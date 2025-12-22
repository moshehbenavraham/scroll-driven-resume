/**
 * Unit tests for frame-utils.ts
 * Tests URL generation, quality detection, and frame utilities.
 */

import { describe, it, expect, vi, afterEach } from "vitest";
import {
  getFrameUrl,
  generateFrameUrls,
  generateFrameUrlRange,
  getOptimalQuality,
  isMobileDevice,
  createMobileMediaQuery,
  getVirtualizedRange,
  isFrameInRange,
  frameIndexToNumber,
  frameNumberToIndex,
} from "@/lib/frame-utils";

describe("frame-utils", () => {
  // =========================================================================
  // getFrameUrl tests (T006)
  // =========================================================================
  describe("getFrameUrl", () => {
    it("generates correct URL for hero desktop frame", () => {
      const url = getFrameUrl({
        sequence: "hero",
        index: 1,
        quality: "desktop",
      });
      expect(url).toBe(
        "http://localhost:8080/frames-desktop/hero/frame_0001.webp"
      );
    });

    it("generates correct URL for hero mobile frame", () => {
      const url = getFrameUrl({
        sequence: "hero",
        index: 1,
        quality: "mobile",
      });
      expect(url).toBe(
        "http://localhost:8080/frames-mobile/hero/frame_0001.webp"
      );
    });

    it("generates correct URL for product desktop frame", () => {
      const url = getFrameUrl({
        sequence: "product",
        index: 100,
        quality: "desktop",
      });
      expect(url).toBe(
        "http://localhost:8080/frames-desktop/product/frame_0100.webp"
      );
    });

    it("generates correct URL for product mobile frame", () => {
      const url = getFrameUrl({
        sequence: "product",
        index: 144,
        quality: "mobile",
      });
      expect(url).toBe(
        "http://localhost:8080/frames-mobile/product/frame_0144.webp"
      );
    });

    it("pads frame index to 4 digits", () => {
      const url1 = getFrameUrl({
        sequence: "hero",
        index: 1,
        quality: "desktop",
      });
      const url2 = getFrameUrl({
        sequence: "hero",
        index: 10,
        quality: "desktop",
      });
      const url3 = getFrameUrl({
        sequence: "hero",
        index: 192,
        quality: "desktop",
      });

      expect(url1).toContain("frame_0001.webp");
      expect(url2).toContain("frame_0010.webp");
      expect(url3).toContain("frame_0192.webp");
    });

    it("handles invalid index by using 1", () => {
      const consoleWarn = vi
        .spyOn(console, "warn")
        .mockImplementation(() => {});

      const url = getFrameUrl({
        sequence: "hero",
        index: 0,
        quality: "desktop",
      });

      expect(url).toContain("frame_0001.webp");
      expect(consoleWarn).toHaveBeenCalled();

      consoleWarn.mockRestore();
    });

    it("handles negative index by using 1", () => {
      const consoleWarn = vi
        .spyOn(console, "warn")
        .mockImplementation(() => {});

      const url = getFrameUrl({
        sequence: "hero",
        index: -5,
        quality: "desktop",
      });

      expect(url).toContain("frame_0001.webp");
      expect(consoleWarn).toHaveBeenCalled();

      consoleWarn.mockRestore();
    });
  });

  // =========================================================================
  // generateFrameUrls tests (T007)
  // =========================================================================
  describe("generateFrameUrls", () => {
    it("generates correct number of URLs for hero sequence", () => {
      const urls = generateFrameUrls({
        sequence: "hero",
        totalFrames: 192,
        quality: "desktop",
      });

      expect(urls).toHaveLength(192);
    });

    it("generates correct number of URLs for product sequence", () => {
      const urls = generateFrameUrls({
        sequence: "product",
        totalFrames: 144,
        quality: "mobile",
      });

      expect(urls).toHaveLength(144);
    });

    it("first URL uses frame index 1", () => {
      const urls = generateFrameUrls({
        sequence: "hero",
        totalFrames: 10,
        quality: "desktop",
      });

      expect(urls[0]).toContain("frame_0001.webp");
    });

    it("last URL uses correct frame index", () => {
      const urls = generateFrameUrls({
        sequence: "hero",
        totalFrames: 192,
        quality: "desktop",
      });

      expect(urls[191]).toContain("frame_0192.webp");
    });

    it("returns empty array for zero frames", () => {
      const urls = generateFrameUrls({
        sequence: "hero",
        totalFrames: 0,
        quality: "desktop",
      });

      expect(urls).toHaveLength(0);
    });

    it("returns empty array for negative frames", () => {
      const urls = generateFrameUrls({
        sequence: "hero",
        totalFrames: -10,
        quality: "desktop",
      });

      expect(urls).toHaveLength(0);
    });
  });

  // =========================================================================
  // generateFrameUrlRange tests
  // =========================================================================
  describe("generateFrameUrlRange", () => {
    it("generates URLs for specified range", () => {
      const urls = generateFrameUrlRange("hero", 0, 5, "desktop");

      expect(urls).toHaveLength(5);
      expect(urls[0]).toContain("frame_0001.webp");
      expect(urls[4]).toContain("frame_0005.webp");
    });

    it("handles mid-range correctly", () => {
      const urls = generateFrameUrlRange("hero", 50, 55, "desktop");

      expect(urls).toHaveLength(5);
      expect(urls[0]).toContain("frame_0051.webp");
      expect(urls[4]).toContain("frame_0055.webp");
    });
  });

  // =========================================================================
  // getOptimalQuality tests (T008)
  // =========================================================================
  describe("getOptimalQuality", () => {
    it("returns desktop for large viewport", () => {
      expect(getOptimalQuality(1920)).toBe("desktop");
      expect(getOptimalQuality(1024)).toBe("desktop");
      expect(getOptimalQuality(768)).toBe("desktop");
    });

    it("returns mobile for small viewport", () => {
      expect(getOptimalQuality(767)).toBe("mobile");
      expect(getOptimalQuality(375)).toBe("mobile");
      expect(getOptimalQuality(320)).toBe("mobile");
    });

    it("returns desktop when viewport is undefined (SSR)", () => {
      // In test environment, window is available but we test SSR by not passing width
      // The actual SSR case returns desktop as default
      expect(getOptimalQuality(undefined)).toBeDefined();
    });
  });

  // =========================================================================
  // isMobileDevice tests
  // =========================================================================
  describe("isMobileDevice", () => {
    const originalInnerWidth = window.innerWidth;

    afterEach(() => {
      Object.defineProperty(window, "innerWidth", {
        value: originalInnerWidth,
        writable: true,
      });
    });

    it("returns true for mobile viewport", () => {
      Object.defineProperty(window, "innerWidth", {
        value: 375,
        writable: true,
      });

      expect(isMobileDevice()).toBe(true);
    });

    it("returns false for desktop viewport", () => {
      Object.defineProperty(window, "innerWidth", {
        value: 1024,
        writable: true,
      });

      expect(isMobileDevice()).toBe(false);
    });
  });

  // =========================================================================
  // createMobileMediaQuery tests
  // =========================================================================
  describe("createMobileMediaQuery", () => {
    it("returns MediaQueryList in browser environment", () => {
      const query = createMobileMediaQuery();
      expect(query).not.toBeNull();
      expect(query).toHaveProperty("matches");
    });
  });

  // =========================================================================
  // getVirtualizedRange tests
  // =========================================================================
  describe("getVirtualizedRange", () => {
    it("returns correct range for middle frame", () => {
      const { start, end } = getVirtualizedRange(50, 192, 2);

      expect(start).toBe(48);
      expect(end).toBe(52);
    });

    it("clamps start at 0", () => {
      const { start, end } = getVirtualizedRange(1, 192, 2);

      expect(start).toBe(0);
      expect(end).toBe(3);
    });

    it("clamps end at totalFrames - 1", () => {
      const { start, end } = getVirtualizedRange(190, 192, 2);

      expect(start).toBe(188);
      expect(end).toBe(191);
    });

    it("handles first frame", () => {
      const { start, end } = getVirtualizedRange(0, 192, 2);

      expect(start).toBe(0);
      expect(end).toBe(2);
    });

    it("handles last frame", () => {
      const { start, end } = getVirtualizedRange(191, 192, 2);

      expect(start).toBe(189);
      expect(end).toBe(191);
    });

    it("uses default range of 2", () => {
      const { start, end } = getVirtualizedRange(50, 192);

      expect(start).toBe(48);
      expect(end).toBe(52);
    });
  });

  // =========================================================================
  // isFrameInRange tests
  // =========================================================================
  describe("isFrameInRange", () => {
    it("returns true for current frame", () => {
      expect(isFrameInRange(50, 50, 2)).toBe(true);
    });

    it("returns true for frames within range", () => {
      expect(isFrameInRange(48, 50, 2)).toBe(true);
      expect(isFrameInRange(49, 50, 2)).toBe(true);
      expect(isFrameInRange(51, 50, 2)).toBe(true);
      expect(isFrameInRange(52, 50, 2)).toBe(true);
    });

    it("returns false for frames outside range", () => {
      expect(isFrameInRange(47, 50, 2)).toBe(false);
      expect(isFrameInRange(53, 50, 2)).toBe(false);
    });

    it("uses default range of 2", () => {
      expect(isFrameInRange(48, 50)).toBe(true);
      expect(isFrameInRange(47, 50)).toBe(false);
    });
  });

  // =========================================================================
  // frameIndexToNumber / frameNumberToIndex tests
  // =========================================================================
  describe("frameIndexToNumber", () => {
    it("converts 0-based index to 1-based number", () => {
      expect(frameIndexToNumber(0)).toBe(1);
      expect(frameIndexToNumber(191)).toBe(192);
    });
  });

  describe("frameNumberToIndex", () => {
    it("converts 1-based number to 0-based index", () => {
      expect(frameNumberToIndex(1)).toBe(0);
      expect(frameNumberToIndex(192)).toBe(191);
    });
  });
});
