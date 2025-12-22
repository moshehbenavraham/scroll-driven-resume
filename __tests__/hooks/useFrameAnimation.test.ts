/**
 * Unit tests for useFrameAnimation hook.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFrameAnimation } from "@/hooks/useFrameAnimation";
import {
  useScroll,
  useTransform,
  useMotionValueEvent,
  useInView,
} from "framer-motion";

// Mock framer-motion hooks
vi.mock("framer-motion", () => ({
  useScroll: vi.fn(),
  useTransform: vi.fn(),
  useMotionValueEvent: vi.fn(),
  useInView: vi.fn(),
}));

describe("useFrameAnimation", () => {
  const mockScrollYProgress = {
    get: vi.fn(() => 0),
    set: vi.fn(),
    onChange: vi.fn(),
  };

  const mockFrameIndex = {
    get: vi.fn(() => 0),
    set: vi.fn(),
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useScroll as ReturnType<typeof vi.fn>).mockReturnValue({
      scrollYProgress: mockScrollYProgress,
    });
    (useTransform as ReturnType<typeof vi.fn>).mockReturnValue(mockFrameIndex);
    (useMotionValueEvent as ReturnType<typeof vi.fn>).mockImplementation(
      () => {}
    );
    (useInView as ReturnType<typeof vi.fn>).mockReturnValue(false);
  });

  it("returns frameIndex MotionValue", () => {
    const targetRef = { current: document.createElement("div") };

    const { result } = renderHook(() =>
      useFrameAnimation({ target: targetRef, totalFrames: 192 })
    );

    expect(result.current.frameIndex).toBe(mockFrameIndex);
  });

  it("returns progress MotionValue", () => {
    const targetRef = { current: document.createElement("div") };

    const { result } = renderHook(() =>
      useFrameAnimation({ target: targetRef, totalFrames: 192 })
    );

    expect(result.current.progress).toBe(mockScrollYProgress);
  });

  it("returns direction as null initially", () => {
    const targetRef = { current: document.createElement("div") };

    const { result } = renderHook(() =>
      useFrameAnimation({ target: targetRef, totalFrames: 192 })
    );

    expect(result.current.direction).toBe(null);
  });

  it("returns isActive from useInView", () => {
    const targetRef = { current: document.createElement("div") };
    (useInView as ReturnType<typeof vi.fn>).mockReturnValue(true);

    const { result } = renderHook(() =>
      useFrameAnimation({ target: targetRef, totalFrames: 192 })
    );

    expect(result.current.isActive).toBe(true);
  });

  it("calls useScroll with correct target", () => {
    const targetRef = { current: document.createElement("div") };

    renderHook(() =>
      useFrameAnimation({ target: targetRef, totalFrames: 192 })
    );

    expect(useScroll).toHaveBeenCalledWith({
      target: targetRef,
      offset: ["start end", "end start"],
    });
  });

  it("uses custom offset when provided", () => {
    const targetRef = { current: document.createElement("div") };
    const customOffset: [string, string] = ["start start", "end end"];

    renderHook(() =>
      useFrameAnimation({
        target: targetRef,
        totalFrames: 192,
        offset: customOffset,
      })
    );

    expect(useScroll).toHaveBeenCalledWith({
      target: targetRef,
      offset: customOffset,
    });
  });

  it("calls useTransform with scrollYProgress", () => {
    const targetRef = { current: document.createElement("div") };

    renderHook(() =>
      useFrameAnimation({ target: targetRef, totalFrames: 192 })
    );

    expect(useTransform).toHaveBeenCalledWith(
      mockScrollYProgress,
      expect.any(Function)
    );
  });

  it("transforms progress to frame index correctly", () => {
    const targetRef = { current: document.createElement("div") };
    let transformFn: (progress: number) => number = () => 0;

    (useTransform as ReturnType<typeof vi.fn>).mockImplementation(
      (_: unknown, fn: (progress: number) => number) => {
        transformFn = fn;
        return mockFrameIndex;
      }
    );

    renderHook(() =>
      useFrameAnimation({ target: targetRef, totalFrames: 192 })
    );

    // Test frame index calculation
    expect(transformFn(0)).toBe(0);
    expect(transformFn(0.5)).toBe(95); // floor(0.5 * 191) = 95
    expect(transformFn(1)).toBe(191);
  });

  it("handles zero totalFrames", () => {
    const targetRef = { current: document.createElement("div") };
    let transformFn: (progress: number) => number = () => 0;

    (useTransform as ReturnType<typeof vi.fn>).mockImplementation(
      (_: unknown, fn: (progress: number) => number) => {
        transformFn = fn;
        return mockFrameIndex;
      }
    );

    renderHook(() => useFrameAnimation({ target: targetRef, totalFrames: 0 }));

    expect(transformFn(0.5)).toBe(0);
  });

  it("clamps frame index for out of range progress", () => {
    const targetRef = { current: document.createElement("div") };
    let transformFn: (progress: number) => number = () => 0;

    (useTransform as ReturnType<typeof vi.fn>).mockImplementation(
      (_: unknown, fn: (progress: number) => number) => {
        transformFn = fn;
        return mockFrameIndex;
      }
    );

    renderHook(() =>
      useFrameAnimation({ target: targetRef, totalFrames: 100 })
    );

    expect(transformFn(-0.5)).toBe(0);
    expect(transformFn(1.5)).toBe(99);
  });

  it("registers motion value event listener for direction", () => {
    const targetRef = { current: document.createElement("div") };

    renderHook(() =>
      useFrameAnimation({ target: targetRef, totalFrames: 192 })
    );

    expect(useMotionValueEvent).toHaveBeenCalledWith(
      mockScrollYProgress,
      "change",
      expect.any(Function)
    );
  });

  it("updates direction on scroll", () => {
    const targetRef = { current: document.createElement("div") };
    let changeHandler: (progress: number) => void = () => {};

    (useMotionValueEvent as ReturnType<typeof vi.fn>).mockImplementation(
      (_: unknown, __: string, handler: (progress: number) => void) => {
        changeHandler = handler;
      }
    );

    const { result } = renderHook(() =>
      useFrameAnimation({ target: targetRef, totalFrames: 192 })
    );

    // Initial direction is null
    expect(result.current.direction).toBe(null);

    // Simulate scroll down
    act(() => {
      changeHandler(0.5);
    });
    expect(result.current.direction).toBe("down");

    // Simulate scroll up
    act(() => {
      changeHandler(0.3);
    });
    expect(result.current.direction).toBe("up");
  });
});
