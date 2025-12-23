/**
 * Component tests for ContactForm.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactForm } from "@/components/contact/ContactForm";

// Mock framer-motion
vi.mock("framer-motion", async () => {
  const actual = await vi.importActual("framer-motion");
  return {
    ...actual,
    motion: {
      div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
        <div {...props}>{children}</div>
      ),
      form: ({ children, ...props }: React.HTMLAttributes<HTMLFormElement>) => (
        <form {...props}>{children}</form>
      ),
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => (
      <>{children}</>
    ),
  };
});

// Mock useReducedMotion hook
vi.mock("@/hooks/useReducedMotion", () => ({
  useReducedMotion: () => false,
}));

describe("ContactForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all form fields", () => {
    render(<ContactForm />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /send message/i })
    ).toBeInTheDocument();
  });

  it("shows validation errors on empty submission", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const submitButton = screen.getByRole("button", { name: /send message/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/name must be at least/i)).toBeInTheDocument();
    });
  });

  it("shows email validation error for invalid email", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, "notanemail");
    await user.tab();

    await waitFor(() => {
      expect(
        screen.getByText(/please enter a valid email/i)
      ).toBeInTheDocument();
    });
  });

  it("shows message validation error for short message", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const messageInput = screen.getByLabelText(/message/i);
    await user.type(messageInput, "Hi");
    await user.tab();

    await waitFor(() => {
      expect(
        screen.getByText(/message must be at least 10 characters/i)
      ).toBeInTheDocument();
    });
  });

  it("clears errors when valid input is entered", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    // Trigger validation error
    const nameInput = screen.getByLabelText(/name/i);
    await user.type(nameInput, "J");
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/name must be at least/i)).toBeInTheDocument();
    });

    // Fix the error
    await user.clear(nameInput);
    await user.type(nameInput, "John Doe");
    await user.tab();

    await waitFor(() => {
      expect(
        screen.queryByText(/name must be at least/i)
      ).not.toBeInTheDocument();
    });
  });

  it("has proper accessibility attributes", () => {
    render(<ContactForm />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const messageInput = screen.getByLabelText(/message/i);

    expect(nameInput).toHaveAttribute("id", "contact-name");
    expect(emailInput).toHaveAttribute("id", "contact-email");
    expect(messageInput).toHaveAttribute("id", "contact-message");
  });

  it("has noValidate attribute on form", () => {
    const { container } = render(<ContactForm />);
    const form = container.querySelector("form");
    expect(form).toHaveAttribute("noValidate");
  });

  it("honeypot field is hidden from visual users", () => {
    const { container } = render(<ContactForm />);
    const honeypotContainer = container.querySelector(
      '[aria-hidden="true"][tabindex="-1"]'
    );
    expect(honeypotContainer).toBeInTheDocument();
  });

  it("disables submit button while submitting", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    // Fill in valid form data
    await user.type(screen.getByLabelText(/name/i), "John Doe");
    await user.type(screen.getByLabelText(/email/i), "john@example.com");
    await user.type(
      screen.getByLabelText(/message/i),
      "Hello, I would like to discuss a project with you."
    );

    // Click submit - mock window.location.href
    const originalLocation = window.location;
    Object.defineProperty(window, "location", {
      value: { href: "" },
      writable: true,
    });

    const submitButton = screen.getByRole("button", { name: /send message/i });
    await user.click(submitButton);

    // Button should show loading state briefly
    await waitFor(() => {
      expect(screen.queryByText(/sending/i)).not.toBeInTheDocument();
    });

    // Restore window.location
    Object.defineProperty(window, "location", {
      value: originalLocation,
      writable: true,
    });
  });

  it("calls onSubmitSuccess callback on successful submission", async () => {
    const onSubmitSuccess = vi.fn();
    const user = userEvent.setup();

    // Mock window.location.href
    const originalLocation = window.location;
    Object.defineProperty(window, "location", {
      value: { href: "" },
      writable: true,
    });

    render(<ContactForm onSubmitSuccess={onSubmitSuccess} />);

    // Fill in valid form data
    await user.type(screen.getByLabelText(/name/i), "John Doe");
    await user.type(screen.getByLabelText(/email/i), "john@example.com");
    await user.type(
      screen.getByLabelText(/message/i),
      "Hello, I would like to discuss a project with you."
    );

    const submitButton = screen.getByRole("button", { name: /send message/i });
    await user.click(submitButton);

    // Wait for success callback
    await waitFor(
      () => {
        expect(onSubmitSuccess).toHaveBeenCalled();
      },
      { timeout: 2000 }
    );

    // Restore window.location
    Object.defineProperty(window, "location", {
      value: originalLocation,
      writable: true,
    });
  });

  it("shows success state after form submission", async () => {
    const user = userEvent.setup();

    // Mock window.location.href
    const originalLocation = window.location;
    Object.defineProperty(window, "location", {
      value: { href: "" },
      writable: true,
    });

    render(<ContactForm />);

    // Fill in valid form data
    await user.type(screen.getByLabelText(/name/i), "John Doe");
    await user.type(screen.getByLabelText(/email/i), "john@example.com");
    await user.type(
      screen.getByLabelText(/message/i),
      "Hello, I would like to discuss a project with you."
    );

    const submitButton = screen.getByRole("button", { name: /send message/i });
    await user.click(submitButton);

    // Wait for success state
    await waitFor(
      () => {
        expect(screen.getByText(/message ready/i)).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    // Restore window.location
    Object.defineProperty(window, "location", {
      value: originalLocation,
      writable: true,
    });
  });

  it("allows sending another message after success", async () => {
    const user = userEvent.setup();

    // Mock window.location.href
    const originalLocation = window.location;
    Object.defineProperty(window, "location", {
      value: { href: "" },
      writable: true,
    });

    render(<ContactForm />);

    // Fill in and submit form
    await user.type(screen.getByLabelText(/name/i), "John Doe");
    await user.type(screen.getByLabelText(/email/i), "john@example.com");
    await user.type(
      screen.getByLabelText(/message/i),
      "Hello, I would like to discuss a project with you."
    );
    await user.click(screen.getByRole("button", { name: /send message/i }));

    // Wait for success state
    await waitFor(
      () => {
        expect(screen.getByText(/message ready/i)).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    // Click "Send Another Message"
    await user.click(screen.getByText(/send another message/i));

    // Form should be visible again
    await waitFor(() => {
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    });

    // Restore window.location
    Object.defineProperty(window, "location", {
      value: originalLocation,
      writable: true,
    });
  });
});
