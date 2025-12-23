import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for Modern Resume Site E2E tests.
 * Configured for Chrome and Firefox with visual regression support.
 */
export default defineConfig({
  // Test directory
  testDir: "./e2e",

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Limit parallel workers on CI
  workers: process.env.CI ? 1 : undefined,

  // Reporter configuration
  reporter: [["html", { open: "never" }], ["list"]],

  // Shared settings for all projects
  use: {
    // Base URL for the application
    baseURL: "http://localhost:3017",

    // Collect trace on first retry
    trace: "on-first-retry",

    // Screenshot on failure
    screenshot: "only-on-failure",

    // Video on failure
    video: "on-first-retry",

    // Viewport size
    viewport: { width: 1280, height: 720 },

    // Timeouts
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },

  // Global timeout for each test (increased for heavy asset loading)
  timeout: 120000,

  // Expect configuration for assertions
  expect: {
    // Timeout for expect assertions (increased for visual tests)
    timeout: 30000,

    // Visual comparison settings
    toHaveScreenshot: {
      // Threshold for pixel comparison (increased tolerance for browser rendering variance)
      maxDiffPixelRatio: 0.01,
      // Animation tolerance
      animations: "disabled",
    },

    toMatchSnapshot: {
      // Threshold for snapshot comparison
      maxDiffPixelRatio: 0.01,
    },
  },

  // Configure projects for major browsers
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    // Mobile viewports
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "mobile-safari",
      use: { ...devices["iPhone 12"] },
    },
  ],

  // Run local dev server before starting the tests
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3017",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },

  // Output directory for test artifacts
  outputDir: "test-results/",

  // Snapshot directory
  snapshotDir: "e2e/__snapshots__",
});
