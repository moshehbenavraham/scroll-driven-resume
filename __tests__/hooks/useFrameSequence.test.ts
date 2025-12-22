/**
 * Unit tests for useFrameSequence hook dependencies.
 * Tests the underlying utilities and data flow used by the hook.
 *
 * Note: Full hook integration testing with scroll events is done via manual testing
 * on the demo page, as the hook depends on complex browser APIs (scroll, matchMedia).
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  generateFrameUrls,
  getOptimalQuality,
  getVirtualizedRange,
} from "@/lib/frame-utils";
import { FRAME_COUNTS } from "@/types/animation";
import { useAnimationStore } from "@/stores/animation-store";

describe("useFrameSequence dependencies", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock window.matchMedia
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    // Mock window.innerWidth
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 1024,
    });

    // Reset store
    useAnimationStore.getState().reset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // =========================================================================
  // Frame URL generation tests (used by hook)
  // =========================================================================
  describe("frame URL generation", () => {
    it("generates correct number of URLs for hero", () => {
      const urls = generateFrameUrls({
        sequence: "hero",
        totalFrames: FRAME_COUNTS.hero,
        quality: "desktop",
      });

      expect(urls).toHaveLength(192);
      expect(urls[0]).toContain("hero/frame_0001.webp");
      expect(urls[191]).toContain("hero/frame_0192.webp");
    });

    it("generates correct number of URLs for product", () => {
      const urls = generateFrameUrls({
        sequence: "product",
        totalFrames: FRAME_COUNTS.product,
        quality: "desktop",
      });

      expect(urls).toHaveLength(144);
      expect(urls[0]).toContain("product/frame_0001.webp");
      expect(urls[143]).toContain("product/frame_0144.webp");
    });

    it("uses mobile bucket for mobile quality", () => {
      const urls = generateFrameUrls({
        sequence: "hero",
        totalFrames: 10,
        quality: "mobile",
      });

      expect(urls[0]).toContain("frames-mobile");
    });

    it("uses desktop bucket for desktop quality", () => {
      const urls = generateFrameUrls({
        sequence: "hero",
        totalFrames: 10,
        quality: "desktop",
      });

      expect(urls[0]).toContain("frames-desktop");
    });
  });

  // =========================================================================
  // Quality detection tests (used by hook)
  // =========================================================================
  describe("quality detection", () => {
    it("returns desktop for wide viewport", () => {
      expect(getOptimalQuality(1920)).toBe("desktop");
    });

    it("returns desktop for viewport at threshold", () => {
      expect(getOptimalQuality(768)).toBe("desktop");
    });

    it("returns mobile for narrow viewport", () => {
      expect(getOptimalQuality(767)).toBe("mobile");
    });

    it("returns mobile for phone viewport", () => {
      expect(getOptimalQuality(375)).toBe("mobile");
    });
  });

  // =========================================================================
  // Virtualization tests (used by hook)
  // =========================================================================
  describe("frame virtualization", () => {
    it("returns 5 frames for middle position", () => {
      const { start, end } = getVirtualizedRange(50, 192, 2);

      // Should be 48, 49, 50, 51, 52 = 5 frames
      expect(end - start + 1).toBe(5);
    });

    it("clamps to start boundary", () => {
      const { start, end } = getVirtualizedRange(0, 192, 2);

      expect(start).toBe(0);
      expect(end).toBe(2);
      // Only 3 frames at start: 0, 1, 2
      expect(end - start + 1).toBe(3);
    });

    it("clamps to end boundary", () => {
      const { start, end } = getVirtualizedRange(191, 192, 2);

      expect(start).toBe(189);
      expect(end).toBe(191);
      // Only 3 frames at end: 189, 190, 191
      expect(end - start + 1).toBe(3);
    });
  });

  // =========================================================================
  // Animation store tests (used by hook)
  // =========================================================================
  describe("animation store integration", () => {
    it("initializes with correct hero frame count", () => {
      const heroState = useAnimationStore.getState().sequences.hero;

      expect(heroState.totalFrames).toBe(192);
      expect(heroState.currentFrame).toBe(0);
      expect(heroState.isActive).toBe(false);
      expect(heroState.isLoaded).toBe(false);
    });

    it("initializes with correct product frame count", () => {
      const productState = useAnimationStore.getState().sequences.product;

      expect(productState.totalFrames).toBe(144);
      expect(productState.currentFrame).toBe(0);
      expect(productState.isActive).toBe(false);
      expect(productState.isLoaded).toBe(false);
    });

    it("updates sequence frame", () => {
      useAnimationStore.getState().setSequenceFrame("hero", 50);

      expect(useAnimationStore.getState().sequences.hero.currentFrame).toBe(50);
    });

    it("updates sequence active state", () => {
      useAnimationStore.getState().setSequenceActive("hero", true);

      expect(useAnimationStore.getState().sequences.hero.isActive).toBe(true);
    });

    it("updates sequence load progress", () => {
      useAnimationStore.getState().setSequenceLoadProgress("hero", 75);

      expect(useAnimationStore.getState().sequences.hero.loadProgress).toBe(75);
    });

    it("updates sequence loaded state", () => {
      useAnimationStore.getState().setSequenceLoaded("hero", true);

      const heroState = useAnimationStore.getState().sequences.hero;
      expect(heroState.isLoaded).toBe(true);
      expect(heroState.loadProgress).toBe(100);
    });

    it("updates sequence direction", () => {
      useAnimationStore.getState().setSequenceDirection("hero", "down");

      expect(useAnimationStore.getState().sequences.hero.direction).toBe("down");
    });

    it("gets sequence state", () => {
      useAnimationStore.getState().setSequenceFrame("product", 100);
      const productState = useAnimationStore.getState().getSequence("product");

      expect(productState.currentFrame).toBe(100);
    });

    it("resets to initial state", () => {
      // Modify state
      useAnimationStore.getState().setSequenceFrame("hero", 50);
      useAnimationStore.getState().setSequenceActive("hero", true);

      // Reset
      useAnimationStore.getState().reset();

      const heroState = useAnimationStore.getState().sequences.hero;
      expect(heroState.currentFrame).toBe(0);
      expect(heroState.isActive).toBe(false);
    });
  });

  // =========================================================================
  // FRAME_COUNTS constant tests
  // =========================================================================
  describe("FRAME_COUNTS constant", () => {
    it("has correct hero frame count", () => {
      expect(FRAME_COUNTS.hero).toBe(192);
    });

    it("has correct product frame count", () => {
      expect(FRAME_COUNTS.product).toBe(144);
    });
  });
});
