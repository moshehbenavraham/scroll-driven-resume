/**
 * Frame URL utilities for MinIO-hosted frame sequences.
 * Generates URLs for hero and product frame sequences with quality variants.
 */

import type {
  FrameQuality,
  FrameSequenceId,
  GetFrameUrlParams,
  GenerateFrameUrlsParams,
} from "@/types/animation";

// ============================================================================
// Configuration
// ============================================================================

/**
 * Base URL for frame assets.
 * Uses nginx proxy in development for CORS and caching.
 */
const FRAME_BASE_URL =
  process.env.NEXT_PUBLIC_FRAME_BASE_URL || "http://localhost:8080";

/**
 * Bucket names for frame quality variants.
 */
const BUCKET_NAMES: Record<FrameQuality, string> = {
  desktop: "frames-desktop",
  mobile: "frames-mobile",
};

// ============================================================================
// URL Generation (T006)
// ============================================================================

/**
 * Generates a URL for a single frame image.
 *
 * @param params - Parameters for URL generation
 * @param params.sequence - Sequence identifier (hero or product)
 * @param params.index - Frame index (1-based, e.g., 1 to 192)
 * @param params.quality - Quality variant (desktop or mobile)
 * @returns Full URL to the frame image
 *
 * @example
 * getFrameUrl({ sequence: "hero", index: 1, quality: "desktop" })
 * // => "http://localhost:8080/frames-desktop/hero/frame_0001.webp"
 */
export function getFrameUrl(params: GetFrameUrlParams): string {
  const { sequence, index, quality } = params;

  // Validate index is positive
  if (index < 1) {
    console.warn(`[frame-utils] Invalid frame index: ${index}. Using 1.`);
    return buildFrameUrl(sequence, 1, quality);
  }

  return buildFrameUrl(sequence, index, quality);
}

/**
 * Internal helper to build frame URL with proper formatting.
 */
function buildFrameUrl(
  sequence: FrameSequenceId,
  index: number,
  quality: FrameQuality
): string {
  const bucket = BUCKET_NAMES[quality];
  // Pad index to 4 digits (e.g., 1 => "0001")
  const paddedIndex = String(index).padStart(4, "0");

  return `${FRAME_BASE_URL}/${bucket}/${sequence}/frame_${paddedIndex}.webp`;
}

// ============================================================================
// Batch URL Generation (T007)
// ============================================================================

/**
 * Generates an array of URLs for all frames in a sequence.
 *
 * @param params - Parameters for batch generation
 * @param params.sequence - Sequence identifier (hero or product)
 * @param params.totalFrames - Total number of frames to generate
 * @param params.quality - Quality variant (desktop or mobile)
 * @returns Array of frame URLs (0-indexed, but URLs use 1-based frame numbers)
 *
 * @example
 * const urls = generateFrameUrls({
 *   sequence: "hero",
 *   totalFrames: 192,
 *   quality: "desktop"
 * });
 * // urls[0] => "http://localhost:8080/frames-desktop/hero/frame_0001.webp"
 * // urls[191] => "http://localhost:8080/frames-desktop/hero/frame_0192.webp"
 */
export function generateFrameUrls(params: GenerateFrameUrlsParams): string[] {
  const { sequence, totalFrames, quality } = params;

  if (totalFrames <= 0) {
    return [];
  }

  const urls: string[] = [];

  for (let i = 0; i < totalFrames; i++) {
    // Convert 0-based array index to 1-based frame number
    urls.push(
      getFrameUrl({
        sequence,
        index: i + 1,
        quality,
      })
    );
  }

  return urls;
}

/**
 * Generates frame URLs for a specific range.
 * Useful for virtualization where only a subset of frames are needed.
 *
 * @param sequence - Sequence identifier
 * @param startIndex - Start index (0-based)
 * @param endIndex - End index (0-based, exclusive)
 * @param quality - Quality variant
 * @returns Array of frame URLs for the specified range
 */
export function generateFrameUrlRange(
  sequence: FrameSequenceId,
  startIndex: number,
  endIndex: number,
  quality: FrameQuality
): string[] {
  const urls: string[] = [];

  for (let i = startIndex; i < endIndex; i++) {
    urls.push(
      getFrameUrl({
        sequence,
        index: i + 1,
        quality,
      })
    );
  }

  return urls;
}

// ============================================================================
// Quality Detection (T008)
// ============================================================================

/**
 * Mobile breakpoint for quality detection.
 */
const MOBILE_WIDTH_THRESHOLD = 768;

/**
 * Determines optimal quality based on viewport width.
 * Returns "mobile" for viewports under 768px, "desktop" otherwise.
 *
 * @param viewportWidth - Current viewport width in pixels
 * @returns Optimal quality variant
 *
 * @example
 * getOptimalQuality(1920) // => "desktop"
 * getOptimalQuality(375)  // => "mobile"
 * getOptimalQuality()     // => Uses window.innerWidth if available
 */
export function getOptimalQuality(viewportWidth?: number): FrameQuality {
  // Use provided width or try to get from window
  let width = viewportWidth;

  if (width === undefined) {
    // SSR safety: default to desktop if window not available
    if (typeof window === "undefined") {
      return "desktop";
    }
    width = window.innerWidth;
  }

  return width < MOBILE_WIDTH_THRESHOLD ? "mobile" : "desktop";
}

/**
 * Checks if the current device should use mobile quality.
 * Safe for SSR - returns false on server.
 *
 * @returns True if mobile quality should be used
 */
export function isMobileDevice(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return window.innerWidth < MOBILE_WIDTH_THRESHOLD;
}

/**
 * Creates a media query matcher for mobile detection.
 * Returns null on server.
 *
 * @returns MediaQueryList or null
 */
export function createMobileMediaQuery(): MediaQueryList | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.matchMedia(`(max-width: ${MOBILE_WIDTH_THRESHOLD - 1}px)`);
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Calculates the virtualized frame range based on current frame index.
 * Returns indices of frames to render (current +/- range).
 *
 * @param currentFrame - Current frame index (0-based)
 * @param totalFrames - Total number of frames
 * @param range - Number of frames to include before/after current (default: 2)
 * @returns Object with start and end indices (inclusive)
 */
export function getVirtualizedRange(
  currentFrame: number,
  totalFrames: number,
  range: number = 2
): { start: number; end: number } {
  const start = Math.max(0, currentFrame - range);
  const end = Math.min(totalFrames - 1, currentFrame + range);

  return { start, end };
}

/**
 * Checks if a frame index is within the virtualized range.
 *
 * @param frameIndex - Frame index to check
 * @param currentFrame - Current active frame index
 * @param range - Virtualization range (default: 2)
 * @returns True if frame should be rendered
 */
export function isFrameInRange(
  frameIndex: number,
  currentFrame: number,
  range: number = 2
): boolean {
  return Math.abs(frameIndex - currentFrame) <= range;
}

/**
 * Converts a 0-based frame index to a 1-based frame number.
 *
 * @param index - 0-based index
 * @returns 1-based frame number
 */
export function frameIndexToNumber(index: number): number {
  return index + 1;
}

/**
 * Converts a 1-based frame number to a 0-based index.
 *
 * @param frameNumber - 1-based frame number
 * @returns 0-based index
 */
export function frameNumberToIndex(frameNumber: number): number {
  return frameNumber - 1;
}
