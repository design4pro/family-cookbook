import type { App, Screen } from 'e2e';

const proofHeaders = { 'x-t07-proof': 'local-harness' };
export const email = 'web@example.test';

export async function resetHarness(app: App) {
  const response = await fetch(`${app.baseUrl}/__proof/reset`, { method: 'POST', headers: proofHeaders });
  if (!response.ok) throw new Error(`Harness reset failed: ${response.status}`);
}

export async function signIn(app: App, screen: Screen) {
  await app.open('/sign-in');
  await screen.getByLabel('Email', { exact: true }).fill(email);
  await screen.getByRole('button', { name: 'Send code', exact: true }).tap();
  await screen.getByTestId('auth-status').filter({ hasText: 'a code has been sent' }).waitFor();
  const response = await fetch(`${app.baseUrl}/__proof/mail?email=${email}`, { headers: proofHeaders });
  if (!response.ok) throw new Error(`Harness mailbox failed: ${response.status}`);
  const mail = await response.json() as { code?: string };
  if (!mail.code) throw new Error('Harness mailbox contains no OTP');
  await screen.getByLabel('Six-digit code', { exact: true }).fill(mail.code);
  await screen.getByRole('button', { name: 'Sign in', exact: true }).tap();
  await screen.getByTestId('auth-status').filter({ hasText: `Authenticated: ${email}` }).waitFor();
}
