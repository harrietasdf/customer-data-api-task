import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/",
  testMatch: "tests/steps/**/*.steps.ts",
  fullyParallel: true,
  // eslint-disable-next-line no-undef
  retries: process.env.CI ? 2 : 0,
  reporter: "html",
  // use: {
  //   baseURL: "http://localhost:8080/test-api",
  //   trace: 'on-first-retry',
  // },

  // Run the local dev server before starting the tests
  webServer: {
    command: "npm run start:server",
    url: "http://localhost:8080/test-api",
    // Always spin up a new server on CI
    // eslint-disable-next-line no-undef
    reuseExistingServer: !process.env.CI,
  },
});
