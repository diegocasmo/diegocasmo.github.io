import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  projects: [{ name: 'chromium', use: { channel: 'chromium' } }],
  webServer: {
    // Astro backgrounds `preview` when it detects an AI agent, which Playwright
    // reads as a crash; --ignore-lock keeps it in the foreground.
    command: 'npm run preview -- --ignore-lock',
    port: 4321,
    reuseExistingServer: !process.env.CI,
  },
});
