import { applyD1Migrations, reset, type D1Migration } from "cloudflare:test";
import { env } from "cloudflare:workers";
import { beforeEach } from "vitest";

declare global {
  namespace Cloudflare {
    interface Env {
      TEST_MIGRATIONS: D1Migration[];
      JOURNAL: D1Database;
      ACTIVE: R2Bucket;
      RECOVERY: R2Bucket;
    }
  }
}

beforeEach(async () => {
  await reset();
  await applyD1Migrations(env.DB, env.TEST_MIGRATIONS);
});
