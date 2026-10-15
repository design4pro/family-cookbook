import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import type { Household } from "../../../api/src/households/contract";

interface Props {
  household: Household;
  userId: string;
  busy: boolean;
  run: (action: () => Promise<void>) => Promise<void>;
  mutate: (action: string, body: object) => Promise<unknown>;
  setMessage: (message: string) => void;
}
const noticeText = {
  handover_requested: "You were nominated for administration. Check the current request above.",
  administrator_changed: "The household administrator changed. Membership, authorship and billing were not transferred.",
  administrator_deleted: "The administrator account was deleted. Existing members keep access and an eligible member can claim administration.",
};

export function Administration({ household, userId, busy, run, mutate, setMessage }: Props) {
  const [codeRequested, setCodeRequested] = useState(false);
  const [otp, setOtp] = useState("");
  const [verified, setVerified] = useState(false);
  const administrator = household.administratorId === userId;
  const pending = household.handover;
  const request = (action: string, body: object = {}) => mutate(`handover/${action}`, { ...body, householdId: household.id });

  return <View style={{ gap: 16 }}>
    <Text accessibilityRole="header" style={{ fontSize: 22 }}>Administration</Text>
    <Text>Handover changes membership management only. The payer, subscriptions, recipe authorship and allowances stay unchanged.</Text>
    {pending && <View style={{ gap: 12 }}>
      <Text>Awaiting acceptance by {household.members.find(member => member.id === pending.recipientId)?.email}. Expires {new Date(pending.expiresAt).toLocaleString()}.</Text>
      {pending.senderId === userId && <Button title="Cancel handover" disabled={busy} onPress={() => run(async () => {
        await request("cancel", { requestId: pending.id }); setVerified(false); setMessage("Handover canceled. Administration is unchanged.");
      })} />}
      {pending.recipientId === userId && <Button title="Accept administration" disabled={busy} onPress={() => run(async () => {
        await request("accept", { requestId: pending.id }); setMessage("Administration transferred. Remaining members have an in-app notification.");
      })} />}
    </View>}
    {administrator && !pending && household.members.length > 1 && <View style={{ gap: 12 }}>
      <Text>Verify a new email code, then nominate one current member. They must accept within seven days; until then you remain administrator.</Text>
      <Button title="Send handover verification code" disabled={busy} onPress={() => run(async () => {
        await request("send-code"); setCodeRequested(true); setVerified(false); setOtp("");
        setMessage("Verification code requested for your sign-in email. It expires in five minutes.");
      })} />
      {codeRequested && !verified && <View style={{ gap: 12 }}>
        <TextInput accessibilityLabel="Handover verification code" keyboardType="number-pad" autoComplete="one-time-code" value={otp} onChangeText={setOtp} maxLength={6} style={{ borderWidth: 1, padding: 12, minHeight: 48 }} />
        <Button title="Verify handover code" disabled={busy || otp.length !== 6} onPress={() => run(async () => {
          try { await request("verify-code", { otp }); setVerified(true); setMessage("Identity verified. Choose a member within five minutes."); }
          finally { setOtp(""); }
        })} />
      </View>}
      {verified && household.members.filter(member => member.id !== userId).map(member => <Button key={member.id} title={`Nominate ${member.email}`} disabled={busy} onPress={() => run(async () => {
        try {
          await request("request", { recipientId: member.id });
          setCodeRequested(false); setMessage("Handover requested. Administration changes only after the recipient accepts.");
        } finally { setVerified(false); }
      })} />)}
    </View>}
    {household.administratorId === null && <View style={{ gap: 12 }}>
      <Text>No administrator is assigned. Existing access continues; membership management is unavailable until an eligible member explicitly claims administration.</Text>
      {household.canClaimAdministration && <Button title="Claim administration" disabled={busy} onPress={() => run(async () => {
        await request("claim"); setMessage("Administration claimed. Remaining members have an in-app notification.");
      })} />}
    </View>}
    {household.notifications.length > 0 && <View style={{ gap: 8 }}>
      <Text accessibilityRole="header" style={{ fontSize: 20 }}>Household notifications</Text>
      {household.notifications.map(notice => <Text key={notice.id}>{new Date(notice.createdAt).toLocaleString()} · {noticeText[notice.kind]}</Text>)}
    </View>}
  </View>;
}
