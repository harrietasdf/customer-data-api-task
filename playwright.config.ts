import { defineConfig } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  testDir: "tests/",
  testMatch: "tests/specs/**/*.spec.ts",
  fullyParallel: true,
  // eslint-disable-next-line no-undef
  retries: process.env.CI ? 2 : 0,
  reporter: "html",
  // Run the local dev server before starting the tests
  webServer: {
    command: "npm run start:server",
    url: "http://localhost:8080/test-api",
    // Always spin up a new server on CI
    // eslint-disable-next-line no-undef
    reuseExistingServer: !process.env.CI,
  },
});
