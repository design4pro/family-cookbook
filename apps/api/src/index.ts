import { createAuth, handleAuthRequest } from "./auth/auth";
import { sendTestCode } from "./auth/email";
import { handleHouseholdRequest } from "./households/routes";

interface ApplicationEnv {
  DB: D1Database;
  AUTH_BASE_URL?: string;
  BETTER_AUTH_SECRET?: string;
  RESEND_API_KEY?: string;
}

export default {
  async fetch(request: Request, env: ApplicationEnv) {
    if (!new URL(request.url).pathname.startsWith("/api/")) return new Response("Not found", { status: 404 });
    if (!env.AUTH_BASE_URL || !env.BETTER_AUTH_SECRET || !env.RESEND_API_KEY) {
      return Response.json({ error: "Authentication is not configured" }, { status: 503 });
    }
    // Keep the existing approved test recipient restriction until operational readiness.
    const auth = createAuth({ database: env.DB, baseURL: env.AUTH_BASE_URL, secret: env.BETTER_AUTH_SECRET,
      recipients: ["kontakt@design4.pro"], sendCode: async (email, code, purpose) => { await sendTestCode(env.RESEND_API_KEY!, email, code, purpose); } });
    return new URL(request.url).pathname.startsWith("/api/household")
      ? handleHouseholdRequest(env.DB, auth, request) : handleAuthRequest(auth, request);
  },
} satisfies ExportedHandler<ApplicationEnv>;
