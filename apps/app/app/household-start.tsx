import type { HouseholdSnapshot } from "../../api/src/households/contract";
import { useEffect, useState } from "react";
import { Link } from "expo-router";
import { Button, ScrollView, Text, TextInput, View } from "react-native";
import { useInvitationToken } from "../src/households/invitation";
import { Administration } from "../src/households/administration";
import { authBaseURL, protectedRequest } from "../src/auth/client";

const field = { borderWidth: 1, padding: 12, minHeight: 48 };

export default function HouseholdStart() {
  const [snapshot, setSnapshot] = useState<HouseholdSnapshot | null>(null);
  const [email, setEmail] = useState("");
  const [token, setToken] = useInvitationToken();
  const [invitationLink, setInvitationLink] = useState("");
  const [message, setMessage] = useState("Checking membership…");
  const [busy, setBusy] = useState(true);
  const [confirmation, setConfirmation] = useState<{ memberId: string; label: string } | null>(null);
  const household = snapshot?.household;
  const administrator = !!household && household.administratorId === snapshot?.userId;

  async function refresh() {
    const response = await protectedRequest("/api/household");
    if (!response.ok) { setSnapshot(null); throw new Error("Sign in to manage your household."); }
    const current = await response.json() as HouseholdSnapshot;
    setSnapshot(current);
    if (!current.household) { setInvitationLink(""); setConfirmation(null); }
    return current;
  }
  async function run(action: () => Promise<void>) {
    setBusy(true);
    try { await action(); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Connection unavailable. Retry when online."); }
    finally { setBusy(false); }
  }
  async function mutate(action: string, body: object = {}) {
    const response = await protectedRequest(`/api/household/${action}`, {
      method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body),
    });
    const result = await response.json();
    if (!response.ok) {
      await refresh();
      throw new Error(result.error ?? "Change was not confirmed. Retry when online.");
    }
    await refresh();
    return result;
  }
  useEffect(() => {
    run(async () => { const current = await refresh(); setMessage(current.household ? "Membership verified online" : "Create a household or accept an invitation"); });
  }, []);

  return <ScrollView contentContainerStyle={{ padding: 24, gap: 16, maxWidth: 640, width: "100%", alignSelf: "center" }}>
    <Text accessibilityRole="header" style={{ fontSize: 28 }}>Your household</Text>
    <Text role="status" accessibilityLiveRegion="polite" testID="household-status">{message}</Text>
    <Link href={token ? `/sign-in#invite=${token}` : "/sign-in"} style={{ paddingVertical: 12 }}>Sign in or manage your session</Link>
    <Button title="Refresh membership" disabled={busy} onPress={() => run(async () => {
      const current = await refresh();
      setMessage(current.household ? "Membership verified online" : "You have no active household. Access may have been removed.");
    })} />
    {snapshot && !household && <View style={{ gap: 16 }}>
      <Text>One private cookbook, up to five people. You can belong to one household at a time.</Text>
      <Button title="Create household" disabled={busy} onPress={() => run(async () => {
        await mutate("create"); setMessage("Household created. You are administrator and payer.");
      })} />
      <Text>Sign in with the email address named in the invitation.</Text>
      <TextInput accessibilityLabel="Invitation code or link" autoCapitalize="none" autoCorrect={false} value={token} onChangeText={value => {
        setToken(new URLSearchParams(value.split("#")[1] ?? "").get("invite") ?? value.trim());
      }} style={field} />
      <Button title="Accept invitation" disabled={busy || !token} onPress={() => run(async () => {
        await mutate("accept", { token }); setToken(""); setMessage("Invitation accepted. You joined the household.");
      })} />
    </View>}
    {household && <View style={{ gap: 16 }}>
      <Text accessibilityRole="header" style={{ fontSize: 22 }}>Members ({household.members.length}/5)</Text>
      <Text>Administrator manages membership. Payer manages their purchase. These are separate responsibilities.</Text>
      {household.members.map(member => <View key={member.id} style={{ gap: 8 }}>
        <Text>{member.email}{member.id === household.administratorId ? " · Administrator" : ""}{member.id === household.payerId ? " · Payer" : ""}</Text>
        {administrator && member.id !== snapshot.userId && <Button title={`Remove ${member.email}`} disabled={busy} onPress={() => setConfirmation({ memberId: member.id, label: `Remove ${member.email}` })} />}
      </View>)}
      {household.payerId && !household.members.some(member => member.id === household.payerId) && <Text>The payer is no longer a member. Leaving does not cancel their subscription.</Text>}
      {administrator && <View style={{ gap: 16 }}>
        <Text accessibilityRole="header" style={{ fontSize: 22 }}>Invite a member</Text>
        <Text>Links expire after seven days and work once for the named email. Pending invitations do not reserve places.</Text>
        <TextInput accessibilityLabel="Invitee email" autoCapitalize="none" autoComplete="email" keyboardType="email-address" value={email} onChangeText={setEmail} style={field} />
        <Button title="Create invitation" disabled={busy || !email || household.members.length >= 5} onPress={() => run(async () => {
          const invite = await mutate("invite", { householdId: household.id, email });
          setInvitationLink(`${authBaseURL}/household-start#invite=${invite.token}`);
          setEmail(""); setMessage("Invitation created. Copy the link and share it with the named recipient. No email has been sent.");
        })} />
        {!!invitationLink && <TextInput accessibilityLabel="Invitation link" value={invitationLink} readOnly multiline style={field} />}
        {household.invitations.map(invite => <View key={invite.id} style={{ gap: 8 }}>
          <Text>{invite.email} · expires {new Date(invite.expiresAt).toLocaleDateString()}</Text>
          <Button title={`Revoke invitation for ${invite.email}`} disabled={busy} onPress={() => run(async () => {
            await mutate("revoke-invitation", { householdId: household.id, invitationId: invite.id });
            setInvitationLink(""); setMessage("Invitation revoked.");
          })} />
        </View>)}
      </View>}
      <Administration key={household.id} household={household} userId={snapshot.userId} busy={busy} run={run} mutate={mutate} setMessage={setMessage} />
      <Text>Leaving or removal ends online access immediately. It does not delete the account or contributions, or cancel billing. Previously downloaded exports cannot be remotely recalled.</Text>
      {administrator && household.members.length > 1 && <Text>Hand over administration before leaving. You can leave after the recipient accepts.</Text>}
      <Button title="Leave household" disabled={busy || (administrator && household.members.length > 1)} onPress={() => setConfirmation({ memberId: snapshot.userId, label: household.members.length === 1 ? "Leave and close this empty household" : "Leave this household" })} />
      {confirmation && <View style={{ gap: 12 }}>
        <Text accessibilityRole="header">{confirmation.label}?</Text>
        <Button title="Confirm membership removal" disabled={busy} onPress={() => run(async () => {
          await mutate(confirmation.memberId === snapshot.userId ? "leave" : "remove", { householdId: household.id, memberId: confirmation.memberId });
          setConfirmation(null); setMessage("Membership removed. Account, contributions and billing are unchanged.");
        })} />
        <Button title="Keep membership" disabled={busy} onPress={() => setConfirmation(null)} />
      </View>}
    </View>}
  </ScrollView>;
}
