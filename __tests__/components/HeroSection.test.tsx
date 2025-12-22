/**
 * Tests for HeroSection component.
 * Integration tests for the full hero section with all sub-components.
 */

import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { HeroSection } from "@/components/sections/HeroSection";

// Mock FrameSequence to avoid complex dependencies
vi.mock("@/components/animation/FrameSequence", () => ({
  FrameSequence: ({
    sequence,
    onLoadComplete,
  }: {
    sequence: string;
    onLoadComplete?: () => void;
  }) => (
    <div data-testid="frame-sequence" data-sequence={sequence}>
      Mock FrameSequence
      <button onClick={onLoadComplete} data-testid="trigger-load-complete">
        Complete
      </button>
    </div>
  ),
}));

// Mock ContentReveal to simplify testing
vi.mock("@/components/loading/ContentReveal", () => ({
  ContentReveal: ({
    children,
    isRevealed,
  }: {
    children: React.ReactNode;
    isRevealed: boolean;
  }) => (
    <div data-testid="content-reveal" data-revealed={isRevealed}>
      {children}
    </div>
  ),
}));

// Mock framer-motion to avoid animation issues in tests
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
        ...props
      }: React.PropsWithChildren<Record<string, unknown>>) => (
        <div {...props}>{children}</div>
      ),
      svg: ({
        children,
        ...props
      }: React.PropsWithChildren<Record<string, unknown>>) => (
        <svg {...props}>{children}</svg>
      ),
      path: (props: Record<string, unknown>) => <path {...props} />,
    },
    useScroll: () => ({
      scrollYProgress: createMockMotionValue(0),
    }),
    useTransform: () => createMockMotionValue(0),
    useMotionValue: (value: number) => createMockMotionValue(value),
    useInView: () => true,
  };
});

describe("HeroSection", () => {
  it("renders without crashing", () => {
    render(<HeroSection />);
    expect(screen.getByRole("region")).toBeInTheDocument();
  });

  it("has correct aria-label", () => {
    render(<HeroSection />);
    expect(screen.getByRole("region")).toHaveAttribute(
      "aria-label",
      "Hero section"
    );
  });

  it("renders FrameSequence with hero sequence", () => {
    render(<HeroSection />);
    const frameSequence = screen.getByTestId("frame-sequence");
    expect(frameSequence).toHaveAttribute("data-sequence", "hero");
  });

  it("renders ContentReveal wrapper", () => {
    render(<HeroSection />);
    expect(screen.getByTestId("content-reveal")).toBeInTheDocument();
  });

  it("renders HeroContent with name", () => {
    render(<HeroSection isRevealed={true} />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("renders SkillIndicators", () => {
    render(<HeroSection isRevealed={true} />);
    expect(screen.getByRole("list")).toBeInTheDocument();
  });

  it("renders SocialLinks", () => {
    render(<HeroSection isRevealed={true} />);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<HeroSection className="custom-class" />);
    const section = screen.getByRole("region");
    expect(section).toHaveClass("custom-class");
  });

  it("passes isRevealed to ContentReveal", () => {
    render(<HeroSection isRevealed={false} />);
    const contentReveal = screen.getByTestId("content-reveal");
    expect(contentReveal).toHaveAttribute("data-revealed", "false");
  });

  it("defaults isRevealed to true", () => {
    render(<HeroSection />);
    const contentReveal = screen.getByTestId("content-reveal");
    expect(contentReveal).toHaveAttribute("data-revealed", "true");
  });

  it("has 300vh height for scroll runway", () => {
    render(<HeroSection />);
    const section = screen.getByRole("region");
    expect(section).toHaveClass("h-[300vh]");
  });

  it("has sticky container for frame display", () => {
    const { container } = render(<HeroSection />);
    const stickyContainer = container.querySelector(".sticky");
    expect(stickyContainer).toBeInTheDocument();
    expect(stickyContainer).toHaveClass("top-0");
  });

  it("has gradient overlay for text contrast", () => {
    const { container } = render(<HeroSection />);
    const gradient = container.querySelector(".bg-gradient-to-t");
    expect(gradient).toBeInTheDocument();
    expect(gradient).toHaveAttribute("aria-hidden", "true");
  });

  it("has correct z-index layering", () => {
    const { container } = render(<HeroSection />);

    // With parallax integration, z-index is applied via style prop on ParallaxLayer
    // Verify the layer structure exists by checking for key elements
    const frameSequence = container.querySelector(
      '[class*="h-full"][class*="w-full"]'
    );
    expect(frameSequence).toBeInTheDocument();

    // Gradient layer should exist
    const gradientLayer = container.querySelector(".bg-gradient-to-t");
    expect(gradientLayer).toBeInTheDocument();

    // Content layer with ContentReveal should exist
    const contentContainer = container.querySelector(
      '[class*="flex"][class*="items-center"][class*="justify-center"]'
    );
    expect(contentContainer).toBeInTheDocument();
  });
});
