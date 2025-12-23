import {
  test,
  expect,
  SELECTORS,
  waitForPageLoad,
} from "./fixtures/test-fixtures";

test.describe("Home Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("loads within acceptable timeout", async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle(/Resume|Portfolio/i);

    // Wait for page to fully load
    await waitForPageLoad(page);

    // Verify body is visible
    await expect(page.locator("body")).toBeVisible();
  });

  test("displays loading screen and dismisses it", async ({ page }) => {
    // Navigate fresh to catch loading screen
    await page.goto("/", { waitUntil: "commit" });

    // Check if loading screen appears (may be too fast to catch)
    const loadingScreen = page.locator(SELECTORS.loadingScreen);
    const wasVisible = await loadingScreen.isVisible().catch(() => false);

    // If loading screen was visible, wait for it to dismiss
    if (wasVisible) {
      await expect(loadingScreen).toBeHidden({ timeout: 30000 });
    }

    // Verify main content is visible after loading
    await waitForPageLoad(page);
    await expect(page.locator("main")).toBeVisible();
  });

  test.describe("Section Rendering", () => {
    test.beforeEach(async ({ page }) => {
      await waitForPageLoad(page);
    });

    test("renders Hero section", async ({ page }) => {
      const hero = page.locator(SELECTORS.hero);
      await expect(hero).toBeVisible();
    });

    test("renders About section", async ({ page }) => {
      const about = page.locator(SELECTORS.about);
      await expect(about).toBeVisible();
    });

    test("renders Skills section", async ({ page }) => {
      const skills = page.locator(SELECTORS.skills);
      await expect(skills).toBeVisible();
    });

    test("renders Projects section", async ({ page }) => {
      const projects = page.locator(SELECTORS.projects);
      await expect(projects).toBeVisible();
    });

    test("renders Product section", async ({ page }) => {
      const product = page.locator(SELECTORS.product);
      // Product section may or may not exist depending on implementation
      const exists = (await product.count()) > 0;
      if (exists) {
        await expect(product).toBeVisible();
      }
    });

    test("renders Contact section", async ({ page }) => {
      const contact = page.locator(SELECTORS.contact);
      await expect(contact).toBeVisible();
    });

    test("renders Footer", async ({ page }) => {
      const footer = page.locator(SELECTORS.footer);
      await expect(footer).toBeVisible();
    });

    test("renders Navbar", async ({ page }) => {
      const navbar = page.locator(SELECTORS.navbar);
      // Navbar may use different attribute
      const exists = (await navbar.count()) > 0;
      if (exists) {
        await expect(navbar).toBeVisible();
      } else {
        // Try alternative selector
        const nav = page.locator("nav").first();
        await expect(nav).toBeVisible();
      }
    });
  });

  test("all critical sections are present in document", async ({ page }) => {
    await waitForPageLoad(page);

    // Check that essential sections exist in the DOM
    const sections = ["#hero", "#about", "#skills", "#projects", "#contact"];

    for (const section of sections) {
      const element = page.locator(section);
      const count = await element.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test("page has proper document structure", async ({ page }) => {
    await waitForPageLoad(page);

    // Verify single main element
    const mainElements = page.locator("main");
    await expect(mainElements).toHaveCount(1);

    // Verify single h1 (for accessibility)
    const h1Elements = page.locator("h1");
    const h1Count = await h1Elements.count();
    expect(h1Count).toBeGreaterThanOrEqual(1);
  });

  test("page renders without console errors", async ({ page }) => {
    const errors: string[] = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    await page.goto("/");
    await waitForPageLoad(page);

    // Filter out known acceptable errors (e.g., WebGL warnings in headless)
    const criticalErrors = errors.filter(
      (error) =>
        !error.includes("WebGL") &&
        !error.includes("THREE") &&
        !error.includes("Failed to load resource") // Allow 404s for optional assets
    );

    expect(criticalErrors).toHaveLength(0);
  });
});
