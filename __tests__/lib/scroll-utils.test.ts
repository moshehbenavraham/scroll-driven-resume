/**
 * Unit tests for scroll utility functions.
 */

import { describe, it, expect } from "vitest";
import {
  calculateFrameIndex,
  calculateParallaxOffset,
  normalizeProgress,
  getScrollDirection,
  isSectionInView,
  generateFrameUrls,
  calculateFadeOpacity,
} from "@/lib/scroll-utils";

describe("calculateFrameIndex", () => {
  it("returns 0 for progress 0", () => {
    expect(calculateFrameIndex(0, 192)).toBe(0);
  });

  it("returns last frame index for progress 1", () => {
    expect(calculateFrameIndex(1, 192)).toBe(191);
  });

  it("returns middle frame for progress 0.5", () => {
    // 0.5 * 191 = 95.5, floor = 95
    expect(calculateFrameIndex(0.5, 192)).toBe(95);
  });

  it("handles zero total frames", () => {
    expect(calculateFrameIndex(0.5, 0)).toBe(0);
  });

  it("handles negative total frames", () => {
    expect(calculateFrameIndex(0.5, -10)).toBe(0);
  });

  it("clamps progress below 0", () => {
    expect(calculateFrameIndex(-0.5, 192)).toBe(0);
  });

  it("clamps progress above 1", () => {
    expect(calculateFrameIndex(1.5, 192)).toBe(191);
  });

  it("works with small frame counts", () => {
    expect(calculateFrameIndex(0, 2)).toBe(0);
    expect(calculateFrameIndex(1, 2)).toBe(1);
  });

  it("works with single frame", () => {
    expect(calculateFrameIndex(0, 1)).toBe(0);
    expect(calculateFrameIndex(1, 1)).toBe(0);
  });

  it("returns correct frame for various progress values", () => {
    expect(calculateFrameIndex(0.25, 100)).toBe(24);
    expect(calculateFrameIndex(0.75, 100)).toBe(74);
    expect(calculateFrameIndex(0.99, 100)).toBe(98);
  });
});

describe("calculateParallaxOffset", () => {
  it("returns 0 for speed of 1.0", () => {
    // Speed 1.0 means element moves at scroll speed, no offset
    expect(calculateParallaxOffset(100, 1.0, 800)).toBe(0);
  });

  it("returns negative offset for slow speed", () => {
    // Speed 0.5 means element moves slower
    // offset = 100 * (0.5 - 1) = -50
    expect(calculateParallaxOffset(100, 0.5, 800)).toBe(-50);
  });

  it("returns positive offset for fast speed", () => {
    // Speed 1.3 means element moves faster
    // offset = 100 * (1.3 - 1) = 30
    expect(calculateParallaxOffset(100, 1.3, 800)).toBeCloseTo(30, 5);
  });

  it("clamps offset to container bounds", () => {
    // Very large offset should be clamped
    const offset = calculateParallaxOffset(10000, 0.3, 800);
    expect(offset).toBeGreaterThanOrEqual(-800);
    expect(offset).toBeLessThanOrEqual(800);
  });

  it("works with zero container height", () => {
    expect(calculateParallaxOffset(100, 0.5, 0)).toBe(-50);
  });

  it("handles zero scroll position", () => {
    expect(calculateParallaxOffset(0, 0.5, 800)).toBeCloseTo(0, 5);
  });
});

describe("normalizeProgress", () => {
  const viewportHeight = 800;
  const sectionTop = 500;
  const sectionHeight = 1000;

  it("returns 0 when scroll is before section", () => {
    // Section starts at 500, viewport is 800
    // Progress starts when section top enters viewport bottom
    // startScroll = sectionTop - viewportHeight = 500 - 800 = -300
    // At scrollY = -300, progress = 0 (section just entering)
    // At scrollY = -500, section hasn't entered yet
    expect(normalizeProgress(-500, sectionTop, sectionHeight, viewportHeight)).toBe(0);
  });

  it("returns 0 when section top just enters viewport bottom", () => {
    // scrollY = sectionTop - viewportHeight = 500 - 800 = -300
    // At this point, section top is at viewport bottom
    const startScroll = sectionTop - viewportHeight;
    expect(normalizeProgress(startScroll, sectionTop, sectionHeight, viewportHeight)).toBe(0);
  });

  it("returns 1 when section bottom exits viewport top", () => {
    // scrollY = sectionTop + sectionHeight = 500 + 1000 = 1500
    const endScroll = sectionTop + sectionHeight;
    expect(normalizeProgress(endScroll, sectionTop, sectionHeight, viewportHeight)).toBe(1);
  });

  it("returns ~0.5 at midpoint", () => {
    const startScroll = sectionTop - viewportHeight;
    const endScroll = sectionTop + sectionHeight;
    const midScroll = (startScroll + endScroll) / 2;
    const progress = normalizeProgress(midScroll, sectionTop, sectionHeight, viewportHeight);
    expect(progress).toBeCloseTo(0.5, 1);
  });

  it("clamps progress to 0-1 range", () => {
    expect(normalizeProgress(-1000, sectionTop, sectionHeight, viewportHeight)).toBe(0);
    expect(normalizeProgress(5000, sectionTop, sectionHeight, viewportHeight)).toBe(1);
  });

  it("handles zero section height", () => {
    expect(normalizeProgress(500, sectionTop, 0, viewportHeight)).toBe(0);
  });

  it("handles zero viewport height", () => {
    expect(normalizeProgress(500, sectionTop, sectionHeight, 0)).toBe(0);
  });
});

describe("getScrollDirection", () => {
  it("returns 'down' when scrolling down", () => {
    expect(getScrollDirection(100, 200)).toBe("down");
  });

  it("returns 'up' when scrolling up", () => {
    expect(getScrollDirection(200, 100)).toBe("up");
  });

  it("returns null when position unchanged", () => {
    expect(getScrollDirection(100, 100)).toBe(null);
  });

  it("handles zero positions", () => {
    expect(getScrollDirection(0, 100)).toBe("down");
    expect(getScrollDirection(100, 0)).toBe("up");
  });
});

describe("isSectionInView", () => {
  it("returns true when section is fully visible", () => {
    // Section at 100-300, viewport at 0-800
    expect(isSectionInView(100, 200, 0, 800)).toBe(true);
  });

  it("returns true when section is partially visible at top", () => {
    // Section at 0-200, viewport at 100-900
    expect(isSectionInView(0, 200, 100, 800)).toBe(true);
  });

  it("returns true when section is partially visible at bottom", () => {
    // Section at 700-900, viewport at 0-800
    expect(isSectionInView(700, 200, 0, 800)).toBe(true);
  });

  it("returns false when section is above viewport", () => {
    // Section at 0-100, viewport at 200-1000
    expect(isSectionInView(0, 100, 200, 800)).toBe(false);
  });

  it("returns false when section is below viewport", () => {
    // Section at 1000-1200, viewport at 0-800
    expect(isSectionInView(1000, 200, 0, 800)).toBe(false);
  });
});

describe("generateFrameUrls", () => {
  it("generates correct number of URLs", () => {
    const urls = generateFrameUrls("/frames", 10, "webp");
    expect(urls).toHaveLength(10);
  });

  it("generates correctly formatted URLs", () => {
    const urls = generateFrameUrls("/frames/hero", 3, "webp");
    expect(urls[0]).toBe("/frames/hero/frame_0001.webp");
    expect(urls[1]).toBe("/frames/hero/frame_0002.webp");
    expect(urls[2]).toBe("/frames/hero/frame_0003.webp");
  });

  it("uses custom pattern", () => {
    const urls = generateFrameUrls("/frames", 2, "png", "img_");
    expect(urls[0]).toBe("/frames/img_0001.png");
    expect(urls[1]).toBe("/frames/img_0002.png");
  });

  it("handles different extensions", () => {
    expect(generateFrameUrls("/f", 1, "png")[0]).toContain(".png");
    expect(generateFrameUrls("/f", 1, "jpg")[0]).toContain(".jpg");
    expect(generateFrameUrls("/f", 1, "webp")[0]).toContain(".webp");
  });

  it("returns empty array for zero frames", () => {
    expect(generateFrameUrls("/frames", 0, "webp")).toEqual([]);
  });
});

describe("calculateFadeOpacity", () => {
  it("returns 0 at progress 0", () => {
    expect(calculateFadeOpacity(0)).toBe(0);
  });

  it("returns 1 at progress 0.5", () => {
    expect(calculateFadeOpacity(0.5)).toBe(1);
  });

  it("returns 0 at progress 1", () => {
    expect(calculateFadeOpacity(1)).toBe(0);
  });

  it("fades in during first 20%", () => {
    expect(calculateFadeOpacity(0.1)).toBeCloseTo(0.5, 1);
    expect(calculateFadeOpacity(0.2)).toBe(1);
  });

  it("stays at 1 during middle", () => {
    expect(calculateFadeOpacity(0.3)).toBe(1);
    expect(calculateFadeOpacity(0.5)).toBe(1);
    expect(calculateFadeOpacity(0.7)).toBe(1);
  });

  it("fades out during last 20%", () => {
    expect(calculateFadeOpacity(0.8)).toBe(1);
    expect(calculateFadeOpacity(0.9)).toBeCloseTo(0.5, 1);
  });

  it("respects custom fade boundaries", () => {
    // Fade in 0-0.1, visible 0.1-0.9, fade out 0.9-1.0
    expect(calculateFadeOpacity(0.05, 0.1, 0.9)).toBeCloseTo(0.5, 1);
    expect(calculateFadeOpacity(0.5, 0.1, 0.9)).toBe(1);
    expect(calculateFadeOpacity(0.95, 0.1, 0.9)).toBeCloseTo(0.5, 1);
  });

  it("clamps progress values", () => {
    expect(calculateFadeOpacity(-0.5)).toBe(0);
    expect(calculateFadeOpacity(1.5)).toBe(0);
  });
});
