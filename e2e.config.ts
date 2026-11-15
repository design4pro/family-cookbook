import type { E2EConfig } from 'e2e';
import { web } from '@e2e-dev/web';
import { chatgpt } from 'e2e/oauth/chatgpt';

export default {
  tests: ['tests/smoke/**/*.e2e.ts'],
  workers: 1,
  retries: 0,
  reporters: ['list', 'junit', 'markdown'],
  trace: 'retain-on-failure',
  video: 'retain-on-failure',
  // Your ChatGPT subscription serves the model; sign in once with `e2e login openai`, `e2e models openai` lists the ids.
  agents: {
    default: {
      model: chatgpt('gpt-6-luna'),
      system: 'You are a thorough QA agent. Verify every outcome.',
    },
  },
  targets: [{
    name: 'chromium',
    engine: web(),
    app: {
      url: 'http://127.0.0.1:8789',
      readyUrl: 'http://127.0.0.1:8789/sign-in',
      command: {
        executable: 'pnpm',
        args: ['serve:auth-proof'],
        env: { CI: '1', WRANGLER_SEND_METRICS: 'false' },
        startupTimeout: 120_000,
        log: '.e2e/logs/auth-proof.log',
      },
    },
  }],
} satisfies E2EConfig;
