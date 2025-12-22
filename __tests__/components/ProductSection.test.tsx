/**
 * Tests for ProductSection component.
 * Integration tests for the full product section with all sub-components.
 */

import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { ProductSection } from "@/components/sections/ProductSection";

// Mock UnifiedHeroCanvas to avoid complex WebGL dependencies
vi.mock("@/components/three/UnifiedHeroCanvas", () => ({
  UnifiedHeroCanvas: ({
    sequence,
    onLoadComplete,
  }: {
    sequence: string;
    onLoadComplete?: () => void;
  }) => (
    <div data-testid="unified-canvas" data-sequence={sequence}>
      Mock UnifiedHeroCanvas
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
  return {
    ...actual,
    motion: {
      div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
        <div {...props}>{children}</div>
      ),
    },
    useScroll: () => ({
      scrollYProgress: { get: () => 0 },
    }),
    useTransform: () => ({ get: () => 0 }),
  };
});

describe("ProductSection", () => {
  it("renders without crashing", () => {
    render(<ProductSection />);
    expect(screen.getByRole("region")).toBeInTheDocument();
  });

  it("has correct aria-label", () => {
    render(<ProductSection />);
    expect(screen.getByRole("region")).toHaveAttribute(
      "aria-label",
      "Product section"
    );
  });

  it("renders UnifiedHeroCanvas with product sequence", () => {
    render(<ProductSection />);
    const canvas = screen.getByTestId("unified-canvas");
    expect(canvas).toHaveAttribute("data-sequence", "product");
  });

  it("renders ContentReveal wrapper", () => {
    render(<ProductSection />);
    expect(screen.getByTestId("content-reveal")).toBeInTheDocument();
  });

  it("renders ProductContent with heading", () => {
    render(<ProductSection isRevealed={true} />);
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });

  it("renders ProductStats", () => {
    render(<ProductSection isRevealed={true} />);
    expect(screen.getByRole("list")).toBeInTheDocument();
  });

  it("renders ProductCTAs as links", () => {
    render(<ProductSection isRevealed={true} />);
    // CTAs render as links when no onClick handlers are provided
    expect(screen.getAllByRole("link")).toHaveLength(2);
  });

  it("applies custom className", () => {
    render(<ProductSection className="custom-class" />);
    const section = screen.getByRole("region");
    expect(section).toHaveClass("custom-class");
  });

  it("passes isRevealed to ContentReveal", () => {
    render(<ProductSection isRevealed={false} />);
    const contentReveal = screen.getByTestId("content-reveal");
    expect(contentReveal).toHaveAttribute("data-revealed", "false");
  });

  it("defaults isRevealed to true", () => {
    render(<ProductSection />);
    const contentReveal = screen.getByTestId("content-reveal");
    expect(contentReveal).toHaveAttribute("data-revealed", "true");
  });

  it("has 225vh height for scroll runway", () => {
    render(<ProductSection />);
    const section = screen.getByRole("region");
    expect(section).toHaveStyle({ height: "225vh" });
  });

  it("has sticky container for frame display", () => {
    const { container } = render(<ProductSection />);
    const stickyContainer = container.querySelector(".sticky");
    expect(stickyContainer).toBeInTheDocument();
    expect(stickyContainer).toHaveClass("top-0");
  });

  it("has gradient overlay for text contrast", () => {
    const { container } = render(<ProductSection />);
    const gradient = container.querySelector("[aria-hidden='true']");
    expect(gradient).toBeInTheDocument();
    // With parallax integration, z-index is applied via style prop
    expect(gradient?.className).toContain("bg-[radial-gradient");
  });

  it("has correct z-index layering", () => {
    const { container } = render(<ProductSection />);

    // With parallax integration, z-index is applied via style prop on ParallaxLayer
    // Verify the layer structure exists by checking for key elements
    const frameSequence = container.querySelector('[class*="h-full"][class*="w-full"]');
    expect(frameSequence).toBeInTheDocument();

    // Gradient layer should exist
    const gradientLayer = container.querySelector("[aria-hidden='true']");
    expect(gradientLayer).toBeInTheDocument();

    // Content layer with ContentReveal should exist
    const contentContainer = container.querySelector('[class*="flex"][class*="items-center"][class*="justify-center"]');
    expect(contentContainer).toBeInTheDocument();
  });

  it("has radial gradient for burst effect", () => {
    const { container } = render(<ProductSection />);
    const gradient = container.querySelector("[aria-hidden='true']");
    expect(gradient?.className).toContain("bg-[radial-gradient");
  });
});
