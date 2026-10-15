import { mkdtempSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parseEnv } from "node:util";
import { randomBytes } from "node:crypto";
import { spawn } from "node:child_process";

// Read only the explicitly selected email credential. Never print credentials or pass them in argv.
const directory = mkdtempSync(join(tmpdir(), "cookbook-t07-"));
const secrets = { BETTER_AUTH_SECRET: randomBytes(48).toString("hex") };
if (process.env.T07_EMAIL_ENV_FILE) {
  const configured = parseEnv(readFileSync(process.env.T07_EMAIL_ENV_FILE, "utf8"));
  secrets.RESEND_API_KEY = configured.EMAIL_API_KEY ?? configured.RESEND_API_KEY;
  if (!secrets.RESEND_API_KEY) throw new Error("Configured test email credential missing");
}
const file = join(directory, ".env");
writeFileSync(file, Object.entries(secrets).map(([key, value]) => `${key}=${JSON.stringify(value)}`).join("\n"), { mode: 0o600 });
const child = spawn("pnpm", ["--filter", "@family-cookbook/api", "exec", "wrangler", "dev", "--config", "wrangler.t07-proof.jsonc", "--env-file", file, "--ip", "127.0.0.1", "--port", "8789"], { stdio: "inherit", env: { ...process.env, WRANGLER_SEND_METRICS: "false" } });
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => child.kill(signal));
child.on("exit", code => { rmSync(directory, { recursive: true, force: true }); process.exitCode = code ?? 1; });
