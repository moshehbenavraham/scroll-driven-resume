/**
 * Form validation schemas using Zod.
 * Provides validation for contact form and utility functions.
 */

import { z } from "zod";

// ============================================================================
// Validation Constants
// ============================================================================

/**
 * Minimum length for name field.
 */
export const NAME_MIN_LENGTH = 2;

/**
 * Maximum length for name field.
 */
export const NAME_MAX_LENGTH = 100;

/**
 * Minimum length for message field.
 */
export const MESSAGE_MIN_LENGTH = 10;

/**
 * Maximum length for message field.
 */
export const MESSAGE_MAX_LENGTH = 5000;

/**
 * Maximum length for email field.
 */
export const EMAIL_MAX_LENGTH = 254;

// ============================================================================
// Validation Schemas
// ============================================================================

/**
 * Contact form validation schema.
 */
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(NAME_MIN_LENGTH, {
      message: `Name must be at least ${NAME_MIN_LENGTH} characters`,
    })
    .max(NAME_MAX_LENGTH, {
      message: `Name must be less than ${NAME_MAX_LENGTH} characters`,
    })
    .trim(),

  email: z
    .string()
    .min(1, { message: "Email is required" })
    .max(EMAIL_MAX_LENGTH, {
      message: `Email must be less than ${EMAIL_MAX_LENGTH} characters`,
    })
    .email({ message: "Please enter a valid email address" })
    .trim()
    .toLowerCase(),

  message: z
    .string()
    .min(MESSAGE_MIN_LENGTH, {
      message: `Message must be at least ${MESSAGE_MIN_LENGTH} characters`,
    })
    .max(MESSAGE_MAX_LENGTH, {
      message: `Message must be less than ${MESSAGE_MAX_LENGTH} characters`,
    })
    .trim(),

  honeypot: z.string().max(0, { message: "Invalid submission" }).optional(),
});

/**
 * Inferred type from contact form schema.
 */
export type ContactFormSchemaType = z.infer<typeof contactFormSchema>;

// ============================================================================
// Validation Utilities
// ============================================================================

/**
 * Validates a single email address.
 *
 * @param email - Email address to validate
 * @returns True if email is valid
 *
 * @example
 * isValidEmail("test@example.com") // true
 * isValidEmail("invalid-email") // false
 */
export function isValidEmail(email: string): boolean {
  const emailSchema = z.string().email();
  const result = emailSchema.safeParse(email);
  return result.success;
}

/**
 * Validates name field.
 *
 * @param name - Name to validate
 * @returns Validation result with success status and optional error message
 *
 * @example
 * validateName("John") // { success: true }
 * validateName("J") // { success: false, error: "Name must be at least 2 characters" }
 */
export function validateName(name: string): {
  success: boolean;
  error?: string;
} {
  const nameSchema = z
    .string()
    .min(NAME_MIN_LENGTH, {
      message: `Name must be at least ${NAME_MIN_LENGTH} characters`,
    })
    .max(NAME_MAX_LENGTH, {
      message: `Name must be less than ${NAME_MAX_LENGTH} characters`,
    })
    .trim();

  const result = nameSchema.safeParse(name);

  if (result.success) {
    return { success: true };
  }

  return {
    success: false,
    error: result.error.issues[0]?.message || "Invalid name",
  };
}

/**
 * Validates message field.
 *
 * @param message - Message to validate
 * @returns Validation result with success status and optional error message
 *
 * @example
 * validateMessage("Hello, I would like to connect!") // { success: true }
 * validateMessage("Hi") // { success: false, error: "Message must be at least 10 characters" }
 */
export function validateMessage(message: string): {
  success: boolean;
  error?: string;
} {
  const messageSchema = z
    .string()
    .min(MESSAGE_MIN_LENGTH, {
      message: `Message must be at least ${MESSAGE_MIN_LENGTH} characters`,
    })
    .max(MESSAGE_MAX_LENGTH, {
      message: `Message must be less than ${MESSAGE_MAX_LENGTH} characters`,
    })
    .trim();

  const result = messageSchema.safeParse(message);

  if (result.success) {
    return { success: true };
  }

  return {
    success: false,
    error: result.error.issues[0]?.message || "Invalid message",
  };
}

/**
 * Validates the entire contact form data.
 *
 * @param data - Form data to validate
 * @returns Validation result with success status and optional errors
 *
 * @example
 * validateContactForm({
 *   name: "John Doe",
 *   email: "john@example.com",
 *   message: "Hello, I would like to discuss a project."
 * })
 */
export function validateContactForm(data: unknown): {
  success: boolean;
  data?: ContactFormSchemaType;
  errors?: Record<string, string>;
} {
  const result = contactFormSchema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0];
    if (typeof field === "string") {
      errors[field] = issue.message;
    }
  }

  return { success: false, errors };
}

/**
 * Formats form data for mailto: link.
 * Properly encodes values for URL safety.
 *
 * @param data - Validated form data
 * @param toEmail - Recipient email address
 * @returns Formatted mailto: URL
 *
 * @example
 * formatMailtoLink(
 *   { name: "John", email: "john@example.com", message: "Hello!" },
 *   "contact@example.com"
 * )
 * // "mailto:contact@example.com?subject=Contact%20from%20John&body=..."
 */
export function formatMailtoLink(
  data: { name: string; email: string; message: string },
  toEmail: string
): string {
  const subject = `Contact from ${data.name}`;
  const body = `Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`;

  const params = new URLSearchParams({
    subject,
    body,
  });

  return `mailto:${toEmail}?${params.toString()}`;
}

/**
 * Checks if honeypot field indicates spam.
 *
 * @param honeypot - Value of honeypot field
 * @returns True if submission appears to be spam
 *
 * @example
 * isSpamSubmission("") // false
 * isSpamSubmission("bot-filled-value") // true
 */
export function isSpamSubmission(honeypot: string | undefined): boolean {
  return honeypot !== undefined && honeypot.length > 0;
}
