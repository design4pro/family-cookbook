import type { CodePurpose } from "./auth";

export async function sendTestCode(apiKey: string, email: string, code: string, purpose: CodePurpose = "sign-in") {
  if (email !== "kontakt@design4.pro") throw new Error("Recipient is not approved for T07");
  const action = purpose === "email-verification" ? "administration handover verification" : "sign-in";
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
    body: JSON.stringify({ from: "Cookbook T07 <cookbook-t07@staging.planned.travel>", to: [email],
      subject: `Cookbook test ${action} code`, text: `Your test ${action} code is ${code}. It expires in 5 minutes. If you did not request it, ignore this email.` }),
  });
  if (!response.ok) throw new Error("Test email delivery was not accepted");
  return (await response.json() as { id: string }).id;
}
