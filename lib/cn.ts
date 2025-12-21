import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names using clsx and merges Tailwind classes intelligently.
 * Handles conditional classes and resolves Tailwind class conflicts.
 *
 * @example
 * cn("px-2 py-1", "px-4") // => "py-1 px-4"
 * cn("text-red-500", isActive && "text-blue-500") // => "text-blue-500" (if isActive)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
