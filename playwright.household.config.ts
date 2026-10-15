import { defineConfig } from "@playwright/test";
import auth from "./playwright.auth.config";

export default defineConfig({
  ...auth,
  testDir: "./tests/web", testMatch: "household.spec.ts",
  reporter: [["list"], ["json", { outputFile: "test-results/household-web.json" }]],
});
