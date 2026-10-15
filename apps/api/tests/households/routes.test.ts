import { env } from "cloudflare:workers";
import { beforeEach, expect, test } from "vitest";
import { createAuth, handleAuthRequest } from "../../src/auth/auth";
import { handleHouseholdRequest } from "../../src/households/routes";
import { readHouseholdResource } from "../../src/households/membership";

let auth: ReturnType<typeof createAuth>;
const delivered = new Map<string, string>();
beforeEach(() => {
  delivered.clear();
  auth = createAuth({ database: env.DB, baseURL: "https://household.test", secret: "synthetic-household-secret-never-for-deployment-123456",
    recipients: ["owner@example.test", "member@example.test", "outsider@example.test"],
    sendCode: async (email, code) => { delivered.set(email, code); } });
});
function request(path: string, cookie = "", body?: unknown, origin = "https://household.test") {
  return new Request(`https://household.test${path}`, { method: body === undefined ? "GET" : "POST",
    headers: { cookie, origin, "content-type": "application/json" }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
}
async function signIn(email: string) {
  await handleAuthRequest(auth, request("/api/auth/email-otp/send-verification-otp", "", { email, type: "sign-in" }));
  const result = await handleAuthRequest(auth, request("/api/auth/sign-in/email-otp", "", { email, otp: delivered.get(email) }));
  expect(result.status).toBe(200);
  return result.headers.getSetCookie().map(cookie => cookie.split(";")[0]).join("; ");
}
function api(cookie: string, action = "", body?: unknown) {
  return handleHouseholdRequest(env.DB, auth, request(`/api/household${action}`, cookie, body));
}

test("verified sessions own identity; an already-open removed session keeps its account but loses household access", async () => {
  const owner = await signIn("owner@example.test"), member = await signIn("member@example.test");
  const created = await api(owner, "/create", { userId: "attacker", payerId: "attacker" });
  expect(created.status).toBe(201);
  const { id } = await created.json() as { id: string };
  const invitation = await (await api(owner, "/invite", { householdId: id, email: "member@example.test" })).json() as { token: string };
  expect((await api(member, "/accept", invitation)).status).toBe(200);
  const before = await (await api(member)).json() as { userId: string; household: { members: unknown[] } };
  expect(before.household.members).toHaveLength(2);
  expect((await api(member, "/remove", { householdId: id, memberId: "attacker" })).status).toBe(409);
  expect((await api(owner, "/remove", { householdId: id, memberId: before.userId })).status).toBe(200);
  expect(await (await api(member)).json()).toMatchObject({ userId: before.userId, household: null });
  expect((await handleAuthRequest(auth, request("/api/private", member))).status).toBe(200);
  expect((await readHouseholdResource(env.DB, before.userId, id, async () => new Response("secret"))).status).toBe(403);
  expect((await api(member, "/invite", { householdId: id, email: "outsider@example.test" })).status).toBe(409);
});

test("missing/expired sessions, cross-origin writes and malformed input fail closed", async () => {
  expect((await api("", "/create", {})).status).toBe(401);
  const cookie = await signIn("owner@example.test");
  expect((await handleHouseholdRequest(env.DB, auth, request("/api/household/create", cookie, {}, "https://evil.test"))).status).toBe(403);
  const missing = request("/api/household/create", cookie, {}); missing.headers.delete("origin");
  expect((await handleHouseholdRequest(env.DB, auth, missing)).status).toBe(403);
  for (const body of [null, [], { token: {} }, { token: "short" }]) expect((await api(cookie, "/accept", body)).status).toBe(400);
  await env.DB.prepare('DELETE FROM session').run();
  expect((await api(cookie, "/create", {})).status).toBe(401);
});

test("native session headers use the same membership rules", async () => {
  const cookie = await signIn("owner@example.test");
  const native = request("/api/household/create", cookie, {});
  native.headers.delete("origin"); native.headers.set("expo-origin", "cookbook-t03-proof://");
  expect((await handleHouseholdRequest(env.DB, auth, native)).status).toBe(201);
  const response = await api(cookie);
  expect(response.headers.get("cache-control")).toBe("no-store");
  const { userId, household } = await response.json() as { userId: string; household: { administratorId: string; payerId: string } };
  expect(household).toMatchObject({ administratorId: userId, payerId: userId });
});

test("handover reauthentication consumes a fresh OTP for the session email, not a supplied identity", async () => {
  const owner = await signIn("owner@example.test"), member = await signIn("member@example.test");
  const { id } = await (await api(owner, "/create", {})).json() as { id: string };
  const invitation = await (await api(owner, "/invite", { householdId: id, email: "member@example.test" })).json();
  await api(member, "/accept", invitation);
  const { userId: memberId } = await (await api(member)).json() as { userId: string };
  const body = { householdId: id, recipientId: memberId };
  expect((await api(owner, "/handover/request", { ...body, reauthenticated: true })).status).toBe(409);
  expect((await api(member, "/handover/send-code", { householdId: id })).status).toBe(403);
  expect((await api(owner, "/handover/send-code", { householdId: id, email: "outsider@example.test" })).status).toBe(200);
  expect(delivered.has("outsider@example.test")).toBe(false);
  const otp = delivered.get("owner@example.test")!;
  expect((await api(owner, "/handover/verify-code", { householdId: id, otp: otp === "000000" ? "111111" : "000000" })).status).toBe(400);
  expect((await api(owner, "/handover/verify-code", { householdId: id, otp })).status).toBe(200);
  expect((await api(owner, "/handover/verify-code", { householdId: id, otp })).status).toBe(400);
  const secondSession = await signIn("owner@example.test");
  expect((await api(secondSession, "/handover/request", body)).status).toBe(409);
  const nominated = await api(owner, "/handover/request", body);
  expect(nominated.status).toBe(201);
  const { id: requestId } = await nominated.json() as { id: string };
  expect((await api(member, "/handover/accept", { householdId: id, requestId })).status).toBe(200);
  expect((await api(owner, "/handover/request", body)).status).toBe(409);
});

test("expired verification and a revoked session cannot authorize handover", async () => {
  const owner = await signIn("owner@example.test");
  const { id } = await (await api(owner, "/create", {})).json() as { id: string };
  await api(owner, "/handover/send-code", { householdId: id });
  const otp = delivered.get("owner@example.test")!;
  await env.DB.prepare("UPDATE verification SET expiresAt = 0").run();
  expect((await api(owner, "/handover/verify-code", { householdId: id, otp })).status).toBe(400);
  await api(owner, "/handover/send-code", { householdId: id });
  expect((await api(owner, "/handover/verify-code", { householdId: id, otp: delivered.get("owner@example.test") })).status).toBe(200);
  await env.DB.prepare("DELETE FROM session").run();
  expect(await env.DB.prepare("SELECT COUNT(*) AS n FROM household_reauthentication").first("n")).toBe(0);
  expect((await api(owner, "/handover/request", { householdId: id, recipientId: "other" })).status).toBe(401);
});
