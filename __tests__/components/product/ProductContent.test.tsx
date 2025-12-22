/**
 * Tests for ProductContent component.
 */

import { render, screen } from "@testing-library/react";
import { ProductContent } from "@/components/product/ProductContent";
import { DEFAULT_PRODUCT_CONTENT } from "@/types/product";

describe("ProductContent", () => {
  it("renders without crashing", () => {
    render(<ProductContent />);
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });

  it("renders default product name", () => {
    render(<ProductContent />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      DEFAULT_PRODUCT_CONTENT.name
    );
  });

  it("renders default tagline", () => {
    render(<ProductContent />);
    expect(
      screen.getByText(DEFAULT_PRODUCT_CONTENT.tagline)
    ).toBeInTheDocument();
  });

  it("renders custom product name", () => {
    render(<ProductContent name="Custom Product" />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Custom Product"
    );
  });

  it("renders custom tagline", () => {
    render(<ProductContent tagline="Custom tagline text" />);
    expect(screen.getByText("Custom tagline text")).toBeInTheDocument();
  });

  it("renders children", () => {
    render(
      <ProductContent>
        <div data-testid="child-element">Child content</div>
      </ProductContent>
    );
    expect(screen.getByTestId("child-element")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<ProductContent className="custom-class" />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass("custom-class");
  });

  it("has centered text alignment", () => {
    const { container } = render(<ProductContent />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass("text-center");
  });

  it("has correct max width for readability", () => {
    const { container } = render(<ProductContent />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass("max-w-3xl");
  });

  it("renders name with correct heading styles", () => {
    render(<ProductContent />);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveClass("font-bold");
    expect(heading).toHaveClass("text-white");
  });

  it("renders tagline with correct styles", () => {
    render(<ProductContent />);
    const tagline = screen.getByText(DEFAULT_PRODUCT_CONTENT.tagline);
    expect(tagline).toHaveClass("text-white/80");
  });
});
