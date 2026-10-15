import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/web",
  testIgnore: "**/household.spec.ts",
  fullyParallel: true,
  workers: 2,
  retries: 0,
  reporter: [["list"], ["json", { outputFile: "test-results/web-results.json" }]],
  use: { baseURL: "http://127.0.0.1:8788", trace: "retain-on-failure", screenshot: "only-on-failure" },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }, { name: "webkit", use: { browserName: "webkit" } }],
  webServer: {
    command: "pnpm serve:web-proof",
    url: "http://127.0.0.1:8788/proof-shopping",
    timeout: 120_000,
    env: { WRANGLER_SEND_METRICS: "false", CI: "1" },
  },
});
