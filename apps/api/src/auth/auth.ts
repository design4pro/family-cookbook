import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins";
import { expo } from "@better-auth/expo";

export const NATIVE_ORIGIN = "cookbook-t03-proof://";
export type CodePurpose = "sign-in" | "email-verification";
export interface AuthOptions {
  database: D1Database;
  baseURL: string;
  secret: string;
  recipients: readonly string[];
  sendCode: (email: string, code: string, purpose: CodePurpose) => Promise<void>;
}

export function createAuth(options: AuthOptions) {
  const recipients = new Set(options.recipients.map(email => email.toLowerCase()));
  return betterAuth({
    database: options.database,
    baseURL: options.baseURL,
    secret: options.secret,
    trustedOrigins: [new URL(options.baseURL).origin, NATIVE_ORIGIN],
    logger: { disabled: true },
    session: { expiresIn: 7 * 86400, cookieCache: { enabled: false } },
    advanced: { cookiePrefix: "cookbook-t07", ipAddress: { ipAddressHeaders: ["cf-connecting-ip"] } },
    rateLimit: { enabled: true, storage: "database", window: 60, max: 100 },
    plugins: [expo(), emailOTP({
      otpLength: 6, expiresIn: 300, allowedAttempts: 3, storeOTP: "hashed",
      rateLimit: { window: 60, max: 10 },
      async sendVerificationOTP({ email, otp, type }) {
        // The same success response conceals account existence and the test allowlist.
        if ((type === "sign-in" || type === "email-verification") && recipients.has(email.toLowerCase())) await options.sendCode(email, otp, type);
      },
    })],
  });
}

const allowedPaths = new Set([
  "/api/auth/email-otp/send-verification-otp", "/api/auth/sign-in/email-otp",
  "/api/auth/get-session", "/api/auth/sign-out",
]);

export async function handleAuthRequest(auth: ReturnType<typeof createAuth>, request: Request) {
  const url = new URL(request.url);
  const trusted = [new URL(auth.options.baseURL as string).origin, NATIVE_ORIGIN];
  const origin = request.headers.get("origin") ?? request.headers.get("expo-origin");
  if ((origin && !trusted.includes(origin)) || (request.method === "POST" && !origin)) {
    return Response.json({ error: "Untrusted origin" }, { status: 403 });
  }
  if (request.method === "POST") {
    let body: Record<string, unknown>;
    try { body = await request.clone().json(); } catch { return new Response(null, { status: 400 }); }
    if (!body || typeof body !== "object" || Array.isArray(body)) return new Response(null, { status: 400 });
    for (const name of ["callbackURL", "errorCallbackURL", "newUserCallbackURL"]) {
      if (typeof body[name] === "string") {
        try {
          if (new URL(body[name], auth.options.baseURL as string).origin !== trusted[0]) return Response.json({ error: "Untrusted redirect" }, { status: 403 });
        } catch { return new Response(null, { status: 400 }); }
      }
    }
    if (url.pathname === "/api/auth/email-otp/send-verification-otp" && body.type !== "sign-in") {
      return new Response(null, { status: 400 });
    }
  }
  if (url.pathname === "/api/private" && request.method === "GET") {
    // Native cached session data is presentation only; every protected read consults D1.
    const session = await auth.api.getSession({ headers: request.headers, query: { disableCookieCache: true } });
    return Response.json(session ? { userId: session.user.id, email: session.user.email } : { error: "Unauthenticated" },
      { status: session ? 200 : 401, headers: { "cache-control": "no-store" } });
  }
  if (!allowedPaths.has(url.pathname)) return new Response(null, { status: 404 });
  const response = await auth.handler(request);
  response.headers.set("cache-control", "no-store");
  return response;
}
