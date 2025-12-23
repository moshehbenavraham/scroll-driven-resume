/**
 * Type definitions for contact section components.
 */

import type { ReactNode } from "react";

// ============================================================================
// Contact Form Types
// ============================================================================

/**
 * Contact form field names.
 */
export type ContactFormFieldName = "name" | "email" | "message" | "honeypot";

/**
 * Contact form data structure.
 */
export interface ContactFormData {
  /** Sender name */
  name: string;
  /** Sender email address */
  email: string;
  /** Message content */
  message: string;
  /** Honeypot field for spam prevention (should be empty) */
  honeypot?: string;
}

/**
 * Form submission state.
 */
export type FormSubmitState = "idle" | "submitting" | "success" | "error";

/**
 * Form field configuration.
 */
export interface ContactFormFieldConfig {
  /** Field name identifier */
  name: ContactFormFieldName;
  /** Field label text */
  label: string;
  /** Field type (text, email, textarea) */
  type: "text" | "email" | "textarea";
  /** Placeholder text */
  placeholder: string;
  /** Whether field is required */
  required: boolean;
  /** Autocomplete attribute */
  autoComplete?: string;
  /** Number of rows for textarea */
  rows?: number;
}

// ============================================================================
// Contact Form Field Props
// ============================================================================

/**
 * Props for ContactFormField component.
 */
export interface ContactFormFieldProps {
  /** Field name for form registration */
  name: ContactFormFieldName;
  /** Field label */
  label: string;
  /** Input type */
  type: "text" | "email" | "textarea";
  /** Placeholder text */
  placeholder?: string;
  /** Error message (if validation failed) */
  error?: string;
  /** Whether field is disabled */
  disabled?: boolean;
  /** Autocomplete attribute */
  autoComplete?: string;
  /** Number of rows (for textarea) */
  rows?: number;
  /** React Hook Form register function */
  register: unknown;
  /** Optional additional CSS classes */
  className?: string;
}

// ============================================================================
// Contact Form Props
// ============================================================================

/**
 * Props for ContactForm component.
 */
export interface ContactFormProps {
  /** Optional additional CSS classes */
  className?: string;
  /** Callback when form is successfully submitted */
  onSubmitSuccess?: () => void;
  /** Callback when form submission fails */
  onSubmitError?: (error: Error) => void;
}

// ============================================================================
// Contact Social Links Types
// ============================================================================

/**
 * Props for ContactSocialLinks component.
 */
export interface ContactSocialLinksProps {
  /** Optional additional CSS classes */
  className?: string;
}

// ============================================================================
// Contact Decorative Types
// ============================================================================

/**
 * Props for ContactDecorative component.
 */
export interface ContactDecorativeProps {
  /** Optional additional CSS classes */
  className?: string;
  /** Optional child elements */
  children?: ReactNode;
}

// ============================================================================
// Contact Section Types
// ============================================================================

/**
 * Props for ContactSection component.
 */
export interface ContactSectionProps {
  /** Optional additional CSS classes */
  className?: string;
  /** Whether content should be revealed (for loading sync) */
  isRevealed?: boolean;
}

// ============================================================================
// Footer Types
// ============================================================================

/**
 * Navigation link configuration for footer.
 */
export interface FooterNavLink {
  /** Link label */
  label: string;
  /** Target href (section ID or external URL) */
  href: string;
  /** Whether link is external */
  isExternal?: boolean;
}

/**
 * Props for FooterNav component.
 */
export interface FooterNavProps {
  /** Optional additional CSS classes */
  className?: string;
  /** Optional custom links (uses defaults if not provided) */
  links?: FooterNavLink[];
}

/**
 * Props for ScrollToTop component.
 */
export interface ScrollToTopProps {
  /** Optional additional CSS classes */
  className?: string;
  /** Scroll threshold to show button (pixels from top) */
  showAfter?: number;
}

/**
 * Props for Footer component.
 */
export interface FooterProps {
  /** Optional additional CSS classes */
  className?: string;
}

// ============================================================================
// Default Configurations
// ============================================================================

/**
 * Default contact form field configurations.
 */
export const CONTACT_FORM_FIELDS: ContactFormFieldConfig[] = [
  {
    name: "name",
    label: "Name",
    type: "text",
    placeholder: "Your name",
    required: true,
    autoComplete: "name",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "your@email.com",
    required: true,
    autoComplete: "email",
  },
  {
    name: "message",
    label: "Message",
    type: "textarea",
    placeholder: "Your message...",
    required: true,
    rows: 5,
  },
];

/**
 * Default footer navigation links.
 */
export const DEFAULT_FOOTER_LINKS: FooterNavLink[] = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

/**
 * Email address for contact form submission.
 */
export const CONTACT_EMAIL = "hello@mosheh.dev";
