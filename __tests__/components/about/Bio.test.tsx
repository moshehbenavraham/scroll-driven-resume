/**
 * Tests for Bio component.
 */

import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { Bio } from "@/components/about/Bio";
import { DEFAULT_BIO_CONTENT } from "@/types/about";

// Mock useReducedMotion hook
vi.mock("@/hooks/useReducedMotion", () => ({
  useReducedMotion: vi.fn(() => false),
}));

// Mock framer-motion
vi.mock("framer-motion", async () => {
  const actual = await vi.importActual("framer-motion");
  return {
    ...actual,
    motion: {
      div: ({
        children,
        className,
        ...props
      }: React.PropsWithChildren<{ className?: string }>) => (
        <div className={className} {...props}>
          {children}
        </div>
      ),
      h2: ({
        children,
        className,
        ...props
      }: React.PropsWithChildren<{ className?: string }>) => (
        <h2 className={className} {...props}>
          {children}
        </h2>
      ),
      p: ({
        children,
        className,
        ...props
      }: React.PropsWithChildren<{ className?: string }>) => (
        <p className={className} {...props}>
          {children}
        </p>
      ),
    },
  };
});

describe("Bio", () => {
  it("renders without crashing", () => {
    render(<Bio />);
    expect(
      screen.getByRole("heading", { level: 2 })
    ).toBeInTheDocument();
  });

  it("renders default heading", () => {
    render(<Bio isRevealed={true} />);
    expect(
      screen.getByRole("heading", { name: DEFAULT_BIO_CONTENT.heading })
    ).toBeInTheDocument();
  });

  it("renders custom heading", () => {
    render(<Bio heading="Custom Heading" isRevealed={true} />);
    expect(
      screen.getByRole("heading", { name: "Custom Heading" })
    ).toBeInTheDocument();
  });

  it("renders default paragraphs", () => {
    render(<Bio isRevealed={true} />);
    DEFAULT_BIO_CONTENT.paragraphs.forEach((paragraph) => {
      expect(screen.getByText(paragraph)).toBeInTheDocument();
    });
  });

  it("renders custom paragraphs", () => {
    const customParagraphs = ["First paragraph.", "Second paragraph."];
    render(<Bio paragraphs={customParagraphs} isRevealed={true} />);
    customParagraphs.forEach((paragraph) => {
      expect(screen.getByText(paragraph)).toBeInTheDocument();
    });
  });

  it("applies custom className", () => {
    const { container } = render(<Bio className="custom-class" />);
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("renders correct number of paragraphs", () => {
    render(<Bio isRevealed={true} />);
    const paragraphs = screen.getAllByText(/^I |^Throughout|^When/);
    expect(paragraphs.length).toBe(DEFAULT_BIO_CONTENT.paragraphs.length);
  });

  it("handles empty paragraphs array gracefully", () => {
    render(<Bio paragraphs={[]} isRevealed={true} />);
    expect(
      screen.getByRole("heading", { level: 2 })
    ).toBeInTheDocument();
  });

  it("has proper heading styling", () => {
    render(<Bio isRevealed={true} />);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveClass("font-bold");
  });
});
