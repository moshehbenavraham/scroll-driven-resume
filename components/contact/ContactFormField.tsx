"use client";

/**
 * ContactFormField component - Reusable form field with label, input, and error display.
 * Supports text, email, and textarea field types with accessible error handling.
 */

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";
import type { ContactFormFieldName } from "@/types/contact";

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
  /** Optional additional CSS classes */
  className?: string;
}

/**
 * Shared input styles.
 */
const inputStyles = cn(
  // Base styles with 44px minimum touch target
  "min-h-[44px] w-full rounded-lg border px-4 py-3",
  // Responsive text size (16px on mobile prevents iOS zoom)
  "text-base sm:text-sm",
  // Colors
  "bg-background/50 border-border/50",
  "text-foreground placeholder:text-muted-foreground/60",
  // Focus states
  "focus:border-accent focus:ring-accent focus:ring-1 focus:outline-none",
  // Transitions
  "transition-colors duration-200",
  // Disabled state
  "disabled:cursor-not-allowed disabled:opacity-50"
);

/**
 * Error input styles.
 */
const errorInputStyles = cn(
  "border-red-500/50 focus:border-red-500 focus:ring-red-500"
);

/**
 * Reusable form field with label, input, and error display.
 * Properly associates labels with inputs for accessibility.
 *
 * @param props - Component props
 * @param ref - Forwarded ref for form registration
 *
 * @example
 * <ContactFormField
 *   name="email"
 *   label="Email"
 *   type="email"
 *   placeholder="your@email.com"
 *   error={errors.email?.message}
 *   {...register("email")}
 * />
 */
export const ContactFormField = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  ContactFormFieldProps & ComponentPropsWithoutRef<"input">
>(function ContactFormField(
  {
    name,
    label,
    type,
    placeholder,
    error,
    disabled,
    autoComplete,
    rows = 5,
    className,
    ...rest
  },
  ref
) {
  const fieldId = `contact-${name}`;
  const errorId = `${fieldId}-error`;
  const hasError = Boolean(error);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {/* Label */}
      <label
        htmlFor={fieldId}
        className={cn(
          "text-foreground text-sm font-medium",
          hasError && "text-red-500"
        )}
      >
        {label}
      </label>

      {/* Input or Textarea */}
      {type === "textarea" ? (
        <textarea
          ref={ref as React.Ref<HTMLTextAreaElement>}
          id={fieldId}
          name={name}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          autoComplete={autoComplete}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          className={cn(
            inputStyles,
            "resize-none",
            hasError && errorInputStyles
          )}
          {...(rest as ComponentPropsWithoutRef<"textarea">)}
        />
      ) : (
        <input
          ref={ref as React.Ref<HTMLInputElement>}
          id={fieldId}
          name={name}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          className={cn(inputStyles, hasError && errorInputStyles)}
          {...rest}
        />
      )}

      {/* Error message */}
      {hasError ? (
        <p
          id={errorId}
          className="text-sm text-red-500"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
});

export default ContactFormField;
