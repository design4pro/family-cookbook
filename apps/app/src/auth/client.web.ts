import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";

export const authBaseURL = process.env.EXPO_PUBLIC_AUTH_URL ?? "http://127.0.0.1:8789";
export const authClient = createAuthClient({ baseURL: authBaseURL, plugins: [emailOTPClient()] });
export function protectedRequest(path = "/api/private", init: RequestInit = {}) {
  return fetch(`${authBaseURL}${path}`, { ...init, credentials: "include" });
}
