import { chromium } from "@playwright/test";
import { readFileSync, writeFileSync } from "node:fs";
import { parseEnv } from "node:util";

const path = process.env.T07_EMAIL_ENV_FILE;
if (!path) throw new Error("Set T07_EMAIL_ENV_FILE to the approved local credential source");
const configured = parseEnv(readFileSync(path, "utf8"));
const key = configured.EMAIL_API_KEY ?? configured.RESEND_API_KEY;
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.goto("http://127.0.0.1:8789/sign-in");
  await page.getByLabel("Email", { exact: true }).fill("kontakt@design4.pro");
  await page.getByRole("button", { name: "Send code", exact: true }).click();
  await page.getByTestId("auth-status").filter({ hasText: "a code has been sent" }).waitFor();
  const mailbox = await (await page.request.get("http://127.0.0.1:8789/__proof/mail?email=kontakt%40design4.pro", { headers: { "x-t07-proof": "local-harness" } })).json();
  if (!mailbox.providerId) throw new Error("No provider acceptance ID");
  await page.getByLabel("Six-digit code", { exact: true }).fill(mailbox.code);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await page.getByTestId("auth-status").filter({ hasText: "Authenticated: kontakt@design4.pro" }).waitFor();
  const before = await page.evaluate(async () => (await fetch("/api/private")).status);
  await page.getByRole("button", { name: "Sign out", exact: true }).click();
  await page.getByTestId("auth-status").filter({ hasText: "Signed out" }).waitFor();
  const after = await page.evaluate(async () => (await fetch("/api/private")).status);
  const provider = await fetch(`https://api.resend.com/emails/${mailbox.providerId}`, { headers: { authorization: `Bearer ${key}` } });
  const receipt = await provider.json();
  const report = { at: new Date().toISOString(), providerId: mailbox.providerId, providerReadStatus: provider.status,
    deliveryEvent: receipt.last_event, signInStatus: before, signedOutStatus: after, pass: before === 200 && after === 401,
    codeSource: "In-memory local mail adapter after actual Resend acceptance; no code or cookie is logged", physicalDevice: false };
  writeFileSync("docs/evidence/t07-email.json", JSON.stringify(report, null, 2) + "\n");
  console.log(JSON.stringify(report));
} finally { await browser.close(); }
