/* eslint-disable react-hooks/rules-of-hooks */
import {
  test as base,
  expect,
  type Page,
  type Locator,
} from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Shared test fixtures and utilities for E2E tests.
 * Provides reusable selectors, helpers, and extended test context.
 */

// Section selectors for navigation and verification
export const SELECTORS = {
  // Navigation
  navbar: '[data-testid="navbar"]',
  navLinks: '[data-testid="nav-link"]',
  mobileMenuButton: '[data-testid="mobile-menu-button"]',
  mobileMenu: '[data-testid="mobile-menu"]',

  // Sections
  hero: "#hero",
  about: "#about",
  skills: "#skills",
  projects: "#projects",
  product: "#product",
  contact: "#contact",
  footer: "footer",

  // Loading
  loadingScreen: '[data-testid="loading-screen"]',
  loadingProgress: '[data-testid="loading-progress"]',

  // Contact form
  contactForm: '[data-testid="contact-form"]',
  nameInput: 'input[name="name"]',
  emailInput: 'input[name="email"]',
  messageInput: 'textarea[name="message"]',
  submitButton: '[data-testid="submit-button"]',
  formError: '[data-testid="form-error"]',
  formSuccess: '[data-testid="form-success"]',

  // Frame animation
  frameContainer: '[data-testid="frame-container"]',
  frameImage: '[data-testid="frame-image"]',
} as const;

// Viewport presets
export const VIEWPORTS = {
  desktop: { width: 1280, height: 720 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 667 },
} as const;

// Helper to wait for page to fully load
export async function waitForPageLoad(page: Page): Promise<void> {
  // Wait for network to settle
  await page.waitForLoadState("networkidle");

  // Wait for loading overlay to disappear
  // The loading screen has z-[9999] and blocks all clicks
  const loadingOverlay = page.locator('[role="status"][aria-busy="true"]');
  const overlayExists = (await loadingOverlay.count()) > 0;

  if (overlayExists) {
    // Wait for loading overlay to be hidden or removed
    await loadingOverlay
      .waitFor({ state: "hidden", timeout: 60000 })
      .catch(() => {});
  }

  // Also try the data-testid selector as fallback
  const loadingScreen = page.locator(SELECTORS.loadingScreen);
  const screenExists = (await loadingScreen.count()) > 0;

  if (screenExists) {
    await loadingScreen
      .waitFor({ state: "hidden", timeout: 60000 })
      .catch(() => {});
  }

  // Wait for hydration
  await page.waitForFunction(() => document.readyState === "complete");

  // Additional delay for animations to settle
  await page.waitForTimeout(1000);
}

// Helper to scroll to a section
export async function scrollToSection(
  page: Page,
  sectionId: string
): Promise<void> {
  await page.evaluate((id) => {
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, sectionId);

  // Wait for scroll animation
  await page.waitForTimeout(500);
}

// Helper to check if element is in viewport (at least partially visible)
export async function isInViewport(locator: Locator): Promise<boolean> {
  return locator.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;

    // Check if element is at least partially visible in viewport
    // The top of the element should be visible (within upper 75% of viewport)
    // This accounts for scrolled-to sections where the section header is visible
    const isVerticallyVisible = rect.top >= -50 && rect.top < windowHeight * 0.75;
    const isHorizontallyVisible = rect.left >= 0 && rect.right <= windowWidth;

    return isVerticallyVisible && isHorizontallyVisible;
  });
}

// Helper to get all navigation links
export async function getNavLinks(page: Page): Promise<string[]> {
  const links = page.locator(SELECTORS.navLinks);
  const hrefs: string[] = [];
  const count = await links.count();

  for (let i = 0; i < count; i++) {
    const href = await links.nth(i).getAttribute("href");
    if (href) {
      hrefs.push(href);
    }
  }

  return hrefs;
}

// Helper to run accessibility scan
export async function runAccessibilityScan(
  page: Page,
  options?: { exclude?: string[] }
): Promise<{
  violations: Array<{
    id: string;
    impact?: string | null;
    description: string;
    nodes: Array<{ html: string }>;
  }>;
}> {
  let builder = new AxeBuilder({ page });

  if (options?.exclude) {
    for (const selector of options.exclude) {
      builder = builder.exclude(selector);
    }
  }

  const results = await builder.analyze();
  return { violations: results.violations };
}

// Helper to disable animations for visual tests
export async function disableAnimations(page: Page): Promise<void> {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }
    `,
  });
}

// Helper to set reduced motion preference
export async function setReducedMotion(
  page: Page,
  enabled: boolean
): Promise<void> {
  await page.emulateMedia({
    reducedMotion: enabled ? "reduce" : "no-preference",
  });
}

// Extended test with custom fixtures
export interface TestFixtures {
  selectors: typeof SELECTORS;
  viewports: typeof VIEWPORTS;
}

export const test = base.extend<TestFixtures>({
  selectors: async ({}, use) => {
    await use(SELECTORS);
  },
  viewports: async ({}, use) => {
    await use(VIEWPORTS);
  },
});

export { expect };
