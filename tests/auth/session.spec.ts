import { test, expect, chromium, webkit } from "@playwright/test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const origin = "http://127.0.0.1:8789";
const proofHeaders = { "x-t07-proof": "local-harness" };
test.beforeEach(async ({ request }) => {
  expect((await request.post(`${origin}/__proof/reset`, { headers: proofHeaders })).ok()).toBe(true);
});

test("sign-in, process restart, logout and cached-cookie revocation", async ({ browserName, request }) => {
  const profile = await mkdtemp(join(tmpdir(), "t07-browser-"));
  const engine = browserName === "webkit" ? webkit : chromium;
  let context = await engine.launchPersistentContext(profile);
  try {
    let page = await context.newPage();
    await page.goto(`${origin}/sign-in`);
    await page.getByLabel("Email", { exact: true }).fill("web@example.test");
    await page.getByRole("button", { name: "Send code", exact: true }).click();
    await expect(page.getByTestId("auth-status")).toContainText("a code has been sent");
    const mail = await (await request.get(`${origin}/__proof/mail?email=web@example.test`, { headers: proofHeaders })).json();
    await page.getByLabel("Six-digit code", { exact: true }).fill(mail.code);
    await page.getByRole("button", { name: "Sign in", exact: true }).click();
    await expect(page.getByTestId("auth-status")).toHaveText("Authenticated: web@example.test");
    const savedCookie = (await context.cookies()).find(cookie => cookie.name.endsWith("session_token"))!;
    expect(savedCookie.httpOnly).toBe(true);
    expect(savedCookie.sameSite).toBe("Lax");
    await context.close();
    context = await engine.launchPersistentContext(profile);
    page = await context.newPage();
    await page.goto(`${origin}/sign-in`);
    await expect(page.getByTestId("auth-status")).toHaveText("Authenticated: web@example.test");
    await page.getByRole("button", { name: "Sign out", exact: true }).click();
    await expect(page.getByTestId("auth-status")).toContainText("Signed out");
    const stale = await request.get(`${origin}/api/private`, { headers: { cookie: `${savedCookie.name}=${savedCookie.value}` } });
    expect(stale.status()).toBe(401);
  } finally {
    await context.close();
    await rm(profile, { recursive: true, force: true });
  }
});

test("wrong code is recoverable and cross-origin browser sign-in is rejected", async ({ page, request }) => {
  await page.goto("/sign-in");
  await page.getByLabel("Email", { exact: true }).fill("web@example.test");
  await page.getByRole("button", { name: "Send code", exact: true }).click();
  await expect(page.getByTestId("auth-status")).toContainText("a code has been sent");
  const mail = await (await request.get(`${origin}/__proof/mail?email=web@example.test`, { headers: proofHeaders })).json();
  await page.getByLabel("Six-digit code", { exact: true }).fill(mail.code === "000000" ? "111111" : "000000");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.getByTestId("auth-status")).toContainText("Invalid or expired code");
  const denied = await request.post(`${origin}/api/auth/email-otp/send-verification-otp`, {
    headers: { origin: "https://untrusted.example" }, data: { email: "web@example.test", type: "sign-in" },
  });
  expect(denied.status()).toBe(403);
});
