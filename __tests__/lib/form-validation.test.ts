/**
 * Unit tests for form validation schemas and utilities.
 */

import { describe, it, expect } from "vitest";
import {
  contactFormSchema,
  isValidEmail,
  validateName,
  validateMessage,
  validateContactForm,
  formatMailtoLink,
  isSpamSubmission,
  NAME_MIN_LENGTH,
  NAME_MAX_LENGTH,
  MESSAGE_MIN_LENGTH,
  MESSAGE_MAX_LENGTH,
} from "@/lib/form-validation";

describe("contactFormSchema", () => {
  it("validates a complete valid form", () => {
    const result = contactFormSchema.safeParse({
      name: "John Doe",
      email: "john@example.com",
      message: "Hello, I would like to discuss a project with you.",
    });
    expect(result.success).toBe(true);
  });

  it("trims whitespace from name and message", () => {
    const result = contactFormSchema.safeParse({
      name: "  John Doe  ",
      email: "JOHN@EXAMPLE.COM",
      message: "  Hello, I would like to discuss a project.  ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("John Doe");
      expect(result.data.email).toBe("john@example.com");
      expect(result.data.message).toBe("Hello, I would like to discuss a project.");
    }
  });

  it("rejects empty name", () => {
    const result = contactFormSchema.safeParse({
      name: "",
      email: "john@example.com",
      message: "Hello, I would like to discuss a project.",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("name");
    }
  });

  it("rejects name shorter than minimum length", () => {
    const result = contactFormSchema.safeParse({
      name: "J",
      email: "john@example.com",
      message: "Hello, I would like to discuss a project.",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain(
        `${NAME_MIN_LENGTH} characters`
      );
    }
  });

  it("rejects name longer than maximum length", () => {
    const result = contactFormSchema.safeParse({
      name: "A".repeat(NAME_MAX_LENGTH + 1),
      email: "john@example.com",
      message: "Hello, I would like to discuss a project.",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("name");
    }
  });

  it("rejects empty email", () => {
    const result = contactFormSchema.safeParse({
      name: "John Doe",
      email: "",
      message: "Hello, I would like to discuss a project.",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("email");
    }
  });

  it("rejects invalid email format", () => {
    const invalidEmails = [
      "notanemail",
      "missing@domain",
      "@nodomain.com",
      "spaces in@email.com",
    ];

    for (const email of invalidEmails) {
      const result = contactFormSchema.safeParse({
        name: "John Doe",
        email,
        message: "Hello, I would like to discuss a project.",
      });
      expect(result.success).toBe(false);
    }
  });

  it("accepts valid email formats", () => {
    const validEmails = [
      "simple@example.com",
      "user.name@example.com",
      "user+tag@example.com",
      "user@subdomain.example.com",
    ];

    for (const email of validEmails) {
      const result = contactFormSchema.safeParse({
        name: "John Doe",
        email,
        message: "Hello, I would like to discuss a project.",
      });
      expect(result.success).toBe(true);
    }
  });

  it("rejects message shorter than minimum length", () => {
    const result = contactFormSchema.safeParse({
      name: "John Doe",
      email: "john@example.com",
      message: "Hi",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain(
        `${MESSAGE_MIN_LENGTH} characters`
      );
    }
  });

  it("rejects message longer than maximum length", () => {
    const result = contactFormSchema.safeParse({
      name: "John Doe",
      email: "john@example.com",
      message: "A".repeat(MESSAGE_MAX_LENGTH + 1),
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("message");
    }
  });

  it("rejects non-empty honeypot field", () => {
    const result = contactFormSchema.safeParse({
      name: "John Doe",
      email: "john@example.com",
      message: "Hello, I would like to discuss a project.",
      honeypot: "spam bot filled this",
    });
    expect(result.success).toBe(false);
  });

  it("accepts empty honeypot field", () => {
    const result = contactFormSchema.safeParse({
      name: "John Doe",
      email: "john@example.com",
      message: "Hello, I would like to discuss a project.",
      honeypot: "",
    });
    expect(result.success).toBe(true);
  });

  it("accepts undefined honeypot field", () => {
    const result = contactFormSchema.safeParse({
      name: "John Doe",
      email: "john@example.com",
      message: "Hello, I would like to discuss a project.",
    });
    expect(result.success).toBe(true);
  });
});

describe("isValidEmail", () => {
  it("returns true for valid emails", () => {
    expect(isValidEmail("test@example.com")).toBe(true);
    expect(isValidEmail("user.name@domain.org")).toBe(true);
    expect(isValidEmail("user+tag@example.co.uk")).toBe(true);
  });

  it("returns false for invalid emails", () => {
    expect(isValidEmail("notanemail")).toBe(false);
    expect(isValidEmail("@nodomain.com")).toBe(false);
    expect(isValidEmail("missing@")).toBe(false);
    expect(isValidEmail("")).toBe(false);
  });
});

describe("validateName", () => {
  it("returns success for valid names", () => {
    expect(validateName("John")).toEqual({ success: true });
    expect(validateName("John Doe")).toEqual({ success: true });
    expect(validateName("Jo")).toEqual({ success: true });
  });

  it("returns error for names too short", () => {
    const result = validateName("J");
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("returns error for empty names", () => {
    const result = validateName("");
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});

describe("validateMessage", () => {
  it("returns success for valid messages", () => {
    expect(validateMessage("Hello, I would like to connect!")).toEqual({
      success: true,
    });
    expect(validateMessage("A".repeat(MESSAGE_MIN_LENGTH))).toEqual({
      success: true,
    });
  });

  it("returns error for messages too short", () => {
    const result = validateMessage("Hi");
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("returns error for empty messages", () => {
    const result = validateMessage("");
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});

describe("validateContactForm", () => {
  it("returns success with validated data", () => {
    const result = validateContactForm({
      name: "John Doe",
      email: "john@example.com",
      message: "Hello, I would like to discuss a project.",
    });
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
  });

  it("returns errors object for invalid data", () => {
    const result = validateContactForm({
      name: "J",
      email: "invalid",
      message: "Hi",
    });
    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.errors?.name).toBeDefined();
    expect(result.errors?.email).toBeDefined();
    expect(result.errors?.message).toBeDefined();
  });
});

describe("formatMailtoLink", () => {
  it("creates properly formatted mailto link", () => {
    const link = formatMailtoLink(
      {
        name: "John Doe",
        email: "john@example.com",
        message: "Hello there!",
      },
      "contact@example.com"
    );

    expect(link).toContain("mailto:contact@example.com");
    expect(link).toContain("subject=");
    expect(link).toContain("body=");
    expect(link).toContain("John+Doe");
  });

  it("encodes special characters", () => {
    const link = formatMailtoLink(
      {
        name: "John & Jane",
        email: "test@example.com",
        message: "Question: How are you?",
      },
      "contact@example.com"
    );

    expect(link).toContain("%26");
    expect(link).toContain("%3F");
  });

  it("handles multiline messages", () => {
    const link = formatMailtoLink(
      {
        name: "John",
        email: "john@example.com",
        message: "Line 1\nLine 2\nLine 3",
      },
      "contact@example.com"
    );

    expect(link).toContain("%0A");
  });
});

describe("isSpamSubmission", () => {
  it("returns false for empty honeypot", () => {
    expect(isSpamSubmission("")).toBe(false);
    expect(isSpamSubmission(undefined)).toBe(false);
  });

  it("returns true for filled honeypot", () => {
    expect(isSpamSubmission("spam")).toBe(true);
    expect(isSpamSubmission("bot filled this")).toBe(true);
    expect(isSpamSubmission(" ")).toBe(true);
  });
});
