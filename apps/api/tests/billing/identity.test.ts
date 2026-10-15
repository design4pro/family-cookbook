import { env } from "cloudflare:workers";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { createAuth } from "../../src/auth/auth";
import { createPurchaseIdentity } from "../../src/billing/identity";
import type { PurchaseProvider, VerifiedPurchase } from "../../src/billing/provider-client";
import { createPolarProvider } from "../../src/billing/provider-client";
import polarFixture from "./fixtures/polar-sandbox-subscription.json";

const now = Date.parse(polarFixture.capturedAt);
const purchases = new Map<string, VerifiedPurchase>();
let auth: ReturnType<typeof createAuth>;
let alice: { id: string; headers: Headers };
let bob: { id: string; headers: Headers };
const provider: PurchaseProvider = {
  environment: "sandbox", organizationId: "org-proof",
  async getSubscription(id) {
    const purchase = purchases.get(id);
    if (!purchase) throw new Error("Fixture subscription missing");
    return purchase;
  },
};
const billing = () => createPurchaseIdentity({ database: env.DB, auth, provider });

beforeEach(async () => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(now);
  purchases.clear();
  // Stable synthetic account for replaying the observed provider identity; no real mailbox is used here.
  await env.DB.prepare('INSERT INTO user (id, name, email, emailVerified, createdAt, updatedAt) VALUES (?, ?, ?, 1, ?, ?)')
    .bind(polarFixture.subscription.customer.external_id, "Synthetic Alice", "alice@example.test", now, now).run();
  const mail = new Map<string, string>();
  auth = createAuth({ database: env.DB, baseURL: "https://auth.test", secret: "synthetic-t08-auth-secret-not-for-deployment-12345",
    recipients: ["alice@example.test", "bob@example.test"], sendCode: async (email, code) => { mail.set(email, code); } });
  async function login(email: string) {
    await auth.api.sendVerificationOTP({ body: { email, type: "sign-in" } });
    const response = await auth.api.signInEmailOTP({ body: { email, otp: mail.get(email)! }, asResponse: true });
    const data = await response.json() as { user: { id: string } };
    const cookie = response.headers.getSetCookie().map(value => value.split(";")[0]).join("; ");
    return { id: data.user.id, headers: new Headers({ cookie }) };
  }
  alice = await login("alice@example.test"); bob = await login("bob@example.test");
  await env.DB.batch([
    env.DB.prepare('INSERT INTO household_members (household_id, member_id) VALUES (?, ?), (?, ?)').bind("home-a", alice.id, "home-b", bob.id),
    env.DB.prepare('INSERT INTO billing_households (household_id, payer_user_id) VALUES (?, ?), (?, ?)').bind("home-a", alice.id, "home-b", bob.id),
  ]);
});

afterEach(() => vi.useRealTimers());

async function purchaseFor(person = alice, household = "home-a", subscriptionId = "sub-a") {
  const prepared = await billing().prepare(person.headers, household);
  if (prepared.status !== "prepared") throw new Error("Test purchase preparation failed");
  purchases.set(subscriptionId, { environment: "sandbox", organizationId: "org-proof", subscriptionId,
    payerId: prepared.payerId, intentId: prepared.intentId, customerId: `customer-${person.id}`,
    productId: "product-proof", status: "active", paidThrough: now + 86400000 });
  return subscriptionId;
}

test("a verified purchase grants only its prepared household and cannot be restored by another payer", async () => {
  const subscription = await purchaseFor();
  expect(await billing().restore(alice.headers, "home-a", subscription)).toBe("granted");
  expect(await billing().hasAccess(alice.headers, "home-a")).toBe(true);
  expect(await billing().restore(bob.headers, "home-b", subscription)).toBe("purchase-mismatch");
  expect(await billing().hasAccess(bob.headers, "home-b")).toBe(false);
  expect(await billing().hasAccess(bob.headers, "home-a")).toBe(false);
});

test("the observed Polar sandbox response passes the adapter and cannot transfer across households", async () => {
  const observed = polarFixture.subscription;
  const recordedProvider = createPolarProvider({ environment: "sandbox", organizationId: polarFixture.organizationId,
    productIds: [observed.product_id], accessToken: "synthetic-replay-token",
    fetch: async input => {
      expect(String(input)).toBe(`https://sandbox-api.polar.sh/v1/subscriptions/${observed.id}`);
      return Response.json(observed);
    },
  });
  const proof = createPurchaseIdentity({ database: env.DB, auth, provider: recordedProvider });
  const prepared = await proof.prepare(alice.headers, "home-a");
  if (prepared.status !== "prepared") throw new Error("Missing replay preparation");
  expect(prepared.payerId).toBe(observed.customer.external_id);
  // Reconstruct the recorded fixture intent. This is a transport replay, not an end-to-end checkout test.
  await env.DB.prepare('UPDATE billing_purchase_intents SET id = ? WHERE id = ?')
    .bind(observed.metadata.cookbook_purchase_intent_id, prepared.intentId).run();
  expect(await proof.restore(alice.headers, "home-a", observed.id)).toBe("granted");
  expect(await proof.restore(bob.headers, "home-b", observed.id)).toBe("purchase-mismatch");
  expect(await proof.hasAccess(alice.headers, "home-a")).toBe(true);
  expect(await proof.hasAccess(bob.headers, "home-b")).toBe(false);
  await env.DB.prepare('UPDATE household_members SET household_id = ? WHERE member_id = ?').bind("home-b", alice.id).run();
  await env.DB.prepare('UPDATE billing_households SET payer_user_id = ? WHERE household_id = ?').bind(alice.id, "home-b").run();
  expect(await proof.restore(alice.headers, "home-b", observed.id)).toBe("purchase-mismatch");
  expect(await proof.hasAccess(alice.headers, "home-b")).toBe(false);
});

test.each([false, true])("moving the same payer cannot move a purchase (already claimed: %s)", async claimed => {
  const subscription = await purchaseFor();
  if (claimed) expect(await billing().restore(alice.headers, "home-a", subscription)).toBe("granted");
  await env.DB.batch([
    env.DB.prepare('DELETE FROM household_members WHERE member_id = ?').bind(bob.id),
    env.DB.prepare('UPDATE household_members SET household_id = ? WHERE member_id = ?').bind("home-b", alice.id),
    env.DB.prepare('UPDATE billing_households SET payer_user_id = ? WHERE household_id = ?').bind(alice.id, "home-b"),
  ]);
  expect(await billing().restore(alice.headers, "home-b", subscription)).toBe("purchase-mismatch");
  expect(await billing().hasAccess(alice.headers, "home-b")).toBe(false);
});

test("sandbox purchases never grant production access, even with the same IDs", async () => {
  const subscription = await purchaseFor();
  expect(await billing().restore(alice.headers, "home-a", subscription)).toBe("granted");
  const production = createPurchaseIdentity({ database: env.DB, auth, provider: { ...provider, environment: "production" } });
  expect(await production.restore(alice.headers, "home-a", subscription)).toBe("environment-mismatch");
  expect(await production.hasAccess(alice.headers, "home-a")).toBe(false);
});

test("profile changes preserve identity and deletion cannot let a new account recover the purchase by email", async () => {
  await env.DB.prepare('UPDATE household_members SET household_id = ? WHERE member_id = ?').bind("home-a", bob.id).run();
  const subscription = await purchaseFor();
  await env.DB.prepare('UPDATE user SET name = ?, email = ? WHERE id = ?').bind("Renamed", "renamed@example.test", alice.id).run();
  expect(await billing().restore(alice.headers, "home-a", subscription)).toBe("granted");
  await env.DB.prepare('DELETE FROM user WHERE id = ?').bind(alice.id).run();
  expect(await billing().restore(alice.headers, "home-a", subscription)).toBe("unauthenticated");
  await env.DB.batch([
    env.DB.prepare('UPDATE user SET email = ? WHERE id = ?').bind("renamed@example.test", bob.id),
    env.DB.prepare('DELETE FROM household_members WHERE member_id = ?').bind(alice.id),
    env.DB.prepare('UPDATE billing_households SET payer_user_id = ? WHERE household_id = ?').bind(bob.id, "home-a"),
  ]);
  // Surviving members keep the household's verified period, but do not own the deleted payer's purchase.
  expect(await billing().hasAccess(bob.headers, "home-a")).toBe(true);
  expect(await billing().restore(bob.headers, "home-a", subscription)).toBe("purchase-mismatch");
});

test("changing provider metadata cannot replace an immutable purchase binding", async () => {
  const subscription = await purchaseFor();
  expect(await billing().restore(alice.headers, "home-a", subscription)).toBe("granted");
  const second = await billing().prepare(alice.headers, "home-a");
  if (second.status !== "prepared") throw new Error("Missing second intent");
  purchases.get(subscription)!.intentId = second.intentId;
  expect(await billing().restore(alice.headers, "home-a", subscription)).toBe("conflict");
});

test("duplicate concurrent restores settle one binding and one household entitlement", async () => {
  const subscription = await purchaseFor();
  expect(await Promise.all(Array.from({ length: 4 }, () => billing().restore(alice.headers, "home-a", subscription))))
    .toEqual(["granted", "granted", "granted", "granted"]);
  expect(await env.DB.prepare('SELECT COUNT(*) AS count FROM billing_purchase_bindings').first("count")).toBe(1);
  expect(await env.DB.prepare('SELECT COUNT(*) AS count FROM billing_entitlements').first("count")).toBe(1);
});

test("a second active purchase cannot replace the household's current subscription", async () => {
  const first = await purchaseFor();
  const second = await purchaseFor(alice, "home-a", "sub-second");
  expect(await billing().restore(alice.headers, "home-a", first)).toBe("granted");
  expect(await billing().restore(alice.headers, "home-a", second)).toBe("conflict");
  expect(await env.DB.prepare('SELECT subscription_id FROM billing_entitlements').first("subscription_id")).toBe(first);
});

test("one prepared intent cannot grant two provider subscriptions", async () => {
  const first = await purchaseFor();
  purchases.set("sub-replay", { ...purchases.get(first)!, subscriptionId: "sub-replay" });
  expect(await billing().restore(alice.headers, "home-a", first)).toBe("granted");
  expect(await billing().restore(alice.headers, "home-a", "sub-replay")).toBe("conflict");
});

test("anonymous users and other members cannot prepare or claim the payer's checkout", async () => {
  expect(await billing().prepare(new Headers(), "home-a")).toEqual({ status: "unauthenticated" });
  expect(await billing().restore(new Headers(), "home-a", "sub-a")).toBe("unauthenticated");
  await env.DB.prepare('UPDATE household_members SET household_id = ? WHERE member_id = ?').bind("home-a", bob.id).run();
  expect(await billing().prepare(bob.headers, "home-a")).toEqual({ status: "not-payer" });
  expect(await billing().restore(bob.headers, "home-a", "sub-a")).toBe("not-payer");
});

test("unknown, inactive, expired and unprepared purchases fail closed", async () => {
  expect(await billing().restore(alice.headers, "home-a", "missing")).toBe("unavailable");
  const subscription = await purchaseFor();
  const purchase = purchases.get(subscription)!;
  purchase.status = "canceled";
  expect(await billing().restore(alice.headers, "home-a", subscription)).toBe("inactive");
  purchase.status = "active"; purchase.paidThrough = Date.now() - 1;
  expect(await billing().restore(alice.headers, "home-a", subscription)).toBe("inactive");
  purchase.paidThrough = now + 86400000; purchase.intentId = "client-forged-intent";
  expect(await billing().restore(alice.headers, "home-a", subscription)).toBe("purchase-mismatch");
  expect(await billing().hasAccess(alice.headers, "home-a")).toBe(false);
});

test.each(["session", "membership", "payer"])("%s revocation during provider verification fences the grant", async kind => {
  const subscription = await purchaseFor();
  const delayed = createPurchaseIdentity({ database: env.DB, auth, provider: { ...provider,
    async getSubscription(id) {
      const purchase = await provider.getSubscription(id);
      if (kind === "session") await env.DB.prepare('DELETE FROM session WHERE userId = ?').bind(alice.id).run();
      if (kind === "membership") await env.DB.prepare('DELETE FROM household_members WHERE member_id = ?').bind(alice.id).run();
      if (kind === "payer") await env.DB.prepare('UPDATE billing_households SET payer_user_id = NULL WHERE household_id = ?').bind("home-a").run();
      return purchase;
    },
  } });
  expect(await delayed.restore(alice.headers, "home-a", subscription)).toBe("conflict");
  expect(await billing().hasAccess(alice.headers, "home-a")).toBe(false);
});
