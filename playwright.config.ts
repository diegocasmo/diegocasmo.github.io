import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  projects: [{ name: 'chromium', use: { channel: 'chromium' } }],
  webServer: {
    command: 'npx serve dist -l 4321',
    port: 4321,
    reuseExistingServer: !process.env.CI,
  },
});
