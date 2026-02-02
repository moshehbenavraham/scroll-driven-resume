/**
 * Tests for SkillsSection component.
 * Integration tests for the full skills section with all sub-components.
 */

import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { SkillsSection } from "@/components/sections/SkillsSection";

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

// Mock HorizontalCardScroller
vi.mock("@/components/scroller", () => ({
  HorizontalCardScroller: ({
    children,
    ariaLabel,
    cardClassName,
  }: {
    children: React.ReactNode;
    ariaLabel?: string;
    cardClassName?: string;
  }) => (
    <div
      data-testid="horizontal-card-scroller"
      role="region"
      aria-label={ariaLabel}
      className={`flex gap-4 ${cardClassName || ""}`}
    >
      {children}
    </div>
  ),
}));

describe("SkillsSection", () => {
  it("renders without crashing", () => {
    render(<SkillsSection />);
    expect(
      screen.getByRole("region", { name: "Skills section" })
    ).toBeInTheDocument();
  });

  it("has correct aria-label", () => {
    render(<SkillsSection />);
    expect(
      screen.getByRole("region", { name: "Skills section" })
    ).toHaveAttribute("aria-label", "Skills section");
  });

  it("has id='skills' for navigation", () => {
    render(<SkillsSection />);
    expect(
      screen.getByRole("region", { name: "Skills section" })
    ).toHaveAttribute("id", "skills");
  });

  it("renders section heading", () => {
    render(<SkillsSection isRevealed={true} />);
    expect(screen.getByRole("heading", { name: "Skills" })).toBeInTheDocument();
  });

  it("renders section description", () => {
    render(<SkillsSection isRevealed={true} />);
    expect(
      screen.getByText(/Technical expertise across AI\/ML/i)
    ).toBeInTheDocument();
  });

  it("renders all 4 skill categories", () => {
    render(<SkillsSection isRevealed={true} />);
    expect(screen.getByText("AI/ML")).toBeInTheDocument();
    expect(screen.getByText("Development")).toBeInTheDocument();
    expect(screen.getByText("Product")).toBeInTheDocument();
    expect(screen.getByText("Leadership")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<SkillsSection className="custom-class" />);
    const section = screen.getByRole("region", { name: "Skills section" });
    expect(section).toHaveClass("custom-class");
  });

  it("defaults isRevealed to true", () => {
    render(<SkillsSection />);
    expect(
      screen.getByRole("region", { name: "Skills section" })
    ).toBeInTheDocument();
  });

  it("has parallax container", () => {
    render(<SkillsSection />);
    expect(screen.getByTestId("parallax-container")).toBeInTheDocument();
  });

  it("has background layer for decoratives", () => {
    render(<SkillsSection />);
    expect(screen.getByTestId("parallax-layer-mid")).toBeInTheDocument();
  });

  it("has foreground layer for content", () => {
    render(<SkillsSection />);
    expect(screen.getByTestId("parallax-layer-foreground")).toBeInTheDocument();
  });

  it("has min-h-screen for proper height", () => {
    render(<SkillsSection />);
    const section = screen.getByRole("region", { name: "Skills section" });
    expect(section).toHaveClass("min-h-screen");
  });

  it("has proper responsive padding", () => {
    render(<SkillsSection />);
    const section = screen.getByRole("region", { name: "Skills section" });
    // Responsive padding: py-16 sm:py-20 md:py-24 lg:py-32
    expect(section).toHaveClass("py-16");
  });

  it("renders skill cards with skills", () => {
    render(<SkillsSection isRevealed={true} />);
    // Check some skills from different categories
    expect(screen.getByText("Machine Learning")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("Product Strategy")).toBeInTheDocument();
    expect(screen.getByText("Team Building")).toBeInTheDocument();
  });

  it("has horizontal scroller container", () => {
    render(<SkillsSection isRevealed={true} />);
    // Find the horizontal scroller
    expect(screen.getByTestId("horizontal-card-scroller")).toBeInTheDocument();
  });

  it("renders correct heading level (h2)", () => {
    render(<SkillsSection isRevealed={true} />);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent("Skills");
  });

  it("has multiple skill cards (one per category)", () => {
    render(<SkillsSection isRevealed={true} />);
    // Each category renders an h3, so we should have 4 h3 elements
    const categoryHeadings = screen.getAllByRole("heading", { level: 3 });
    expect(categoryHeadings).toHaveLength(4);
  });
});
