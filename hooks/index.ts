/**
 * Hooks barrel export.
 * Provides convenient access to all custom hooks.
 */

// Scroll and animation hooks
export { useScrollProgress } from "./useScrollProgress";
export { useFrameAnimation } from "./useFrameAnimation";
export { useParallax } from "./useParallax";
export { useFramePreload } from "./useFramePreload";
export { useFrameSequence, FRAME_COUNTS } from "./useFrameSequence";

// Accessibility hooks
export { useReducedMotion } from "./useReducedMotion";
export { useIsMobile } from "./useIsMobile";

// Parallax hooks
export { useParallaxTransform } from "./useParallaxTransform";

// WebGL hooks
export { useWebGLCapabilities } from "./useWebGLCapabilities";

// Canvas rendering hooks
export { useImageCache } from "./useImageCache";
export { useCanvasRenderer } from "./useCanvasRenderer";

// Unified WebGL hooks
export { useTextureLoader } from "./useTextureLoader";
export { useUnifiedFrameAnimation } from "./useUnifiedFrameAnimation";

// Navigation hooks
export { useActiveSection } from "./useActiveSection";
export { useScrollDirection } from "./useScrollDirection";

// Default exports for convenience
export { default as useScrollProgressDefault } from "./useScrollProgress";
export { default as useFrameAnimationDefault } from "./useFrameAnimation";
export { default as useParallaxDefault } from "./useParallax";
export { default as useFramePreloadDefault } from "./useFramePreload";
export { default as useReducedMotionDefault } from "./useReducedMotion";
export { default as useIsMobileDefault } from "./useIsMobile";
export { default as useParallaxTransformDefault } from "./useParallaxTransform";
export { default as useFrameSequenceDefault } from "./useFrameSequence";
export { default as useWebGLCapabilitiesDefault } from "./useWebGLCapabilities";
export { default as useImageCacheDefault } from "./useImageCache";
export { default as useCanvasRendererDefault } from "./useCanvasRenderer";
export { default as useTextureLoaderDefault } from "./useTextureLoader";
export { default as useUnifiedFrameAnimationDefault } from "./useUnifiedFrameAnimation";
export { default as useActiveSectionDefault } from "./useActiveSection";
export { default as useScrollDirectionDefault } from "./useScrollDirection";
