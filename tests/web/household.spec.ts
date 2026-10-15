import { test, expect, type Page, type APIRequestContext, type Browser } from "@playwright/test";

const proofHeaders = { "x-t07-proof": "local-harness" };
test.beforeEach(async ({ request }) => {
  expect((await request.post("/__proof/reset", { headers: proofHeaders })).ok()).toBe(true);
});
async function signIn(page: Page, request: APIRequestContext, email: string, navigate = true) {
  if (navigate) await page.goto("/sign-in");
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByRole("button", { name: "Send code", exact: true }).click();
  await expect(page.getByTestId("auth-status")).toContainText("a code has been sent");
  const mail = await (await request.get(`/__proof/mail?email=${email}`, { headers: proofHeaders })).json();
  await page.getByLabel("Six-digit code", { exact: true }).fill(mail.code);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.getByTestId("auth-status")).toHaveText(`Authenticated: ${email}`);
  await page.getByRole("link", { name: "Open household", exact: true }).click();
  await expect(page.getByRole("button", { name: "Create household", exact: true })).toBeEnabled();
}
async function invite(page: Page, email: string) {
  const field = page.getByLabel("Invitation link", { exact: true });
  const previous = await field.count() ? await field.inputValue() : "";
  await page.getByLabel("Invitee email", { exact: true }).fill(email);
  await page.getByRole("button", { name: "Create invitation", exact: true }).click();
  await expect(page.getByTestId("household-status")).toContainText("Invitation created");
  await expect(field).not.toHaveValue(previous);
  return field.inputValue();
}

async function family(browser: Browser, request: APIRequestContext) {
  const contexts = await Promise.all([1, 2, 3].map(() => browser.newContext()));
  const [owner, member, other] = await Promise.all(contexts.map(context => context.newPage())) as [Page, Page, Page];
  await signIn(owner, request, "web@example.test");
  await owner.getByRole("button", { name: "Create household", exact: true }).click();
  await expect(owner.getByText("Members (1/5)", { exact: true })).toBeVisible();
  for (const [page, email] of [[member, "ios@example.test"], [other, "android@example.test"]] as const) {
    const link = await invite(owner, email);
    await signIn(page, request, email);
    await page.getByLabel("Invitation code or link").fill(link);
    await page.getByRole("button", { name: "Accept invitation", exact: true }).click();
    await expect(page.getByRole("button", { name: "Leave household", exact: true })).toBeVisible();
  }
  await owner.getByRole("button", { name: "Refresh membership", exact: true }).click();
  await expect(owner.getByText("Members (3/5)", { exact: true })).toBeVisible();
  return { owner, member, other, close: () => Promise.all(contexts.map(context => context.close())) };
}

async function verifyHandover(owner: Page, request: APIRequestContext) {
  await owner.getByRole("button", { name: "Send handover verification code", exact: true }).click();
  await expect(owner.getByTestId("household-status")).toContainText("Verification code requested");
  const { code } = await (await request.get("/__proof/mail?email=web@example.test", { headers: proofHeaders })).json();
  await owner.getByLabel("Handover verification code", { exact: true }).fill(code);
  await owner.getByRole("button", { name: "Verify handover code", exact: true }).click();
  await expect(owner.getByTestId("household-status")).toContainText("Identity verified");
}

test("create, invite, join, remove an open session, rejoin and voluntarily leave", async ({ browser, request }) => {
  const ownerContext = await browser.newContext(), memberContext = await browser.newContext();
  try {
    const owner = await ownerContext.newPage(), member = await memberContext.newPage();
    await signIn(owner, request, "web@example.test");
    await owner.getByRole("button", { name: "Create household", exact: true }).click();
    await expect(owner.getByText("Members (1/5)", { exact: true })).toBeVisible();
    await expect(owner.getByText("web@example.test · Administrator · Payer", { exact: true })).toBeVisible();
    const link = await invite(owner, "ios@example.test");
    await signIn(member, request, "ios@example.test");
    await member.goto(link);
    await expect(member.getByLabel("Invitation code or link")).not.toHaveValue("");
    await member.getByRole("button", { name: "Accept invitation", exact: true }).click();
    await expect(member.getByText("Members (2/5)", { exact: true })).toBeVisible();
    await expect(member.getByRole("button", { name: "Create invitation", exact: true })).toHaveCount(0);
    await owner.getByRole("button", { name: "Refresh membership", exact: true }).click();
    await expect(owner.getByRole("button", { name: "Leave household", exact: true })).toBeDisabled();
    await owner.getByRole("button", { name: "Remove ios@example.test", exact: true }).click();
    await expect(owner.getByText(/Previously downloaded exports cannot be remotely recalled/)).toBeVisible();
    await owner.getByRole("button", { name: "Confirm membership removal", exact: true }).click();
    await expect(owner.getByText("Members (1/5)", { exact: true })).toBeVisible();
    await member.getByRole("button", { name: "Refresh membership", exact: true }).click();
    await expect(member.getByTestId("household-status")).toContainText("no active household");
    expect((await memberContext.request.get("/api/private")).status()).toBe(200);
    await member.getByLabel("Invitation code or link").fill(link);
    await member.getByRole("button", { name: "Accept invitation", exact: true }).click();
    await expect(member.getByTestId("household-status")).toContainText("Invitation unavailable");
    const newLink = await invite(owner, "ios@example.test");
    await member.getByLabel("Invitation code or link").fill(newLink);
    await member.getByRole("button", { name: "Accept invitation", exact: true }).click();
    await expect(member.getByText("Members (2/5)", { exact: true })).toBeVisible();
    await member.getByRole("button", { name: "Leave household", exact: true }).click();
    await member.getByRole("button", { name: "Confirm membership removal", exact: true }).click();
    await expect(member.getByRole("button", { name: "Create household", exact: true })).toBeVisible();
    await owner.getByRole("button", { name: "Refresh membership", exact: true }).click();
    await expect(owner.getByRole("button", { name: "Leave household", exact: true })).toBeEnabled();
    await owner.getByRole("button", { name: "Leave household", exact: true }).click();
    await expect(owner.getByText("Leave and close this empty household?", { exact: true })).toBeVisible();
    await owner.getByRole("button", { name: "Confirm membership removal", exact: true }).click();
    await expect(owner.getByRole("button", { name: "Create household", exact: true })).toBeVisible();
  } finally { await ownerContext.close(); await memberContext.close(); }
});

test("a fresh invitation survives sign-in without putting its token in HTTP URLs", async ({ browser, page, request }) => {
  const recipientContext = await browser.newContext();
  try {
    await signIn(page, request, "web@example.test");
    await page.getByRole("button", { name: "Create household", exact: true }).click();
    await expect(page.getByText("Members (1/5)", { exact: true })).toBeVisible();
    const link = await invite(page, "ios@example.test");
    const token = link.split("invite=")[1]!;
    const recipient = await recipientContext.newPage();
    const urls: string[] = [];
    recipient.on("request", item => urls.push(item.url()));
    await recipient.goto(link);
    await expect(recipient.getByTestId("household-status")).toContainText("Sign in");
    await recipient.getByRole("link", { name: "Sign in or manage your session", exact: true }).click();
    await signIn(recipient, request, "ios@example.test", false);
    await expect(recipient.getByLabel("Invitation code or link")).toHaveValue(token);
    await recipient.getByRole("button", { name: "Accept invitation", exact: true }).click();
    await expect(recipient.getByText("Members (2/5)", { exact: true })).toBeVisible();
    expect(urls.some(url => url.includes(token))).toBe(false);
  } finally { await recipientContext.close(); }
});

test("wrong recipient and revoked links fail; a network failure never reports a successful change", async ({ browser, page, request }) => {
  const otherContext = await browser.newContext();
  try {
    await page.setViewportSize({ width: 390, height: 844 });
    await signIn(page, request, "web@example.test");
    await page.getByRole("button", { name: "Create household", exact: true }).click();
    await expect(page.getByText("Members (1/5)", { exact: true })).toBeVisible();
    const link = await invite(page, "ios@example.test");
    const other = await otherContext.newPage();
    await signIn(other, request, "android@example.test");
    await other.getByLabel("Invitation code or link").fill(link);
    await other.getByRole("button", { name: "Accept invitation", exact: true }).click();
    await expect(other.getByTestId("household-status")).toContainText("Invitation unavailable");
    await page.getByRole("button", { name: "Revoke invitation for ios@example.test", exact: true }).click();
    await expect(page.getByTestId("household-status")).toHaveText("Invitation revoked.");
    await page.route("**/api/household/invite", route => route.abort());
    await page.getByLabel("Invitee email", { exact: true }).fill("android@example.test");
    await page.getByRole("button", { name: "Create invitation", exact: true }).click();
    await expect(page.getByTestId("household-status")).not.toContainText("Invitation created");
    await expect(page.getByLabel("Invitee email", { exact: true })).toHaveValue("android@example.test");
    await expect(page.getByRole("button", { name: "Create invitation", exact: true })).toBeEnabled();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  } finally { await otherContext.close(); }
});

test("reauthenticated handover is cancelable, recipient-accepted and preserves a payer-only role", async ({ browser, request }) => {
  const group = await family(browser, request);
  const { owner, member, other } = group;
  try {
    await expect(owner.getByRole("button", { name: "Nominate ios@example.test", exact: true })).toHaveCount(0);
    await expect(member.getByRole("button", { name: "Send handover verification code", exact: true })).toHaveCount(0);
    await verifyHandover(owner, request);
    await owner.getByRole("button", { name: "Nominate ios@example.test", exact: true }).click();
    await expect(owner.getByTestId("household-status")).toContainText("Handover requested");
    await member.getByRole("button", { name: "Refresh membership", exact: true }).click();
    await expect(member.getByRole("button", { name: "Accept administration", exact: true })).toBeVisible();
    await owner.getByRole("button", { name: "Cancel handover", exact: true }).click();
    await expect(owner.getByTestId("household-status")).toContainText("Handover canceled");
    await member.getByRole("button", { name: "Accept administration", exact: true }).click();
    await expect(member.getByTestId("household-status")).toContainText("Handover unavailable");
    await expect(member.getByRole("button", { name: "Accept administration", exact: true })).toHaveCount(0);
    await verifyHandover(owner, request);
    await owner.getByRole("button", { name: "Nominate ios@example.test", exact: true }).click();
    await expect(owner.getByTestId("household-status")).toContainText("Handover requested");
    await member.getByRole("button", { name: "Refresh membership", exact: true }).click();
    await member.getByRole("button", { name: "Accept administration", exact: true }).click();
    await expect(member.getByTestId("household-status")).toContainText("Administration transferred");
    await expect(member.getByText("ios@example.test · Administrator", { exact: true })).toBeVisible();
    await expect(member.getByText("web@example.test · Payer", { exact: true })).toBeVisible();
    await owner.getByRole("button", { name: "Refresh membership", exact: true }).click();
    await expect(owner.getByRole("button", { name: "Create invitation", exact: true })).toHaveCount(0);
    await expect(owner.getByRole("button", { name: "Send handover verification code", exact: true })).toHaveCount(0);
    await expect(owner.getByRole("button", { name: "Leave household", exact: true })).toBeEnabled();
    await other.reload();
    await expect(other.getByText(/The household administrator changed/)).toBeVisible();
    await expect(other.getByText("Members (3/5)", { exact: true })).toBeVisible();
  } finally { await group.close(); }
});

test("after administrator profile deletion, remaining members retain access and explicitly claim the role", async ({ browser, request }) => {
  const group = await family(browser, request);
  const { member, other } = group;
  try {
    expect((await request.post("/__proof/delete-profile", { headers: proofHeaders, data: { email: "web@example.test" } })).ok()).toBe(true);
    await member.getByRole("button", { name: "Refresh membership", exact: true }).click();
    await expect(member.getByText("Members (2/5)", { exact: true })).toBeVisible();
    await expect(member.getByText(/No administrator is assigned/)).toBeVisible();
    await expect(member.getByRole("button", { name: "Create invitation", exact: true })).toHaveCount(0);
    await member.getByRole("button", { name: "Claim administration", exact: true }).click();
    await expect(member.getByTestId("household-status")).toContainText("Administration claimed");
    await expect(member.getByText("ios@example.test · Administrator", { exact: true })).toBeVisible();
    await other.reload();
    await expect(other.getByText(/The administrator account was deleted/)).toBeVisible();
    await expect(other.getByText(/The household administrator changed/)).toBeVisible();
    await expect(other.getByRole("button", { name: "Claim administration", exact: true })).toHaveCount(0);
  } finally { await group.close(); }
});
