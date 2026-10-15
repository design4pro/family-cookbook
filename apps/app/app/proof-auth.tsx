import { useEffect, useState } from "react";
import { Platform, ScrollView, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { authBaseURL, authClient, protectedRequest } from "../src/auth/client";

// Local native harness only. No codes, cookies or session tokens are included in audit output.
export default function AuthProof() {
  const { run = "restore", email = `${Platform.OS}@example.test` } = useLocalSearchParams<{ run: string; email: string }>();
  const [result, setResult] = useState("Running session proof");
  useEffect(() => {
    let stage = "start";
    async function proof() {
      const control = (path: string, body?: unknown) => fetch(`${authBaseURL}/__proof/${path}`, {
        method: body ? "POST" : "GET", headers: { "x-t07-proof": "local-harness", "content-type": "application/json" },
        ...(body ? { body: JSON.stringify(body) } : {}),
      });
      if (run === "signin") {
        stage = "request-code";
        const sent = await authClient.emailOtp.sendVerificationOtp({ email, type: "sign-in" });
        if (sent.error) throw new Error("Code request failed");
        stage = "read-test-mail";
        const { code } = await (await control(`mail?email=${encodeURIComponent(email)}`)).json();
        stage = "verify-code";
        const signed = await authClient.signIn.emailOtp({ email, otp: code });
        if (signed.error) throw new Error("Code verification failed");
      }
      stage = "protected-request";
      const before = await protectedRequest();
      if (before.status !== 200) throw new Error(`Protected request denied: ${before.status}`);
      let after = before.status;
      if (run === "logout") {
        const signedOut = await authClient.signOut();
        if (signedOut.error) throw new Error("Logout failed");
        after = (await protectedRequest()).status;
        if (after !== 401) throw new Error("Logout did not revoke access");
      }
      if (run === "revoke") {
        const cached = await authClient.getSession();
        if (!cached.data?.session) throw new Error("Session cache was not populated");
        await control("revoke", {});
        after = (await protectedRequest()).status;
        if (after !== 401) throw new Error("Cached session bypassed revocation");
      }
      const audit = { platform: Platform.OS, phase: run, before: before.status, after, pass: true, at: new Date().toISOString() };
      await control("audit", audit);
      setResult(JSON.stringify(audit));
    }
    proof().catch((error: unknown) => {
      // Classify known local failures without rendering arbitrary provider responses or secrets.
      const message = error instanceof Error ? error.message : "";
      const reason = message.includes("Network request failed") ? "network" :
        message.includes("SecureStore") ? "secure-storage" :
        message.includes("URL") ? "url" : "operation";
      setResult(`Session proof failed: ${stage} (${reason}).`);
    });
  }, [run, email]);
  return <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 80 }}><Text testID="session-proof" style={{ fontSize: 20 }}>{result}</Text></ScrollView>;
}
