import { type createAuth, NATIVE_ORIGIN } from "../auth/auth";
import { acceptInvitation, createHousehold, getHousehold, inviteMember, removeMember, revokeInvitation } from "./membership";
import { acceptHandover, cancelHandover, claimAdministration, grantHandoverReauthentication, requestHandover } from "./handover";

export async function handleHouseholdRequest(db: D1Database, auth: ReturnType<typeof createAuth>, request: Request) {
  const respond = (body: unknown, status = 200) => Response.json(body, { status, headers: { "cache-control": "no-store" } });
  const path = new URL(request.url).pathname;
  const origin = request.headers.get("origin") ?? request.headers.get("expo-origin");
  const trusted = [new URL(auth.options.baseURL as string).origin, NATIVE_ORIGIN];
  if ((origin && !trusted.includes(origin)) || (request.method !== "GET" && !origin)) return respond({ error: "Untrusted origin" }, 403);
  const session = await auth.api.getSession({ headers: request.headers, query: { disableCookieCache: true } });
  if (!session?.user.emailVerified) return respond({ error: "Sign in with a verified email first" }, 401);
  const userId = session.user.id;
  if (path === "/api/household" && request.method === "GET") return respond({ userId, household: await getHousehold(db, userId) });
  if (request.method !== "POST") return respond({ error: "Not found" }, 404);
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return respond({ error: "Invalid request" }, 400); }
  if (!body || typeof body !== "object" || Array.isArray(body)) return respond({ error: "Invalid request" }, 400);
  if (path === "/api/household/create") {
    const id = await createHousehold(db, userId);
    return id ? respond({ id }, 201) : respond({ error: "You already belong to a household" }, 409);
  }
  if (path === "/api/household/accept") {
    if (typeof body.token !== "string" || !/^[a-f0-9]{64}$/.test(body.token)) return respond({ error: "Invalid invitation" }, 400);
    const id = await acceptInvitation(db, userId, body.token);
    return id ? respond({ id }) : respond({ error: "Invitation unavailable: check its email, expiry, household capacity and your existing membership" }, 409);
  }
  if (typeof body.householdId !== "string") return respond({ error: "Invalid household" }, 400);
  if (path === "/api/household/handover/send-code" || path === "/api/household/handover/verify-code") {
    const household = await getHousehold(db, userId);
    if (household?.id !== body.householdId || household.administratorId !== userId) return respond({ error: "Administrator access required" }, 403);
    const verifying = path.endsWith("/verify-code");
    if (verifying && (typeof body.otp !== "string" || !/^\d{6}$/.test(body.otp))) return respond({ error: "Enter a six-digit verification code" }, 400);
    // Route through Better Auth's HTTP handler to retain its database rate limits
    // and atomic OTP consumption. Never accept an email address from this body.
    const headers = new Headers(request.headers);
    headers.set("content-type", "application/json"); headers.delete("content-length");
    const verification = await auth.handler(new Request(new URL(verifying ? "/api/auth/email-otp/verify-email" : "/api/auth/email-otp/send-verification-otp", auth.options.baseURL as string), {
      method: "POST", headers, body: JSON.stringify(verifying ? { email: session.user.email, otp: body.otp }
        : { email: session.user.email, type: "email-verification" }),
    }));
    if (!verification.ok) return respond({ error: verification.status === 429 ? "Too many requests. Try again later." : "Verification failed. Request a new code and retry." }, verification.status);
    if (!verifying) return respond({ sent: true });
    return await grantHandoverReauthentication(db, userId, session.session.id, household.id)
      ? respond({ verified: true }) : respond({ error: "Administrator session is no longer available" }, 403);
  }
  if (path === "/api/household/handover/request" && typeof body.recipientId === "string") {
    const handover = await requestHandover(db, userId, session.session.id, body.householdId, body.recipientId);
    return handover ? respond(handover, 201) : respond({ error: "Handover unavailable. Verify a new code, choose a current member and check for an existing request." }, 409);
  }
  if ((path === "/api/household/handover/accept" || path === "/api/household/handover/cancel") && typeof body.requestId === "string") {
    const change = path.endsWith("/accept") ? acceptHandover : cancelHandover;
    return await change(db, userId, body.householdId, body.requestId)
      ? respond({ changed: true }) : respond({ error: "Handover unavailable, expired or no longer authorized" }, 409);
  }
  if (path === "/api/household/handover/claim") {
    return await claimAdministration(db, userId, body.householdId)
      ? respond({ claimed: true }) : respond({ error: "Administration cannot be claimed by this account" }, 409);
  }
  if (path === "/api/household/invite") {
    if (typeof body.email !== "string") return respond({ error: "Invalid email" }, 400);
    const invite = await inviteMember(db, userId, body.householdId, body.email);
    return invite ? respond(invite, 201) : respond({ error: "Invitation unavailable: check the address, administrator role and five-person limit" }, 409);
  }
  if (path === "/api/household/revoke-invitation" && typeof body.invitationId === "string") {
    return await revokeInvitation(db, userId, body.householdId, body.invitationId)
      ? respond({ revoked: true }) : respond({ error: "Invitation unavailable" }, 403);
  }
  if (path === "/api/household/leave" || (path === "/api/household/remove" && typeof body.memberId === "string")) {
    const target = path.endsWith("/leave") ? userId : body.memberId as string;
    return await removeMember(db, userId, body.householdId, target)
      ? respond({ removed: true }) : respond({ error: "Removal unavailable. Administrators must hand over before leaving other members." }, 409);
  }
  return respond({ error: "Not found" }, 404);
}
