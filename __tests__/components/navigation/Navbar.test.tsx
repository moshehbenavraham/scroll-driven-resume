/**
 * Unit tests for Navbar component.
 * Tests rendering, accessibility, and functionality.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Navbar } from "@/components/navigation/Navbar";

// Mock useActiveSection hook
vi.mock("@/hooks", () => ({
  useActiveSection: vi.fn(() => "hero"),
  useScrollDirection: vi.fn(() => null),
}));

// Mock ThemeToggle
vi.mock("@/components/ui/theme-toggle", () => ({
  ThemeToggle: ({ className }: { className?: string }) => (
    <button data-testid="theme-toggle" className={className}>
      Theme Toggle
    </button>
  ),
}));

// Mock framer-motion
vi.mock("framer-motion", async () => {
  const actual = await vi.importActual("framer-motion");
  return {
    ...actual,
    motion: {
      ...((actual as Record<string, unknown>).motion as object),
      header: ({
        children,
        className,
        ...props
      }: React.HTMLAttributes<HTMLElement>) => (
        <header className={className} {...props}>
          {children}
        </header>
      ),
      span: ({
        children,
        className,
        ...props
      }: React.HTMLAttributes<HTMLSpanElement>) => (
        <span className={className} {...props}>
          {children}
        </span>
      ),
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => (
      <>{children}</>
    ),
  };
});

// Mock Radix Dialog
vi.mock("@radix-ui/react-dialog", () => ({
  Root: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Portal: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Overlay: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Content: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Title: ({ children }: { children: React.ReactNode }) => (
    <h2>{children}</h2>
  ),
  Close: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("Navbar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders without crashing", () => {
    render(<Navbar />);
    expect(screen.getByRole("navigation", { name: /main navigation/i })).toBeInTheDocument();
  });

  it("has correct ARIA attributes", () => {
    render(<Navbar />);
    const nav = screen.getByRole("navigation", { name: /main navigation/i });
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveAttribute("role", "navigation");
  });

  it("contains skip-to-content link", () => {
    render(<Navbar />);
    const skipLink = screen.getByText(/skip to content/i);
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute("href", "#main-content");
  });

  it("contains ThemeToggle component", () => {
    render(<Navbar />);
    expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
  });

  it("contains navigation links", () => {
    render(<Navbar />);
    // Check for some of the expected links
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Skills")).toBeInTheDocument();
    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<Navbar className="custom-class" />);
    const nav = screen.getByRole("navigation", { name: /main navigation/i });
    expect(nav).toHaveClass("custom-class");
  });

  it("renders mobile menu button on mobile", () => {
    render(<Navbar />);
    const menuButton = screen.getByRole("button", { name: /open menu/i });
    expect(menuButton).toBeInTheDocument();
  });

  it("mobile menu button has correct ARIA attributes", () => {
    render(<Navbar />);
    const menuButton = screen.getByRole("button", { name: /open menu/i });
    expect(menuButton).toHaveAttribute("aria-expanded", "false");
    expect(menuButton).toHaveAttribute("aria-controls", "mobile-menu");
  });
});

describe("Navbar - NavLink", () => {
  beforeEach(() => {
    // Mock scrollIntoView
    Element.prototype.scrollIntoView = vi.fn();
  });

  it("links have correct href attributes", () => {
    render(<Navbar />);
    const aboutLink = screen.getAllByText("About")[0];
    expect(aboutLink).toHaveAttribute("href", "#about");
  });

  it("handles link click with smooth scroll", () => {
    // Create a mock element for scrollIntoView
    const mockElement = document.createElement("div");
    mockElement.id = "about";
    document.body.appendChild(mockElement);

    render(<Navbar />);
    const aboutLink = screen.getAllByText("About")[0];
    fireEvent.click(aboutLink);

    expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "start",
    });

    document.body.removeChild(mockElement);
  });
});

describe("Navbar - Accessibility", () => {
  it("skip link is focusable", () => {
    render(<Navbar />);
    const skipLink = screen.getByText(/skip to content/i);
    skipLink.focus();
    expect(document.activeElement).toBe(skipLink);
  });

  it("navigation links are focusable", () => {
    render(<Navbar />);
    const aboutLink = screen.getAllByText("About")[0];
    aboutLink.focus();
    expect(document.activeElement).toBe(aboutLink);
  });
});
