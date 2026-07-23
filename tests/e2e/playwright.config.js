import { defineConfig, devices } from '@playwright/test';

const DEFAULT_PORT = 5173;
const DEFAULT_HOST = '127.0.0.1';
const isCI = Boolean(process.env.CI);
const port = Number.parseInt(
  process.env.PLAYWRIGHT_PORT ?? String(DEFAULT_PORT),
  10,
);

if (!Number.isInteger(port) || port < 1 || port > 65_535) {
  throw new Error(
    `Invalid PLAYWRIGHT_PORT "${process.env.PLAYWRIGHT_PORT}". ` +
      'Expected an integer between 1 and 65535.',
  );
}
const host = process.env.PLAYWRIGHT_HOST?.trim() || DEFAULT_HOST;

const localBaseURL = `http://${host}:${port}`;
const baseURL = process.env.PLAYWRIGHT_BASE_URL?.trim() || localBaseURL;

const shouldStartLocalServer =
  !process.env.PLAYWRIGHT_BASE_URL && process.env.PLAYWRIGHT_SKIP_SERVER !== '1';

export default defineConfig({
  testDir: '.',
  testMatch: ['**/*.e2e.{js,jsx,ts,tsx}', '**/*.spec.{js,jsx,ts,tsx}'],

  outputDir: '../../test-results/playwright/artifacts',
  forbidOnly: isCI,
  fullyParallel: true,
  retries: isCI ? 2 : 0,
  workers: process.env.PLAYWRIGHT_WORKERS || (isCI ? 2 : undefined),

  timeout: 45_000,

  expect: {
    timeout: 10_000,
    toHaveScreenshot: {
      animations: 'disabled',
      caret: 'hide',
      scale: 'css',
    },
  },

  reporter: isCI
    ? [
        ['line'],
        [
          'html',
          {
            outputFolder: '../../test-results/playwright/report',
            open: 'never',
          },
        ],
        [
          'junit',
          {
            outputFile:
              '../../test-results/playwright/results/playwright.xml',
          },
        ],
      ]
    : [
        ['list'],
        [
          'html',
          {
            outputFolder: '../../test-results/playwright/report',
            open: 'never',
          },
        ],
      ],

  use: {
    baseURL,
    trace: isCI ? 'retain-on-failure' : 'on-first-retry',
    screenshot: 'only-on-failure',
    video: isCI ? 'retain-on-failure' : 'off',

    actionTimeout: 15_000,
    navigationTimeout: 30_000,

    locale: 'en-US',
    timezoneId: 'UTC',
    colorScheme: 'light',
    reducedMotion: 'reduce',

    ignoreHTTPSErrors: false,
    viewport: {
      width: 1440,
      height: 900,
    },

    serviceWorkers: 'block',

    contextOptions: {
      strictSelectors: true,
    },
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: {
          width: 1440,
          height: 900,
        },
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        viewport: {
          width: 1440,
          height: 900,
        },
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        viewport: {
          width: 1440,
          height: 900,
        },
      },
    },
    {
      name: 'mobile-chromium',
      use: {
        ...devices['Pixel 7'],
      },
    },
    {
      name: 'mobile-webkit',
      use: {
        ...devices['iPhone 15'],
      },
    },
  ],
  webServer: shouldStartLocalServer
    ? {
        command: `npm run dev -- --host ${host} --port ${port}`,
        url: localBaseURL,
        reuseExistingServer: !isCI,

        timeout: 120_000,
        stdout: isCI ? 'pipe' : 'ignore',
        stderr: 'pipe',
      }
    : undefined,
});
