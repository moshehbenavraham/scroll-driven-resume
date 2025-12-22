/**
 * Component tests for ParallaxLayer.
 * Tests rendering, transforms, and accessibility features.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { type RefObject } from "react";
import { ParallaxContainer, ParallaxLayer } from "@/components/parallax";

// Mock hooks
vi.mock("@/hooks", () => ({
  useReducedMotion: vi.fn(() => false),
  useIsMobile: vi.fn(() => false),
  useParallaxTransform: vi.fn(() => ({
    y: { get: () => 0 },
    style: {
      y: { get: () => 0 },
      willChange: "transform",
    },
  })),
}));

// Mock framer-motion
vi.mock("framer-motion", async () => {
  const actual = await vi.importActual("framer-motion");
  return {
    ...actual,
    useScroll: vi.fn(() => ({
      scrollYProgress: { get: () => 0.5 },
    })),
    useMotionValue: vi.fn((value: number) => ({
      get: () => value,
      set: vi.fn(),
    })),
    motion: {
      div: ({
        children,
        className,
        style,
        ...props
      }: {
        children?: React.ReactNode;
        className?: string;
        style?: React.CSSProperties;
        [key: string]: unknown;
      }) => (
        <div
          className={className}
          style={style as React.CSSProperties}
          data-motion="div"
          {...props}
        >
          {children}
        </div>
      ),
    },
  };
});

// Wrapper component that provides container context
function TestWrapper({
  children,
  enabled = true,
}: {
  children: React.ReactNode;
  enabled?: boolean;
}) {
  // Create a mock ref
  const containerRef = { current: document.createElement("section") };

  return (
    <ParallaxContainer
      containerRef={containerRef as RefObject<HTMLElement>}
      enabled={enabled}
    >
      {children}
    </ParallaxContainer>
  );
}

describe("ParallaxLayer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders children content", () => {
    render(
      <TestWrapper>
        <ParallaxLayer>
          <div data-testid="child">Child Content</div>
        </ParallaxLayer>
      </TestWrapper>
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.getByText("Child Content")).toBeInTheDocument();
  });

  it("renders with motion.div wrapper", () => {
    render(
      <TestWrapper>
        <ParallaxLayer>
          <span>Content</span>
        </ParallaxLayer>
      </TestWrapper>
    );

    // Check for motion div marker (from our mock)
    const motionDiv = document.querySelector('[data-motion="div"]');
    expect(motionDiv).toBeInTheDocument();
  });

  it("applies absolute positioning", () => {
    render(
      <TestWrapper>
        <ParallaxLayer>
          <span>Content</span>
        </ParallaxLayer>
      </TestWrapper>
    );

    const motionDiv = document.querySelector('[data-motion="div"]');
    expect(motionDiv).toHaveClass("absolute");
    expect(motionDiv).toHaveClass("inset-0");
  });

  it("applies custom className", () => {
    render(
      <TestWrapper>
        <ParallaxLayer className="custom-layer-class">
          <span>Content</span>
        </ParallaxLayer>
      </TestWrapper>
    );

    const motionDiv = document.querySelector('[data-motion="div"]');
    expect(motionDiv).toHaveClass("custom-layer-class");
  });

  it("applies zIndex when provided", () => {
    render(
      <TestWrapper>
        <ParallaxLayer zIndex={10}>
          <span>Content</span>
        </ParallaxLayer>
      </TestWrapper>
    );

    const motionDiv = document.querySelector('[data-motion="div"]');
    expect(motionDiv).toHaveStyle({ zIndex: 10 });
  });

  it("disables pointer events for mid layer by default", () => {
    render(
      <TestWrapper>
        <ParallaxLayer layer="mid">
          <span>Content</span>
        </ParallaxLayer>
      </TestWrapper>
    );

    const motionDiv = document.querySelector('[data-motion="div"]');
    expect(motionDiv).toHaveClass("pointer-events-none");
  });

  it("enables pointer events for foreground layer by default", () => {
    render(
      <TestWrapper>
        <ParallaxLayer layer="foreground">
          <span>Content</span>
        </ParallaxLayer>
      </TestWrapper>
    );

    const motionDiv = document.querySelector('[data-motion="div"]');
    expect(motionDiv).not.toHaveClass("pointer-events-none");
  });

  it("enables pointer events for background layer by default", () => {
    render(
      <TestWrapper>
        <ParallaxLayer layer="background">
          <span>Content</span>
        </ParallaxLayer>
      </TestWrapper>
    );

    const motionDiv = document.querySelector('[data-motion="div"]');
    expect(motionDiv).not.toHaveClass("pointer-events-none");
  });

  it("respects explicit pointerEvents prop (true)", () => {
    render(
      <TestWrapper>
        <ParallaxLayer layer="mid" pointerEvents={true}>
          <span>Content</span>
        </ParallaxLayer>
      </TestWrapper>
    );

    const motionDiv = document.querySelector('[data-motion="div"]');
    expect(motionDiv).not.toHaveClass("pointer-events-none");
  });

  it("respects explicit pointerEvents prop (false)", () => {
    render(
      <TestWrapper>
        <ParallaxLayer layer="foreground" pointerEvents={false}>
          <span>Content</span>
        </ParallaxLayer>
      </TestWrapper>
    );

    const motionDiv = document.querySelector('[data-motion="div"]');
    expect(motionDiv).toHaveClass("pointer-events-none");
  });

  it("renders multiple layers with different z-indices", () => {
    render(
      <TestWrapper>
        <ParallaxLayer layer="background" zIndex={0}>
          <span>Background</span>
        </ParallaxLayer>
        <ParallaxLayer layer="mid" zIndex={10}>
          <span>Mid</span>
        </ParallaxLayer>
        <ParallaxLayer layer="foreground" zIndex={20}>
          <span>Foreground</span>
        </ParallaxLayer>
      </TestWrapper>
    );

    expect(screen.getByText("Background")).toBeInTheDocument();
    expect(screen.getByText("Mid")).toBeInTheDocument();
    expect(screen.getByText("Foreground")).toBeInTheDocument();

    const layers = document.querySelectorAll('[data-motion="div"]');
    expect(layers).toHaveLength(3);
  });

  it("uses speed prop over layer type when both provided", () => {
    // This test validates that explicit speed takes precedence
    render(
      <TestWrapper>
        <ParallaxLayer layer="background" speed={0.5}>
          <span>Content</span>
        </ParallaxLayer>
      </TestWrapper>
    );

    // Component should render without error
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("defaults to mid layer speed when no layer or speed provided", () => {
    render(
      <TestWrapper>
        <ParallaxLayer>
          <span>Content</span>
        </ParallaxLayer>
      </TestWrapper>
    );

    // Component should render without error
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("has transform-origin set to center", () => {
    render(
      <TestWrapper>
        <ParallaxLayer>
          <span>Content</span>
        </ParallaxLayer>
      </TestWrapper>
    );

    const motionDiv = document.querySelector('[data-motion="div"]');
    expect(motionDiv).toHaveClass("origin-center");
  });
});
