import { createAuth, handleAuthRequest } from "../auth/auth";
import { handleHouseholdRequest } from "../households/routes";
import { sendTestCode } from "../auth/email";

interface ProofEnv { DB: D1Database; ASSETS: Fetcher; BETTER_AUTH_SECRET: string; RESEND_API_KEY?: string }
const mailbox = new Map<string, { code: string; providerId?: string }>();
const audits = new Map<string, unknown>();

// Local-only driver. Never deploy this entry point: it exposes a synthetic mailbox and reset controls.
export default {
  async fetch(request: Request, env: ProofEnv) {
    const url = new URL(request.url);
    if (!["127.0.0.1", "localhost", "10.0.2.2"].includes(url.hostname)) return new Response(null, { status: 403 });
    if (url.pathname.startsWith("/__proof/")) {
      if (request.headers.get("x-t07-proof") !== "local-harness") return new Response(null, { status: 403 });
      if (url.pathname === "/__proof/mail") return Response.json(mailbox.get(url.searchParams.get("email") ?? "") ?? {}, { headers: { "cache-control": "no-store" } });
      if (url.pathname === "/__proof/audit" && request.method === "POST") {
        const body = await request.json() as { platform: string; phase: string };
        audits.set(`${body.platform}:${body.phase}`, body);
        return Response.json({ saved: true });
      }
      if (url.pathname === "/__proof/audit") return Response.json(Object.fromEntries(audits));
      if (url.pathname === "/__proof/revoke" && request.method === "POST") {
        await env.DB.prepare('DELETE FROM session').run();
        return Response.json({ revoked: true });
      }
      if (url.pathname === "/__proof/delete-profile" && request.method === "POST") {
        const { email } = await request.json() as { email: string };
        if (!["web@example.test", "ios@example.test", "android@example.test"].includes(email)) return new Response(null, { status: 403 });
        await env.DB.prepare('DELETE FROM user WHERE email = ?').bind(email).run();
        return Response.json({ deleted: true });
      }
      if (url.pathname === "/__proof/reset" && request.method === "POST") {
        await env.DB.batch(["household_reauthentication", "household_handovers", "household_administration_claimants", "household_notifications", "household_invitations", "household_members", "billing_entitlements", "billing_purchase_bindings", "billing_purchase_intents", "billing_payers", "billing_households", "households", "session", "account", "user", "verification", "rateLimit"].map(table => env.DB.prepare(`DELETE FROM "${table}"`)));
        mailbox.clear();
        return Response.json({ reset: true });
      }
      return new Response(null, { status: 404 });
    }
    if (url.pathname.startsWith("/api/")) {
      const auth = createAuth({ database: env.DB, baseURL: "http://127.0.0.1:8789", secret: env.BETTER_AUTH_SECRET,
        recipients: ["web@example.test", "ios@example.test", "android@example.test", "kontakt@design4.pro"],
        async sendCode(email, code, purpose) {
          let providerId: string | undefined;
          if (email === "kontakt@design4.pro") {
            if (!env.RESEND_API_KEY) throw new Error("Test email access missing");
            providerId = await sendTestCode(env.RESEND_API_KEY, email, code, purpose);
          }
          mailbox.set(email, { code, providerId });
        },
      });
      return url.pathname.startsWith("/api/household")
        ? handleHouseholdRequest(env.DB, auth, request) : handleAuthRequest(auth, request);
    }
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<ProofEnv>;
