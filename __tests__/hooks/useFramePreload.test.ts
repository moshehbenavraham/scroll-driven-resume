/**
 * Unit tests for useFramePreload hook.
 * Tests error handling, retry logic, timeout, and cleanup functionality.
 *
 * T017: Test file setup with MockImage class
 * T018: Basic error handling tests
 * T019: Retry logic tests
 * T020: Timeout and threshold tests
 * T021: Cleanup and edge case tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFramePreload } from "@/hooks/useFramePreload";

// ============================================================================
// MockImage Class (T017)
// ============================================================================

/**
 * Mock Image class that simulates async image loading.
 * Supports configurable success/failure based on URL patterns.
 */
class MockImage {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  crossOrigin = "";
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
        this.onload?.();
      }
    }, delay);
  }
}

// Store original Image constructor
const OriginalImage = global.Image;

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

describe("useFramePreload", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Replace global Image with MockImage
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    global.Image = MockImage as any;

    // Mock requestIdleCallback
    global.requestIdleCallback = vi.fn((cb) => {
      const id = setTimeout(() => cb({ didTimeout: false, timeRemaining: () => 50 }), 0);
      return id as unknown as number;
    });
    global.cancelIdleCallback = vi.fn((id) => clearTimeout(id));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    global.Image = OriginalImage;
  });

  // ============================================================================
  // Basic Error Handling Tests (T018)
  // ============================================================================

  describe("basic error handling", () => {
    it("reports error when frame fails", async () => {
      const onError = vi.fn();

      const frames = [
        "http://example.com/frame1.webp",
        "http://example.com/fail-frame2.webp",
        "http://example.com/frame3.webp",
      ];

      const { result } = renderHook(() =>
        useFramePreload({
          frames,
          onError,
          priorityCount: 3,
        })
      );

      act(() => {
        result.current.startPreload();
      });

      // Advance timers to allow image loads
      await advanceTimersAndFlush(50);

      // Error should be reported for failing frame
      expect(onError).toHaveBeenCalledWith(
        expect.stringContaining("fail-frame2"),
        expect.any(Error)
      );

      // Successful frames should be counted
      expect(result.current.loadedCount).toBe(2);
    });

    it("tracks successful loads separately from failed loads", async () => {
      const frames = [
        "http://example.com/frame1.webp",
        "http://example.com/fail-frame2.webp",
        "http://example.com/frame3.webp",
        "http://example.com/fail-frame4.webp",
      ];

      const { result } = renderHook(() =>
        useFramePreload({
          frames,
          priorityCount: 4,
        })
      );

      act(() => {
        result.current.startPreload();
      });

      await advanceTimersAndFlush(50);

      // Only successful frames should be in loadedCount
      expect(result.current.loadedCount).toBe(2);
      expect(result.current.totalCount).toBe(4);
      // Progress should reflect successful loads
      expect(result.current.progress).toBe(50);
    });

    it("maintains backward compatibility with existing API", async () => {
      const onProgress = vi.fn();
      const onComplete = vi.fn();

      const frames = [
        "http://example.com/frame1.webp",
        "http://example.com/frame2.webp",
      ];

      const { result } = renderHook(() =>
        useFramePreload({
          frames,
          onProgress,
          onComplete,
          priorityCount: 2,
        })
      );

      // Check initial state
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isComplete).toBe(false);
      expect(result.current.progress).toBe(0);
      expect(result.current.loadedCount).toBe(0);
      expect(result.current.totalCount).toBe(2);
      expect(typeof result.current.startPreload).toBe("function");

      act(() => {
        result.current.startPreload();
      });

      // Advance timers for loads
      await advanceTimersAndFlush(50);

      // All frames succeed
      expect(result.current.loadedCount).toBe(2);
      expect(onProgress).toHaveBeenCalled();

      // Advance for completion callback
      await advanceTimersAndFlush(10);

      expect(onComplete).toHaveBeenCalled();
      expect(result.current.isComplete).toBe(true);
    });
  });

  // ============================================================================
  // Retry Logic Tests (T019)
  // ============================================================================

  describe("retry logic", () => {
    it("succeeds on retry after first attempt fails", async () => {
      // Track retry attempts
      let failCount = 0;
      const maxFailures = 1;

      // Custom MockImage that fails first attempt then succeeds
      class RetryMockImage {
        onload: (() => void) | null = null;
        onerror: (() => void) | null = null;
        crossOrigin = "";
        private _src = "";

        get src() {
          return this._src;
        }

        set src(value: string) {
          this._src = value;
          setTimeout(() => {
            if (value.includes("retry-test") && failCount < maxFailures) {
              failCount++;
              this.onerror?.();
            } else {
              this.onload?.();
            }
          }, 10);
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      global.Image = RetryMockImage as any;

      const frames = [
        "http://example.com/retry-test-frame.webp",
        "http://example.com/frame2.webp",
      ];

      const { result } = renderHook(() =>
        useFramePreload({
          frames,
          priorityCount: 2,
        })
      );

      act(() => {
        result.current.startPreload();
      });

      // Initial load (first frame fails, second succeeds)
      await advanceTimersAndFlush(50);

      // One frame succeeded
      expect(result.current.loadedCount).toBe(1);

      // Advance past first retry delay (1000ms) + load time
      await advanceTimersAndFlush(1100);

      // After retry succeeds, count should be 2
      expect(result.current.loadedCount).toBe(2);
    });

    it("exhausts max retries (3) then reports final error", async () => {
      const onError = vi.fn();

      const frames = [
        "http://example.com/fail-always.webp",
      ];

      const { result } = renderHook(() =>
        useFramePreload({
          frames,
          onError,
          priorityCount: 1,
        })
      );

      act(() => {
        result.current.startPreload();
      });

      // Initial failure
      await advanceTimersAndFlush(50);
      expect(onError).toHaveBeenCalledTimes(1);

      // Retry 1 (1s delay)
      await advanceTimersAndFlush(1100);

      // Retry 2 (2s delay)
      await advanceTimersAndFlush(2100);

      // Retry 3 (4s delay) - final retry
      await advanceTimersAndFlush(4100);

      // Should report final error after max retries
      expect(onError).toHaveBeenLastCalledWith(
        expect.stringContaining("fail-always"),
        expect.objectContaining({ message: expect.stringContaining("3 retries") })
      );
    });

    it("schedules retries with exponential backoff", async () => {
      const onError = vi.fn();

      const frames = ["http://example.com/fail-backoff.webp"];

      renderHook(() =>
        useFramePreload({
          frames,
          onError,
          priorityCount: 1,
        })
      ).result.current.startPreload();

      // Initial failure
      await advanceTimersAndFlush(50);
      const initialErrorCount = onError.mock.calls.length;
      expect(initialErrorCount).toBe(1);

      // Before 1s delay - no retry yet
      await advanceTimersAndFlush(900);
      expect(onError.mock.calls.length).toBe(1);

      // After 1s delay + load time - first retry fires
      await advanceTimersAndFlush(150);
      // No new error call for retry failure until it completes

      // Continue advancing for remaining retries
      await advanceTimersAndFlush(2100);
      await advanceTimersAndFlush(4100);

      // Should have final error with retry message
      expect(onError).toHaveBeenLastCalledWith(
        expect.any(String),
        expect.objectContaining({ message: expect.stringContaining("retries") })
      );
    });
  });

  // ============================================================================
  // Timeout and Threshold Tests (T020)
  // ============================================================================

  describe("timeout and threshold", () => {
    it("sets up 30-second overall timeout", async () => {
      // Create a frame that never loads (simulates hanging)
      class HangingMockImage {
        onload: (() => void) | null = null;
        onerror: (() => void) | null = null;
        crossOrigin = "";
        private _src = "";

        get src() {
          return this._src;
        }

        set src(value: string) {
          this._src = value;
          // Never call onload or onerror
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      global.Image = HangingMockImage as any;

      const { result } = renderHook(() =>
        useFramePreload({
          frames: ["http://example.com/hanging-frame.webp"],
          priorityCount: 1,
        })
      );

      act(() => {
        result.current.startPreload();
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isComplete).toBe(false);

      // Advance to just before timeout
      await advanceTimersAndFlush(29000);
      expect(result.current.isComplete).toBe(false);

      // Advance past timeout (30s total + buffer)
      await advanceTimersAndFlush(1500);

      // Timeout should have forced completion
      expect(result.current.isComplete).toBe(true);
    });

    it("triggers completion at 80% success threshold", async () => {
      const onComplete = vi.fn();

      // 5 frames: 4 succeed immediately, 1 fails
      const frames = [
        "http://example.com/frame1.webp",
        "http://example.com/frame2.webp",
        "http://example.com/frame3.webp",
        "http://example.com/frame4.webp",
        "http://example.com/fail-frame5.webp",
      ];

      const { result } = renderHook(() =>
        useFramePreload({
          frames,
          onComplete,
          priorityCount: 5,
        })
      );

      act(() => {
        result.current.startPreload();
      });

      // All initial loads complete (4 succeed, 1 fails)
      await advanceTimersAndFlush(50);

      // 4/5 = 80% success
      expect(result.current.loadedCount).toBe(4);

      // Advance for completion callback setTimeout
      await advanceTimersAndFlush(10);

      // Should trigger completion due to 80% threshold
      expect(result.current.isComplete).toBe(true);
      expect(onComplete).toHaveBeenCalled();
    });
  });

  // ============================================================================
  // Cleanup and Edge Case Tests (T021)
  // ============================================================================

  describe("cleanup and edge cases", () => {
    it("cancels retries and timeouts on unmount", async () => {
      const onComplete = vi.fn();
      const onError = vi.fn();

      const frames = [
        "http://example.com/fail-unmount-test.webp",
      ];

      const { result, unmount } = renderHook(() =>
        useFramePreload({
          frames,
          onComplete,
          onError,
          priorityCount: 1,
        })
      );

      act(() => {
        result.current.startPreload();
      });

      // Initial failure triggers retry scheduling
      await act(async () => {
        vi.advanceTimersByTime(50);
      });

      // Unmount before retry fires
      unmount();

      // Advance through retry delays
      await act(async () => {
        vi.advanceTimersByTime(10000);
      });

      // onComplete should NOT be called after unmount
      expect(onComplete).not.toHaveBeenCalled();
    });

    it("reports progress correctly (successful loads only)", async () => {
      const onProgress = vi.fn();

      const frames = [
        "http://example.com/frame1.webp",
        "http://example.com/frame2.webp",
        "http://example.com/frame3.webp",
        "http://example.com/fail-frame4.webp",
      ];

      const { result } = renderHook(() =>
        useFramePreload({
          frames,
          onProgress,
          priorityCount: 4,
        })
      );

      act(() => {
        result.current.startPreload();
      });

      await act(async () => {
        vi.advanceTimersByTime(50);
      });

      // Progress should be based on successful loads (3/4 = 75%)
      expect(result.current.loadedCount).toBe(3);
      expect(result.current.progress).toBe(75);

      // Progress callback should have been called with intermediate values
      expect(onProgress).toHaveBeenCalled();
    });

    it("handles empty frames array gracefully", async () => {
      const onComplete = vi.fn();

      const { result } = renderHook(() =>
        useFramePreload({
          frames: [],
          onComplete,
        })
      );

      // Should not crash and indicate empty state
      expect(result.current.totalCount).toBe(0);
      expect(result.current.progress).toBe(0);

      // startPreload should be a no-op for empty array
      act(() => {
        result.current.startPreload();
      });

      // isLoading should remain false for empty frames
      expect(result.current.isLoading).toBe(false);
    });

    it("skips already-loaded URLs on repeat calls", async () => {
      const frames = [
        "http://example.com/frame1.webp",
        "http://example.com/frame2.webp",
      ];

      const { result } = renderHook(() =>
        useFramePreload({
          frames,
          priorityCount: 2,
        })
      );

      act(() => {
        result.current.startPreload();
      });

      await act(async () => {
        vi.advanceTimersByTime(50);
      });

      expect(result.current.loadedCount).toBe(2);

      // Reset and try to start again
      act(() => {
        result.current.startPreload();
      });

      // Should be skipped since already complete
      expect(result.current.loadedCount).toBe(2);
    });

    it("handles very fast loading (< 100ms)", async () => {
      // All frames load instantly
      class FastMockImage {
        onload: (() => void) | null = null;
        onerror: (() => void) | null = null;
        crossOrigin = "";
        private _src = "";

        get src() {
          return this._src;
        }

        set src(value: string) {
          this._src = value;
          // Instant load
          setTimeout(() => {
            this.onload?.();
          }, 1);
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      global.Image = FastMockImage as any;

      const onComplete = vi.fn();

      const frames = [
        "http://example.com/frame1.webp",
        "http://example.com/frame2.webp",
        "http://example.com/frame3.webp",
      ];

      const { result } = renderHook(() =>
        useFramePreload({
          frames,
          onComplete,
          priorityCount: 3,
        })
      );

      act(() => {
        result.current.startPreload();
      });

      // Advance for fast loads
      await advanceTimersAndFlush(10);

      // All frames loaded
      expect(result.current.loadedCount).toBe(3);

      // Advance for completion callback
      await advanceTimersAndFlush(10);

      expect(result.current.isComplete).toBe(true);
      expect(onComplete).toHaveBeenCalled();
    });

    it("handles all frames failing with errors", async () => {
      const onError = vi.fn();

      const frames = [
        "http://example.com/fail-all-1.webp",
        "http://example.com/fail-all-2.webp",
      ];

      const { result } = renderHook(() =>
        useFramePreload({
          frames,
          onError,
          priorityCount: 2,
        })
      );

      act(() => {
        result.current.startPreload();
      });

      // All initial loads fail
      await advanceTimersAndFlush(50);

      // No successful loads
      expect(result.current.loadedCount).toBe(0);

      // Errors reported for each frame
      expect(onError).toHaveBeenCalledTimes(2);

      // Go through all retry cycles
      await advanceTimersAndFlush(1100); // Retry 1
      await advanceTimersAndFlush(2100); // Retry 2
      await advanceTimersAndFlush(4100); // Retry 3

      // Final errors with retry message
      expect(onError).toHaveBeenLastCalledWith(
        expect.any(String),
        expect.objectContaining({ message: expect.stringContaining("retries") })
      );
    });
  });
});
