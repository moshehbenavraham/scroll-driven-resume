/**
 * Unit tests for useViewportHeight hook.
 * Tests SSR safety, viewport height detection, and resize handling.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import {
  useViewportHeight,
  useViewportHeightCSS,
  useViewportHeightValues,
} from "@/hooks/useViewportHeight";

describe("useViewportHeight", () => {
  // Store original values
  const originalInnerHeight = window.innerHeight;
  let resizeHandler: (() => void) | null = null;
  let orientationHandler: (() => void) | null = null;
  let visualViewportResizeHandler: (() => void) | null = null;
  const originalAddEventListener = window.addEventListener;
  const originalRemoveEventListener = window.removeEventListener;

  // Mock visualViewport
  const mockVisualViewport = {
    height: 800,
    addEventListener: vi.fn((event: string, handler: EventListener) => {
      if (event === "resize") {
        visualViewportResizeHandler = handler as () => void;
      }
    }),
    removeEventListener: vi.fn(),
  };

  beforeEach(() => {
    // Mock addEventListener to capture handlers
    window.addEventListener = vi.fn((event: string, handler: EventListener) => {
      if (event === "resize") {
        resizeHandler = handler as () => void;
      }
      if (event === "orientationchange") {
        orientationHandler = handler as () => void;
      }
    }) as typeof window.addEventListener;

    window.removeEventListener = vi.fn() as typeof window.removeEventListener;

    // Default to desktop height
    Object.defineProperty(window, "innerHeight", {
      value: 900,
      writable: true,
      configurable: true,
    });

    // Add visualViewport mock
    Object.defineProperty(window, "visualViewport", {
      value: mockVisualViewport,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    // Restore originals
    Object.defineProperty(window, "innerHeight", {
      value: originalInnerHeight,
      writable: true,
      configurable: true,
    });
    window.addEventListener = originalAddEventListener;
    window.removeEventListener = originalRemoveEventListener;
    resizeHandler = null;
    orientationHandler = null;
    visualViewportResizeHandler = null;
    vi.clearAllMocks();
  });

  describe("useViewportHeight", () => {
    it("returns visualViewport height when available", () => {
      mockVisualViewport.height = 750;

      const { result } = renderHook(() => useViewportHeight());

      expect(result.current).toBe(750);
    });

    it("returns innerHeight when visualViewport is not available", () => {
      // Remove visualViewport
      Object.defineProperty(window, "visualViewport", {
        value: null,
        writable: true,
        configurable: true,
      });

      Object.defineProperty(window, "innerHeight", {
        value: 850,
        writable: true,
        configurable: true,
      });

      const { result } = renderHook(() => useViewportHeight());

      expect(result.current).toBe(850);
    });

    it("adds event listeners for resize and orientationchange", () => {
      renderHook(() => useViewportHeight());

      expect(window.addEventListener).toHaveBeenCalledWith(
        "resize",
        expect.any(Function)
      );
      expect(window.addEventListener).toHaveBeenCalledWith(
        "orientationchange",
        expect.any(Function)
      );
    });

    it("adds visualViewport resize listener when available", () => {
      renderHook(() => useViewportHeight());

      expect(mockVisualViewport.addEventListener).toHaveBeenCalledWith(
        "resize",
        expect.any(Function)
      );
    });

    it("removes event listeners on unmount", () => {
      const { unmount } = renderHook(() => useViewportHeight());

      unmount();

      expect(window.removeEventListener).toHaveBeenCalledWith(
        "resize",
        expect.any(Function)
      );
      expect(window.removeEventListener).toHaveBeenCalledWith(
        "orientationchange",
        expect.any(Function)
      );
      expect(mockVisualViewport.removeEventListener).toHaveBeenCalledWith(
        "resize",
        expect.any(Function)
      );
    });

    it("updates when visualViewport resizes", () => {
      mockVisualViewport.height = 800;

      const { result } = renderHook(() => useViewportHeight());

      expect(result.current).toBe(800);

      // Simulate viewport resize (e.g., keyboard appearing)
      act(() => {
        mockVisualViewport.height = 500;
        if (visualViewportResizeHandler) {
          visualViewportResizeHandler();
        }
      });

      expect(result.current).toBe(500);
    });

    it("updates when window resizes", () => {
      // Remove visualViewport to test window.innerHeight path
      Object.defineProperty(window, "visualViewport", {
        value: null,
        writable: true,
        configurable: true,
      });

      Object.defineProperty(window, "innerHeight", {
        value: 900,
        writable: true,
        configurable: true,
      });

      const { result } = renderHook(() => useViewportHeight());

      expect(result.current).toBe(900);

      // Simulate resize
      act(() => {
        Object.defineProperty(window, "innerHeight", {
          value: 700,
          writable: true,
          configurable: true,
        });
        if (resizeHandler) {
          resizeHandler();
        }
      });

      expect(result.current).toBe(700);
    });

    it("updates on orientation change", () => {
      // Remove visualViewport to test window.innerHeight path
      Object.defineProperty(window, "visualViewport", {
        value: null,
        writable: true,
        configurable: true,
      });

      Object.defineProperty(window, "innerHeight", {
        value: 900,
        writable: true,
        configurable: true,
      });

      const { result } = renderHook(() => useViewportHeight());

      expect(result.current).toBe(900);

      // Simulate orientation change
      act(() => {
        Object.defineProperty(window, "innerHeight", {
          value: 500,
          writable: true,
          configurable: true,
        });
        if (orientationHandler) {
          orientationHandler();
        }
      });

      expect(result.current).toBe(500);
    });
  });

  describe("useViewportHeightCSS", () => {
    it("returns height as CSS string", () => {
      mockVisualViewport.height = 800;

      const { result } = renderHook(() => useViewportHeightCSS());

      expect(result.current).toBe("800px");
    });
  });

  describe("useViewportHeightValues", () => {
    it("returns height, CSS string, and style object", () => {
      mockVisualViewport.height = 750;

      const { result } = renderHook(() => useViewportHeightValues());

      expect(result.current.height).toBe(750);
      expect(result.current.css).toBe("750px");
      expect(result.current.style).toEqual({ height: "750px" });
    });
  });
});
