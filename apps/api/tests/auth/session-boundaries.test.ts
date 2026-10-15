import { env } from "cloudflare:workers";
import { beforeEach, expect, test, vi } from "vitest";
import { getMigrations } from "better-auth/db/migration";
import { createAuth, handleAuthRequest } from "../../src/auth/auth";

const delivered = new Map<string, string>();
const options = {
  database: () => env.DB,
  baseURL: "https://auth.test",
  secret: "synthetic-t07-test-secret-not-for-deployment-12345",
  recipients: ["alice@example.test", "new@example.test"],
  sendCode: async (email: string, otp: string) => { delivered.set(email, otp); },
};
let auth: ReturnType<typeof createAuth>;
beforeEach(async () => {
  delivered.clear();
  auth = createAuth({ ...options, database: env.DB });
  await (await getMigrations(auth.options)).runMigrations();
});
function request(path: string, body?: unknown, cookie?: string, origin = "https://auth.test") {
  return new Request(`https://auth.test${path}`, {
    method: body === undefined ? "GET" : "POST",
    headers: { "content-type": "application/json", origin, "cf-connecting-ip": "192.0.2.1", ...(cookie ? { cookie } : {}) },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
}
async function send(email = "alice@example.test") {
  return handleAuthRequest(auth, request("/api/auth/email-otp/send-verification-otp", { email, type: "sign-in" }));
}
async function signIn(email = "alice@example.test") {
  expect((await send(email)).status).toBe(200);
  const response = await handleAuthRequest(auth, request("/api/auth/sign-in/email-otp", { email, otp: delivered.get(email) }));
  expect(response.status).toBe(200);
  return response.headers.getSetCookie().map(value => value.split(";")[0]).join("; ");
}

test("email OTP creates a durable D1 session with secure cookies and server revocation", async () => {
  const cookie = await signIn();
  expect(cookie).toContain("__Secure-");
  const restarted = createAuth({ ...options, database: env.DB });
  expect((await handleAuthRequest(restarted, request("/api/private", undefined, cookie))).status).toBe(200);
  await env.DB.prepare('DELETE FROM "session"').run();
  expect((await handleAuthRequest(restarted, request("/api/private", undefined, cookie))).status).toBe(401);
});

test("OTP values are hashed, expire and cannot be reused", async () => {
  await send();
  const code = delivered.get("alice@example.test")!;
  const rows = await env.DB.prepare('SELECT value FROM verification').all<{ value: string }>();
  expect(rows.results.every(row => !row.value.includes(code))).toBe(true);
  await env.DB.prepare('UPDATE verification SET expiresAt = 0').run();
  const expired = await handleAuthRequest(auth, request("/api/auth/sign-in/email-otp", { email: "alice@example.test", otp: code }));
  expect(expired.status).toBe(400);
  await signIn();
  const reused = await handleAuthRequest(auth, request("/api/auth/sign-in/email-otp", { email: "alice@example.test", otp: delivered.get("alice@example.test") }));
  expect(reused.status).toBe(400);
});

test("wrong attempts invalidate a code and rate limits persist across server instances", async () => {
  await send();
  const code = delivered.get("alice@example.test")!;
  const wrong = code === "000000" ? "111111" : "000000";
  for (let n = 0; n < 3; n++) expect((await handleAuthRequest(auth, request("/api/auth/sign-in/email-otp", { email: "alice@example.test", otp: wrong }))).status).toBe(400);
  expect((await handleAuthRequest(auth, request("/api/auth/sign-in/email-otp", { email: "alice@example.test", otp: code }))).status).toBe(403);
  for (let n = 0; n < 9; n++) await send();
  const restarted = createAuth({ ...options, database: env.DB });
  const limited = await handleAuthRequest(restarted, request("/api/auth/email-otp/send-verification-otp", { email: "alice@example.test", type: "sign-in" }));
  expect(limited.status).toBe(429);
});

test("logout invalidates a previously copied cookie and clears the browser cookie", async () => {
  const cookie = await signIn();
  const result = await handleAuthRequest(auth, request("/api/auth/sign-out", {}, cookie));
  expect(result.status).toBe(200);
  expect(result.headers.get("set-cookie")).toContain("Max-Age=0");
  expect((await handleAuthRequest(auth, request("/api/private", undefined, cookie))).status).toBe(401);
});

test("native cookie header is accepted but deleted users and expired sessions are rejected", async () => {
  const cookie = await signIn();
  const native = request("/api/private", undefined, cookie);
  native.headers.delete("origin");
  native.headers.set("expo-origin", "cookbook-t03-proof://");
  expect((await handleAuthRequest(auth, native)).status).toBe(200);
  await env.DB.prepare('UPDATE session SET expiresAt = 0').run();
  expect((await handleAuthRequest(auth, native)).status).toBe(401);
  const second = await signIn("new@example.test");
  await env.DB.prepare('DELETE FROM user WHERE email = ?').bind("new@example.test").run();
  expect((await handleAuthRequest(auth, request("/api/private", undefined, second))).status).toBe(401);
});

test("unknown recipients and existing/new accounts have the same send response", async () => {
  await signIn();
  const existing = await send();
  const unknown = await send("outsider@example.test");
  const fresh = await send("new@example.test");
  expect([existing.status, unknown.status, fresh.status]).toEqual([200, 200, 200]);
  expect(await unknown.json()).toEqual(await existing.json());
  expect(await fresh.json()).toEqual({ success: true });
  expect(delivered.has("outsider@example.test")).toBe(false);
});

test("untrusted origins, redirects and unused authentication endpoints are denied", async () => {
  const body = { email: "alice@example.test", type: "sign-in" };
  for (const origin of ["https://evil.test", "https://auth.test.evil.test", "exp://127.0.0.1"]) {
    expect((await handleAuthRequest(auth, request("/api/auth/email-otp/send-verification-otp", body, undefined, origin))).status).toBe(403);
  }
  expect((await handleAuthRequest(auth, request("/api/auth/sign-in/email-otp", { email: "alice@example.test", otp: "000000", callbackURL: "https://evil.test" }))).status).toBe(403);
  expect((await handleAuthRequest(auth, request("/api/auth/get-verification-otp"))).status).toBe(404);
  expect(delivered.size).toBe(0);
});

test("cookie flags are secure and OTPs are not logged", async () => {
  const logs = [vi.spyOn(console, "log"), vi.spyOn(console, "warn"), vi.spyOn(console, "error")];
  await send();
  const code = delivered.get("alice@example.test")!;
  const response = await handleAuthRequest(auth, request("/api/auth/sign-in/email-otp", { email: "alice@example.test", otp: code }));
  const cookie = response.headers.get("set-cookie")!;
  expect(cookie).toContain("HttpOnly");
  expect(cookie).toContain("Secure");
  expect(cookie).toContain("SameSite=Lax");
  expect(JSON.stringify(logs.flatMap(log => log.mock.calls))).not.toContain(code);
  logs.forEach(log => log.mockRestore());
});

test("concurrent verification consumes a code once", async () => {
  await send();
  const body = { email: "alice@example.test", otp: delivered.get("alice@example.test") };
  const responses = await Promise.all([1, 2].map(() => handleAuthRequest(auth, request("/api/auth/sign-in/email-otp", body))));
  expect(responses.filter(response => response.status === 200)).toHaveLength(1);
  expect(await env.DB.prepare('SELECT COUNT(*) AS n FROM session').first("n")).toBe(1);
});

test("malformed JSON and redirect input fail without internal errors", async () => {
  expect((await handleAuthRequest(auth, request("/api/auth/sign-in/email-otp", null))).status).toBe(400);
  expect((await handleAuthRequest(auth, request("/api/auth/sign-in/email-otp", { callbackURL: "http://[invalid" }))).status).toBe(400);
});
