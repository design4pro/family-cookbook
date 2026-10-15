import { chromium, webkit, expect, test, type Page } from "@playwright/test";

const route = "/proof-shopping";
async function open(page: Page) {
  const response = await page.goto(route);
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("status")).toHaveText("Local storage ready.");
}
async function toggle(page: Page) {
  await page.getByRole("checkbox", { name: "Milk" }).click();
  await expect(page.getByRole("status")).toHaveText("Saved on this browser; pending synchronization.");
  const id = await page.getByTestId("next").textContent();
  expect(id).not.toBe("none");
  return id!;
}

test("offline intent survives reload when the exported shell is available", async ({ page, context }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  // Supply previously fetched shell bytes only. This is not a product service worker or a cold-start promise.
  const shell = new Map<string, { body: Buffer; contentType: string }>();
  let offline = false;
  await context.route("http://127.0.0.1:8788/**", async request => {
    const url = request.request().url();
    if (offline) {
      const cached = shell.get(url);
      if (cached) await request.fulfill(cached);
      else await request.abort("internetdisconnected");
    } else {
      const response = await request.fetch();
      shell.set(url, { body: await response.body(), contentType: response.headers()["content-type"] ?? "application/octet-stream" });
      await request.fulfill({ response });
    }
  });
  await open(page);
  offline = true;
  await context.setOffline(true);
  await expect(page.getByTestId("network")).toHaveText("offline");
  const id = await toggle(page);
  await page.reload();
  await expect(page.getByTestId("next")).toHaveText(id);
  await expect(page.getByRole("checkbox")).toBeChecked();
  await expect(page.getByTestId("network")).toHaveText("offline");
  await page.getByRole("button", { name: "Retry synchronization" }).click();
  await expect(page.getByRole("alert")).toBeVisible();
  await expect(page.getByTestId("flight")).toHaveText(id);
  await page.reload();
  await expect(page.getByTestId("flight")).toHaveText(id);
  expect(errors).toEqual([]);
});

test("browser process restart restores immutable unknown delivery and newer intent", async ({ browserName, baseURL }, info) => {
  const engine = browserName === "chromium" ? chromium : webkit;
  const profile = info.outputPath("isolated-profile");
  let context = await engine.launchPersistentContext(profile, { baseURL, headless: true });
  try {
    let page = context.pages()[0]!;
    await open(page);
    const first = await toggle(page);
    await page.route("**/proof-check", request => request.abort("failed"));
    await page.getByRole("button", { name: "Retry synchronization" }).click();
    await expect(page.getByTestId("flight")).toHaveText(first);
    await expect(page.getByRole("alert")).toBeVisible();
    const later = await toggle(page);
    await context.close(); // Closes the actual browser; no storageState restore.
    context = await engine.launchPersistentContext(profile, { baseURL, headless: true });
    page = context.pages()[0]!;
    await open(page);
    await expect(page.getByTestId("flight")).toHaveText(first);
    await expect(page.getByTestId("next")).toHaveText(later);
    await expect(page.getByRole("checkbox")).not.toBeChecked();
    const sent: { operationId: string; revision: number; purchased: boolean }[] = [];
    await page.route("**/proof-check", async request => {
      const { command } = request.request().postDataJSON();
      sent.push(command);
      await request.fulfill({ json: { status: "accepted", revision: 2, purchased: command.purchased } });
    });
    await page.getByRole("button", { name: "Retry synchronization" }).click();
    await expect(page.getByTestId("flight")).toHaveText("none");
    await expect(page.getByTestId("next")).toHaveText("none");
    expect(sent.map(command => command.operationId)).toEqual([first, later]);
    expect(sent.map(command => command.revision)).toEqual([1, 1]);
  } finally { await context.close(); }
});

test("snapshots and old acknowledgments preserve newer taps without rebasing", async ({ page }) => {
  await open(page);
  const first = await toggle(page);
  await toggle(page);
  const lastUnsent = await toggle(page);
  expect(lastUnsent).not.toBe(first);
  let release!: () => void;
  const held = new Promise<void>(resolve => { release = resolve; });
  const sent: { operationId: string; revision: number }[] = [];
  await page.route("**/proof-check", async request => {
    const { command } = request.request().postDataJSON();
    sent.push(command);
    if (sent.length === 1) {
      await held;
      await request.fulfill({ json: { status: "accepted", revision: 2, purchased: true } });
    } else await request.abort("failed");
  });
  await page.getByRole("button", { name: "Retry synchronization" }).click();
  await expect(page.getByTestId("flight")).toHaveText(lastUnsent);
  const later = await toggle(page);
  await page.getByRole("button", { name: "Fetch snapshot revision 7" }).click();
  await expect(page.getByTestId("revision")).toHaveText("7");
  await expect(page.getByTestId("next")).toHaveText(later);
  await expect(page.getByTestId("flight")).toHaveText(lastUnsent);
  release();
  await expect(page.getByRole("alert")).toBeVisible();
  await expect(page.getByTestId("flight")).toHaveText(later);
  expect(sent.map(command => command.operationId)).toEqual([lastUnsent, later]);
  expect(sent.map(command => command.revision)).toEqual([1, 1]);
  await expect(page.getByTestId("revision")).toHaveText("7");
  await page.unroute("**/proof-check");
  await page.route("**/proof-check", request => request.fulfill({ json: { status: "conflict", revision: 7, purchased: false } }));
  await page.getByRole("button", { name: "Retry synchronization" }).click();
  await expect(page.getByTestId("flight")).toHaveText("none");
  await expect(page.getByTestId("notice")).toContainText("changed elsewhere");
});

test("switching account fences delivery and logout clears only its owner's queue", async ({ page }) => {
  await open(page);
  const alice = await toggle(page);
  await page.getByRole("button", { name: "Use Bob" }).click();
  await expect(page.getByTestId("next")).toHaveText("none");
  const sent: string[] = [];
  await page.route("**/proof-check", async request => {
    const { scope } = request.request().postDataJSON();
    sent.push(scope.accountId);
    await request.abort("failed");
  });
  await page.getByRole("button", { name: "Retry synchronization" }).click();
  await expect(page.getByRole("button", { name: "Retry synchronization" })).toBeEnabled();
  expect(sent).toEqual([]);
  const bob = await toggle(page);
  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page.getByRole("checkbox")).toBeDisabled();
  await page.getByRole("button", { name: "Use Bob" }).click();
  await expect(page.getByTestId("next")).toHaveText("none");
  await page.getByRole("button", { name: "Use Alice" }).click();
  await expect(page.getByTestId("next")).toHaveText(alice);
  expect(alice).not.toBe(bob);
});

test("switching identity during delivery cannot settle or send the previous account's next intent", async ({ page }) => {
  await open(page);
  const alice = await toggle(page);
  let release!: () => void;
  const held = new Promise<void>(resolve => { release = resolve; });
  const sent: string[] = [];
  await page.route("**/proof-check", async request => {
    const { scope, command } = request.request().postDataJSON();
    sent.push(`${scope.accountId}/${command.operationId}`);
    await held;
    await request.fulfill({ json: { status: "accepted", revision: 2, purchased: true } });
  });
  await page.getByRole("button", { name: "Retry synchronization" }).click();
  await expect(page.getByTestId("flight")).toHaveText(alice);
  const later = await toggle(page);
  await page.getByRole("button", { name: "Use Bob" }).click();
  release();
  await expect(page.getByTestId("flight")).toHaveText("none");
  await expect(page.getByTestId("next")).toHaveText("none");
  await expect(page.getByRole("button", { name: "Retry synchronization" })).toBeEnabled();
  await page.getByRole("button", { name: "Retry synchronization" }).click();
  await expect(page.getByRole("button", { name: "Retry synchronization" })).toBeEnabled();
  expect(sent).toEqual([`alice/${alice}`]);
  await page.getByRole("button", { name: "Use Alice" }).click();
  await expect(page.getByTestId("flight")).toHaveText(alice);
  await expect(page.getByTestId("next")).toHaveText(later);
});

test("denied storage disables saving without an in-memory success", async ({ page }) => {
  await page.addInitScript(() => {
    IDBFactory.prototype.open = () => { throw new DOMException("Storage denied fixture", "SecurityError"); };
  });
  await page.goto(route);
  await expect(page.getByRole("alert")).toContainText("Local storage unavailable");
  await expect(page.getByRole("checkbox")).toBeDisabled();
  await expect(page.getByRole("status")).not.toContainText("Saved");
});

for (const failure of ["quota", "abort-after-request-success"] as const) {
  test(`${failure} rejects saving and retains the last committed intent`, async ({ page }) => {
    await open(page);
    const saved = await toggle(page);
    await page.evaluate(kind => {
      const put = IDBObjectStore.prototype.put;
      IDBObjectStore.prototype.put = function (...args: Parameters<IDBObjectStore["put"]>) {
        if (kind === "quota") throw new DOMException("Storage full fixture", "QuotaExceededError");
        const request = put.apply(this, args);
        request.addEventListener("success", () => this.transaction.abort());
        return request;
      };
    }, failure);
    await page.getByRole("checkbox").click();
    await expect(page.getByRole("alert")).toContainText("no new save confirmed");
    await expect(page.getByRole("checkbox")).toBeChecked();
    await expect(page.getByTestId("next")).toHaveText(saved);
    await expect(page.getByRole("status")).not.toContainText("Saved");
    await page.reload();
    await expect(page.getByTestId("next")).toHaveText(saved);
    await expect(page.getByRole("checkbox")).toBeChecked();
  });
}

test("terminal unavailable and forbidden results prevent further replay", async ({ page }) => {
  await open(page);
  await toggle(page);
  await page.route("**/proof-check", request => request.fulfill({ json: { status: "unavailable", revision: null, purchased: null } }));
  await page.getByRole("button", { name: "Retry synchronization" }).click();
  await expect(page.getByTestId("notice")).toContainText("no longer available");
  await page.getByRole("button", { name: "Fetch snapshot revision 7" }).click();
  await page.reload();
  await expect(page.getByRole("checkbox")).toBeDisabled();
  await page.getByRole("button", { name: "Use Bob" }).click();
  await toggle(page);
  await page.unroute("**/proof-check");
  await page.route("**/proof-check", request => request.fulfill({ json: { status: "forbidden", revision: null, purchased: null } }));
  await page.getByRole("button", { name: "Retry synchronization" }).click();
  await expect(page.getByTestId("next")).toHaveText("none");
  await expect(page.getByTestId("flight")).toHaveText("none");
  await page.getByRole("checkbox").click();
  await expect(page.getByRole("alert")).toContainText("Sign in");
});
