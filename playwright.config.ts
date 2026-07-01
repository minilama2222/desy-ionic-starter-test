import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E configuration for desy-ionic-starter.
 *
 * - WebServer arranca `ng serve` antes de los tests y lo para al final.
 * - Apunta a `http://localhost:4200` por defecto (puerto estándar de Angular CLI).
 * - Si usas `ionic serve`, cambia el comando a `ionic:serve` y el puerto a 8100.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: process.env['E2E_BASE_URL'] || 'http://localhost:4200',
    trace: 'on-first-retry'
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],

  webServer: {
    command: 'npm run start',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env['CI'],
    timeout: 120_000
  }
});