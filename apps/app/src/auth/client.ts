import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export const authBaseURL = process.env.EXPO_PUBLIC_AUTH_URL ?? (Platform.OS === "android" ? "http://10.0.2.2:8789" : "http://127.0.0.1:8789");
export const authClient = createAuthClient({
  baseURL: authBaseURL,
  plugins: [emailOTPClient(), expoClient({
    scheme: "cookbook-t03-proof", storagePrefix: "cookbook-t07", cookiePrefix: "cookbook-t07", storage: SecureStore,
  })],
});

export async function protectedRequest(path = "/api/private", init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  if (Platform.OS !== "web") {
    headers.set("cookie", await authClient.getCookie());
    headers.set("expo-origin", "cookbook-t03-proof://");
  }
  return fetch(`${authBaseURL}${path}`, {
    ...init, headers, credentials: Platform.OS === "web" ? "include" : "omit",
  });
}
