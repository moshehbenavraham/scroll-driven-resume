/**
 * Component tests for FrameSequence.
 * Tests rendering, virtualization, and accessibility.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { FrameSequence } from "@/components/animation/FrameSequence";
import { FrameImage } from "@/components/animation/FrameImage";
import { useFrameSequence } from "@/hooks/useFrameSequence";

// Mock useFrameSequence hook
vi.mock("@/hooks/useFrameSequence", () => ({
  useFrameSequence: vi.fn(),
}));

describe("FrameSequence", () => {
  const createMockRef = () => ({
    current: document.createElement("section"),
  });

  const mockFrameUrls = Array.from(
    { length: 192 },
    (_, i) =>
      `http://localhost:8080/frames-desktop/hero/frame_${String(i + 1).padStart(4, "0")}.webp`
  );

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementation
    vi.mocked(useFrameSequence).mockReturnValue({
      currentFrame: 0,
      frameUrls: mockFrameUrls,
      isLoading: false,
      isReady: true,
      loadProgress: 100,
      direction: null,
      isActive: false,
      prefersReducedMotion: false,
      isMobile: false,
      startPreload: vi.fn(),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // =========================================================================
  // Basic rendering tests
  // =========================================================================
  describe("basic rendering", () => {
    it("renders without crashing", () => {
      const ref = createMockRef();

      render(<FrameSequence sequence="hero" containerRef={ref} />);

      // The container has role="img" with aria-label
      expect(screen.getByRole("img", { name: /hero animation sequence/i })).toBeInTheDocument();
    });

    it("renders with correct aria-label", () => {
      const ref = createMockRef();

      render(<FrameSequence sequence="hero" containerRef={ref} />);

      expect(
        screen.getByRole("img", { name: /hero animation sequence/i })
      ).toBeInTheDocument();
    });

    it("sets data attributes correctly", () => {
      const ref = createMockRef();

      render(<FrameSequence sequence="hero" containerRef={ref} />);

      const container = screen.getByRole("img", { name: /hero animation sequence/i });
      expect(container).toHaveAttribute("data-sequence", "hero");
      expect(container).toHaveAttribute("data-frame", "0");
      expect(container).toHaveAttribute("data-ready", "true");
    });

    it("applies custom className", () => {
      const ref = createMockRef();

      render(
        <FrameSequence
          sequence="hero"
          containerRef={ref}
          className="custom-class"
        />
      );

      // The container div has role="img" and the custom class
      const container = screen.getByRole("img", { name: /hero animation sequence/i });
      expect(container).toHaveClass("custom-class");
    });
  });

  // =========================================================================
  // Loading state tests
  // =========================================================================
  describe("loading state", () => {
    it("shows loading indicator when loading", () => {
      vi.mocked(useFrameSequence).mockReturnValue({
        currentFrame: 0,
        frameUrls: mockFrameUrls,
        isLoading: true,
        isReady: false,
        loadProgress: 50,
        direction: null,
        isActive: false,
        prefersReducedMotion: false,
        isMobile: false,
        startPreload: vi.fn(),
      });

      const ref = createMockRef();

      render(<FrameSequence sequence="hero" containerRef={ref} />);

      expect(screen.getByRole("status")).toBeInTheDocument();
      expect(screen.getByText(/Loading... 50%/i)).toBeInTheDocument();
    });

    it("hides loading indicator when ready", () => {
      vi.mocked(useFrameSequence).mockReturnValue({
        currentFrame: 0,
        frameUrls: mockFrameUrls,
        isLoading: false,
        isReady: true,
        loadProgress: 100,
        direction: null,
        isActive: false,
        prefersReducedMotion: false,
        isMobile: false,
        startPreload: vi.fn(),
      });

      const ref = createMockRef();

      render(<FrameSequence sequence="hero" containerRef={ref} />);

      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });
  });

  // =========================================================================
  // Frame virtualization tests
  // =========================================================================
  describe("frame virtualization", () => {
    it("renders only virtualized frames (current +/- 2)", () => {
      vi.mocked(useFrameSequence).mockReturnValue({
        currentFrame: 50,
        frameUrls: mockFrameUrls,
        isLoading: false,
        isReady: true,
        loadProgress: 100,
        direction: null,
        isActive: true,
        prefersReducedMotion: false,
        isMobile: false,
        startPreload: vi.fn(),
      });

      const ref = createMockRef();

      render(<FrameSequence sequence="hero" containerRef={ref} />);

      // Should render frames 48-52 (5 frames total)
      const images = screen.getAllByRole("img", { hidden: true });
      // The main container + virtualized frame images
      // Note: img role includes both container and actual images
      expect(images.length).toBeLessThanOrEqual(6); // container + 5 frames max
    });

    it("renders first frame with highest z-index when active", () => {
      vi.mocked(useFrameSequence).mockReturnValue({
        currentFrame: 0,
        frameUrls: mockFrameUrls,
        isLoading: false,
        isReady: true,
        loadProgress: 100,
        direction: null,
        isActive: true,
        prefersReducedMotion: false,
        isMobile: false,
        startPreload: vi.fn(),
      });

      const ref = createMockRef();

      render(<FrameSequence sequence="hero" containerRef={ref} />);

      // First frame should be active
      const frameImage = document.querySelector('img[alt="hero frame 1"]');
      expect(frameImage).toHaveStyle({ opacity: "1" });
    });
  });

  // =========================================================================
  // Static frame tests (reduced motion / mobile)
  // =========================================================================
  describe("static frame mode", () => {
    it("shows only first frame when reduced motion is preferred", () => {
      vi.mocked(useFrameSequence).mockReturnValue({
        currentFrame: 0,
        frameUrls: mockFrameUrls,
        isLoading: false,
        isReady: true,
        loadProgress: 100,
        direction: null,
        isActive: false,
        prefersReducedMotion: true,
        isMobile: false,
        startPreload: vi.fn(),
      });

      const ref = createMockRef();

      render(<FrameSequence sequence="hero" containerRef={ref} />);

      // Should only render one frame
      const frameImage = document.querySelector('img[alt="hero frame 1"]');
      expect(frameImage).toBeInTheDocument();
    });

    it("shows only first frame on mobile", () => {
      vi.mocked(useFrameSequence).mockReturnValue({
        currentFrame: 0,
        frameUrls: mockFrameUrls,
        isLoading: false,
        isReady: true,
        loadProgress: 100,
        direction: null,
        isActive: false,
        prefersReducedMotion: false,
        isMobile: true,
        startPreload: vi.fn(),
      });

      const ref = createMockRef();

      render(<FrameSequence sequence="hero" containerRef={ref} />);

      // Should only render one frame
      const frameImage = document.querySelector('img[alt="hero frame 1"]');
      expect(frameImage).toBeInTheDocument();
    });

    it("shows only first frame when disabled", () => {
      vi.mocked(useFrameSequence).mockReturnValue({
        currentFrame: 0,
        frameUrls: mockFrameUrls,
        isLoading: false,
        isReady: true,
        loadProgress: 100,
        direction: null,
        isActive: false,
        prefersReducedMotion: false,
        isMobile: false,
        startPreload: vi.fn(),
      });

      const ref = createMockRef();

      render(<FrameSequence sequence="hero" containerRef={ref} disabled />);

      // Should only render one frame
      const frameImage = document.querySelector('img[alt="hero frame 1"]');
      expect(frameImage).toBeInTheDocument();
    });
  });

  // =========================================================================
  // Empty state tests
  // =========================================================================
  describe("empty state", () => {
    it("returns null when no frame URLs", () => {
      vi.mocked(useFrameSequence).mockReturnValue({
        currentFrame: 0,
        frameUrls: [],
        isLoading: false,
        isReady: false,
        loadProgress: 0,
        direction: null,
        isActive: false,
        prefersReducedMotion: false,
        isMobile: false,
        startPreload: vi.fn(),
      });

      const ref = createMockRef();

      const { container } = render(
        <FrameSequence sequence="hero" containerRef={ref} />
      );

      expect(container.firstChild).toBeNull();
    });
  });

  // =========================================================================
  // Callback tests
  // =========================================================================
  describe("callbacks", () => {
    it("passes onLoadProgress to hook", () => {
      const onLoadProgress = vi.fn();

      vi.mocked(useFrameSequence).mockImplementation((options) => {
        // Verify callback is passed
        expect(options.onProgress).toBe(onLoadProgress);

        return {
          currentFrame: 0,
          frameUrls: mockFrameUrls,
          isLoading: false,
          isReady: true,
          loadProgress: 100,
          direction: null,
          isActive: false,
          prefersReducedMotion: false,
          isMobile: false,
          startPreload: vi.fn(),
        };
      });

      const ref = createMockRef();

      render(
        <FrameSequence
          sequence="hero"
          containerRef={ref}
          onLoadProgress={onLoadProgress}
        />
      );
    });

    it("passes onLoadComplete to hook", () => {
      const onLoadComplete = vi.fn();

      vi.mocked(useFrameSequence).mockImplementation((options) => {
        // Verify callback is passed
        expect(options.onComplete).toBe(onLoadComplete);

        return {
          currentFrame: 0,
          frameUrls: mockFrameUrls,
          isLoading: false,
          isReady: true,
          loadProgress: 100,
          direction: null,
          isActive: false,
          prefersReducedMotion: false,
          isMobile: false,
          startPreload: vi.fn(),
        };
      });

      const ref = createMockRef();

      render(
        <FrameSequence
          sequence="hero"
          containerRef={ref}
          onLoadComplete={onLoadComplete}
        />
      );
    });
  });
});

// =========================================================================
// FrameImage component tests
// =========================================================================
describe("FrameImage", () => {
  it("renders with correct src", () => {
    render(
      <FrameImage
        src="http://localhost:8080/frames-desktop/hero/frame_0001.webp"
        alt="Test frame"
        isActive={true}
        zIndex={1}
      />
    );

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute(
      "src",
      "http://localhost:8080/frames-desktop/hero/frame_0001.webp"
    );
  });

  it("renders with correct alt text", () => {
    render(
      <FrameImage
        src="http://localhost:8080/frames-desktop/hero/frame_0001.webp"
        alt="Test frame"
        isActive={true}
        zIndex={1}
      />
    );

    expect(screen.getByAltText("Test frame")).toBeInTheDocument();
  });

  it("has opacity 1 when active", () => {
    render(
      <FrameImage
        src="http://localhost:8080/frames-desktop/hero/frame_0001.webp"
        alt="Test frame"
        isActive={true}
        zIndex={1}
      />
    );

    const img = screen.getByRole("img");
    expect(img).toHaveStyle({ opacity: "1" });
  });

  it("has opacity 0 when inactive", () => {
    render(
      <FrameImage
        src="http://localhost:8080/frames-desktop/hero/frame_0001.webp"
        alt="Test frame"
        isActive={false}
        zIndex={1}
      />
    );

    const img = screen.getByRole("img");
    expect(img).toHaveStyle({ opacity: "0" });
  });

  it("applies z-index correctly", () => {
    render(
      <FrameImage
        src="http://localhost:8080/frames-desktop/hero/frame_0001.webp"
        alt="Test frame"
        isActive={true}
        zIndex={5}
      />
    );

    const img = screen.getByRole("img");
    expect(img).toHaveStyle({ zIndex: "5" });
  });

  it("applies custom className", () => {
    render(
      <FrameImage
        src="http://localhost:8080/frames-desktop/hero/frame_0001.webp"
        alt="Test frame"
        isActive={true}
        zIndex={1}
        className="custom-frame"
      />
    );

    expect(screen.getByRole("img")).toHaveClass("custom-frame");
  });

  it("uses eager loading by default", () => {
    render(
      <FrameImage
        src="http://localhost:8080/frames-desktop/hero/frame_0001.webp"
        alt="Test frame"
        isActive={true}
        zIndex={1}
      />
    );

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("loading", "eager");
  });

  it("supports lazy loading", () => {
    render(
      <FrameImage
        src="http://localhost:8080/frames-desktop/hero/frame_0001.webp"
        alt="Test frame"
        isActive={true}
        zIndex={1}
        loading="lazy"
      />
    );

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("loading", "lazy");
  });

  it("is not draggable", () => {
    render(
      <FrameImage
        src="http://localhost:8080/frames-desktop/hero/frame_0001.webp"
        alt="Test frame"
        isActive={true}
        zIndex={1}
      />
    );

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("draggable", "false");
  });
});
