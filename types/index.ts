/**
 * Shared TypeScript type definitions for the application.
 */

// Re-export animation types
export * from "./animation";

// Re-export hero types
export * from "./hero";

// Re-export WebGL types
export * from "./webgl";

// Re-export product types
export * from "./product";

// Re-export decorative types
export * from "./decorative";

// Re-export about types
export * from "./about";

/**
 * Theme options for the application.
 */
export type Theme = "light" | "dark" | "system";

/**
 * Base props that all components can extend.
 */
export interface BaseComponentProps {
  className?: string;
}

/**
 * Props for components that can have children.
 */
export interface WithChildren {
  children?: React.ReactNode;
}

/**
 * Frame sequence asset information.
 */
export interface FrameSequence {
  id: string;
  name: string;
  frameCount: number;
  basePath: string;
  extension: "webp" | "png" | "jpg";
}

/**
 * Animation state for scroll-based animations.
 */
export interface AnimationState {
  progress: number;
  isActive: boolean;
  direction: "up" | "down" | null;
}

/**
 * Viewport dimensions and scroll information.
 */
export interface ViewportInfo {
  width: number;
  height: number;
  scrollY: number;
  scrollProgress: number;
}

/**
 * Section configuration for the portfolio.
 */
export interface SectionConfig {
  id: string;
  title: string;
  subtitle?: string;
  order: number;
}
