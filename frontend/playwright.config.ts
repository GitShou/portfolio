import type { PlaywrightTestConfig } from "@playwright/test";

const baseURL = process.env.E2E_BASE_URL ?? "http://127.0.0.1:3000";

const webServer = process.env.CI
  ? ([
      {
        command: "npm run dev -- --hostname 0.0.0.0 --port 3000",
        port: 3000,
        timeout: 120_000,
        reuseExistingServer: false,
        env: {
          PROJECTS_API_BASE_URL: process.env.PROJECTS_API_BASE_URL ?? "",
        },
      },
    ] satisfies NonNullable<PlaywrightTestConfig["webServer"]>)
  : ([
      {
        command: "npm run mock:api",
        port: 4000,
        timeout: 30_000,
        reuseExistingServer: true,
      },
      {
        command: "npm run dev",
        port: 3000,
        timeout: 120_000,
        reuseExistingServer: true,
      },
    ] satisfies NonNullable<PlaywrightTestConfig["webServer"]>);

const config: PlaywrightTestConfig = {
  testDir: "tests/e2e",
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL,
    headless: true,
    video: process.env.CI ? "retain-on-failure" : "off",
    screenshot: "only-on-failure",
    viewport: { width: 1280, height: 720 },
  },
  webServer,
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
  ],
};

export default config;
