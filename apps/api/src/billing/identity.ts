import type { createAuth } from "../auth/auth";
import type { PurchaseProvider } from "./provider-client";

type Auth = ReturnType<typeof createAuth>;

export function createPurchaseIdentity(options: { database: D1Database; auth: Auth; provider: PurchaseProvider }) {
  const { database: db, auth, provider } = options;
  const session = (headers: Headers) => auth.api.getSession({ headers, query: { disableCookieCache: true } });
  // Recheck authorization inside each atomic write, including after a slow provider response.
  const eligible = `EXISTS (
    SELECT 1 FROM household_members m JOIN billing_households h ON h.household_id = m.household_id
    JOIN session s ON s.userId = m.member_id JOIN user u ON u.id = s.userId
    WHERE m.household_id = ? AND m.member_id = ? AND h.payer_user_id = m.member_id
      AND s.id = ? AND s.expiresAt > ?
  )`;

  async function prepare(headers: Headers, householdId: string) {
    const current = await session(headers);
    if (!current) return { status: "unauthenticated" as const };
    const id = crypto.randomUUID();
    const parameters = [householdId, current.user.id, current.session.id, Date.now()];
    const [, inserted] = await db.batch([
      db.prepare(`INSERT INTO billing_payers (id, user_id) SELECT ?, ? WHERE ${eligible} ON CONFLICT DO NOTHING`)
        .bind(current.user.id, current.user.id, ...parameters),
      db.prepare(`INSERT INTO billing_purchase_intents (id, environment, organization_id, payer_id, household_id)
        SELECT ?, ?, ?, p.id, ? FROM billing_payers p WHERE p.user_id = ? AND ${eligible}`)
        .bind(id, provider.environment, provider.organizationId, householdId, current.user.id, ...parameters),
    ]);
    return inserted!.meta.changes === 1
      ? { status: "prepared" as const, intentId: id, payerId: current.user.id }
      : { status: "not-payer" as const };
  }

  async function restore(headers: Headers, householdId: string, subscriptionId: string) {
    const current = await session(headers);
    if (!current) return "unauthenticated" as const;
    const authorized = await db.prepare(`SELECT 1 WHERE ${eligible}`)
      .bind(householdId, current.user.id, current.session.id, Date.now()).first();
    if (!authorized) return "not-payer" as const;
    let purchase;
    try { purchase = await provider.getSubscription(subscriptionId); } catch { return "unavailable" as const; }
    if (purchase.environment !== provider.environment || purchase.organizationId !== provider.organizationId) return "environment-mismatch" as const;
    if (purchase.subscriptionId !== subscriptionId || purchase.payerId !== current.user.id) return "purchase-mismatch" as const;
    const intent = await db.prepare(`SELECT 1 FROM billing_purchase_intents i JOIN billing_payers p ON p.id = i.payer_id
      WHERE i.id = ? AND i.environment = ? AND i.organization_id = ? AND i.household_id = ? AND p.user_id = ?`)
      .bind(purchase.intentId, provider.environment, provider.organizationId, householdId, current.user.id).first();
    if (!intent) return "purchase-mismatch" as const;
    const now = Date.now();
    if (purchase.status !== "active" || !Number.isFinite(purchase.paidThrough) || purchase.paidThrough <= now) return "inactive" as const;
    const authorization = [householdId, current.user.id, current.session.id, now];
    const [, entitlement] = await db.batch([
      db.prepare(`INSERT INTO billing_purchase_bindings
        (environment, organization_id, subscription_id, intent_id, payer_id, household_id, customer_id, product_id)
        SELECT ?, ?, ?, ?, ?, ?, ?, ? WHERE ${eligible} ON CONFLICT DO NOTHING`)
        .bind(provider.environment, provider.organizationId, subscriptionId, purchase.intentId, current.user.id,
          householdId, purchase.customerId, purchase.productId, ...authorization),
      db.prepare(`INSERT INTO billing_entitlements (environment, household_id, organization_id, subscription_id, paid_through)
        SELECT environment, household_id, organization_id, subscription_id, ? FROM billing_purchase_bindings
        WHERE environment = ? AND organization_id = ? AND subscription_id = ? AND intent_id = ? AND payer_id = ?
          AND household_id = ? AND customer_id = ? AND product_id = ? AND ${eligible}
        ON CONFLICT (environment, household_id) DO UPDATE SET organization_id = excluded.organization_id,
          subscription_id = excluded.subscription_id, paid_through = excluded.paid_through
        WHERE (billing_entitlements.organization_id = excluded.organization_id AND billing_entitlements.subscription_id = excluded.subscription_id)
          OR billing_entitlements.paid_through <= ?`)
        .bind(purchase.paidThrough, provider.environment, provider.organizationId, subscriptionId, purchase.intentId,
          current.user.id, householdId, purchase.customerId, purchase.productId, ...authorization, now),
    ]);
    // An existing grant is not evidence that this refresh matched its immutable binding.
    if (entitlement!.meta.changes !== 1) return "conflict" as const;
    const granted = await db.prepare(`SELECT 1 FROM billing_entitlements
      WHERE environment = ? AND household_id = ? AND organization_id = ? AND subscription_id = ? AND paid_through > ? AND ${eligible}`)
      .bind(provider.environment, householdId, provider.organizationId, subscriptionId, now, ...authorization).first();
    return granted ? "granted" as const : "conflict" as const;
  }

  async function hasAccess(headers: Headers, householdId: string) {
    const current = await session(headers);
    if (!current) return false;
    return Boolean(await db.prepare(`SELECT 1 FROM billing_entitlements e
      JOIN household_members m ON m.household_id = e.household_id JOIN session s ON s.userId = m.member_id
      WHERE e.environment = ? AND e.organization_id = ? AND e.household_id = ? AND m.member_id = ?
        AND e.paid_through > ? AND s.id = ? AND s.expiresAt > ?`)
      .bind(provider.environment, provider.organizationId, householdId, current.user.id, Date.now(), current.session.id, Date.now()).first());
  }
  return { prepare, restore, hasAccess };
}
