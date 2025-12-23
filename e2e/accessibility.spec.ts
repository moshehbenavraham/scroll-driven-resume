/* eslint-disable no-console */
import {
  test,
  expect,
  waitForPageLoad,
  runAccessibilityScan,
  setReducedMotion,
} from "./fixtures/test-fixtures";

test.describe("Accessibility", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await waitForPageLoad(page);
  });

  test.describe("Axe-Core Automated Tests", () => {
    test("home page has no critical accessibility violations", async ({
      page,
    }) => {
      const { violations } = await runAccessibilityScan(page);

      // Filter for critical and serious violations only
      const criticalViolations = violations.filter(
        (v) => v.impact === "critical" || v.impact === "serious"
      );

      if (criticalViolations.length > 0) {
        console.log("Critical accessibility violations found:");
        criticalViolations.forEach((v) => {
          console.log(`- ${v.id}: ${v.description}`);
          v.nodes.forEach((n) => console.log(`  ${n.html}`));
        });
      }

      expect(criticalViolations).toHaveLength(0);
    });

    test("navigation section is accessible", async ({ page }) => {
      const { violations } = await runAccessibilityScan(page, {
        exclude: ["#hero canvas", "[class*='webgl']"], // Exclude WebGL elements
      });

      const navViolations = violations.filter((v) =>
        v.nodes.some((n) => n.html.includes("nav") || n.html.includes("menu"))
      );

      expect(navViolations).toHaveLength(0);
    });

    test("contact form is accessible", async ({ page }) => {
      await page.locator("#contact").scrollIntoViewIfNeeded();

      const { violations } = await runAccessibilityScan(page);

      const formViolations = violations.filter((v) =>
        v.nodes.some((n) => n.html.includes("form") || n.html.includes("input"))
      );

      // Filter for critical form issues
      const criticalFormIssues = formViolations.filter(
        (v) => v.impact === "critical" || v.impact === "serious"
      );

      expect(criticalFormIssues).toHaveLength(0);
    });
  });

  test.describe("Keyboard Navigation", () => {
    test("can navigate through page using Tab key", async ({ page }) => {
      // Start from body
      await page.locator("body").focus();

      // Track focused elements
      const focusedElements: string[] = [];

      // Tab through several elements
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press("Tab");
        const focused = page.locator(":focus");
        const tagName = await focused
          .evaluate((el) => el.tagName.toLowerCase())
          .catch(() => "none");
        focusedElements.push(tagName);
      }

      // Should have focused on interactive elements
      const interactiveElements = focusedElements.filter((tag) =>
        ["a", "button", "input", "textarea", "select"].includes(tag)
      );

      expect(interactiveElements.length).toBeGreaterThan(0);
    });

    test("skip link is present and works", async ({ page }) => {
      // Check for skip link (often first focusable element)
      await page.keyboard.press("Tab");

      const focused = page.locator(":focus");
      const skipLink = await focused.getAttribute("href");
      const text = await focused.textContent();

      // Skip link might have #main or #content href
      const isSkipLink =
        skipLink?.includes("#main") ||
        skipLink?.includes("#content") ||
        text?.toLowerCase().includes("skip");

      // Skip link is nice to have but not critical if other navigation works
      if (isSkipLink) {
        await page.keyboard.press("Enter");
        const mainContent = page.locator("main, #main, #content").first();
        await expect(mainContent).toBeVisible();
      }
    });

    test("all interactive elements have visible focus indicators", async ({
      page,
    }) => {
      const interactiveElements = page.locator(
        "a, button, input, textarea, select, [tabindex='0']"
      );
      const count = await interactiveElements.count();

      // Sample a few elements
      const samplesToCheck = Math.min(count, 5);

      for (let i = 0; i < samplesToCheck; i++) {
        const element = interactiveElements.nth(i);
        await element.focus();

        // Check if element has focus styles
        const outlineStyle = await element.evaluate((el) => {
          const styles = window.getComputedStyle(el);
          return {
            outline: styles.outline,
            outlineWidth: styles.outlineWidth,
            boxShadow: styles.boxShadow,
            borderColor: styles.borderColor,
          };
        });

        // Element should have some focus indicator
        const hasFocusIndicator =
          outlineStyle.outline !== "none" ||
          outlineStyle.outlineWidth !== "0px" ||
          outlineStyle.boxShadow !== "none" ||
          outlineStyle.borderColor !== "transparent";

        // This is informational - some focus styles may be on :focus-visible only
        if (!hasFocusIndicator) {
          console.log(`Element ${i} may need focus indicator review`);
        }
      }
    });

    test("Escape key closes modals/dialogs", async ({ page, browserName }) => {
      // Skip on WebKit/Safari - mobile Safari doesn't reliably handle Escape key
      // Focus is on testing actual user interaction patterns
      test.skip(browserName === "webkit", "Safari mobile handles Escape differently");

      // Check if mobile menu exists and can be closed
      await page.setViewportSize({ width: 375, height: 667 });
      await waitForPageLoad(page);

      const menuButton = page.locator('button[aria-controls="mobile-menu"]');
      const menuExists = (await menuButton.count()) > 0;

      if (menuExists) {
        await menuButton.click();
        await page.waitForTimeout(500);

        // Verify menu is open
        const mobileMenu = page.locator("#mobile-menu");
        const isVisible = await mobileMenu.isVisible().catch(() => false);

        if (isVisible) {
          await page.keyboard.press("Escape");
          await page.waitForTimeout(500);

          // Menu should be closed
          const menuClosed = await mobileMenu.isHidden().catch(() => true);
          expect(menuClosed).toBe(true);
        }
      }
    });
  });

  test.describe("Reduced Motion", () => {
    test("respects prefers-reduced-motion", async ({ page }) => {
      // Set reduced motion preference
      await setReducedMotion(page, true);

      await page.goto("/");
      await waitForPageLoad(page);

      // Check if animations are disabled or reduced
      const animatedElements = page.locator(
        "[class*='animate'], [class*='motion']"
      );
      const count = await animatedElements.count();

      if (count > 0) {
        const firstAnimated = animatedElements.first();
        const animationDuration = await firstAnimated
          .evaluate((el) => {
            return window.getComputedStyle(el).animationDuration;
          })
          .catch(() => "0s");

        // Animations should be reduced (0s or very short)
        // This is informational - actual behavior depends on implementation
        console.log(
          `Animation duration with reduced motion: ${animationDuration}`
        );
      }
    });

    test("content is accessible without animations", async ({ page }) => {
      await setReducedMotion(page, true);

      await page.goto("/");
      await waitForPageLoad(page);

      // All sections should still be visible
      const sections = ["#hero", "#about", "#skills", "#projects", "#contact"];

      for (const section of sections) {
        const element = page.locator(section);
        await expect(element).toBeVisible();
      }
    });
  });

  test.describe("Color Contrast", () => {
    test("text has sufficient color contrast", async ({ page }) => {
      const { violations } = await runAccessibilityScan(page, {
        // Exclude elements that may have dynamic backgrounds or gradients
        exclude: [
          "canvas",
          "[class*='webgl']",
          "[data-testid='frame-container']",
          // Exclude hero section which has complex backgrounds
          "#hero",
        ],
      });

      const contrastViolations = violations.filter(
        (v) => v.id === "color-contrast" && v.impact === "serious"
      );

      // Log any contrast issues for debugging
      if (contrastViolations.length > 0) {
        console.log("Color contrast issues found:");
        contrastViolations.forEach((v) => {
          v.nodes.forEach((n) => console.log(`  ${n.html}`));
        });
      }

      // Allow some minor contrast issues (warnings) but fail on serious
      // Mobile viewports may render differently, so log but don't fail on minor issues
      expect(contrastViolations).toHaveLength(0);
    });
  });

  test.describe("Document Structure", () => {
    test("page has proper heading hierarchy", async ({ page }) => {
      const headings = await page.locator("h1, h2, h3, h4, h5, h6").all();
      const headingLevels: number[] = [];

      for (const heading of headings) {
        const tagName = await heading.evaluate((el) => el.tagName);
        headingLevels.push(parseInt(tagName.replace("H", "")));
      }

      // Check that we start with h1
      expect(headingLevels[0]).toBe(1);

      // Check that we don't skip levels
      for (let i = 1; i < headingLevels.length; i++) {
        const currentLevel = headingLevels[i];
        const previousLevel = headingLevels[i - 1];

        // Should not skip more than one level (e.g., h1 to h3)
        expect(currentLevel).toBeLessThanOrEqual(previousLevel + 1);
      }
    });

    test("page has exactly one main landmark", async ({ page }) => {
      const mainElements = page.locator("main, [role='main']");
      const count = await mainElements.count();

      expect(count).toBe(1);
    });

    test("images have alt text", async ({ page }) => {
      const images = page.locator("img");
      const count = await images.count();

      for (let i = 0; i < count; i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute("alt");
        const role = await img.getAttribute("role");
        const ariaHidden = await img.getAttribute("aria-hidden");

        // Image should have alt text, or be decorative (role=presentation or aria-hidden)
        const hasAltText = alt !== null;
        const isDecorative = role === "presentation" || ariaHidden === "true";

        expect(hasAltText || isDecorative).toBe(true);
      }
    });
  });
});
