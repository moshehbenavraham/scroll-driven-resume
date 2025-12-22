/**
 * Tests for ProductCTAs component.
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { ProductCTAs } from "@/components/product/ProductCTAs";
import { DEFAULT_PRODUCT_CTAS } from "@/types/product";

describe("ProductCTAs", () => {
  it("renders without crashing", () => {
    render(<ProductCTAs />);
    // When no onClick, renders as links (asChild)
    expect(screen.getAllByRole("link")).toHaveLength(2);
  });

  it("renders primary link with default label", () => {
    render(<ProductCTAs />);
    expect(screen.getByRole("link", { name: DEFAULT_PRODUCT_CTAS.primary.label })).toBeInTheDocument();
  });

  it("renders secondary link with default label", () => {
    render(<ProductCTAs />);
    expect(screen.getByRole("link", { name: DEFAULT_PRODUCT_CTAS.secondary.label })).toBeInTheDocument();
  });

  it("renders primary button as link when no onClick", () => {
    render(<ProductCTAs />);
    const link = screen.getByRole("link", { name: DEFAULT_PRODUCT_CTAS.primary.label });
    expect(link).toHaveAttribute("href", DEFAULT_PRODUCT_CTAS.primary.href);
  });

  it("renders secondary button as link when no onClick", () => {
    render(<ProductCTAs />);
    const link = screen.getByRole("link", { name: DEFAULT_PRODUCT_CTAS.secondary.label });
    expect(link).toHaveAttribute("href", DEFAULT_PRODUCT_CTAS.secondary.href);
  });

  it("calls onPrimaryClick when primary button clicked", () => {
    const handleClick = vi.fn();
    render(<ProductCTAs onPrimaryClick={handleClick} />);
    const button = screen.getByRole("button", { name: DEFAULT_PRODUCT_CTAS.primary.label });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("calls onSecondaryClick when secondary button clicked", () => {
    const handleClick = vi.fn();
    render(<ProductCTAs onSecondaryClick={handleClick} />);
    const button = screen.getByRole("button", { name: DEFAULT_PRODUCT_CTAS.secondary.label });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders custom primary CTA config", () => {
    const customPrimary = { label: "Custom Primary", href: "/custom" };
    render(<ProductCTAs primary={customPrimary} />);
    expect(screen.getByRole("link", { name: "Custom Primary" })).toBeInTheDocument();
  });

  it("renders custom secondary CTA config", () => {
    const customSecondary = { label: "Custom Secondary", href: "/custom-secondary" };
    render(<ProductCTAs secondary={customSecondary} />);
    expect(screen.getByRole("link", { name: "Custom Secondary" })).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<ProductCTAs className="custom-class" />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass("custom-class");
  });

  it("has flex layout", () => {
    const { container } = render(<ProductCTAs />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass("flex");
  });

  it("has responsive stack on mobile", () => {
    const { container } = render(<ProductCTAs />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass("flex-col");
    expect(wrapper).toHaveClass("sm:flex-row");
  });

  it("primary link has correct styling", () => {
    render(<ProductCTAs />);
    const link = screen.getByRole("link", { name: DEFAULT_PRODUCT_CTAS.primary.label });
    expect(link).toHaveClass("bg-purple-600");
  });

  it("secondary link has outline styling", () => {
    render(<ProductCTAs />);
    const link = screen.getByRole("link", { name: DEFAULT_PRODUCT_CTAS.secondary.label });
    expect(link).toHaveClass("border-white/30");
  });

  it("links have accessible labels", () => {
    render(<ProductCTAs />);
    const primaryLink = screen.getByRole("link", { name: DEFAULT_PRODUCT_CTAS.primary.label });
    const secondaryLink = screen.getByRole("link", { name: DEFAULT_PRODUCT_CTAS.secondary.label });
    expect(primaryLink).toBeInTheDocument();
    expect(secondaryLink).toBeInTheDocument();
  });
});
