import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Button, ScrollView, Text, TextInput, View } from "react-native";
import { useInvitationToken } from "../src/households/invitation";
import { authClient, protectedRequest } from "../src/auth/client";

export default function SignIn() {
  const [invitationToken] = useInvitationToken();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("Signed out");
  const [busy, setBusy] = useState(false);
  async function check() {
    const response = await protectedRequest();
    const body = await response.json();
    setMessage(response.ok ? `Authenticated: ${body.email}` : "Signed out or session revoked");
  }
  useEffect(() => { check().catch(() => setMessage("Connection unavailable. Retry to verify your session.")); }, []);
  async function run(action: () => Promise<void>) {
    setBusy(true);
    try { await action(); } catch { setMessage("Connection unavailable. Please retry."); }
    finally { setBusy(false); }
  }
  return <ScrollView contentContainerStyle={{ padding: 24, gap: 16, maxWidth: 520, width: "100%", alignSelf: "center" }}>
    <Text accessibilityRole="header" style={{ fontSize: 26 }}>Sign in with an email code</Text>
    <Text>Email</Text>
    <TextInput accessibilityLabel="Email" autoCapitalize="none" keyboardType="email-address" autoComplete="email" value={email} onChangeText={setEmail} style={{ borderWidth: 1, padding: 12, minHeight: 48 }} />
    <Button title="Send code" disabled={busy || !email} onPress={() => run(async () => {
      const result = await authClient.emailOtp.sendVerificationOtp({ email, type: "sign-in" });
      setMessage(result.error ? (result.error.status === 429 ? "Too many requests. Try again later." : "Unable to send code. Please retry.") : "If this address is allowed, a code has been sent. It expires in 5 minutes.");
    })} />
    <Text>Six-digit code</Text>
    <TextInput accessibilityLabel="Six-digit code" keyboardType="number-pad" autoComplete="one-time-code" value={otp} onChangeText={setOtp} maxLength={6} style={{ borderWidth: 1, padding: 12, minHeight: 48 }} />
    <Button title="Sign in" disabled={busy || otp.length !== 6} onPress={() => run(async () => {
      const result = await authClient.signIn.emailOtp({ email, otp });
      setOtp("");
      if (result.error) setMessage(result.error.status === 429 ? "Too many requests. Try again later." : "Invalid or expired code. Request a new code.");
      else await check();
    })} />
    <Link href={invitationToken ? `/household-start#invite=${invitationToken}` : "/household-start"} style={{ paddingVertical: 12 }}>Open household</Link>
    <Text role="status" accessibilityLiveRegion="polite" testID="auth-status">{message}</Text>
    <View style={{ gap: 16 }}>
      <Button title="Check protected session" disabled={busy} onPress={() => run(check)} />
      <Button title="Sign out" disabled={busy} onPress={() => run(async () => {
        const result = await authClient.signOut();
        if (result.error) setMessage("Sign out was not confirmed. Reconnect and retry.");
        else await check();
      })} />
    </View>
  </ScrollView>;
}
