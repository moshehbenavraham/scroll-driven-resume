/**
 * Unit tests for useWebGLCapabilities hook.
 * Tests GPU detection, quality tiers, mobile detection, and reduced motion.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import {
  useWebGLCapabilities,
  _resetWebGLCache,
} from "@/hooks/useWebGLCapabilities";

describe("useWebGLCapabilities", () => {
  // Store originals
  const originalMatchMedia = window.matchMedia;
  const originalInnerWidth = window.innerWidth;

  // Mock matchMedia for reduced motion
  let mockReducedMotionMatches = false;
  let mockMatchMedia: ReturnType<typeof vi.fn>;

  // Mock WebGL context
  let mockWebGLContext: Record<string, unknown> | null = null;

  beforeEach(() => {
    // Reset WebGL cache before each test
    _resetWebGLCache();

    // Reset mocks
    mockReducedMotionMatches = false;

    // Mock matchMedia
    mockMatchMedia = vi.fn((query: string) => ({
      matches:
        query === "(prefers-reduced-motion: reduce)"
          ? mockReducedMotionMatches
          : false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: () => false,
    }));
    window.matchMedia = mockMatchMedia as unknown as typeof window.matchMedia;

    // Mock canvas getContext for WebGL detection
    mockWebGLContext = {
      getParameter: vi.fn((param: number) => {
        // MAX_TEXTURE_SIZE
        if (param === 3379) {
          return 16384;
        }
        // MAX_VERTEX_UNIFORM_VECTORS
        if (param === 36347) {
          return 1024;
        }
        // VENDOR (regular and debug info)
        if (param === 7936 || param === 37445) {
          return "WebKit";
        }
        // RENDERER (regular and debug info)
        if (param === 7937 || param === 37446) {
          return "WebKit WebGL";
        }
        return null;
      }),
      getExtension: vi.fn(() => ({
        UNMASKED_VENDOR_WEBGL: 37445,
        UNMASKED_RENDERER_WEBGL: 37446,
      })),
      MAX_TEXTURE_SIZE: 3379,
      MAX_VERTEX_UNIFORM_VECTORS: 36347,
      VENDOR: 7936,
      RENDERER: 7937,
    };

    HTMLCanvasElement.prototype.getContext = vi.fn((contextType: string) => {
      if (contextType === "webgl2" || contextType === "webgl") {
        return mockWebGLContext;
      }
      return null;
    }) as unknown as typeof HTMLCanvasElement.prototype.getContext;

    // Set desktop viewport by default
    Object.defineProperty(window, "innerWidth", {
      value: 1024,
      writable: true,
    });
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    Object.defineProperty(window, "innerWidth", {
      value: originalInnerWidth,
      writable: true,
    });
    vi.clearAllMocks();
  });

  it("returns enabled state when WebGL is available", () => {
    const { result } = renderHook(() => useWebGLCapabilities());

    expect(result.current.isEnabled).toBe(true);
    expect(result.current.disableReason).toBeUndefined();
  });

  it("returns disabled state when WebGL is unavailable", () => {
    mockWebGLContext = null;

    const { result } = renderHook(() => useWebGLCapabilities());

    expect(result.current.isEnabled).toBe(false);
    expect(result.current.disableReason).toBe("no-webgl");
  });

  it("detects WebGL2 support", () => {
    const { result } = renderHook(() => useWebGLCapabilities());

    expect(result.current.support.webgl2).toBe(true);
  });

  it("returns disabled state on mobile viewport", () => {
    Object.defineProperty(window, "innerWidth", {
      value: 600,
      writable: true,
    });

    const { result } = renderHook(() => useWebGLCapabilities());

    expect(result.current.isEnabled).toBe(false);
    expect(result.current.disableReason).toBe("mobile-viewport");
  });

  it("returns disabled state when reduced motion is preferred", () => {
    mockReducedMotionMatches = true;

    const { result } = renderHook(() => useWebGLCapabilities());

    expect(result.current.isEnabled).toBe(false);
    expect(result.current.disableReason).toBe("reduced-motion");
  });

  it("provides quality settings based on tier", () => {
    const { result } = renderHook(() => useWebGLCapabilities());

    expect(result.current.quality).toBeDefined();
    expect(result.current.quality.particleCount).toBeGreaterThan(0);
    expect(typeof result.current.quality.enableShaders).toBe("boolean");
    expect(result.current.quality.opacityMultiplier).toBeGreaterThan(0);
  });

  it("detects high-end GPU from renderer string", () => {
    mockWebGLContext = {
      ...mockWebGLContext,
      getParameter: vi.fn((param: number) => {
        if (param === 3379) {
          return 16384;
        }
        if (param === 36347) {
          return 1024;
        }
        if (param === 37445) {
          return "Apple";
        }
        if (param === 37446) {
          return "Apple M1 Pro";
        }
        if (param === 7936) {
          return "Apple";
        }
        if (param === 7937) {
          return "Apple M1 Pro";
        }
        return null;
      }),
    };

    const { result } = renderHook(() => useWebGLCapabilities());

    expect(result.current.tier).toBe("high");
    expect(result.current.quality.particleCount).toBe(500);
  });

  it("detects low-end GPU from renderer string", () => {
    mockWebGLContext = {
      ...mockWebGLContext,
      getParameter: vi.fn((param: number) => {
        if (param === 3379) {
          return 4096;
        }
        if (param === 36347) {
          return 256;
        }
        if (param === 37445) {
          return "Intel";
        }
        if (param === 37446) {
          return "Intel HD Graphics 4000";
        }
        if (param === 7936) {
          return "Intel";
        }
        if (param === 7937) {
          return "Intel HD Graphics 4000";
        }
        return null;
      }),
    };

    const { result } = renderHook(() => useWebGLCapabilities());

    expect(result.current.tier).toBe("low");
    expect(result.current.quality.particleCount).toBe(100);
  });

  it("updates mobile state on window resize", async () => {
    // Use fake timers to control debounce
    vi.useFakeTimers();

    const { result } = renderHook(() => useWebGLCapabilities());

    expect(result.current.isEnabled).toBe(true);

    // Simulate resize to mobile
    await act(async () => {
      Object.defineProperty(window, "innerWidth", {
        value: 600,
        writable: true,
      });
      window.dispatchEvent(new Event("resize"));
      // Advance past the 150ms debounce in subscribeToMobile
      vi.advanceTimersByTime(200);
    });

    expect(result.current.isEnabled).toBe(false);
    expect(result.current.disableReason).toBe("mobile-viewport");

    vi.useRealTimers();
  });

  it("provides support information", () => {
    const { result } = renderHook(() => useWebGLCapabilities());

    expect(result.current.support).toBeDefined();
    expect(result.current.support.webgl1).toBe(true);
    expect(result.current.support.maxTextureSize).toBeGreaterThan(0);
  });

  it("returns unsupported tier when no WebGL", () => {
    mockWebGLContext = null;

    const { result } = renderHook(() => useWebGLCapabilities());

    expect(result.current.tier).toBe("unsupported");
    expect(result.current.quality.particleCount).toBe(0);
  });
});
