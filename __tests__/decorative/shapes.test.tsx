/**
 * Component tests for decorative shape components.
 * Tests rendering, SVG output, and props handling.
 */

import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import {
  Circle,
  Triangle,
  Hexagon,
  Diamond,
} from "@/components/decorative/shapes";

describe("Circle", () => {
  it("renders an SVG element", () => {
    const { container } = render(<Circle />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("renders a circle element", () => {
    const { container } = render(<Circle />);
    const circle = container.querySelector("circle");
    expect(circle).toBeInTheDocument();
  });

  it("has aria-hidden attribute", () => {
    const { container } = render(<Circle />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("applies custom size", () => {
    const { container } = render(<Circle size={60} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "60");
    expect(svg).toHaveAttribute("height", "60");
  });

  it("applies custom fill color", () => {
    const { container } = render(<Circle fill="red" />);
    const circle = container.querySelector("circle");
    expect(circle).toHaveAttribute("fill", "red");
  });

  it("applies custom opacity", () => {
    const { container } = render(<Circle opacity={0.5} />);
    const circle = container.querySelector("circle");
    expect(circle).toHaveAttribute("opacity", "0.5");
  });

  it("applies custom className", () => {
    const { container } = render(<Circle className="custom-class" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("custom-class");
  });
});

describe("Triangle", () => {
  it("renders an SVG element", () => {
    const { container } = render(<Triangle />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("renders a polygon element", () => {
    const { container } = render(<Triangle />);
    const polygon = container.querySelector("polygon");
    expect(polygon).toBeInTheDocument();
  });

  it("has aria-hidden attribute", () => {
    const { container } = render(<Triangle />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("applies custom size", () => {
    const { container } = render(<Triangle size={50} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "50");
    expect(svg).toHaveAttribute("height", "50");
  });

  it("applies custom fill color", () => {
    const { container } = render(<Triangle fill="blue" />);
    const polygon = container.querySelector("polygon");
    expect(polygon).toHaveAttribute("fill", "blue");
  });
});

describe("Hexagon", () => {
  it("renders an SVG element", () => {
    const { container } = render(<Hexagon />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("renders a polygon element", () => {
    const { container } = render(<Hexagon />);
    const polygon = container.querySelector("polygon");
    expect(polygon).toBeInTheDocument();
  });

  it("has aria-hidden attribute", () => {
    const { container } = render(<Hexagon />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("renders 6-point polygon (hexagon)", () => {
    const { container } = render(<Hexagon size={40} />);
    const polygon = container.querySelector("polygon");
    const points = polygon?.getAttribute("points");
    // A hexagon should have 6 points (6 comma-separated pairs)
    const pointCount = points?.split(" ").length;
    expect(pointCount).toBe(6);
  });

  it("applies custom size", () => {
    const { container } = render(<Hexagon size={80} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "80");
    expect(svg).toHaveAttribute("height", "80");
  });
});

describe("Diamond", () => {
  it("renders an SVG element", () => {
    const { container } = render(<Diamond />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("renders a polygon element", () => {
    const { container } = render(<Diamond />);
    const polygon = container.querySelector("polygon");
    expect(polygon).toBeInTheDocument();
  });

  it("has aria-hidden attribute", () => {
    const { container } = render(<Diamond />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("renders 4-point polygon (diamond)", () => {
    const { container } = render(<Diamond size={40} />);
    const polygon = container.querySelector("polygon");
    const points = polygon?.getAttribute("points");
    // A diamond should have 4 points
    const pointCount = points?.split(" ").length;
    expect(pointCount).toBe(4);
  });

  it("applies custom size", () => {
    const { container } = render(<Diamond size={30} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "30");
    expect(svg).toHaveAttribute("height", "30");
  });
});
