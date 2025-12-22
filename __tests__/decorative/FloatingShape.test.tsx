/**
 * Component tests for FloatingShape.
 * Tests rendering, reduced motion behavior, and accessibility.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { FloatingShape } from "@/components/decorative/FloatingShape";

// Track reduced motion preference
let mockReducedMotion = false;

// Mock hooks
vi.mock("@/hooks/useReducedMotion", () => ({
  useReducedMotion: () => mockReducedMotion,
  default: () => mockReducedMotion,
}));

// Mock framer-motion
vi.mock("framer-motion", async () => {
  const actual = await vi.importActual("framer-motion");
  return {
    ...actual,
    useMotionValue: vi.fn((value: number) => ({
      get: () => value,
      set: vi.fn(),
      getVelocity: () => 0,
    })),
    useTransform: vi.fn(() => ({
      get: () => 0,
      set: vi.fn(),
    })),
    motion: {
      div: ({
        children,
        className,
        style,
        "aria-hidden": ariaHidden,
        ...props
      }: {
        children?: React.ReactNode;
        className?: string;
        style?: React.CSSProperties;
        "aria-hidden"?: boolean | "true" | "false";
        [key: string]: unknown;
      }) => (
        <div
          className={className}
          style={style as React.CSSProperties}
          aria-hidden={ariaHidden === true || ariaHidden === "true" ? true : undefined}
          data-testid="floating-shape"
          {...props}
        >
          {children}
        </div>
      ),
    },
  };
});

describe("FloatingShape", () => {
  beforeEach(() => {
    mockReducedMotion = false;
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders circle shape variant", () => {
    const { container } = render(
      <FloatingShape variant="circle" position={{ x: 10, y: 20 }} />
    );

    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();

    const circle = container.querySelector("circle");
    expect(circle).toBeInTheDocument();
  });

  it("renders triangle shape variant", () => {
    const { container } = render(
      <FloatingShape variant="triangle" position={{ x: 10, y: 20 }} />
    );

    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();

    const polygon = container.querySelector("polygon");
    expect(polygon).toBeInTheDocument();
  });

  it("renders hexagon shape variant", () => {
    const { container } = render(
      <FloatingShape variant="hexagon" position={{ x: 10, y: 20 }} />
    );

    const polygon = container.querySelector("polygon");
    expect(polygon).toBeInTheDocument();

    // Hexagon has 6 points
    const points = polygon?.getAttribute("points");
    expect(points?.split(" ").length).toBe(6);
  });

  it("renders diamond shape variant", () => {
    const { container } = render(
      <FloatingShape variant="diamond" position={{ x: 10, y: 20 }} />
    );

    const polygon = container.querySelector("polygon");
    expect(polygon).toBeInTheDocument();

    // Diamond has 4 points
    const points = polygon?.getAttribute("points");
    expect(points?.split(" ").length).toBe(4);
  });

  it("has aria-hidden attribute", () => {
    render(<FloatingShape variant="circle" position={{ x: 10, y: 20 }} />);

    const shape = screen.getByTestId("floating-shape");
    expect(shape).toHaveAttribute("aria-hidden", "true");
  });

  it("applies pointer-events-none class", () => {
    render(<FloatingShape variant="circle" position={{ x: 10, y: 20 }} />);

    const shape = screen.getByTestId("floating-shape");
    expect(shape).toHaveClass("pointer-events-none");
  });

  it("positions using percentage values", () => {
    render(
      <FloatingShape variant="circle" position={{ x: 25, y: 75 }} />
    );

    const shape = screen.getByTestId("floating-shape");
    expect(shape).toHaveStyle({ left: "25%", top: "75%" });
  });

  it("applies absolute positioning", () => {
    render(<FloatingShape variant="circle" position={{ x: 10, y: 20 }} />);

    const shape = screen.getByTestId("floating-shape");
    expect(shape).toHaveClass("absolute");
  });

  it("applies custom className", () => {
    render(
      <FloatingShape
        variant="circle"
        position={{ x: 10, y: 20 }}
        className="custom-shape"
      />
    );

    const shape = screen.getByTestId("floating-shape");
    expect(shape).toHaveClass("custom-shape");
  });

  it("applies blur filter when blur prop is provided", () => {
    render(
      <FloatingShape
        variant="circle"
        position={{ x: 10, y: 20 }}
        blur={2}
      />
    );

    const shape = screen.getByTestId("floating-shape");
    expect(shape).toHaveStyle({ filter: "blur(2px)" });
  });

  it("does not apply blur filter when blur is 0", () => {
    render(
      <FloatingShape
        variant="circle"
        position={{ x: 10, y: 20 }}
        blur={0}
      />
    );

    const shape = screen.getByTestId("floating-shape");
    expect(shape.style.filter).toBeFalsy();
  });

  describe("reduced motion behavior", () => {
    it("disables will-change when reduced motion is preferred", () => {
      mockReducedMotion = true;

      render(
        <FloatingShape variant="circle" position={{ x: 10, y: 20 }} />
      );

      const shape = screen.getByTestId("floating-shape");
      expect(shape).toHaveStyle({ willChange: "auto" });
    });

    it("enables will-change when reduced motion is not preferred", () => {
      mockReducedMotion = false;

      render(
        <FloatingShape variant="circle" position={{ x: 10, y: 20 }} />
      );

      const shape = screen.getByTestId("floating-shape");
      expect(shape).toHaveStyle({ willChange: "transform" });
    });
  });
});
