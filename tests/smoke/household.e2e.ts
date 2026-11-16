import { beforeEach, describe, test } from '@e2e-dev/web';
import { expect } from 'e2e';
import { email, resetHarness, signIn } from './harness';

describe('household smoke', { tags: ['smoke'] }, () => {
  beforeEach(async ({ app }) => { await resetHarness(app); });

  test('the creator becomes the household administrator and payer', async ({ app, screen }) => {
    await signIn(app, screen);
    await app.open('/household-start');
    await screen.getByRole('button', { name: 'Create household', exact: true }).waitFor();

    await screen.getByRole('button', { name: 'Create household', exact: true }).tap();

    await expect(screen.getByText('Members (1/5)', { exact: true })).toBeVisible();
    await expect(screen.getByText(`${email} · Administrator · Payer`, { exact: true })).toBeVisible();
    await expect(screen.getByTestId('household-status')).toHaveText('Household created. You are administrator and payer.');
  });
});
