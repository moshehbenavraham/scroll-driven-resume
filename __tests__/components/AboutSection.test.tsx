/**
 * Tests for AboutSection component.
 * Integration tests for the full about section with all sub-components.
 */

import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { AboutSection } from "@/components/sections/AboutSection";

// Mock hooks
vi.mock("@/hooks/useReducedMotion", () => ({
  useReducedMotion: vi.fn(() => false),
}));

vi.mock("@/hooks/useIsMobile", () => ({
  useIsMobile: vi.fn(() => false),
}));

// Mock framer-motion
vi.mock("framer-motion", async () => {
  const actual = await vi.importActual("framer-motion");
  const createMockMotionValue = (value: number) => ({
    get: () => value,
    set: vi.fn(),
    getVelocity: () => 0,
    on: vi.fn(() => vi.fn()),
    onChange: vi.fn(() => vi.fn()),
  });
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
    useScroll: () => ({
      scrollYProgress: createMockMotionValue(0),
    }),
    useTransform: () => createMockMotionValue(0),
    useMotionValue: (value: number) => createMockMotionValue(value),
    useInView: () => true,
  };
});

// Mock parallax components
vi.mock("@/components/parallax", () => ({
  ParallaxContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="parallax-container">{children}</div>
  ),
  ParallaxLayer: ({
    children,
    zIndex,
    layer,
  }: {
    children: React.ReactNode;
    zIndex: number;
    layer: string;
  }) => (
    <div data-testid={`parallax-layer-${layer}`} style={{ zIndex }}>
      {children}
    </div>
  ),
}));

// Mock decorative components
vi.mock("@/components/decorative", () => ({
  DecorativeElements: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="decorative-elements">{children}</div>
  ),
  FloatingShape: () => <div data-testid="floating-shape" />,
  ConnectionLine: () => <div data-testid="connection-line" />,
  GradientMesh: () => <div data-testid="gradient-mesh" />,
  NoiseOverlay: () => <div data-testid="noise-overlay" />,
}));

describe("AboutSection", () => {
  it("renders without crashing", () => {
    render(<AboutSection />);
    expect(screen.getByRole("region")).toBeInTheDocument();
  });

  it("has correct aria-label", () => {
    render(<AboutSection />);
    expect(screen.getByRole("region")).toHaveAttribute(
      "aria-label",
      "About section"
    );
  });

  it("has id='about' for navigation", () => {
    render(<AboutSection />);
    expect(screen.getByRole("region")).toHaveAttribute("id", "about");
  });

  it("renders Bio component with heading", () => {
    render(<AboutSection isRevealed={true} />);
    expect(
      screen.getByRole("heading", { name: "About Me" })
    ).toBeInTheDocument();
  });

  it("renders Achievements component", () => {
    render(<AboutSection isRevealed={true} />);
    expect(screen.getByRole("list")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<AboutSection className="custom-class" />);
    const section = screen.getByRole("region");
    expect(section).toHaveClass("custom-class");
  });

  it("defaults isRevealed to true", () => {
    render(<AboutSection />);
    expect(screen.getByRole("region")).toBeInTheDocument();
  });

  it("has parallax container", () => {
    render(<AboutSection />);
    expect(screen.getByTestId("parallax-container")).toBeInTheDocument();
  });

  it("has background layer for decoratives", () => {
    render(<AboutSection />);
    expect(screen.getByTestId("parallax-layer-mid")).toBeInTheDocument();
  });

  it("has foreground layer for content", () => {
    render(<AboutSection />);
    expect(screen.getByTestId("parallax-layer-foreground")).toBeInTheDocument();
  });

  it("has min-h-screen for proper height", () => {
    render(<AboutSection />);
    const section = screen.getByRole("region");
    expect(section).toHaveClass("min-h-screen");
  });

  it("has proper padding", () => {
    render(<AboutSection />);
    const section = screen.getByRole("region");
    expect(section).toHaveClass("py-24");
  });

  it("renders achievement cards", () => {
    render(<AboutSection isRevealed={true} />);
    expect(screen.getByText("Years Experience")).toBeInTheDocument();
    expect(screen.getByText("Projects Completed")).toBeInTheDocument();
    expect(screen.getByText("Technologies Mastered")).toBeInTheDocument();
    expect(screen.getByText("Community Members")).toBeInTheDocument();
  });

  it("renders bio paragraphs", () => {
    render(<AboutSection isRevealed={true} />);
    expect(screen.getByText(/passionate AI engineer/i)).toBeInTheDocument();
  });
});
