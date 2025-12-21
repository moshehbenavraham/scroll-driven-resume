/**
 * General utility functions for the application.
 */

/**
 * Returns the asset URL for a given path.
 * Uses the NEXT_PUBLIC_ASSET_BASE_URL environment variable.
 */
export function getAssetUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_ASSET_BASE_URL ?? "";
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${baseUrl}/${cleanPath}`;
}

/**
 * Formats a number with commas as thousands separators.
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

/**
 * Clamps a number between a minimum and maximum value.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation between two values.
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * clamp(t, 0, 1);
}

/**
 * Maps a value from one range to another.
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}
