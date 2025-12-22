/**
 * Decorative elements type definitions.
 * Types for floating shapes, connection lines, gradients, and noise overlays.
 */

import type { MotionValue } from "framer-motion";
import type { ReactNode, CSSProperties } from "react";

// ============================================================================
// Shape Configuration
// ============================================================================

/**
 * Available decorative shape variants.
 */
export type DecorativeShapeVariant = "circle" | "triangle" | "hexagon" | "diamond";

/**
 * Shape size presets.
 */
export type DecorativeShapeSize = "sm" | "md" | "lg";

/**
 * Shape size values in pixels.
 */
export const DECORATIVE_SHAPE_SIZES: Record<DecorativeShapeSize, number> = {
  sm: 24,
  md: 40,
  lg: 64,
} as const;

/**
 * Shape color presets using CSS custom properties.
 */
export type DecorativeShapeColor =
  | "accent"
  | "muted"
  | "highlight"
  | "custom";

// ============================================================================
// Position Configuration
// ============================================================================

/**
 * Position configuration for decorative elements.
 * Uses percentage-based positioning for responsive layouts.
 */
export interface DecorativePosition {
  /** Horizontal position as percentage (0-100) */
  x: number;
  /** Vertical position as percentage (0-100) */
  y: number;
}

/**
 * Z-index values for decorative layer stacking.
 */
export const DECORATIVE_Z_INDEX = {
  gradientMesh: 5,
  connectionLine: 6,
  floatingShape: 7,
  noiseOverlay: 8,
} as const;

// ============================================================================
// Shape Component Props
// ============================================================================

/**
 * Base props for SVG shape components.
 */
export interface ShapeSVGProps {
  /** Size in pixels */
  size?: number;
  /** Fill color (CSS color value) */
  fill?: string;
  /** Stroke color (CSS color value) */
  stroke?: string;
  /** Stroke width in pixels */
  strokeWidth?: number;
  /** Opacity value (0-1) */
  opacity?: number;
  /** Optional className for SVG element */
  className?: string;
}

/**
 * Props for FloatingShape component.
 */
export interface FloatingShapeProps {
  /** Shape variant to render */
  variant: DecorativeShapeVariant;
  /** Position as percentage coordinates */
  position: DecorativePosition;
  /** Size preset or custom pixel value */
  size?: DecorativeShapeSize | number;
  /** Color preset or custom CSS color */
  color?: DecorativeShapeColor | string;
  /** Opacity value (0-1). Default: 0.3 */
  opacity?: number;
  /** Blur amount in pixels for depth effect. Default: 0 */
  blur?: number;
  /** Parallax speed multiplier (0.3-0.5 recommended). Default: 0.4 */
  speed?: number;
  /** Animation delay in seconds for staggered reveals. Default: 0 */
  delay?: number;
  /** Optional className */
  className?: string;
}

// ============================================================================
// Connection Line Props
// ============================================================================

/**
 * Props for ConnectionLine component.
 */
export interface ConnectionLineProps {
  /** Start position as percentage coordinates */
  start: DecorativePosition;
  /** End position as percentage coordinates */
  end: DecorativePosition;
  /** Line color (CSS color value). Default: accent */
  color?: string;
  /** Line thickness in pixels. Default: 1 */
  thickness?: number;
  /** Opacity value (0-1). Default: 0.2 */
  opacity?: number;
  /** Whether to animate line drawing on scroll. Default: true */
  animated?: boolean;
  /** Animation delay in seconds. Default: 0 */
  delay?: number;
  /** Optional className */
  className?: string;
}

// ============================================================================
// Gradient Mesh Props
// ============================================================================

/**
 * Gradient stop configuration.
 */
export interface GradientStop {
  /** Color value (CSS color) */
  color: string;
  /** Position as percentage (0-100) */
  position: number;
}

/**
 * Props for GradientMesh component.
 */
export interface GradientMeshProps {
  /** Array of gradient stops */
  stops?: GradientStop[];
  /** Gradient type. Default: radial */
  type?: "radial" | "linear" | "conic";
  /** Gradient angle for linear gradients (degrees). Default: 45 */
  angle?: number;
  /** Overall opacity (0-1). Default: 0.5 */
  opacity?: number;
  /** Blend mode for layering. Default: normal */
  blendMode?: CSSProperties["mixBlendMode"];
  /** Optional className */
  className?: string;
}

// ============================================================================
// Noise Overlay Props
// ============================================================================

/**
 * Props for NoiseOverlay component.
 */
export interface NoiseOverlayProps {
  /** Noise intensity (0-1). Default: 0.05 */
  intensity?: number;
  /** Blend mode for noise layer. Default: overlay */
  blendMode?: CSSProperties["mixBlendMode"];
  /** Whether to animate noise. Default: false */
  animated?: boolean;
  /** Optional className */
  className?: string;
}

// ============================================================================
// Container Props
// ============================================================================

/**
 * Configuration for a single decorative element in the container.
 */
export interface DecorativeElementConfig {
  /** Unique identifier for the element */
  id: string;
  /** Element type */
  type: "shape" | "line" | "gradient" | "noise";
  /** Element-specific props */
  props: FloatingShapeProps | ConnectionLineProps | GradientMeshProps | NoiseOverlayProps;
}

/**
 * Props for DecorativeElements container component.
 */
export interface DecorativeElementsProps {
  /** Array of element configurations */
  elements?: DecorativeElementConfig[];
  /** Children elements (alternative to config array) */
  children?: ReactNode;
  /** Whether to enable staggered reveal animation. Default: true */
  staggered?: boolean;
  /** Stagger delay between elements in seconds. Default: 0.1 */
  staggerDelay?: number;
  /** Scroll progress for parallax (0-1) */
  scrollProgress?: MotionValue<number>;
  /** Whether to show on mobile. Default: false */
  showOnMobile?: boolean;
  /** Optional className for container */
  className?: string;
}

// ============================================================================
// Hook Types
// ============================================================================

/**
 * Options for useDecorativeParallax hook.
 */
export interface UseDecorativeParallaxOptions {
  /** Parallax speed multiplier */
  speed: number;
  /** Scroll progress MotionValue */
  scrollProgress: MotionValue<number>;
  /** Whether parallax is enabled */
  enabled?: boolean;
}

/**
 * Return value from useDecorativeParallax hook.
 */
export interface UseDecorativeParallaxReturn {
  /** Y transform value */
  y: MotionValue<number>;
  /** Opacity for reveal animation */
  opacity: MotionValue<number>;
  /** Combined style object */
  style: {
    y: MotionValue<number>;
    opacity: MotionValue<number>;
  };
}

// ============================================================================
// Preset Configurations
// ============================================================================

/**
 * Default color values for decorative elements.
 */
export const DECORATIVE_COLORS = {
  accent: "rgba(147, 112, 219, 0.6)",
  muted: "rgba(100, 100, 120, 0.4)",
  highlight: "rgba(255, 255, 255, 0.3)",
} as const;

/**
 * Default gradient mesh stops.
 */
export const DEFAULT_GRADIENT_STOPS: GradientStop[] = [
  { color: "rgba(147, 112, 219, 0.1)", position: 0 },
  { color: "rgba(100, 100, 120, 0.05)", position: 50 },
  { color: "transparent", position: 100 },
];
