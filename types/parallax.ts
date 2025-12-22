/**
 * Parallax layer system type definitions.
 * Types for container, layer, and transform components.
 */

import type { MotionValue } from "framer-motion";
import type { RefObject, ReactNode } from "react";
import type { ScrollOffset } from "./animation";

// ============================================================================
// Layer Configuration
// ============================================================================

/**
 * Named parallax layer types for semantic usage.
 */
export type ParallaxLayerType = "background" | "mid" | "foreground";

/**
 * Speed configuration for parallax layers.
 * - 0: Fixed relative to section (no parallax)
 * - 0.3-0.5: Slower than scroll (appears behind)
 * - 1.0: Normal scroll speed
 * - 1.0-1.3: Faster than scroll (appears in front)
 */
export interface ParallaxSpeedConfig {
  /** Minimum valid speed */
  min: number;
  /** Maximum valid speed */
  max: number;
  /** Default speed for unnamed layers */
  default: number;
}

/**
 * Default speed configuration.
 */
export const PARALLAX_SPEED_CONFIG: ParallaxSpeedConfig = {
  min: 0,
  max: 2.0,
  default: 0.5,
} as const;

/**
 * Speed presets by layer type.
 */
export const PARALLAX_LAYER_SPEEDS: Record<ParallaxLayerType, number> = {
  background: 0,
  mid: 0.4,
  foreground: 1.0,
} as const;

/**
 * Maximum number of layers allowed per container.
 */
export const MAX_PARALLAX_LAYERS = 5;

// ============================================================================
// Context Types
// ============================================================================

/**
 * Context value provided by ParallaxContainer.
 */
export interface ParallaxContextValue {
  /** Reference to the container element for scroll tracking */
  containerRef: RefObject<HTMLElement | null>;
  /** Scroll progress through the section (0-1) */
  scrollProgress: MotionValue<number>;
  /** Whether parallax is currently enabled */
  isEnabled: boolean;
  /** Whether user prefers reduced motion */
  prefersReducedMotion: boolean;
  /** Whether viewport is mobile width */
  isMobile: boolean;
  /** Register a layer (for count validation) */
  registerLayer: () => () => void;
  /** Current layer count */
  layerCount: number;
}

/**
 * Default context value (used when no container is present).
 */
export const DEFAULT_PARALLAX_CONTEXT: Omit<
  ParallaxContextValue,
  "containerRef" | "scrollProgress"
> = {
  isEnabled: false,
  prefersReducedMotion: false,
  isMobile: false,
  registerLayer: () => () => {},
  layerCount: 0,
};

// ============================================================================
// Component Props
// ============================================================================

/**
 * Props for ParallaxContainer component.
 */
export interface ParallaxContainerProps {
  /** Reference to the section element for scroll tracking */
  containerRef: RefObject<HTMLElement | null>;
  /** Child elements (ParallaxLayer components) */
  children: ReactNode;
  /** Optional scroll offset configuration */
  offset?: ScrollOffset;
  /** Whether parallax is enabled. Default: true */
  enabled?: boolean;
  /** Maximum layers allowed. Default: 5 */
  maxLayers?: number;
  /** Optional className for the wrapper */
  className?: string;
}

/**
 * Props for ParallaxLayer component.
 */
export interface ParallaxLayerProps {
  /** Child elements to render in this layer */
  children: ReactNode;
  /** Speed multiplier (0 = fixed, 0.3-0.5 = slow, 1.0-1.3 = fast) */
  speed?: number;
  /** Named layer type (sets speed automatically if speed not provided) */
  layer?: ParallaxLayerType;
  /** Optional className for the wrapper */
  className?: string;
  /** Z-index for stacking order */
  zIndex?: number;
  /** Whether this layer blocks pointer events. Default: false for mid, true for others */
  pointerEvents?: boolean;
}

// ============================================================================
// Hook Types
// ============================================================================

/**
 * Options for useParallaxTransform hook.
 */
export interface UseParallaxTransformOptions {
  /** Speed multiplier for parallax effect */
  speed: number;
  /** Scroll progress MotionValue (0-1) */
  scrollProgress: MotionValue<number>;
  /** Whether to enable the transform. Default: true */
  enabled?: boolean;
}

/**
 * Return value from useParallaxTransform hook.
 */
export interface UseParallaxTransformReturn {
  /** Y transform value for parallax offset */
  y: MotionValue<number>;
  /** Style object ready to apply to motion component */
  style: {
    y: MotionValue<number>;
    willChange: string;
  };
}

/**
 * Options for useIsMobile hook.
 */
export interface UseIsMobileOptions {
  /** Breakpoint width in pixels. Default: 768 */
  breakpoint?: number;
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Transform calculation parameters.
 */
export interface ParallaxTransformParams {
  /** Current scroll progress (0-1) */
  progress: number;
  /** Speed multiplier */
  speed: number;
  /** Maximum offset in pixels */
  maxOffset?: number;
}

/**
 * Calculate parallax Y offset from progress and speed.
 */
export type ParallaxOffsetCalculator = (params: ParallaxTransformParams) => number;
