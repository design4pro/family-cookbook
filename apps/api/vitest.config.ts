import { cloudflareTest, readD1Migrations } from "@cloudflare/vitest-plugin";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    cloudflareTest({
      wrangler: { configPath: "./wrangler.jsonc" },
      miniflare: {
        d1Databases: ["JOURNAL"],
        r2Buckets: ["ACTIVE", "RECOVERY"],
        bindings: { TEST_MIGRATIONS: await readD1Migrations("./migrations") },
      },
    }),
  ],
  test: { setupFiles: ["./tests/setup.ts"] },
});
