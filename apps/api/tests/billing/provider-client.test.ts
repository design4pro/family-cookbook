import { expect, test } from "vitest";
import { createPolarProvider } from "../../src/billing/provider-client";

const payload = () => ({ id: "sub-proof", customer_id: "customer-proof", product_id: "product-proof", status: "active",
  current_period_end: "2099-01-01T00:00:00Z", metadata: { cookbook_purchase_intent_id: "intent-proof" },
  customer: { id: "customer-proof", external_id: "payer-proof", organization_id: "org-proof", deleted_at: null },
  product: { id: "product-proof", organization_id: "org-proof" } });
const config = { environment: "sandbox" as const, organizationId: "org-proof", productIds: ["product-proof"], accessToken: "synthetic-token" };

test("a server-side Polar read pins sandbox, API version and canonical customer identity", async () => {
  const provider = createPolarProvider({ ...config, fetch: async (input, init) => {
    expect(String(input)).toBe("https://sandbox-api.polar.sh/v1/subscriptions/sub-proof");
    expect(new Headers(init?.headers).get("Polar-Version")).toBe("2026-10");
    expect(init?.redirect).toBe("error");
    return Response.json(payload());
  } });
  expect(await provider.getSubscription("sub-proof")).toEqual({ environment: "sandbox", organizationId: "org-proof",
    subscriptionId: "sub-proof", customerId: "customer-proof", payerId: "payer-proof", intentId: "intent-proof",
    productId: "product-proof", status: "active", paidThrough: Date.parse("2099-01-01T00:00:00Z") });
});

test.each([
  ["subscription", (data: ReturnType<typeof payload>) => { data.id = "other"; }],
  ["customer organization", (data: ReturnType<typeof payload>) => { data.customer.organization_id = "other"; }],
  ["product organization", (data: ReturnType<typeof payload>) => { data.product.organization_id = "other"; }],
  ["customer identity", (data: ReturnType<typeof payload>) => { data.customer.id = "other"; }],
  ["product identity", (data: ReturnType<typeof payload>) => { data.product.id = "other"; }],
  ["product allowlist", (data: ReturnType<typeof payload>) => { data.product_id = data.product.id = "other"; }],
  ["personal payer", (data: ReturnType<typeof payload>) => { data.customer.external_id = ""; }],
  ["purchase intent", (data: ReturnType<typeof payload>) => { data.metadata.cookbook_purchase_intent_id = ""; }],
  ["period", (data: ReturnType<typeof payload>) => { data.current_period_end = "invalid"; }],
] as const)("rejects mismatched or missing %s", async (_label, mutate) => {
  const data = payload(); mutate(data);
  const provider = createPolarProvider({ ...config, fetch: async () => Response.json(data) });
  await expect(provider.getSubscription("sub-proof")).rejects.toThrow();
});

test("deleted provider customers and failed requests cannot become verified purchases", async () => {
  for (const response of [Response.json({ ...payload(), customer: { ...payload().customer, deleted_at: "2026-10-15T00:00:00Z" } }),
    Response.json(null), new Response("upstream private diagnostic", { status: 503 })]) {
    const provider = createPolarProvider({ ...config, fetch: async () => response });
    await expect(provider.getSubscription("sub-proof")).rejects.toThrow();
  }
});

test("the environment must be configured explicitly", () => {
  expect(() => createPolarProvider({ ...config, accessToken: "" })).toThrow();
  expect(() => createPolarProvider({ ...config, productIds: [] })).toThrow();
});
