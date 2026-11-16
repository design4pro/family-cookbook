import { beforeEach, describe, test } from '@e2e-dev/web';
import { expect } from 'e2e';
import { email, resetHarness, signIn } from './harness';

describe('authentication smoke', { tags: ['smoke'] }, () => {
  beforeEach(async ({ app }) => { await resetHarness(app); });

  test('email OTP establishes a session that survives navigation', async ({ app, screen }) => {
    await signIn(app, screen);

    await app.open('/sign-in');

    await expect(screen.getByTestId('auth-status')).toHaveText(`Authenticated: ${email}`);
  });
});
