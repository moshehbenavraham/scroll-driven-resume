/**
 * Tests for TechBadge component.
 */

import { render, screen } from "@testing-library/react";
import { TechBadge } from "@/components/projects/TechBadge";

describe("TechBadge", () => {
  it("renders without crashing", () => {
    render(<TechBadge technology="TypeScript" />);
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("renders technology name", () => {
    render(<TechBadge technology="React" />);
    expect(screen.getByText("React")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<TechBadge technology="TypeScript" className="custom-class" />);
    const badge = screen.getByText("TypeScript");
    expect(badge).toHaveClass("custom-class");
  });

  it("has pill styling with rounded-full", () => {
    render(<TechBadge technology="TypeScript" />);
    const badge = screen.getByText("TypeScript");
    expect(badge).toHaveClass("rounded-full");
  });

  it("has correct accent color styling", () => {
    render(<TechBadge technology="TypeScript" />);
    const badge = screen.getByText("TypeScript");
    expect(badge).toHaveClass("text-accent");
  });

  it("has small text styling", () => {
    render(<TechBadge technology="TypeScript" />);
    const badge = screen.getByText("TypeScript");
    expect(badge).toHaveClass("text-xs");
  });

  it("renders as span element", () => {
    const { container } = render(<TechBadge technology="TypeScript" />);
    const span = container.querySelector("span");
    expect(span).toBeInTheDocument();
    expect(span).toHaveTextContent("TypeScript");
  });

  it("handles long technology names", () => {
    const longName = "VeryLongTechnologyNameThatMightOverflow";
    render(<TechBadge technology={longName} />);
    expect(screen.getByText(longName)).toBeInTheDocument();
  });

  it("handles technology names with special characters", () => {
    render(<TechBadge technology="C++" />);
    expect(screen.getByText("C++")).toBeInTheDocument();
  });

  it("handles technology names with dots", () => {
    render(<TechBadge technology="Next.js" />);
    expect(screen.getByText("Next.js")).toBeInTheDocument();
  });
});
