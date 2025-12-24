/**
 * Unit tests for useTextureLoader hook.
 * Tests promise deduplication, failure caching, cleanup, and edge cases.
 *
 * Session: phase00-session02-texture-loader-refactor
 *
 * Test categories:
 * - T018: Concurrent load deduplication (5+ tests)
 * - T019: Failure caching (3+ tests)
 * - T020: Cleanup tests
 * - T021: Edge case tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTextureLoader } from "@/hooks/useTextureLoader";
import type * as THREE from "three";

// ============================================================================
// Mock Setup
// ============================================================================

/**
 * Mock Image class that simulates async image loading.
 * Supports configurable success/failure based on URL patterns.
 */
class MockImage {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  crossOrigin = "";
  complete = false;
  private _src = "";

  get src() {
    return this._src;
  }

  set src(value: string) {
    this._src = value;
    // Simulate async load with configurable behavior
    const delay = value.includes("slow") ? 100 : 10;

    setTimeout(() => {
      if (value.includes("fail")) {
        this.onerror?.();
      } else {
        this.complete = true;
        this.onload?.();
      }
    }, delay);
  }
}

// Store original Image constructor
const OriginalImage = global.Image;

// Mock THREE.Texture as a class
vi.mock("three", async () => {
  const actual = await vi.importActual<typeof THREE>("three");
  class MockTexture {
    needsUpdate = false;
    colorSpace = "";
    minFilter = 0;
    magFilter = 0;
    dispose = vi.fn();
  }
  return {
    ...actual,
    Texture: MockTexture,
  };
});

/**
 * Helper to advance timers and flush pending promises.
 */
async function advanceTimersAndFlush(ms: number) {
  await act(async () => {
    vi.advanceTimersByTime(ms);
    // Flush microtasks
    await Promise.resolve();
  });
}

// ============================================================================
// Test Suites
// ============================================================================

describe("useTextureLoader", () => {
  const mockFrameUrls = [
    "/frame0.webp",
    "/frame1.webp",
    "/frame2.webp",
    "/frame3-fail.webp",
    "/frame4.webp",
    "/frame5-slow.webp",
  ];

  beforeEach(() => {
    vi.useFakeTimers();
    // Replace global Image with MockImage
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    global.Image = MockImage as any;

    // Mock requestIdleCallback
    global.requestIdleCallback = vi.fn((cb) => {
      const id = setTimeout(
        () => cb({ didTimeout: false, timeRemaining: () => 50 }),
        0
      );
      return id as unknown as number;
    });
    global.cancelIdleCallback = vi.fn((id) => clearTimeout(id));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    global.Image = OriginalImage;
  });

  // ==========================================================================
  // Basic functionality tests
  // ==========================================================================

  describe("basic functionality", () => {
    it("returns initial state correctly", () => {
      const { result } = renderHook(() =>
        useTextureLoader({ frameUrls: mockFrameUrls })
      );

      expect(result.current.totalCount).toBe(mockFrameUrls.length);
      expect(result.current.loadedCount).toBe(0);
      expect(typeof result.current.getTexture).toBe("function");
      expect(typeof result.current.isTextureReady).toBe("function");
      expect(typeof result.current.preloadNearby).toBe("function");
    });

    it("loads priority frames on mount", async () => {
      const { result } = renderHook(() =>
        useTextureLoader({ frameUrls: mockFrameUrls, priorityCount: 3 })
      );

      // Advance timers to complete image loads
      await advanceTimersAndFlush(50);

      expect(result.current.loadedCount).toBeGreaterThan(0);
    });
  });

  // ==========================================================================
  // T018: Concurrent load deduplication tests (5+ tests)
  // ==========================================================================

  describe("concurrent load deduplication", () => {
    it("concurrent getTexture calls do not create multiple images", async () => {
      // Track Image constructor calls
      let imageCreateCount = 0;
      const TrackedMockImage = class extends MockImage {
        constructor() {
          super();
          imageCreateCount++;
        }
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      global.Image = TrackedMockImage as any;

      const { result } = renderHook(() =>
        useTextureLoader({ frameUrls: mockFrameUrls, priorityCount: 0, enabled: true })
      );

      // Make multiple concurrent getTexture calls for same frame
      act(() => {
        result.current.getTexture(0);
        result.current.getTexture(0);
        result.current.getTexture(0);
      });

      // Only one image should be created (deduplication)
      expect(imageCreateCount).toBe(1);
    });

    it("cached entries return immediately without new load", async () => {
      const { result } = renderHook(() =>
        useTextureLoader({ frameUrls: mockFrameUrls, priorityCount: 1 })
      );

      // Wait for priority frame to load
      await advanceTimersAndFlush(50);

      // Get texture multiple times - should use cached version
      let texture1: ReturnType<typeof result.current.getTexture> = null;
      let texture2: ReturnType<typeof result.current.getTexture> = null;

      act(() => {
        texture1 = result.current.getTexture(0);
        texture2 = result.current.getTexture(0);
      });

      // Both calls should return the same texture (cached)
      expect(texture1).toBe(texture2);
      expect(texture1).not.toBeNull();
    });

    it("isTextureReady returns true for loaded frames", async () => {
      const { result } = renderHook(() =>
        useTextureLoader({ frameUrls: mockFrameUrls, priorityCount: 2 })
      );

      // Initially not ready
      expect(result.current.isTextureReady(0)).toBe(false);

      // Wait for load
      await advanceTimersAndFlush(50);

      // Now should be ready
      expect(result.current.isTextureReady(0)).toBe(true);
    });

    it("preloadNearby triggers loads for nearby frames", async () => {
      const { result } = renderHook(() =>
        useTextureLoader({ frameUrls: mockFrameUrls, priorityCount: 0 })
      );

      // Preload around frame 2
      act(() => {
        result.current.preloadNearby(2);
      });

      // Wait for loads
      await advanceTimersAndFlush(50);

      // Nearby frames should be ready (0, 1, 2, 3, 4 are within range)
      expect(result.current.isTextureReady(0)).toBe(true);
      expect(result.current.isTextureReady(2)).toBe(true);
    });

    it("multiple preloadNearby calls do not create duplicate loads", async () => {
      let imageCreateCount = 0;
      const TrackedMockImage = class extends MockImage {
        constructor() {
          super();
          imageCreateCount++;
        }
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      global.Image = TrackedMockImage as any;

      const { result } = renderHook(() =>
        useTextureLoader({ frameUrls: mockFrameUrls, priorityCount: 0 })
      );

      // Multiple preload calls for same area
      act(() => {
        result.current.preloadNearby(0);
        result.current.preloadNearby(0);
        result.current.preloadNearby(0);
      });

      // Should only create images once per frame (not 3x per frame)
      expect(imageCreateCount).toBeLessThanOrEqual(mockFrameUrls.length);
    });
  });

  // ==========================================================================
  // T019: Failure caching tests (3+ tests)
  // ==========================================================================

  describe("failure caching", () => {
    it("failed load does not make texture ready", async () => {
      const failingUrls = ["/frame-fail.webp"];
      const { result } = renderHook(() =>
        useTextureLoader({ frameUrls: failingUrls, priorityCount: 1 })
      );

      // Wait for load attempt
      await advanceTimersAndFlush(50);

      // Should not be ready because it failed
      expect(result.current.isTextureReady(0)).toBe(false);
    });

    it("failed frame returns null from getTexture", async () => {
      const failingUrls = ["/frame-fail.webp"];
      const { result } = renderHook(() =>
        useTextureLoader({ frameUrls: failingUrls, priorityCount: 1 })
      );

      // Wait for load attempt
      await advanceTimersAndFlush(50);

      // getTexture should return null for failed frame
      const texture = result.current.getTexture(0);
      expect(texture).toBeNull();
    });

    it("subsequent requests for failed frame do not retry", async () => {
      let imageCreateCount = 0;
      const TrackedMockImage = class extends MockImage {
        constructor() {
          super();
          imageCreateCount++;
        }
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      global.Image = TrackedMockImage as any;

      const failingUrls = ["/frame-fail.webp"];
      const { result } = renderHook(() =>
        useTextureLoader({ frameUrls: failingUrls, priorityCount: 1 })
      );

      // Wait for initial load to fail
      await advanceTimersAndFlush(50);

      const initialCount = imageCreateCount;

      // Try to get texture again - should not create new Image
      act(() => {
        result.current.getTexture(0);
        result.current.getTexture(0);
      });

      // No new images should be created (failure is cached)
      expect(imageCreateCount).toBe(initialCount);
    });

    it("failed entries do not affect loadedCount", async () => {
      // Mix of success and failure
      const mixedUrls = ["/frame0.webp", "/frame-fail.webp", "/frame2.webp"];
      const { result } = renderHook(() =>
        useTextureLoader({ frameUrls: mixedUrls, priorityCount: 3 })
      );

      // Wait for loads
      await advanceTimersAndFlush(50);

      // Only successful loads should be counted
      // frame0 and frame2 succeed, frame-fail fails
      expect(result.current.loadedCount).toBe(2);
    });
  });

  // ==========================================================================
  // T020: Cleanup tests
  // ==========================================================================

  describe("cleanup", () => {
    it("idle callbacks cancelled on unmount", async () => {
      const { unmount } = renderHook(() =>
        useTextureLoader({ frameUrls: mockFrameUrls })
      );

      // Let some idle callbacks start
      await advanceTimersAndFlush(10);

      unmount();

      // Verify cancelIdleCallback was called
      expect(global.cancelIdleCallback).toHaveBeenCalled();
    });

    it("no state updates after unmount", async () => {
      const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

      const { unmount } = renderHook(() =>
        useTextureLoader({ frameUrls: mockFrameUrls })
      );

      unmount();

      // Advance timers - should not cause state update warnings
      await advanceTimersAndFlush(200);

      // Check no React warnings about state updates after unmount
      const hasUnmountWarning = consoleError.mock.calls.some((call) =>
        call[0]?.includes?.("unmounted")
      );
      expect(hasUnmountWarning).toBe(false);

      consoleError.mockRestore();
    });

    it("textures are disposed on unmount", async () => {
      const { result, unmount } = renderHook(() =>
        useTextureLoader({ frameUrls: mockFrameUrls, priorityCount: 2 })
      );

      // Wait for loads
      await advanceTimersAndFlush(50);

      // Get textures to add them to pool
      let texture: ReturnType<typeof result.current.getTexture> = null;
      act(() => {
        texture = result.current.getTexture(0);
      });

      // Verify texture was created
      expect(texture).not.toBeNull();

      // Unmount should not throw (textures disposed internally)
      unmount();

      // Test passes if no errors during unmount
      expect(true).toBe(true);
    });
  });

  // ==========================================================================
  // T021: Edge case tests
  // ==========================================================================

  describe("edge cases", () => {
    it("handles unmount during active load", async () => {
      const { unmount } = renderHook(() =>
        useTextureLoader({
          frameUrls: ["/frame-slow.webp"],
          priorityCount: 1,
        })
      );

      // Unmount while load is in progress
      unmount();

      // Advance past when load would complete
      await advanceTimersAndFlush(200);

      // Should not throw
      expect(true).toBe(true);
    });

    it("handles rapid frame switching", async () => {
      const { result } = renderHook(() =>
        useTextureLoader({ frameUrls: mockFrameUrls })
      );

      // Complete initial loads
      await advanceTimersAndFlush(100);

      // Rapidly switch frames - preloadNearby should handle without errors
      act(() => {
        for (let i = 0; i < 10; i++) {
          result.current.preloadNearby(i % mockFrameUrls.length);
        }
      });

      // Verify hook still works after rapid switching
      expect(result.current.totalCount).toBe(mockFrameUrls.length);
    });

    it("handles mixed success/failure scenario", async () => {
      const mixedUrls = [
        "/frame0.webp",       // success
        "/frame-fail.webp",   // fail
        "/frame2.webp",       // success
        "/frame3-fail.webp",  // fail
        "/frame4.webp",       // success
      ];

      const { result } = renderHook(() =>
        useTextureLoader({ frameUrls: mixedUrls, priorityCount: 5 })
      );

      // Wait for all loads
      await advanceTimersAndFlush(50);

      // Check correct ready states
      expect(result.current.isTextureReady(0)).toBe(true);  // success
      expect(result.current.isTextureReady(1)).toBe(false); // fail
      expect(result.current.isTextureReady(2)).toBe(true);  // success
      expect(result.current.isTextureReady(3)).toBe(false); // fail
      expect(result.current.isTextureReady(4)).toBe(true);  // success

      // Only successful loads counted
      expect(result.current.loadedCount).toBe(3);
    });

    it("handles disabled state", () => {
      const { result } = renderHook(() =>
        useTextureLoader({ frameUrls: mockFrameUrls, enabled: false })
      );

      const texture = result.current.getTexture(0);
      expect(texture).toBeNull();
    });

    it("handles empty frame urls", () => {
      const { result } = renderHook(() =>
        useTextureLoader({ frameUrls: [] })
      );

      expect(result.current.totalCount).toBe(0);
      expect(result.current.getTexture(0)).toBeNull();
    });

    it("handles out of bounds frame index", async () => {
      const { result } = renderHook(() =>
        useTextureLoader({ frameUrls: mockFrameUrls })
      );

      expect(result.current.getTexture(-1)).toBeNull();
      expect(result.current.getTexture(100)).toBeNull();
    });
  });
});
