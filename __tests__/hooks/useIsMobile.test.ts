/**
 * Unit tests for useIsMobile hook.
 * Tests SSR safety, breakpoint detection, and resize handling.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useIsMobile } from "@/hooks/useIsMobile";

describe("useIsMobile", () => {
  // Store original innerWidth and addEventListener
  const originalInnerWidth = window.innerWidth;
  let resizeHandler: (() => void) | null = null;
  const originalAddEventListener = window.addEventListener;
  const originalRemoveEventListener = window.removeEventListener;

  beforeEach(() => {
    // Mock addEventListener to capture resize handler
    window.addEventListener = vi.fn((event: string, handler: EventListener) => {
      if (event === "resize") {
        resizeHandler = handler as () => void;
      }
    }) as typeof window.addEventListener;

    window.removeEventListener = vi.fn() as typeof window.removeEventListener;

    // Default to desktop width
    Object.defineProperty(window, "innerWidth", {
      value: 1024,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    // Restore originals
    Object.defineProperty(window, "innerWidth", {
      value: originalInnerWidth,
      writable: true,
      configurable: true,
    });
    window.addEventListener = originalAddEventListener;
    window.removeEventListener = originalRemoveEventListener;
    resizeHandler = null;
    vi.clearAllMocks();
  });

  it("returns false when viewport width >= 768px", () => {
    Object.defineProperty(window, "innerWidth", {
      value: 1024,
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);
  });

  it("returns true when viewport width < 768px", () => {
    Object.defineProperty(window, "innerWidth", {
      value: 500,
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(true);
  });

  it("returns false at exactly 768px (breakpoint boundary)", () => {
    Object.defineProperty(window, "innerWidth", {
      value: 768,
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);
  });

  it("returns true at 767px (just below breakpoint)", () => {
    Object.defineProperty(window, "innerWidth", {
      value: 767,
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(true);
  });

  it("adds resize event listener", () => {
    renderHook(() => useIsMobile());

    expect(window.addEventListener).toHaveBeenCalledWith(
      "resize",
      expect.any(Function)
    );
  });

  it("removes resize event listener on unmount", () => {
    const { unmount } = renderHook(() => useIsMobile());

    unmount();

    expect(window.removeEventListener).toHaveBeenCalledWith(
      "resize",
      expect.any(Function)
    );
  });

  it("updates when window resizes to mobile", () => {
    Object.defineProperty(window, "innerWidth", {
      value: 1024,
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);

    // Simulate resize to mobile
    act(() => {
      Object.defineProperty(window, "innerWidth", {
        value: 500,
        writable: true,
        configurable: true,
      });
      if (resizeHandler) {
        resizeHandler();
      }
    });

    expect(result.current).toBe(true);
  });

  it("updates when window resizes to desktop", () => {
    Object.defineProperty(window, "innerWidth", {
      value: 500,
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(true);

    // Simulate resize to desktop
    act(() => {
      Object.defineProperty(window, "innerWidth", {
        value: 1024,
        writable: true,
        configurable: true,
      });
      if (resizeHandler) {
        resizeHandler();
      }
    });

    expect(result.current).toBe(false);
  });
});
