/* eslint-disable @next/next/no-img-element */
/**
 * Tests for ProjectsSection component.
 */

import { render, screen } from "@testing-library/react";
import { vi, beforeEach } from "vitest";
import { ProjectsSection } from "@/components/sections/ProjectsSection";

// Track if reduced motion is enabled for tests
let mockReducedMotion = false;
let mockIsMobile = false;
let mockIsInView = true;

// Mock useReducedMotion hook
vi.mock("@/hooks/useReducedMotion", () => ({
  useReducedMotion: vi.fn(() => mockReducedMotion),
}));

// Mock useIsMobile hook
vi.mock("@/hooks/useIsMobile", () => ({
  useIsMobile: vi.fn(() => mockIsMobile),
}));

// Mock framer-motion
vi.mock("framer-motion", async () => {
  const actual = await vi.importActual("framer-motion");
  return {
    ...actual,
    useInView: vi.fn(() => mockIsInView),
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
      article: ({
        children,
        className,
        ...props
      }: React.PropsWithChildren<{ className?: string }>) => (
        <article className={className} {...props}>
          {children}
        </article>
      ),
    },
  };
});

// Mock next/image
vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    className,
  }: {
    src: string;
    alt: string;
    className?: string;
  }) => <img src={src} alt={alt} className={className} />,
}));

// Mock ParallaxContainer and ParallaxLayer
vi.mock("@/components/parallax", () => ({
  ParallaxContainer: ({
    children,
  }: React.PropsWithChildren<Record<string, unknown>>) => <div>{children}</div>,
  ParallaxLayer: ({
    children,
  }: React.PropsWithChildren<Record<string, unknown>>) => <div>{children}</div>,
}));

// Mock decorative components
vi.mock("@/components/decorative", () => ({
  DecorativeElements: ({
    children,
  }: React.PropsWithChildren<Record<string, unknown>>) => (
    <div data-testid="decorative-elements">{children}</div>
  ),
  FloatingShape: () => <div data-testid="floating-shape" />,
  ConnectionLine: () => <div data-testid="connection-line" />,
  GradientMesh: () => <div data-testid="gradient-mesh" />,
  NoiseOverlay: () => <div data-testid="noise-overlay" />,
}));

describe("ProjectsSection", () => {
  beforeEach(() => {
    mockReducedMotion = false;
    mockIsMobile = false;
    mockIsInView = true;
  });

  it("renders without crashing", () => {
    render(<ProjectsSection />);
    expect(screen.getByText("Projects")).toBeInTheDocument();
  });

  it("renders section heading", () => {
    render(<ProjectsSection />);
    expect(
      screen.getByRole("heading", { name: "Projects" })
    ).toBeInTheDocument();
  });

  it("renders section description", () => {
    render(<ProjectsSection />);
    expect(
      screen.getByText(/selected work showcasing ai/i)
    ).toBeInTheDocument();
  });

  it("has correct section id", () => {
    render(<ProjectsSection />);
    const section = screen.getByRole("region", { name: /projects section/i });
    expect(section).toHaveAttribute("id", "projects");
  });

  it("has aria-label for accessibility", () => {
    render(<ProjectsSection />);
    expect(
      screen.getByRole("region", { name: /projects section/i })
    ).toBeInTheDocument();
  });

  it("renders project cards", () => {
    render(<ProjectsSection />);
    // Check for project titles from DEFAULT_PROJECTS
    expect(screen.getByText("AI Analytics Platform")).toBeInTheDocument();
    expect(screen.getByText("E-Commerce Mobile App")).toBeInTheDocument();
  });

  it("renders all default projects", () => {
    render(<ProjectsSection />);
    const articles = screen.getAllByRole("article");
    expect(articles.length).toBeGreaterThanOrEqual(4);
  });

  it("applies custom className", () => {
    render(<ProjectsSection className="custom-class" />);
    const section = screen.getByRole("region", { name: /projects section/i });
    expect(section).toHaveClass("custom-class");
  });

  it("has responsive grid layout", () => {
    const { container } = render(<ProjectsSection />);
    const grid = container.querySelector(".grid");
    expect(grid).toHaveClass("grid-cols-1");
    expect(grid).toHaveClass("md:grid-cols-2");
    expect(grid).toHaveClass("lg:grid-cols-3");
  });

  it("renders with min-h-screen class", () => {
    render(<ProjectsSection />);
    const section = screen.getByRole("region", { name: /projects section/i });
    expect(section).toHaveClass("min-h-screen");
  });

  it("respects isRevealed prop", () => {
    const { container, rerender } = render(
      <ProjectsSection isRevealed={false} />
    );
    expect(container.firstChild).toBeInTheDocument();

    rerender(<ProjectsSection isRevealed={true} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  describe("reduced motion", () => {
    beforeEach(() => {
      mockReducedMotion = true;
    });

    it("renders correctly with reduced motion", () => {
      render(<ProjectsSection isRevealed={true} />);
      expect(screen.getByText("Projects")).toBeInTheDocument();
    });

    it("hides decorative elements with reduced motion", () => {
      render(<ProjectsSection />);
      // Decoratives should not render with reduced motion
      expect(
        screen.queryByTestId("decorative-elements")
      ).not.toBeInTheDocument();
    });
  });

  describe("mobile view", () => {
    beforeEach(() => {
      mockIsMobile = true;
    });

    it("renders correctly on mobile", () => {
      render(<ProjectsSection />);
      expect(screen.getByText("Projects")).toBeInTheDocument();
    });

    it("hides decorative elements on mobile", () => {
      render(<ProjectsSection />);
      // Decoratives should not render on mobile
      expect(
        screen.queryByTestId("decorative-elements")
      ).not.toBeInTheDocument();
    });
  });
});
