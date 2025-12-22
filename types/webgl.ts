/**
 * WebGL capability and effect type definitions.
 * Used for GPU detection, quality adjustment, and WebGL effects.
 */

import type { MotionValue } from "framer-motion";

/**
 * GPU performance tier classification.
 * Used to determine effect quality and particle counts.
 */
export type GPUTier = "high" | "medium" | "low" | "unsupported";

/**
 * WebGL support level detection result.
 */
export interface WebGLSupport {
  /** WebGL 1.0 is available */
  webgl1: boolean;
  /** WebGL 2.0 is available */
  webgl2: boolean;
  /** Maximum supported texture size */
  maxTextureSize: number;
  /** Maximum vertex uniforms available */
  maxVertexUniforms: number;
  /** GPU vendor string */
  vendor: string;
  /** GPU renderer string */
  renderer: string;
}

/**
 * Quality settings based on GPU tier.
 * Controls effect complexity for performance optimization.
 */
export interface QualitySettings {
  /** Number of particles to render (0-1000) */
  particleCount: number;
  /** Whether to enable shader effects */
  enableShaders: boolean;
  /** Effect opacity multiplier (0-1) */
  opacityMultiplier: number;
  /** Whether to enable bloom/glow effects */
  enableGlow: boolean;
  /** Target frames per second for adaptive quality */
  targetFPS: number;
}

/**
 * WebGL capabilities detection result.
 * Returned by useWebGLCapabilities hook.
 */
export interface WebGLCapabilities {
  /** Whether WebGL effects should be enabled */
  isEnabled: boolean;
  /** Detected GPU performance tier */
  tier: GPUTier;
  /** Quality settings based on tier */
  quality: QualitySettings;
  /** Raw WebGL support information */
  support: WebGLSupport;
  /** Reason for disabling (if disabled) */
  disableReason?: WebGLDisableReason;
}

/**
 * Reasons why WebGL effects might be disabled.
 */
export type WebGLDisableReason =
  | "no-webgl"
  | "mobile-viewport"
  | "reduced-motion"
  | "low-performance"
  | "context-lost";

/**
 * Effect type options for HeroWebGLEffect.
 */
export type WebGLEffectType = "particles" | "glow" | "none";

/**
 * Base props shared by all WebGL effect components.
 */
export interface BaseEffectProps {
  /** Scroll progress value (0-1) */
  scrollProgress: MotionValue<number>;
  /** Quality settings for adaptive rendering */
  quality: QualitySettings;
  /** Whether the effect is active */
  isActive?: boolean;
}

/**
 * Props for ParticleField effect component.
 */
export interface ParticleFieldProps extends BaseEffectProps {
  /** Particle color (CSS color string) */
  color?: string;
  /** Particle size range [min, max] */
  sizeRange?: [number, number];
  /** Spread area dimensions [width, height, depth] */
  spread?: [number, number, number];
  /** Movement speed multiplier */
  speed?: number;
}

/**
 * Props for GlowAura effect component.
 */
export interface GlowAuraProps extends BaseEffectProps {
  /** Center color of glow */
  innerColor?: string;
  /** Edge color of glow */
  outerColor?: string;
  /** Glow radius */
  radius?: number;
  /** Pulse intensity (0-1) */
  pulseIntensity?: number;
}

/**
 * Props for HeroWebGLEffect component.
 */
export interface HeroWebGLEffectProps {
  /** Optional CSS class name */
  className?: string;
  /** Effect type to render */
  effectType?: WebGLEffectType;
  /** Scroll progress for synchronization */
  scrollProgress?: MotionValue<number>;
  /** Force disable WebGL effects */
  disabled?: boolean;
}

/**
 * Props for WebGLFallback component.
 */
export interface WebGLFallbackProps {
  /** Optional CSS class name */
  className?: string;
  /** Reason for fallback display */
  reason?: WebGLDisableReason;
  /** Whether to show visible fallback effect */
  showEffect?: boolean;
}

/**
 * Default quality settings for each GPU tier.
 */
export const DEFAULT_QUALITY_SETTINGS: Record<GPUTier, QualitySettings> = {
  high: {
    particleCount: 500,
    enableShaders: true,
    opacityMultiplier: 1.0,
    enableGlow: true,
    targetFPS: 60,
  },
  medium: {
    particleCount: 250,
    enableShaders: true,
    opacityMultiplier: 0.8,
    enableGlow: false,
    targetFPS: 45,
  },
  low: {
    particleCount: 100,
    enableShaders: false,
    opacityMultiplier: 0.6,
    enableGlow: false,
    targetFPS: 30,
  },
  unsupported: {
    particleCount: 0,
    enableShaders: false,
    opacityMultiplier: 0,
    enableGlow: false,
    targetFPS: 0,
  },
};

// ============================================================================
// Unified Hero Canvas Types
// ============================================================================

import type { FrameSequenceId } from "./animation";

/**
 * Props for UnifiedHeroCanvas component.
 */
export interface UnifiedHeroCanvasProps {
  /** Frame sequence to display (hero or product) */
  sequence: FrameSequenceId;
  /** Reference to container element for scroll tracking */
  containerRef: React.RefObject<HTMLElement | null>;
  /** Effect type to render. Default: "particles" */
  effectType?: WebGLEffectType;
  /** Optional CSS class name */
  className?: string;
  /** Callback when frame preload completes */
  onLoadComplete?: () => void;
  /** Callback for frame preload progress (0-100) */
  onLoadProgress?: (percent: number) => void;
  /** Force disable WebGL rendering */
  disabled?: boolean;
}

/**
 * Props for FramePlane component.
 * Note: The actual component uses THREE.Texture type from three.js.
 */
export interface FramePlaneProps {
  /** Current frame texture to display (THREE.Texture | null) */
  texture: unknown;
  /** Render order for z-layering. Default: 0 */
  renderOrder?: number;
  /** Z-position for depth ordering. Default: -2 */
  zPosition?: number;
}
