/**
 * Unit tests for useParallaxTransform hook.
 * Tests speed clamping, transform calculations, and disabled state.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import type { useMotionValue } from "framer-motion";
import { useParallaxTransform } from "@/hooks/useParallaxTransform";

// Mock framer-motion's useTransform to make testing predictable
vi.mock("framer-motion", async () => {
  const actual = await vi.importActual("framer-motion");
  return {
    ...actual,
    useTransform: vi.fn((motionValue, inputRange, outputRange) => {
      // Return a mock MotionValue that stores the transform config
      const mockValue = {
        get: () => {
          const progress = motionValue.get();
          // Linear interpolation between output range based on progress
          const [start, end] = outputRange;
          return start + (end - start) * progress;
        },
        _config: { inputRange, outputRange },
      };
      return mockValue;
    }),
  };
});

describe("useParallaxTransform", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns y transform and style object", () => {
    const scrollProgress = { get: () => 0.5 } as ReturnType<
      typeof useMotionValue<number>
    >;

    const { result } = renderHook(() =>
      useParallaxTransform({
        speed: 0.5,
        scrollProgress,
      })
    );

    expect(result.current).toHaveProperty("y");
    expect(result.current).toHaveProperty("style");
    expect(result.current.style).toHaveProperty("y");
    expect(result.current.style).toHaveProperty("willChange");
  });

  it("sets willChange to transform when enabled", () => {
    const scrollProgress = { get: () => 0.5 } as ReturnType<
      typeof useMotionValue<number>
    >;

    const { result } = renderHook(() =>
      useParallaxTransform({
        speed: 0.5,
        scrollProgress,
        enabled: true,
      })
    );

    expect(result.current.style.willChange).toBe("transform");
  });

  it("sets willChange to auto when disabled", () => {
    const scrollProgress = { get: () => 0.5 } as ReturnType<
      typeof useMotionValue<number>
    >;

    const { result } = renderHook(() =>
      useParallaxTransform({
        speed: 0.5,
        scrollProgress,
        enabled: false,
      })
    );

    expect(result.current.style.willChange).toBe("auto");
  });

  it("calculates transform for speed < 1 (slower than scroll)", () => {
    const scrollProgress = { get: () => 0 } as ReturnType<
      typeof useMotionValue<number>
    >;

    const { result } = renderHook(() =>
      useParallaxTransform({
        speed: 0.5,
        scrollProgress,
        enabled: true,
      })
    );

    // Speed 0.5 means speedDelta = -0.5, offsetRange = -75
    // Output range should be [75, -75] (flipped from [-offsetRange, offsetRange])
    const y = result.current.y as { _config?: { outputRange: number[] } };
    expect(y._config?.outputRange[0]).toBeCloseTo(75, 0);
    expect(y._config?.outputRange[1]).toBeCloseTo(-75, 0);
  });

  it("calculates transform for speed > 1 (faster than scroll)", () => {
    const scrollProgress = { get: () => 0 } as ReturnType<
      typeof useMotionValue<number>
    >;

    const { result } = renderHook(() =>
      useParallaxTransform({
        speed: 1.5,
        scrollProgress,
        enabled: true,
      })
    );

    // Speed 1.5 means speedDelta = 0.5, offsetRange = 75
    // Output range should be [-75, 75]
    const y = result.current.y as { _config?: { outputRange: number[] } };
    expect(y._config?.outputRange[0]).toBeCloseTo(-75, 0);
    expect(y._config?.outputRange[1]).toBeCloseTo(75, 0);
  });

  it("returns identity transform for speed = 1 (no parallax)", () => {
    const scrollProgress = { get: () => 0.5 } as ReturnType<
      typeof useMotionValue<number>
    >;

    const { result } = renderHook(() =>
      useParallaxTransform({
        speed: 1.0,
        scrollProgress,
        enabled: true,
      })
    );

    // Speed 1.0 should result in [0, 0] output range
    const y = result.current.y as { _config?: { outputRange: number[] } };
    expect(y._config?.outputRange[0]).toBe(0);
    expect(y._config?.outputRange[1]).toBe(0);
  });

  it("returns identity transform when disabled", () => {
    const scrollProgress = { get: () => 0.5 } as ReturnType<
      typeof useMotionValue<number>
    >;

    const { result } = renderHook(() =>
      useParallaxTransform({
        speed: 0.5,
        scrollProgress,
        enabled: false,
      })
    );

    // Disabled should result in [0, 0] output range
    const y = result.current.y as { _config?: { outputRange: number[] } };
    expect(y._config?.outputRange[0]).toBe(0);
    expect(y._config?.outputRange[1]).toBe(0);
  });

  it("clamps speed to minimum (0)", () => {
    const scrollProgress = { get: () => 0 } as ReturnType<
      typeof useMotionValue<number>
    >;

    const { result } = renderHook(() =>
      useParallaxTransform({
        speed: -1,
        scrollProgress,
        enabled: true,
      })
    );

    // Speed clamped to 0, speedDelta = -1, offsetRange = -150
    // Output range should be [150, -150]
    const y = result.current.y as { _config?: { outputRange: number[] } };
    expect(y._config?.outputRange[0]).toBeCloseTo(150, 0);
    expect(y._config?.outputRange[1]).toBeCloseTo(-150, 0);
  });

  it("clamps speed to maximum (2.0)", () => {
    const scrollProgress = { get: () => 0 } as ReturnType<
      typeof useMotionValue<number>
    >;

    const { result } = renderHook(() =>
      useParallaxTransform({
        speed: 5,
        scrollProgress,
        enabled: true,
      })
    );

    // Speed clamped to 2.0, speedDelta = 1.0, offsetRange = 150
    // Output range should be [-150, 150]
    const y = result.current.y as { _config?: { outputRange: number[] } };
    expect(y._config?.outputRange[0]).toBeCloseTo(-150, 0);
    expect(y._config?.outputRange[1]).toBeCloseTo(150, 0);
  });

  it("enabled defaults to true", () => {
    const scrollProgress = { get: () => 0.5 } as ReturnType<
      typeof useMotionValue<number>
    >;

    const { result } = renderHook(() =>
      useParallaxTransform({
        speed: 0.5,
        scrollProgress,
        // enabled not provided
      })
    );

    expect(result.current.style.willChange).toBe("transform");
  });
});
