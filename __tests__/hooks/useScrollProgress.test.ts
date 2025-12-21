/**
 * Unit tests for useScrollProgress hook.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useScroll, useInView } from "framer-motion";

// Mock framer-motion hooks
vi.mock("framer-motion", () => ({
  useScroll: vi.fn(),
  useInView: vi.fn(),
}));

describe("useScrollProgress", () => {
  const mockScrollYProgress = {
    get: vi.fn(() => 0),
    set: vi.fn(),
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useScroll as ReturnType<typeof vi.fn>).mockReturnValue({
      scrollYProgress: mockScrollYProgress,
    });
    (useInView as ReturnType<typeof vi.fn>).mockReturnValue(false);
  });

  it("returns progress MotionValue", () => {
    const targetRef = { current: document.createElement("div") };

    const { result } = renderHook(() =>
      useScrollProgress({ target: targetRef })
    );

    expect(result.current.progress).toBe(mockScrollYProgress);
  });

  it("returns isInView boolean", () => {
    const targetRef = { current: document.createElement("div") };
    (useInView as ReturnType<typeof vi.fn>).mockReturnValue(true);

    const { result } = renderHook(() =>
      useScrollProgress({ target: targetRef })
    );

    expect(result.current.isInView).toBe(true);
  });

  it("calls useScroll with correct target", () => {
    const targetRef = { current: document.createElement("div") };

    renderHook(() => useScrollProgress({ target: targetRef }));

    expect(useScroll).toHaveBeenCalledWith({
      target: targetRef,
      offset: ["start end", "end start"],
    });
  });

  it("uses custom offset when provided", () => {
    const targetRef = { current: document.createElement("div") };
    const customOffset: [string, string] = ["start start", "end end"];

    renderHook(() =>
      useScrollProgress({ target: targetRef, offset: customOffset })
    );

    expect(useScroll).toHaveBeenCalledWith({
      target: targetRef,
      offset: customOffset,
    });
  });

  it("calls useInView with correct options", () => {
    const targetRef = { current: document.createElement("div") };

    renderHook(() => useScrollProgress({ target: targetRef }));

    expect(useInView).toHaveBeenCalledWith(targetRef, {
      once: false,
      amount: 0.01,
    });
  });

  it("handles null target ref", () => {
    const targetRef = { current: null };

    const { result } = renderHook(() =>
      useScrollProgress({ target: targetRef })
    );

    expect(result.current.progress).toBe(mockScrollYProgress);
    expect(result.current.isInView).toBe(false);
  });
});
