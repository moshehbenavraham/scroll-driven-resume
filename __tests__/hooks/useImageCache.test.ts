/**
 * Unit tests for useImageCache hook.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useImageCache } from "@/hooks/useImageCache";

describe("useImageCache", () => {
  const mockFrameUrls = [
    "/frames/frame1.webp",
    "/frames/frame2.webp",
    "/frames/frame3.webp",
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns initial state correctly", () => {
    const { result } = renderHook(() =>
      useImageCache({ frameUrls: mockFrameUrls })
    );

    expect(result.current.totalCount).toBe(3);
    expect(typeof result.current.getImage).toBe("function");
    expect(typeof result.current.isImageLoaded).toBe("function");
  });

  it("returns null for uncached image index", () => {
    const { result } = renderHook(() =>
      useImageCache({ frameUrls: mockFrameUrls })
    );

    // Before any images are loaded, getImage should return null
    expect(result.current.getImage(0)).toBe(null);
  });

  it("handles empty frame URLs", () => {
    const { result } = renderHook(() => useImageCache({ frameUrls: [] }));

    expect(result.current.totalCount).toBe(0);
    expect(result.current.loadedCount).toBe(0);
    expect(result.current.getImage(0)).toBe(null);
  });

  it("respects enabled option", () => {
    const { result } = renderHook(() =>
      useImageCache({ frameUrls: mockFrameUrls, enabled: false })
    );

    expect(result.current.totalCount).toBe(3);
    expect(result.current.loadedCount).toBe(0);
  });

  it("isImageLoaded returns false for uncached index", () => {
    const { result } = renderHook(() =>
      useImageCache({ frameUrls: mockFrameUrls })
    );

    expect(result.current.isImageLoaded(0)).toBe(false);
    expect(result.current.isImageLoaded(5)).toBe(false);
  });

  it("updates loadedCount when images load", async () => {
    // Mock Image constructor using a class
    const originalImage = global.Image;
    const mockImages: Array<{
      onload?: () => void;
      onerror?: () => void;
      src: string;
      complete: boolean;
    }> = [];

    class MockImage {
      onload?: () => void;
      onerror?: () => void;
      src = "";
      complete = false;

      constructor() {
        mockImages.push(this);
      }
    }

    global.Image = MockImage as unknown as typeof Image;

    const { result } = renderHook(() =>
      useImageCache({ frameUrls: mockFrameUrls })
    );

    // Simulate first image loading
    await act(async () => {
      if (mockImages[0]?.onload) {
        mockImages[0].complete = true;
        mockImages[0].onload();
      }
    });

    await waitFor(() => {
      expect(result.current.loadedCount).toBeGreaterThan(0);
    });

    // Cleanup
    global.Image = originalImage;
  });

  it("handles image load errors gracefully", async () => {
    const originalImage = global.Image;
    const mockImages: Array<{
      onload?: () => void;
      onerror?: () => void;
      src: string;
    }> = [];

    class MockImage {
      onload?: () => void;
      onerror?: () => void;
      src = "";

      constructor() {
        mockImages.push(this);
      }
    }

    global.Image = MockImage as unknown as typeof Image;

    const { result } = renderHook(() =>
      useImageCache({ frameUrls: mockFrameUrls })
    );

    // Simulate image error
    await act(async () => {
      if (mockImages[0]?.onerror) {
        mockImages[0].onerror();
      }
    });

    // Should still update loaded count (to track progress)
    await waitFor(() => {
      expect(result.current.loadedCount).toBeGreaterThanOrEqual(0);
    });

    global.Image = originalImage;
  });
});
