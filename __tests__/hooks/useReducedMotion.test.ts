/**
 * Unit tests for useReducedMotion hook.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

describe("useReducedMotion", () => {
  // Store original matchMedia
  const originalMatchMedia = window.matchMedia;

  // Mock matchMedia implementation
  let mockMatchMedia: ReturnType<typeof vi.fn>;
  let mockMediaQueryList: {
    matches: boolean;
    media: string;
    onchange: null;
    addListener: () => void;
    removeListener: () => void;
    addEventListener: ReturnType<typeof vi.fn>;
    removeEventListener: ReturnType<typeof vi.fn>;
    dispatchEvent: () => boolean;
  };
  let changeHandler: (() => void) | null = null;

  beforeEach(() => {
    // Create mock media query list
    mockMediaQueryList = {
      matches: false,
      media: "(prefers-reduced-motion: reduce)",
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: vi.fn((event: string, handler: () => void) => {
        if (event === "change") {
          changeHandler = handler;
        }
      }),
      removeEventListener: vi.fn(),
      dispatchEvent: () => false,
    };

    mockMatchMedia = vi.fn(() => mockMediaQueryList);
    window.matchMedia = mockMatchMedia as unknown as typeof window.matchMedia;
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    changeHandler = null;
    vi.clearAllMocks();
  });

  it("returns false by default (no preference)", () => {
    mockMediaQueryList.matches = false;

    const { result } = renderHook(() => useReducedMotion());

    expect(result.current).toBe(false);
  });

  it("returns true when media query matches", () => {
    mockMediaQueryList.matches = true;

    const { result } = renderHook(() => useReducedMotion());

    expect(result.current).toBe(true);
  });

  it("calls matchMedia with correct query", () => {
    renderHook(() => useReducedMotion());

    expect(mockMatchMedia).toHaveBeenCalledWith(
      "(prefers-reduced-motion: reduce)"
    );
  });

  it("adds event listener for changes", () => {
    renderHook(() => useReducedMotion());

    expect(mockMediaQueryList.addEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function)
    );
  });

  it("removes event listener on unmount", () => {
    const { unmount } = renderHook(() => useReducedMotion());

    unmount();

    expect(mockMediaQueryList.removeEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function)
    );
  });

  it("updates when media query changes", () => {
    mockMediaQueryList.matches = false;

    const { result } = renderHook(() => useReducedMotion());

    expect(result.current).toBe(false);

    // Simulate media query change - update matches and trigger callback
    act(() => {
      mockMediaQueryList.matches = true;
      if (changeHandler) {
        changeHandler();
      }
    });

    expect(result.current).toBe(true);
  });

  it("handles change from true to false", () => {
    mockMediaQueryList.matches = true;

    const { result } = renderHook(() => useReducedMotion());

    expect(result.current).toBe(true);

    // Simulate media query change - update matches and trigger callback
    act(() => {
      mockMediaQueryList.matches = false;
      if (changeHandler) {
        changeHandler();
      }
    });

    expect(result.current).toBe(false);
  });
});
