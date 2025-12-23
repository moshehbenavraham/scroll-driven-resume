/**
 * Animation system type definitions for scroll and parallax hooks.
 */

import type { MotionValue } from "framer-motion";
import type { RefObject } from "react";

/**
 * Scroll direction during animation.
 */
export type ScrollDirection = "up" | "down" | null;

/**
 * Scroll offset configuration for Framer Motion useScroll.
 * First value: when element enters viewport
 * Second value: when element exits viewport
 *
 * Using string literal tuples for type safety with Framer Motion.
 */
export type ScrollOffset = [string, string];

/**
 * Default scroll offset - element starts animating when top enters bottom of viewport,
 * stops when bottom exits top of viewport.
 */
export const DEFAULT_SCROLL_OFFSET: ScrollOffset = ["start end", "end start"];

// ============================================================================
// useScrollProgress Types
// ============================================================================

/**
 * Options for the useScrollProgress hook.
 */
export interface UseScrollProgressOptions {
  /** Reference to the target section element */
  target: RefObject<HTMLElement | null>;
  /** Scroll offset configuration. Default: ["start end", "end start"] */
  offset?: ScrollOffset;
}

/**
 * Return value from useScrollProgress hook.
 */
export interface UseScrollProgressReturn {
  /** Scroll progress as MotionValue (0-1) */
  progress: MotionValue<number>;
  /** Whether the section is currently in view */
  isInView: boolean;
}

// ============================================================================
// useFrameAnimation Types
// ============================================================================

/**
 * Options for the useFrameAnimation hook.
 */
export interface UseFrameAnimationOptions {
  /** Reference to the target section element */
  target: RefObject<HTMLElement | null>;
  /** Total number of frames in the sequence */
  totalFrames: number;
  /** Scroll offset configuration. Default: ["start end", "end start"] */
  offset?: ScrollOffset;
}

/**
 * Return value from useFrameAnimation hook.
 */
export interface UseFrameAnimationReturn {
  /** Current frame index as MotionValue (0 to totalFrames-1) */
  frameIndex: MotionValue<number>;
  /** Scroll progress as MotionValue (0-1) */
  progress: MotionValue<number>;
  /** Current scroll direction */
  direction: ScrollDirection;
  /** Whether animation is currently active (section in view) */
  isActive: boolean;
}

// ============================================================================
// useParallax Types
// ============================================================================

/**
 * Options for the useParallax hook.
 */
export interface UseParallaxOptions {
  /** Reference to the target section element */
  target: RefObject<HTMLElement | null>;
  /** Speed multiplier (0.3-1.3 range). Default: 0.5 */
  speed?: number;
  /** Scroll offset configuration. Default: ["start end", "end start"] */
  offset?: ScrollOffset;
}

/**
 * Return value from useParallax hook.
 */
export interface UseParallaxReturn {
  /** Vertical parallax offset as MotionValue */
  y: MotionValue<number>;
  /** Horizontal parallax offset as MotionValue (for advanced effects) */
  x: MotionValue<number>;
  /** Opacity value as MotionValue (for fade effects) */
  opacity: MotionValue<number>;
}

// ============================================================================
// useFramePreload Types
// ============================================================================

/**
 * Callback for preload progress updates.
 */
export type PreloadProgressCallback = (percent: number) => void;

/**
 * Callback when preload completes.
 */
export type PreloadCompleteCallback = () => void;

/**
 * Callback when preload encounters an error.
 */
export type PreloadErrorCallback = (url: string, error: Error) => void;

/**
 * Options for the useFramePreload hook.
 */
export interface UseFramePreloadOptions {
  /** Array of frame URLs to preload */
  frames: string[];
  /** Number of frames to load with high priority. Default: 10 */
  priorityCount?: number;
  /** Callback fired on progress updates (0-100) */
  onProgress?: PreloadProgressCallback;
  /** Callback fired when all frames are loaded */
  onComplete?: PreloadCompleteCallback;
  /** Callback fired when a frame fails to load */
  onError?: PreloadErrorCallback;
}

/**
 * Return value from useFramePreload hook.
 */
export interface UseFramePreloadReturn {
  /** Whether preloading is currently in progress */
  isLoading: boolean;
  /** Whether all frames have been loaded */
  isComplete: boolean;
  /** Current progress percentage (0-100) */
  progress: number;
  /** Number of frames that have been loaded */
  loadedCount: number;
  /** Total number of frames to load */
  totalCount: number;
  /** Function to start preloading (for manual trigger) */
  startPreload: () => void;
}

// ============================================================================
// Scroll Utility Types
// ============================================================================

/**
 * Parameters for calculating frame index from progress.
 */
export interface CalculateFrameIndexParams {
  /** Current scroll progress (0-1) */
  progress: number;
  /** Total number of frames */
  totalFrames: number;
}

/**
 * Parameters for calculating parallax offset.
 */
export interface CalculateParallaxOffsetParams {
  /** Current scroll Y position */
  scrollY: number;
  /** Speed multiplier */
  speed: number;
  /** Container height for offset calculation */
  containerHeight: number;
}

/**
 * Parameters for normalizing scroll progress within a section.
 */
export interface NormalizeProgressParams {
  /** Current scroll Y position */
  scrollY: number;
  /** Top position of the section */
  sectionTop: number;
  /** Height of the section */
  sectionHeight: number;
  /** Height of the viewport */
  viewportHeight: number;
}

// ============================================================================
// Frame Sequence Configuration
// ============================================================================

/**
 * Configuration for a frame animation sequence.
 */
export interface FrameSequenceConfig {
  /** Unique identifier for the sequence */
  id: string;
  /** Display name of the sequence */
  name: string;
  /** Total number of frames */
  frameCount: number;
  /** Base URL path for frame images */
  basePath: string;
  /** File extension for frames */
  extension: "webp" | "png" | "jpg";
  /** Optional frame filename pattern (default: "frame_XXXX") */
  filenamePattern?: string;
}

/**
 * Pre-configured frame sequences for the portfolio.
 */
export const FRAME_SEQUENCES: Record<string, FrameSequenceConfig> = {
  hero: {
    id: "hero",
    name: "Hero Sequence",
    frameCount: 192,
    basePath: "/frames/hero",
    extension: "webp",
  },
  product: {
    id: "product",
    name: "Product Sequence",
    frameCount: 144,
    basePath: "/frames/product",
    extension: "webp",
  },
} as const;

// ============================================================================
// Parallax Layer Configuration
// ============================================================================

/**
 * Speed presets for parallax layers.
 */
export const PARALLAX_SPEEDS = {
  /** Background layer - slowest movement */
  background: 0.3,
  /** Mid-ground layer - medium movement */
  midground: 0.5,
  /** Default speed */
  default: 0.5,
  /** Foreground layer - fastest movement */
  foreground: 1.0,
  /** Extra fast for emphasis */
  fast: 1.3,
} as const;

export type ParallaxSpeedPreset = keyof typeof PARALLAX_SPEEDS;

// ============================================================================
// Frame Quality and URL Types (T005)
// ============================================================================

/**
 * Quality variant for frame images.
 */
export type FrameQuality = "desktop" | "mobile";

/**
 * Frame sequence identifier.
 */
export type FrameSequenceId = "hero" | "product";

/**
 * Parameters for generating a single frame URL.
 */
export interface GetFrameUrlParams {
  /** Sequence identifier (hero or product) */
  sequence: FrameSequenceId;
  /** Frame index (1-based, e.g., 1 to 192 for hero) */
  index: number;
  /** Quality variant (desktop or mobile) */
  quality: FrameQuality;
}

/**
 * Parameters for generating batch frame URLs.
 */
export interface GenerateFrameUrlsParams {
  /** Sequence identifier (hero or product) */
  sequence: FrameSequenceId;
  /** Total number of frames in the sequence */
  totalFrames: number;
  /** Quality variant (desktop or mobile) */
  quality: FrameQuality;
}

/**
 * Frame URL configuration from environment.
 */
export interface FrameUrlConfig {
  /** Base URL for frame assets (e.g., http://localhost:8089) */
  baseUrl: string;
  /** Bucket name pattern for desktop frames */
  desktopBucket: string;
  /** Bucket name pattern for mobile frames */
  mobileBucket: string;
}

// ============================================================================
// FrameSequence Component Types (T004)
// ============================================================================

/**
 * Props for the FrameSequence component.
 */
export interface FrameSequenceProps {
  /** Sequence identifier (hero or product) */
  sequence: FrameSequenceId;
  /** Reference to the container element for scroll tracking */
  containerRef: React.RefObject<HTMLElement | null>;
  /** Optional className for the wrapper element */
  className?: string;
  /** Optional priority count for preloading. Default: 10 */
  priorityCount?: number;
  /** Callback fired when all frames are preloaded */
  onLoadComplete?: () => void;
  /** Callback fired on preload progress updates (0-100) */
  onLoadProgress?: (percent: number) => void;
  /** Whether to disable animation (show static first frame) */
  disabled?: boolean;
  /** Custom scroll offset configuration */
  offset?: ScrollOffset;
}

/**
 * Props for the FrameImage component.
 */
export interface FrameImageProps {
  /** URL of the frame image */
  src: string;
  /** Alt text for accessibility */
  alt: string;
  /** Whether this frame is currently visible (opacity: 1) */
  isActive: boolean;
  /** Z-index for stacking order */
  zIndex: number;
  /** Optional className for styling */
  className?: string;
  /** Optional loading strategy. Default: "eager" */
  loading?: "eager" | "lazy";
}

/**
 * Return value from useFrameSequence hook.
 */
export interface UseFrameSequenceReturn {
  /** Current frame index (0-based) */
  currentFrame: number;
  /** Array of frame URLs */
  frameUrls: string[];
  /** Whether preloading is in progress */
  isLoading: boolean;
  /** Whether all frames are preloaded */
  isReady: boolean;
  /** Preload progress (0-100) */
  loadProgress: number;
  /** Current scroll direction */
  direction: ScrollDirection;
  /** Whether animation is active (section in view) */
  isActive: boolean;
  /** Whether reduced motion is preferred */
  prefersReducedMotion: boolean;
  /** Whether device is mobile (viewport < 768px) */
  isMobile: boolean;
  /** Start preloading manually */
  startPreload: () => void;
}

/**
 * Options for useFrameSequence hook.
 */
export interface UseFrameSequenceOptions {
  /** Sequence identifier (hero or product) */
  sequence: FrameSequenceId;
  /** Reference to container element for scroll tracking */
  containerRef: React.RefObject<HTMLElement | null>;
  /** Priority count for preloading. Default: 10 */
  priorityCount?: number;
  /** Scroll offset configuration */
  offset?: ScrollOffset;
  /** Callback on preload progress */
  onProgress?: (percent: number) => void;
  /** Callback when preload completes */
  onComplete?: () => void;
}

// ============================================================================
// Frame Sequence Constants
// ============================================================================

/**
 * Frame counts for each sequence.
 */
export const FRAME_COUNTS: Record<FrameSequenceId, number> = {
  hero: 192,
  product: 144,
} as const;

/**
 * Mobile breakpoint width in pixels.
 */
export const MOBILE_BREAKPOINT = 768;

/**
 * Number of frames to virtualize (current +/- this value).
 */
export const FRAME_VIRTUALIZATION_RANGE = 2;

// ============================================================================
// Canvas Frame Renderer Types
// ============================================================================

/**
 * Options for useImageCache hook.
 */
export interface UseImageCacheOptions {
  /** Array of frame URLs to cache */
  frameUrls: string[];
  /** Whether caching is enabled. Default: true */
  enabled?: boolean;
}

/**
 * Return value from useImageCache hook.
 */
export interface UseImageCacheReturn {
  /** Get cached image by frame index */
  getImage: (index: number) => HTMLImageElement | null;
  /** Check if specific frame is loaded */
  isImageLoaded: (index: number) => boolean;
  /** Number of images currently cached */
  loadedCount: number;
  /** Total number of images to cache */
  totalCount: number;
}

/**
 * Options for useCanvasRenderer hook.
 */
export interface UseCanvasRendererOptions {
  /** Reference to canvas element */
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  /** Current frame index to draw */
  currentFrame: number;
  /** Function to get cached image by index */
  getImage: (index: number) => HTMLImageElement | null;
  /** Whether rendering is enabled. Default: true */
  enabled?: boolean;
}

/**
 * Return value from useCanvasRenderer hook.
 */
export interface UseCanvasRendererReturn {
  /** Last successfully drawn frame index */
  lastDrawnFrame: number;
}

/**
 * Props for CanvasFrameRenderer component.
 */
export interface CanvasFrameRendererProps {
  /** Array of frame URLs */
  frameUrls: string[];
  /** Current frame index to display */
  currentFrame: number;
  /** Optional CSS class name */
  className?: string;
}

/**
 * Dimensions for canvas draw operation (object-fit: cover).
 */
export interface DrawDimensions {
  /** Source X offset (for cropping) */
  sx: number;
  /** Source Y offset (for cropping) */
  sy: number;
  /** Source width to draw */
  sWidth: number;
  /** Source height to draw */
  sHeight: number;
  /** Destination X offset */
  dx: number;
  /** Destination Y offset */
  dy: number;
  /** Destination width */
  dWidth: number;
  /** Destination height */
  dHeight: number;
}

// ============================================================================
// Parallax Types Re-export
// ============================================================================

/**
 * Re-export parallax types for convenience.
 * Full types available in types/parallax.ts
 */
export type {
  ParallaxLayerType,
  ParallaxContextValue,
  ParallaxContainerProps,
  ParallaxLayerProps,
  UseParallaxTransformOptions,
  UseParallaxTransformReturn,
} from "./parallax";
