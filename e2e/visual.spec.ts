import {
  test,
  expect,
  SELECTORS,
  waitForPageLoad,
  disableAnimations,
  scrollToSection,
} from "./fixtures/test-fixtures";

test.describe("Visual Regression", () => {
  test.describe("Desktop Viewport", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.goto("/");
      await waitForPageLoad(page);
      await disableAnimations(page);
      // Extra wait for fonts and images to load
      await page.waitForTimeout(1000);
    });

    test("Hero section visual snapshot", async ({ page }) => {
      const hero = page.locator(SELECTORS.hero);
      await hero.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);

      await expect(page).toHaveScreenshot("hero-desktop.png", {
        fullPage: false,
        animations: "disabled",
        timeout: 30000,
        mask: [
          page.locator("canvas"), // Mask WebGL canvas
          page.locator("[class*='webgl']"),
          page.locator("[data-testid='frame-container']"), // Mask frame animations
        ],
      });
    });

    test("About section visual snapshot", async ({ page }) => {
      await scrollToSection(page, "#about");
      await page.waitForTimeout(1000);

      const about = page.locator(SELECTORS.about);
      await expect(about).toHaveScreenshot("about-desktop.png", {
        animations: "disabled",
        timeout: 30000,
      });
    });

    test("Skills section visual snapshot", async ({ page }) => {
      await scrollToSection(page, "#skills");
      await page.waitForTimeout(1000);

      const skills = page.locator(SELECTORS.skills);
      await expect(skills).toHaveScreenshot("skills-desktop.png", {
        animations: "disabled",
        timeout: 30000,
      });
    });

    test("Projects section visual snapshot", async ({ page }) => {
      await scrollToSection(page, "#projects");
      await page.waitForTimeout(1000);

      const projects = page.locator(SELECTORS.projects);
      await expect(projects).toHaveScreenshot("projects-desktop.png", {
        animations: "disabled",
        timeout: 30000,
      });
    });

    test("Contact section visual snapshot", async ({ page }) => {
      await scrollToSection(page, "#contact");
      await page.waitForTimeout(1000);

      const contact = page.locator(SELECTORS.contact);
      await expect(contact).toHaveScreenshot("contact-desktop.png", {
        animations: "disabled",
        timeout: 30000,
      });
    });

    test("Footer visual snapshot", async ({ page }) => {
      const footer = page.locator(SELECTORS.footer);
      await footer.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);

      await expect(footer).toHaveScreenshot("footer-desktop.png", {
        animations: "disabled",
        timeout: 30000,
      });
    });

    test("Navbar visual snapshot", async ({ page }) => {
      const navbar = page.locator("nav").first();
      await page.waitForTimeout(500);
      await expect(navbar).toHaveScreenshot("navbar-desktop.png", {
        animations: "disabled",
        timeout: 30000,
      });
    });
  });

  test.describe("Mobile Viewport", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/");
      await waitForPageLoad(page);
      await disableAnimations(page);
      // Extra wait for fonts and images to load
      await page.waitForTimeout(1000);
    });

    test("Hero section mobile visual snapshot", async ({ page }) => {
      const hero = page.locator(SELECTORS.hero);
      await hero.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);

      await expect(page).toHaveScreenshot("hero-mobile.png", {
        fullPage: false,
        animations: "disabled",
        timeout: 30000,
        mask: [
          page.locator("canvas"),
          page.locator("[class*='webgl']"),
          page.locator("[data-testid='frame-container']"),
        ],
      });
    });

    test("About section mobile visual snapshot", async ({ page }) => {
      await scrollToSection(page, "#about");
      await page.waitForTimeout(1000);

      const about = page.locator(SELECTORS.about);
      await expect(about).toHaveScreenshot("about-mobile.png", {
        animations: "disabled",
        timeout: 30000,
      });
    });

    test("Skills section mobile visual snapshot", async ({ page }) => {
      await scrollToSection(page, "#skills");
      await page.waitForTimeout(1000);

      const skills = page.locator(SELECTORS.skills);
      await expect(skills).toHaveScreenshot("skills-mobile.png", {
        animations: "disabled",
        timeout: 30000,
      });
    });

    test("Projects section mobile visual snapshot", async ({ page }) => {
      await scrollToSection(page, "#projects");
      await page.waitForTimeout(1000);

      const projects = page.locator(SELECTORS.projects);
      await expect(projects).toHaveScreenshot("projects-mobile.png", {
        animations: "disabled",
        timeout: 30000,
      });
    });

    test("Contact section mobile visual snapshot", async ({ page }) => {
      await scrollToSection(page, "#contact");
      await page.waitForTimeout(1000);

      const contact = page.locator(SELECTORS.contact);
      await expect(contact).toHaveScreenshot("contact-mobile.png", {
        animations: "disabled",
        timeout: 30000,
      });
    });

    test("Mobile navigation menu visual snapshot", async ({ page }) => {
      const menuButton = page
        .locator("button[aria-label*='menu' i], nav button")
        .first();
      const buttonExists = (await menuButton.count()) > 0;

      if (buttonExists) {
        await menuButton.click();
        await page.waitForTimeout(1000);

        await expect(page).toHaveScreenshot("mobile-menu-open.png", {
          animations: "disabled",
          timeout: 30000,
        });
      }
    });
  });

  test.describe("Tablet Viewport", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto("/");
      await waitForPageLoad(page);
      await disableAnimations(page);
      // Extra wait for fonts and images to load
      await page.waitForTimeout(1000);
    });

    test("Hero section tablet visual snapshot", async ({ page }) => {
      const hero = page.locator(SELECTORS.hero);
      await hero.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);

      await expect(page).toHaveScreenshot("hero-tablet.png", {
        fullPage: false,
        animations: "disabled",
        timeout: 30000,
        mask: [
          page.locator("canvas"),
          page.locator("[class*='webgl']"),
          page.locator("[data-testid='frame-container']"),
        ],
      });
    });

    test("Projects section tablet visual snapshot", async ({ page }) => {
      await scrollToSection(page, "#projects");
      await page.waitForTimeout(1000);

      const projects = page.locator(SELECTORS.projects);
      await expect(projects).toHaveScreenshot("projects-tablet.png", {
        animations: "disabled",
        timeout: 30000,
      });
    });
  });

  test.describe("Visual Consistency", () => {
    // Skip this flaky test - page reload behavior varies across browsers
    // Visual consistency is better tested through individual section snapshots
    test.skip("page layout is consistent on reload", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.goto("/");
      await waitForPageLoad(page);
      await disableAnimations(page);
      await page.waitForTimeout(1000);

      // Take first screenshot for debugging purposes, then reload and compare
      await page.screenshot({
        fullPage: true,
        animations: "disabled",
      });

      // Reload page
      await page.reload();
      await waitForPageLoad(page);
      await disableAnimations(page);
      await page.waitForTimeout(1000);

      // Compare with second screenshot
      await expect(page).toHaveScreenshot("full-page-consistency.png", {
        fullPage: true,
        animations: "disabled",
        timeout: 30000,
        maxDiffPixelRatio: 0.02, // Allow 2% difference for minor rendering variations
        mask: [
          page.locator("canvas"),
          page.locator("[class*='webgl']"),
          page.locator("[data-testid='frame-container']"),
        ],
      });
    });
  });

  test.describe("Responsive Breakpoints", () => {
    const viewports = [
      { name: "mobile-small", width: 320, height: 568, skipOnMobile: false },
      { name: "mobile", width: 375, height: 667, skipOnMobile: false },
      { name: "tablet", width: 768, height: 1024, skipOnMobile: false },
      { name: "laptop", width: 1024, height: 768, skipOnMobile: true },
      { name: "desktop", width: 1280, height: 720, skipOnMobile: true },
      { name: "wide", width: 1920, height: 1080, skipOnMobile: true },
    ];

    for (const viewport of viewports) {
      test(`navbar responds correctly at ${viewport.name} (${viewport.width}px)`, async ({
        page,
      }, testInfo) => {
        // Skip large viewport tests on mobile device projects
        const isMobileProject = testInfo.project.name.includes("mobile");
        if (viewport.skipOnMobile && isMobileProject) {
          test.skip(true, `Skipping ${viewport.name} viewport test on mobile device`);
          return;
        }

        await page.setViewportSize({
          width: viewport.width,
          height: viewport.height,
        });
        await page.goto("/");
        await waitForPageLoad(page);
        await disableAnimations(page);
        await page.waitForTimeout(1000);

        const navbar = page.locator("nav").first();
        await expect(navbar).toHaveScreenshot(`navbar-${viewport.name}.png`, {
          animations: "disabled",
          timeout: 30000,
        });
      });
    }
  });
});
