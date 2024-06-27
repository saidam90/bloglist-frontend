// playwright.config.mjs
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  timeout: 3000,
  fullyParallel: false,
  workers: 1,
  testDir: "./tests",
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "html",
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],

  //   webServer: {
  //     command: "npm run start",
  //     url: "http://localhost:5173",
  //     reuseExistingServer: !process.env.CI,
  //   },
});
