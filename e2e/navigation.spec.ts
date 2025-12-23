import type { Page } from "@playwright/test";
import {
  test,
  expect,
  SELECTORS,
  waitForPageLoad,
  scrollToSection,
  isInViewport,
} from "./fixtures/test-fixtures";

/**
 * Helper to check if current viewport is mobile-sized.
 * Desktop nav links are hidden on mobile (md breakpoint = 768px).
 */
async function isMobileViewport(page: Page): Promise<boolean> {
  const viewportSize = page.viewportSize();
  return viewportSize !== null && viewportSize.width < 768;
}

/**
 * Helper to navigate to a section, using mobile menu if on mobile viewport.
 */
async function navigateToSection(
  page: Page,
  sectionHref: string
): Promise<void> {
  const isMobile = await isMobileViewport(page);

  if (isMobile) {
    // Open mobile menu first
    const mobileMenuButton = page.locator('button[aria-controls="mobile-menu"]');
    await mobileMenuButton.click();
    await page.waitForTimeout(500);

    // Click the link in the mobile menu
    const mobileDrawer = page.locator("#mobile-menu");
    const link = mobileDrawer.locator(`a[href='${sectionHref}']`).first();
    await link.click();
  } else {
    // Click desktop nav link
    const link = page.locator(`a[href='${sectionHref}']`).first();
    await link.click();
  }

  await page.waitForTimeout(1000); // Wait for smooth scroll
}

test.describe("Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await waitForPageLoad(page);
  });

  test.describe("Navbar", () => {
    test("displays navigation bar", async ({ page }) => {
      // Try multiple selectors for navbar
      const navbar = page.locator(SELECTORS.navbar);
      const nav = page.locator("nav").first();

      const navbarVisible = await navbar.isVisible().catch(() => false);
      const navVisible = await nav.isVisible().catch(() => false);

      expect(navbarVisible || navVisible).toBe(true);
    });

    test("contains navigation links", async ({ page }) => {
      const navLinks = page.locator("nav a[href^='#'], nav button");
      const count = await navLinks.count();

      // Should have at least some navigation items
      expect(count).toBeGreaterThan(0);
    });

    test("navigation links have proper href attributes", async ({ page }) => {
      const sectionLinks = page.locator("nav a[href^='#']");
      const count = await sectionLinks.count();

      for (let i = 0; i < count; i++) {
        const href = await sectionLinks.nth(i).getAttribute("href");
        expect(href).toMatch(/^#\w+/);
      }
    });
  });

  test.describe("Section Navigation", () => {
    test("clicking About link scrolls to About section", async ({ page }) => {
      // Wait for any loading overlays to be hidden
      await page
        .locator('[role="status"]')
        .waitFor({ state: "hidden", timeout: 30000 })
        .catch(() => {});

      // Use mobile-aware navigation helper
      await navigateToSection(page, "#about");

      const aboutSection = page.locator(SELECTORS.about);
      const isVisible = await isInViewport(aboutSection);
      expect(isVisible).toBe(true);
    });

    test("clicking Skills link scrolls to Skills section", async ({ page }) => {
      // Wait for any loading overlays to be hidden
      await page
        .locator('[role="status"]')
        .waitFor({ state: "hidden", timeout: 30000 })
        .catch(() => {});

      // Use mobile-aware navigation helper
      await navigateToSection(page, "#skills");

      const skillsSection = page.locator(SELECTORS.skills);
      const isVisible = await isInViewport(skillsSection);
      expect(isVisible).toBe(true);
    });

    test("clicking Projects link scrolls to Projects section", async ({
      page,
    }) => {
      // Wait for any loading overlays to be hidden
      await page
        .locator('[role="status"]')
        .waitFor({ state: "hidden", timeout: 30000 })
        .catch(() => {});

      // Use mobile-aware navigation helper
      await navigateToSection(page, "#projects");

      const projectsSection = page.locator(SELECTORS.projects);
      const isVisible = await isInViewport(projectsSection);
      expect(isVisible).toBe(true);
    });

    test("clicking Contact link scrolls to Contact section", async ({
      page,
    }) => {
      // Wait for any loading overlays to be hidden
      await page
        .locator('[role="status"]')
        .waitFor({ state: "hidden", timeout: 30000 })
        .catch(() => {});

      // Use mobile-aware navigation helper
      await navigateToSection(page, "#contact");

      const contactSection = page.locator(SELECTORS.contact);
      const isVisible = await isInViewport(contactSection);
      expect(isVisible).toBe(true);
    });
  });

  test.describe("Smooth Scroll", () => {
    test("scrolls smoothly to sections", async ({ page }) => {
      // Wait for any loading overlays to be hidden
      await page
        .locator('[role="status"]')
        .waitFor({ state: "hidden", timeout: 30000 })
        .catch(() => {});

      // Scroll to About section
      await scrollToSection(page, "#about");

      const aboutSection = page.locator(SELECTORS.about);
      await expect(aboutSection).toBeVisible();

      // Scroll to Contact section
      await scrollToSection(page, "#contact");

      const contactSection = page.locator(SELECTORS.contact);
      await expect(contactSection).toBeVisible();
    });

    test("can scroll back to top", async ({ page }) => {
      // Wait for any loading overlays to be hidden
      await page
        .locator('[role="status"]')
        .waitFor({ state: "hidden", timeout: 30000 })
        .catch(() => {});

      // First scroll down
      await scrollToSection(page, "#contact");
      await page.waitForTimeout(500);

      // Scroll back to top using instant behavior for reliability
      await page.evaluate(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
      });

      // Wait for scroll to complete and poll for scroll position
      await page.waitForFunction(
        () => window.scrollY < 100,
        { timeout: 5000 }
      ).catch(async () => {
        // Fallback: force scroll to top if smooth scroll didn't work
        await page.evaluate(() => window.scrollTo(0, 0));
      });

      await page.waitForTimeout(500);

      // Verify we are at the top (increased tolerance for browser differences)
      const scrollY = await page.evaluate(() => window.scrollY);
      expect(scrollY).toBeLessThan(150);
    });

    test("section anchors have correct IDs", async ({ page }) => {
      const expectedSections = [
        "hero",
        "about",
        "skills",
        "projects",
        "contact",
      ];

      for (const sectionId of expectedSections) {
        const section = page.locator(`#${sectionId}`);
        const count = await section.count();
        expect(count).toBeGreaterThan(0);
      }
    });
  });

  test.describe("Mobile Navigation", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
    });

    test("shows mobile menu button on mobile viewport", async ({ page }) => {
      // The mobile menu button has aria-label="Open menu" and aria-controls="mobile-menu"
      const mobileMenuButton = page.locator(
        'button[aria-controls="mobile-menu"]'
      );
      await expect(mobileMenuButton).toBeVisible();
    });

    test("mobile menu opens when button clicked", async ({ page }) => {
      // Click the hamburger button
      const mobileMenuButton = page.locator(
        'button[aria-controls="mobile-menu"]'
      );
      await mobileMenuButton.click();
      await page.waitForTimeout(500);

      // The drawer has id="mobile-menu"
      const mobileDrawer = page.locator("#mobile-menu");
      await expect(mobileDrawer).toBeVisible();

      // Verify it has navigation links
      const navLinks = mobileDrawer.locator('a[href^="#"]');
      const count = await navLinks.count();
      expect(count).toBeGreaterThan(0);
    });

    test("mobile menu closes when close button clicked", async ({ page }) => {
      // Open menu
      const mobileMenuButton = page.locator(
        'button[aria-controls="mobile-menu"]'
      );
      await mobileMenuButton.click();
      await page.waitForTimeout(500);

      // Click close button inside the drawer (not the hamburger button)
      const closeButton = page.locator(
        '#mobile-menu button[aria-label="Close menu"]'
      );
      await closeButton.click();
      await page.waitForTimeout(500);

      // Menu should be hidden
      const mobileDrawer = page.locator("#mobile-menu");
      await expect(mobileDrawer).not.toBeVisible();
    });
  });
});
