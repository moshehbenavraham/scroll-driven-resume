import {
  test,
  expect,
  waitForPageLoad,
  scrollToSection,
} from "./fixtures/test-fixtures";

test.describe("Contact Form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await waitForPageLoad(page);
    await scrollToSection(page, "#contact");
  });

  test.describe("Form Elements", () => {
    test("displays contact form", async ({ page }) => {
      const form = page.locator("form").first();
      await expect(form).toBeVisible();
    });

    test("has name input field", async ({ page }) => {
      // Field ID is contact-name
      const nameInput = page.locator("#contact-name");
      await expect(nameInput).toBeVisible();
    });

    test("has email input field", async ({ page }) => {
      // Field ID is contact-email
      const emailInput = page.locator("#contact-email");
      await expect(emailInput).toBeVisible();
    });

    test("has message textarea", async ({ page }) => {
      // Field ID is contact-message
      const messageInput = page.locator("#contact-message");
      await expect(messageInput).toBeVisible();
    });

    test("has submit button", async ({ page }) => {
      const submitButton = page.locator("button[type='submit']").first();
      await expect(submitButton).toBeVisible();
    });
  });

  test.describe("Validation", () => {
    test("shows error for empty name field on blur", async ({ page }) => {
      const nameInput = page.locator("#contact-name");
      const emailInput = page.locator("#contact-email");

      // Focus name input and immediately blur to trigger validation
      await nameInput.focus();
      await emailInput.focus(); // Blur name by focusing another field

      await page.waitForTimeout(300);

      // Check for validation error message
      const errorMessage = page.locator("#contact-name-error");
      await expect(errorMessage).toBeVisible();
    });

    test("shows error for invalid email format on blur", async ({ page }) => {
      const emailInput = page.locator("#contact-email");
      const messageInput = page.locator("#contact-message");

      // Fill with invalid email
      await emailInput.fill("invalid-email");
      await messageInput.focus(); // Blur email to trigger validation

      await page.waitForTimeout(300);

      // Email input should show error
      const errorMessage = page.locator("#contact-email-error");
      await expect(errorMessage).toBeVisible();
    });

    test("shows error for empty message field on blur", async ({ page }) => {
      const messageInput = page.locator("#contact-message");
      const submitButton = page.locator("button[type='submit']");

      // Focus message and blur
      await messageInput.focus();
      await submitButton.focus();

      await page.waitForTimeout(300);

      // Check for validation error message
      const errorMessage = page.locator("#contact-message-error");
      await expect(errorMessage).toBeVisible();
    });

    test("accepts valid form input", async ({ page }) => {
      const nameInput = page.locator("#contact-name");
      const emailInput = page.locator("#contact-email");
      const messageInput = page.locator("#contact-message");

      // Fill all fields with valid data
      await nameInput.fill("Test User");
      await emailInput.fill("test@example.com");
      await messageInput.fill("This is a test message for the contact form.");

      // Blur the last field
      await page.locator("button[type='submit']").focus();
      await page.waitForTimeout(300);

      // No form field error messages should be visible
      // Check specifically for field error elements (id pattern: contact-*-error)
      const fieldErrorMessages = page.locator("[id$='-error'][role='alert']");
      const visibleErrors: string[] = [];

      const count = await fieldErrorMessages.count();
      for (let i = 0; i < count; i++) {
        const isVisible = await fieldErrorMessages.nth(i).isVisible();
        if (isVisible) {
          const text = await fieldErrorMessages.nth(i).textContent();
          visibleErrors.push(text || "");
        }
      }

      expect(visibleErrors).toHaveLength(0);
    });
  });

  test.describe("Form Accessibility", () => {
    test("all form inputs have labels", async ({ page }) => {
      // Check that each field has a proper label
      const fields = ["name", "email", "message"];

      for (const field of fields) {
        const input = page.locator(`#contact-${field}`);
        const label = page.locator(`label[for='contact-${field}']`);

        await expect(input).toBeVisible();
        await expect(label).toBeVisible();
      }
    });

    test("form inputs are keyboard accessible", async ({ page }) => {
      // Focus the first form field
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab"); // May need extra tabs to get past navbar

      // Verify we can tab through the form
      const nameInput = page.locator("#contact-name");
      const emailInput = page.locator("#contact-email");
      const messageInput = page.locator("#contact-message");

      // Each field should be focusable
      await nameInput.focus();
      await expect(nameInput).toBeFocused();

      await emailInput.focus();
      await expect(emailInput).toBeFocused();

      await messageInput.focus();
      await expect(messageInput).toBeFocused();
    });

    test("submit button has accessible text", async ({ page }) => {
      const submitButton = page.locator("button[type='submit']").first();
      const buttonText = await submitButton.textContent();

      expect(buttonText).toContain("Send");
    });

    test("form errors have role alert for screen readers", async ({ page }) => {
      const nameInput = page.locator("#contact-name");
      const emailInput = page.locator("#contact-email");

      // Trigger validation error by focusing and blurring name field
      await nameInput.focus();
      await emailInput.focus();
      await page.waitForTimeout(300);

      // Error message should have role="alert" and aria-live="polite"
      const errorMessage = page.locator("#contact-name-error");
      await expect(errorMessage).toBeVisible();
      await expect(errorMessage).toHaveAttribute("role", "alert");
      await expect(errorMessage).toHaveAttribute("aria-live", "polite");
    });

    test("invalid inputs have aria-invalid attribute", async ({ page }) => {
      const nameInput = page.locator("#contact-name");
      const emailInput = page.locator("#contact-email");

      // Trigger validation error
      await nameInput.focus();
      await emailInput.focus();
      await page.waitForTimeout(300);

      // Name input should have aria-invalid="true"
      await expect(nameInput).toHaveAttribute("aria-invalid", "true");
    });
  });
});
