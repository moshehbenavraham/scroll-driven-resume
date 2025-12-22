/**
 * Unit tests for CanvasFrameRenderer component.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "@testing-library/react";
import { CanvasFrameRenderer } from "@/components/animation/CanvasFrameRenderer";

// Mock the hooks
vi.mock("@/hooks/useImageCache", () => ({
  useImageCache: vi.fn(() => ({
    getImage: vi.fn(() => null),
    isImageLoaded: vi.fn(() => false),
    loadedCount: 0,
    totalCount: 3,
  })),
}));

vi.mock("@/hooks/useCanvasRenderer", () => ({
  useCanvasRenderer: vi.fn(() => ({
    lastDrawnFrame: -1,
  })),
}));

describe("CanvasFrameRenderer", () => {
  const mockFrameUrls = [
    "/frames/frame1.webp",
    "/frames/frame2.webp",
    "/frames/frame3.webp",
  ];

  let mockObserve: ReturnType<typeof vi.fn>;
  let mockDisconnect: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock ResizeObserver with a class
    mockObserve = vi.fn();
    mockDisconnect = vi.fn();

    class MockResizeObserver {
      observe = mockObserve;
      unobserve = vi.fn();
      disconnect = mockDisconnect;

      constructor(_callback: ResizeObserverCallback) {
        // Store callback if needed
      }
    }

    global.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;

    // Mock getBoundingClientRect
    Element.prototype.getBoundingClientRect = vi.fn().mockReturnValue({
      width: 1920,
      height: 1080,
      top: 0,
      left: 0,
      right: 1920,
      bottom: 1080,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders a container div", () => {
    const { container } = render(
      <CanvasFrameRenderer frameUrls={mockFrameUrls} currentFrame={0} />
    );

    expect(container.querySelector("div")).toBeTruthy();
  });

  it("renders a canvas element", () => {
    const { container } = render(
      <CanvasFrameRenderer frameUrls={mockFrameUrls} currentFrame={0} />
    );

    const canvas = container.querySelector("canvas");
    expect(canvas).toBeTruthy();
  });

  it("sets canvas aria-hidden to true", () => {
    const { container } = render(
      <CanvasFrameRenderer frameUrls={mockFrameUrls} currentFrame={0} />
    );

    const canvas = container.querySelector("canvas");
    expect(canvas?.getAttribute("aria-hidden")).toBe("true");
  });

  it("applies custom className", () => {
    const { container } = render(
      <CanvasFrameRenderer
        frameUrls={mockFrameUrls}
        currentFrame={0}
        className="custom-class"
      />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("custom-class");
  });

  it("sets up ResizeObserver on mount", () => {
    render(<CanvasFrameRenderer frameUrls={mockFrameUrls} currentFrame={0} />);

    expect(mockObserve).toHaveBeenCalled();
  });

  it("disconnects ResizeObserver on unmount", () => {
    const { unmount } = render(
      <CanvasFrameRenderer frameUrls={mockFrameUrls} currentFrame={0} />
    );

    unmount();

    expect(mockDisconnect).toHaveBeenCalled();
  });

  it("handles empty frameUrls", () => {
    const { container } = render(
      <CanvasFrameRenderer frameUrls={[]} currentFrame={0} />
    );

    // Should still render without crashing
    expect(container.querySelector("canvas")).toBeTruthy();
  });
});
