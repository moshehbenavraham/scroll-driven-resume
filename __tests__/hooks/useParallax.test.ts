/**
 * Unit tests for useParallax hook.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useParallax } from "@/hooks/useParallax";
import { useScroll, useTransform } from "framer-motion";
import { PARALLAX_SPEEDS } from "@/types/animation";

// Mock framer-motion hooks
vi.mock("framer-motion", () => ({
  useScroll: vi.fn(),
  useTransform: vi.fn(),
}));

describe("useParallax", () => {
  const mockScrollYProgress = {
    get: vi.fn(() => 0),
    set: vi.fn(),
    onChange: vi.fn(),
  };

  const mockMotionValue = {
    get: vi.fn(() => 0),
    set: vi.fn(),
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useScroll as ReturnType<typeof vi.fn>).mockReturnValue({
      scrollYProgress: mockScrollYProgress,
    });
    (useTransform as ReturnType<typeof vi.fn>).mockReturnValue(mockMotionValue);
  });

  it("returns y MotionValue", () => {
    const targetRef = { current: document.createElement("div") };

    const { result } = renderHook(() =>
      useParallax({ target: targetRef })
    );

    expect(result.current.y).toBe(mockMotionValue);
  });

  it("returns x MotionValue", () => {
    const targetRef = { current: document.createElement("div") };

    const { result } = renderHook(() =>
      useParallax({ target: targetRef })
    );

    expect(result.current.x).toBe(mockMotionValue);
  });

  it("returns opacity MotionValue", () => {
    const targetRef = { current: document.createElement("div") };

    const { result } = renderHook(() =>
      useParallax({ target: targetRef })
    );

    expect(result.current.opacity).toBe(mockMotionValue);
  });

  it("calls useScroll with correct target", () => {
    const targetRef = { current: document.createElement("div") };

    renderHook(() => useParallax({ target: targetRef }));

    expect(useScroll).toHaveBeenCalledWith({
      target: targetRef,
      offset: ["start end", "end start"],
    });
  });

  it("uses custom offset when provided", () => {
    const targetRef = { current: document.createElement("div") };
    const customOffset: [string, string] = ["start start", "end end"];

    renderHook(() =>
      useParallax({ target: targetRef, offset: customOffset })
    );

    expect(useScroll).toHaveBeenCalledWith({
      target: targetRef,
      offset: customOffset,
    });
  });

  it("uses default speed of 0.5", () => {
    const targetRef = { current: document.createElement("div") };

    renderHook(() => useParallax({ target: targetRef }));

    // Default speed is 0.5, so offset range should be based on (0.5 - 1) = -0.5
    // y transform: [0, 1] -> [-0.5 * -100, -0.5 * 100] = [50, -50]
    expect(useTransform).toHaveBeenCalledWith(
      mockScrollYProgress,
      [0, 1],
      expect.any(Array)
    );
  });

  it("applies custom speed", () => {
    const targetRef = { current: document.createElement("div") };

    renderHook(() =>
      useParallax({ target: targetRef, speed: PARALLAX_SPEEDS.background })
    );

    expect(useTransform).toHaveBeenCalled();
  });

  it("creates transforms for y, x, and opacity", () => {
    const targetRef = { current: document.createElement("div") };

    renderHook(() => useParallax({ target: targetRef }));

    // Should be called 3 times: y, x, opacity
    expect(useTransform).toHaveBeenCalledTimes(3);
  });

  it("creates correct y transform for slow speed", () => {
    const targetRef = { current: document.createElement("div") };
    const calls: unknown[][] = [];

    (useTransform as ReturnType<typeof vi.fn>).mockImplementation(
      (...args: unknown[]) => {
        calls.push(args);
        return mockMotionValue;
      }
    );

    renderHook(() =>
      useParallax({ target: targetRef, speed: 0.3 })
    );

    // First call is for y transform
    // Speed 0.3: (0.3 - 1) * -100 = 70, (0.3 - 1) * 100 = -70
    const yCall = calls[0];
    expect(yCall[1]).toEqual([0, 1]);
    expect(yCall[2]).toEqual([70, -70]);
  });

  it("creates correct y transform for fast speed", () => {
    const targetRef = { current: document.createElement("div") };
    const calls: unknown[][] = [];

    (useTransform as ReturnType<typeof vi.fn>).mockImplementation(
      (...args: unknown[]) => {
        calls.push(args);
        return mockMotionValue;
      }
    );

    renderHook(() =>
      useParallax({ target: targetRef, speed: 1.3 })
    );

    // First call is for y transform
    // Speed 1.3: (1.3 - 1) * -100 = -30, (1.3 - 1) * 100 = 30
    const yCall = calls[0];
    expect(yCall[1]).toEqual([0, 1]);
    // Use toBeCloseTo for floating point comparison
    const [start, end] = yCall[2] as number[];
    expect(start).toBeCloseTo(-30, 5);
    expect(end).toBeCloseTo(30, 5);
  });

  it("creates correct opacity transform with fade boundaries", () => {
    const targetRef = { current: document.createElement("div") };
    const calls: unknown[][] = [];

    (useTransform as ReturnType<typeof vi.fn>).mockImplementation(
      (...args: unknown[]) => {
        calls.push(args);
        return mockMotionValue;
      }
    );

    renderHook(() => useParallax({ target: targetRef }));

    // Third call is for opacity transform
    const opacityCall = calls[2];
    expect(opacityCall[1]).toEqual([0, 0.15, 0.85, 1]);
    expect(opacityCall[2]).toEqual([0, 1, 1, 0]);
  });

  it("clamps speed to valid range", () => {
    const targetRef = { current: document.createElement("div") };
    const calls: unknown[][] = [];

    (useTransform as ReturnType<typeof vi.fn>).mockImplementation(
      (...args: unknown[]) => {
        calls.push(args);
        return mockMotionValue;
      }
    );

    // Speed below minimum should be clamped to 0.1
    renderHook(() =>
      useParallax({ target: targetRef, speed: 0.01 })
    );

    // First call is for y transform
    // Clamped speed 0.1: (0.1 - 1) * -100 = 90, (0.1 - 1) * 100 = -90
    const yCall = calls[0];
    expect(yCall[2]).toEqual([90, -90]);
  });

  it("handles null target ref", () => {
    const targetRef = { current: null };

    const { result } = renderHook(() =>
      useParallax({ target: targetRef })
    );

    expect(result.current.y).toBe(mockMotionValue);
    expect(result.current.x).toBe(mockMotionValue);
    expect(result.current.opacity).toBe(mockMotionValue);
  });

  it("uses preset speeds correctly", () => {
    const targetRef = { current: document.createElement("div") };

    // Test each preset
    Object.entries(PARALLAX_SPEEDS).forEach(([, speed]) => {
      vi.clearAllMocks();
      renderHook(() =>
        useParallax({ target: targetRef, speed })
      );
      expect(useTransform).toHaveBeenCalled();
    });
  });
});
