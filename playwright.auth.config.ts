import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/auth", workers: 1, retries: 0,
  reporter: [["list"], ["json", { outputFile: "test-results/auth-web.json" }]],
  use: { baseURL: "http://127.0.0.1:8789", trace: "off", screenshot: "off", video: "off" },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }, { name: "webkit", use: { browserName: "webkit" } }],
  webServer: {
    command: "pnpm serve:auth-proof", url: "http://127.0.0.1:8789/sign-in", timeout: 120_000,
    reuseExistingServer: !process.env.CI,
  },
});
