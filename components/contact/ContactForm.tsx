"use client";

/**
 * ContactForm component - Form with validation and mailto submission.
 * Uses react-hook-form for state management and Zod for validation.
 */

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ContactFormField } from "./ContactFormField";
import {
  contactFormSchema,
  formatMailtoLink,
  isSpamSubmission,
  type ContactFormSchemaType,
} from "@/lib/form-validation";
import {
  CONTACT_FORM_FIELDS,
  CONTACT_EMAIL,
  type ContactFormProps,
  type FormSubmitState,
} from "@/types/contact";

/**
 * Animation variants for form container.
 */
const formVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

/**
 * Animation variants for form fields.
 */
const fieldVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

/**
 * Reduced motion variants.
 */
const reducedMotionVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0 } },
};

/**
 * Contact form with validation and mailto submission.
 * Includes honeypot field for basic spam prevention.
 *
 * @param props - Component props
 * @param props.className - Optional additional CSS classes
 * @param props.onSubmitSuccess - Callback when form is successfully submitted
 * @param props.onSubmitError - Callback when form submission fails
 *
 * @example
 * <ContactForm
 *   onSubmitSuccess={() => console.log("Form submitted")}
 *   onSubmitError={(error) => console.error(error)}
 * />
 */
export function ContactForm({
  className,
  onSubmitSuccess,
  onSubmitError,
}: ContactFormProps) {
  const [submitState, setSubmitState] = useState<FormSubmitState>("idle");
  const prefersReducedMotion = useReducedMotion();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormSchemaType>({
    resolver: zodResolver(contactFormSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      message: "",
      honeypot: "",
    },
  });

  const activeFormVariants = prefersReducedMotion
    ? reducedMotionVariants
    : formVariants;

  const activeFieldVariants = prefersReducedMotion
    ? reducedMotionVariants
    : fieldVariants;

  /**
   * Handle form submission.
   * Opens mailto link with form data.
   */
  const onSubmit = useCallback(
    async (data: ContactFormSchemaType) => {
      try {
        // Check for spam
        if (isSpamSubmission(data.honeypot)) {
          // Silently fail for spam submissions
          setSubmitState("success");
          return;
        }

        setSubmitState("submitting");

        // Format and open mailto link
        const mailtoUrl = formatMailtoLink(
          {
            name: data.name,
            email: data.email,
            message: data.message,
          },
          CONTACT_EMAIL
        );

        // Open mailto link
        window.location.href = mailtoUrl;

        // Set success state after short delay
        setTimeout(() => {
          setSubmitState("success");
          reset();
          onSubmitSuccess?.();
        }, 500);
      } catch (error) {
        setSubmitState("error");
        onSubmitError?.(
          error instanceof Error ? error : new Error("Submission failed")
        );
      }
    },
    [reset, onSubmitSuccess, onSubmitError]
  );

  const isDisabled = isSubmitting || submitState === "submitting";

  // Success state display
  if (submitState === "success") {
    return (
      <motion.div
        className={cn(
          "flex flex-col items-center justify-center gap-4 py-12",
          className
        )}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <CheckCircle className="h-16 w-16 text-green-500" aria-hidden="true" />
        <h3 className="text-xl font-semibold text-foreground">
          Message Ready!
        </h3>
        <p className="text-center text-muted-foreground">
          Your email client should have opened with the message.
          <br />
          If not, please email me directly at{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-accent hover:underline"
          >
            {CONTACT_EMAIL}
          </a>
        </p>
        <button
          type="button"
          onClick={() => setSubmitState("idle")}
          className={cn(
            "mt-4 rounded-lg px-6 py-2",
            "bg-accent/10 text-accent",
            "hover:bg-accent/20",
            "transition-colors duration-200"
          )}
        >
          Send Another Message
        </button>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-6", className)}
      initial="hidden"
      animate="visible"
      variants={activeFormVariants}
      noValidate
    >
      {/* Form fields */}
      {CONTACT_FORM_FIELDS.map((field) => {
        const { name: _, ...registerProps } = register(field.name);
        return (
          <motion.div key={field.name} variants={activeFieldVariants}>
            <ContactFormField
              name={field.name}
              label={field.label}
              type={field.type}
              placeholder={field.placeholder}
              autoComplete={field.autoComplete}
              rows={field.rows}
              error={errors[field.name]?.message}
              disabled={isDisabled}
              {...registerProps}
            />
          </motion.div>
        );
      })}

      {/* Honeypot field - visually hidden but accessible */}
      <div
        className="absolute left-[-9999px] top-0"
        aria-hidden="true"
        tabIndex={-1}
      >
        <label htmlFor="contact-honeypot">
          Leave this field empty
          <input
            id="contact-honeypot"
            type="text"
            autoComplete="off"
            tabIndex={-1}
            {...register("honeypot")}
          />
        </label>
      </div>

      {/* Error state */}
      {submitState === "error" && (
        <motion.div
          className="flex items-center gap-2 rounded-lg bg-red-500/10 p-4 text-red-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          role="alert"
        >
          <AlertCircle className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
          <p>Something went wrong. Please try again or email directly.</p>
        </motion.div>
      )}

      {/* Submit button */}
      <motion.div variants={activeFieldVariants}>
        <button
          type="submit"
          disabled={isDisabled}
          className={cn(
            "flex w-full items-center justify-center gap-2",
            "rounded-lg px-6 py-3",
            "bg-accent text-white font-medium",
            "hover:bg-accent/90",
            "focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:outline-none",
            "focus:ring-offset-background",
            "transition-all duration-200",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
        >
          {isDisabled ? (
            <>
              <span
                className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"
                aria-hidden="true"
              />
              Sending...
            </>
          ) : (
            <>
              <Send className="h-5 w-5" aria-hidden="true" />
              Send Message
            </>
          )}
        </button>
      </motion.div>
    </motion.form>
  );
}

export default ContactForm;
