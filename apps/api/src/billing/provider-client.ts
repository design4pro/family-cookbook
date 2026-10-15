export type BillingEnvironment = "sandbox" | "production";

export interface VerifiedPurchase {
  environment: BillingEnvironment;
  organizationId: string;
  subscriptionId: string;
  customerId: string;
  payerId: string;
  intentId: string;
  productId: string;
  status: string;
  paidThrough: number;
}

// This boundary is server-only. A client callback or webhook body is never a VerifiedPurchase.
export interface PurchaseProvider {
  readonly environment: BillingEnvironment;
  readonly organizationId: string;
  getSubscription(id: string): Promise<VerifiedPurchase>;
}

export function createPolarProvider(options: {
  environment: BillingEnvironment; organizationId: string; productIds: readonly string[];
  accessToken: string; fetch?: typeof fetch;
}): PurchaseProvider {
  if (!["sandbox", "production"].includes(options.environment) || !options.organizationId || !options.accessToken || !options.productIds.length) {
    throw new Error("Explicit Polar environment, organization, products and credential are required");
  }
  const origin = options.environment === "sandbox" ? "https://sandbox-api.polar.sh" : "https://api.polar.sh";
  const request = options.fetch ?? fetch;
  const record = (value: unknown): Record<string, unknown> => {
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid Polar response");
    return value as Record<string, unknown>;
  };
  const text = (value: unknown): string => {
    if (typeof value !== "string" || !value) throw new Error("Missing Polar identity");
    return value;
  };
  return {
    environment: options.environment, organizationId: options.organizationId,
    async getSubscription(id) {
      const response = await request(`${origin}/v1/subscriptions/${encodeURIComponent(id)}`, {
        headers: { authorization: `Bearer ${options.accessToken}`, "Polar-Version": "2026-10", accept: "application/json" },
        redirect: "error", signal: AbortSignal.timeout(10000),
      });
      if (!response.ok) throw new Error(`Polar subscription read failed (${response.status})`);
      const data = record(await response.json());
      const customer = record(data.customer), product = record(data.product), metadata = record(data.metadata);
      if (data.id !== id || customer.id !== data.customer_id || product.id !== data.product_id ||
        customer.organization_id !== options.organizationId || product.organization_id !== options.organizationId ||
        !options.productIds.includes(text(data.product_id)) || customer.deleted_at !== null) {
        throw new Error("Polar purchase scope mismatch");
      }
      const paidThrough = Date.parse(text(data.current_period_end));
      if (!Number.isFinite(paidThrough)) throw new Error("Invalid Polar period");
      return { environment: options.environment, organizationId: options.organizationId, subscriptionId: id,
        customerId: text(data.customer_id), payerId: text(customer.external_id),
        intentId: text(metadata.cookbook_purchase_intent_id), productId: text(data.product_id),
        status: text(data.status), paidThrough };
    },
  };
}
