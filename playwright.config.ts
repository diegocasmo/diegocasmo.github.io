import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  projects: [{ name: 'chromium', use: { channel: 'chromium' } }],
  webServer: {
    command: 'npm run preview',
    port: 4321,
    reuseExistingServer: !process.env.CI,
  },
});
