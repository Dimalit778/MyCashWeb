import { devices, defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",

  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    actionTimeout: 10000,
    navigationTimeout: 30000,
    screenshot: "only-on-failure",
  },

  projects: [
    // Setup project must run first
    {
      name: "setup",
      testMatch: "**/auth.setup.js",
      use: {
        // Store credentials here
        user: "dimitryd.l@gmail.com",
        password: "144695",
      },
    },
    // Browser projects depend on setup
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "tests/auth/user.json",
      },
      dependencies: ["setup"],
    },
    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
        storageState: "tests/auth/user.json",
      },
      dependencies: ["setup"],
    },
    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"],
        storageState: "tests/auth/user.json",
      },
      dependencies: ["setup"],
    },
  ],

  timeout: 60000,
  expect: {
    timeout: 10000,
  },
});
