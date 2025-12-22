/**
 * Unit tests for useCanvasRenderer hook.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCanvasRenderer } from "@/hooks/useCanvasRenderer";

describe("useCanvasRenderer", () => {
  let mockCanvas: HTMLCanvasElement;
  let mockContext: CanvasRenderingContext2D;
  let rafCallback: FrameRequestCallback | null = null;

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock canvas and context
    mockContext = {
      clearRect: vi.fn(),
      drawImage: vi.fn(),
      scale: vi.fn(),
      canvas: {
        width: 1920,
        height: 1080,
      },
    } as unknown as CanvasRenderingContext2D;

    mockCanvas = {
      getContext: vi.fn().mockReturnValue(mockContext),
      width: 1920,
      height: 1080,
    } as unknown as HTMLCanvasElement;

    // Mock requestAnimationFrame
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      rafCallback = cb;
      return 1;
    });
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    rafCallback = null;
  });

  it("returns initial lastDrawnFrame of -1", () => {
    const canvasRef = { current: mockCanvas };
    const getImage = vi.fn().mockReturnValue(null);

    const { result } = renderHook(() =>
      useCanvasRenderer({
        canvasRef,
        currentFrame: 0,
        getImage,
      })
    );

    expect(result.current.lastDrawnFrame).toBe(-1);
  });

  it("draws frame when image is available", () => {
    const canvasRef = { current: mockCanvas };
    const mockImage = {
      naturalWidth: 1920,
      naturalHeight: 1080,
      complete: true,
    } as HTMLImageElement;
    const getImage = vi.fn().mockReturnValue(mockImage);

    renderHook(() =>
      useCanvasRenderer({
        canvasRef,
        currentFrame: 5,
        getImage,
      })
    );

    // Trigger the RAF callback
    if (rafCallback) {
      act(() => {
        rafCallback!(performance.now());
      });
    }

    expect(mockContext.clearRect).toHaveBeenCalled();
    expect(mockContext.drawImage).toHaveBeenCalledWith(
      mockImage,
      expect.any(Number),
      expect.any(Number),
      expect.any(Number),
      expect.any(Number),
      expect.any(Number),
      expect.any(Number),
      expect.any(Number),
      expect.any(Number)
    );
  });

  it("does not draw when disabled", () => {
    const canvasRef = { current: mockCanvas };
    const mockImage = {
      naturalWidth: 1920,
      naturalHeight: 1080,
      complete: true,
    } as HTMLImageElement;
    const getImage = vi.fn().mockReturnValue(mockImage);

    renderHook(() =>
      useCanvasRenderer({
        canvasRef,
        currentFrame: 5,
        getImage,
        enabled: false,
      })
    );

    expect(mockContext.drawImage).not.toHaveBeenCalled();
  });

  it("does not draw when image is not complete", () => {
    const canvasRef = { current: mockCanvas };
    const mockImage = {
      naturalWidth: 1920,
      naturalHeight: 1080,
      complete: false, // Image not loaded
    } as HTMLImageElement;
    const getImage = vi.fn().mockReturnValue(mockImage);

    renderHook(() =>
      useCanvasRenderer({
        canvasRef,
        currentFrame: 5,
        getImage,
      })
    );

    expect(mockContext.drawImage).not.toHaveBeenCalled();
  });

  it("does not draw when canvas ref is null", () => {
    const canvasRef = { current: null };
    const getImage = vi.fn();

    renderHook(() =>
      useCanvasRenderer({
        canvasRef,
        currentFrame: 5,
        getImage,
      })
    );

    expect(getImage).not.toHaveBeenCalled();
  });

  it("updates lastDrawnFrame after successful draw", () => {
    const canvasRef = { current: mockCanvas };
    const mockImage = {
      naturalWidth: 1920,
      naturalHeight: 1080,
      complete: true,
    } as HTMLImageElement;
    const getImage = vi.fn().mockReturnValue(mockImage);

    const { result } = renderHook(() =>
      useCanvasRenderer({
        canvasRef,
        currentFrame: 10,
        getImage,
      })
    );

    // Trigger the RAF callback
    if (rafCallback) {
      act(() => {
        rafCallback!(performance.now());
      });
    }

    expect(result.current.lastDrawnFrame).toBe(10);
  });

  it("skips draw when frame has not changed", () => {
    const canvasRef = { current: mockCanvas };
    const mockImage = {
      naturalWidth: 1920,
      naturalHeight: 1080,
      complete: true,
    } as HTMLImageElement;
    const getImage = vi.fn().mockReturnValue(mockImage);

    const { rerender } = renderHook(
      ({ frame }) =>
        useCanvasRenderer({
          canvasRef,
          currentFrame: frame,
          getImage,
        }),
      { initialProps: { frame: 5 } }
    );

    // Trigger initial draw
    if (rafCallback) {
      act(() => {
        rafCallback!(performance.now());
      });
    }

    vi.clearAllMocks();

    // Rerender with same frame
    rerender({ frame: 5 });

    // Should not schedule new draw
    expect(window.requestAnimationFrame).not.toHaveBeenCalled();
  });

  it("cancels pending RAF on unmount", () => {
    const canvasRef = { current: mockCanvas };
    const mockImage = {
      naturalWidth: 1920,
      naturalHeight: 1080,
      complete: true,
    } as HTMLImageElement;
    const getImage = vi.fn().mockReturnValue(mockImage);

    const { unmount } = renderHook(() =>
      useCanvasRenderer({
        canvasRef,
        currentFrame: 5,
        getImage,
      })
    );

    // RAF should have been scheduled
    expect(window.requestAnimationFrame).toHaveBeenCalled();

    unmount();

    expect(window.cancelAnimationFrame).toHaveBeenCalled();
  });
});
