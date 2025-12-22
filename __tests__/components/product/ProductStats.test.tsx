/**
 * Tests for ProductStats component.
 */

import { render, screen } from "@testing-library/react";
import { ProductStats } from "@/components/product/ProductStats";
import { DEFAULT_PRODUCT_STATS, type ProductStat } from "@/types/product";

describe("ProductStats", () => {
  it("renders without crashing", () => {
    render(<ProductStats />);
    expect(screen.getByRole("list")).toBeInTheDocument();
  });

  it("renders all default stats", () => {
    render(<ProductStats />);
    DEFAULT_PRODUCT_STATS.forEach((stat) => {
      expect(screen.getByText(stat.value)).toBeInTheDocument();
      expect(screen.getByText(stat.label)).toBeInTheDocument();
    });
  });

  it("renders custom stats", () => {
    const customStats: ProductStat[] = [
      { label: "Custom", value: "100", icon: "star" },
    ];
    render(<ProductStats stats={customStats} />);
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("Custom")).toBeInTheDocument();
  });

  it("handles empty stats array gracefully", () => {
    const { container } = render(<ProductStats stats={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("applies custom className", () => {
    render(<ProductStats className="custom-class" />);
    const list = screen.getByRole("list");
    expect(list).toHaveClass("custom-class");
  });

  it("has correct aria-label for accessibility", () => {
    render(<ProductStats />);
    const list = screen.getByRole("list");
    expect(list).toHaveAttribute("aria-label", "Community statistics");
  });

  it("renders correct number of stat items", () => {
    render(<ProductStats />);
    const statItems = screen.getAllByText(/^\d/);
    expect(statItems.length).toBe(DEFAULT_PRODUCT_STATS.length);
  });

  it("renders with scroll progress at 0 (hidden)", () => {
    render(<ProductStats scrollProgress={0} />);
    expect(screen.getByRole("list")).toBeInTheDocument();
  });

  it("renders with scroll progress at 1 (fully visible)", () => {
    render(<ProductStats scrollProgress={1} />);
    expect(screen.getByRole("list")).toBeInTheDocument();
  });

  it("has grid layout", () => {
    render(<ProductStats />);
    const list = screen.getByRole("list");
    expect(list).toHaveClass("grid");
    expect(list).toHaveClass("grid-cols-2");
  });

  it("has responsive grid on larger screens", () => {
    render(<ProductStats />);
    const list = screen.getByRole("list");
    expect(list).toHaveClass("md:grid-cols-4");
  });

  it("renders stat values with bold text", () => {
    render(<ProductStats />);
    const value = screen.getByText(DEFAULT_PRODUCT_STATS[0].value);
    expect(value).toHaveClass("font-bold");
  });

  it("renders stat labels with uppercase styling", () => {
    render(<ProductStats />);
    const label = screen.getByText(DEFAULT_PRODUCT_STATS[0].label);
    expect(label).toHaveClass("uppercase");
  });
});
