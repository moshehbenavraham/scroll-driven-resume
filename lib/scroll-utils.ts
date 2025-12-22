/**
 * Scroll and animation utility functions.
 * Pure functions for calculating frame indices, parallax offsets, and progress normalization.
 */

import { clamp } from "./utils";

/**
 * Calculates the frame index from scroll progress.
 * Maps a 0-1 progress value to a discrete frame index (0 to totalFrames-1).
 *
 * @param progress - Current scroll progress (0-1)
 * @param totalFrames - Total number of frames in the sequence
 * @returns Frame index (0 to totalFrames-1)
 *
 * @example
 * calculateFrameIndex(0, 192)     // 0
 * calculateFrameIndex(0.5, 192)   // 95
 * calculateFrameIndex(1, 192)     // 191
 */
export function calculateFrameIndex(
  progress: number,
  totalFrames: number
): number {
  if (totalFrames <= 0) {
    return 0;
  }

  // Clamp progress to valid range
  const clampedProgress = clamp(progress, 0, 1);

  // Map progress to frame index
  // Use (totalFrames - 1) to ensure we never exceed the last valid index
  const frameIndex = Math.floor(clampedProgress * (totalFrames - 1));

  // Clamp to valid frame range as safety
  return clamp(frameIndex, 0, totalFrames - 1);
}

/**
 * Calculates the parallax offset based on scroll position and speed.
 *
 * @param scrollY - Current scroll Y position
 * @param speed - Speed multiplier (0.3-1.3 typical range)
 * @param containerHeight - Height of the container for offset calculation
 * @returns Parallax offset in pixels
 *
 * @example
 * calculateParallaxOffset(100, 0.5, 800)  // 50 (half speed)
 * calculateParallaxOffset(100, 1.3, 800)  // 130 (faster than scroll)
 */
export function calculateParallaxOffset(
  scrollY: number,
  speed: number,
  containerHeight: number
): number {
  // Speed of 1.0 means element moves at scroll speed
  // Speed < 1.0 means element moves slower (appears to be further back)
  // Speed > 1.0 means element moves faster (appears to be closer)
  const offset = scrollY * (speed - 1);

  // Optionally clamp to container bounds
  if (containerHeight > 0) {
    return clamp(offset, -containerHeight, containerHeight);
  }

  return offset;
}

/**
 * Normalizes scroll position to 0-1 progress within a section.
 * Returns 0 before section enters viewport, 0-1 during traverse, 1 after exit.
 *
 * @param scrollY - Current window scroll Y position
 * @param sectionTop - Top position of the section (element.offsetTop)
 * @param sectionHeight - Height of the section
 * @param viewportHeight - Height of the viewport (window.innerHeight)
 * @returns Normalized progress (0-1)
 *
 * @example
 * // Section starts at 500px, is 1000px tall, viewport is 800px
 * normalizeProgress(0, 500, 1000, 800)     // 0 (before section)
 * normalizeProgress(500, 500, 1000, 800)   // 0 (section top at viewport bottom)
 * normalizeProgress(900, 500, 1000, 800)   // 0.5 (midway)
 * normalizeProgress(1300, 500, 1000, 800)  // 1 (section bottom at viewport top)
 */
export function normalizeProgress(
  scrollY: number,
  sectionTop: number,
  sectionHeight: number,
  viewportHeight: number
): number {
  // Handle invalid inputs
  if (sectionHeight <= 0 || viewportHeight <= 0) {
    return 0;
  }

  // Calculate the scroll range for the section
  // Start: when section top enters viewport bottom
  // End: when section bottom exits viewport top
  const startScroll = sectionTop - viewportHeight;
  const endScroll = sectionTop + sectionHeight;
  const scrollRange = endScroll - startScroll;

  if (scrollRange <= 0) {
    return 0;
  }

  // Calculate progress
  const progress = (scrollY - startScroll) / scrollRange;

  return clamp(progress, 0, 1);
}

/**
 * Determines scroll direction based on previous and current positions.
 *
 * @param previousY - Previous scroll Y position
 * @param currentY - Current scroll Y position
 * @returns "up", "down", or null if no change
 */
export function getScrollDirection(
  previousY: number,
  currentY: number
): "up" | "down" | null {
  if (currentY > previousY) {
    return "down";
  }
  if (currentY < previousY) {
    return "up";
  }
  return null;
}

/**
 * Checks if a section is currently within the viewport.
 *
 * @param sectionTop - Top position of the section
 * @param sectionHeight - Height of the section
 * @param scrollY - Current scroll Y position
 * @param viewportHeight - Height of the viewport
 * @returns Whether the section is in view
 */
export function isSectionInView(
  sectionTop: number,
  sectionHeight: number,
  scrollY: number,
  viewportHeight: number
): boolean {
  const sectionBottom = sectionTop + sectionHeight;
  const viewportTop = scrollY;
  const viewportBottom = scrollY + viewportHeight;

  // Section is in view if it overlaps with viewport
  return sectionBottom > viewportTop && sectionTop < viewportBottom;
}

/**
 * Generates frame URLs for a sequence.
 *
 * @param basePath - Base URL path for frames
 * @param frameCount - Total number of frames
 * @param extension - File extension (webp, png, jpg)
 * @param pattern - Filename pattern (default: "frame_XXXX")
 * @returns Array of frame URLs
 */
export function generateFrameUrls(
  basePath: string,
  frameCount: number,
  extension: "webp" | "png" | "jpg",
  pattern: string = "frame_"
): string[] {
  const urls: string[] = [];

  for (let i = 0; i < frameCount; i++) {
    // Pad frame number to 4 digits (e.g., 0001, 0002, ...)
    const paddedIndex = String(i + 1).padStart(4, "0");
    urls.push(`${basePath}/${pattern}${paddedIndex}.${extension}`);
  }

  return urls;
}

/**
 * Calculates opacity based on scroll progress for fade effects.
 * Fades in during first 20% and fades out during last 20%.
 *
 * @param progress - Current scroll progress (0-1)
 * @param fadeInEnd - Progress point where fade in completes (default: 0.2)
 * @param fadeOutStart - Progress point where fade out begins (default: 0.8)
 * @returns Opacity value (0-1)
 */
export function calculateFadeOpacity(
  progress: number,
  fadeInEnd: number = 0.2,
  fadeOutStart: number = 0.8
): number {
  const clampedProgress = clamp(progress, 0, 1);

  // Fade in phase
  if (clampedProgress < fadeInEnd) {
    return clampedProgress / fadeInEnd;
  }

  // Visible phase
  if (clampedProgress < fadeOutStart) {
    return 1;
  }

  // Fade out phase
  return 1 - (clampedProgress - fadeOutStart) / (1 - fadeOutStart);
}
