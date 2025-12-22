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

// Default exports for convenience
export { default as useScrollProgressDefault } from "./useScrollProgress";
export { default as useFrameAnimationDefault } from "./useFrameAnimation";
export { default as useParallaxDefault } from "./useParallax";
export { default as useFramePreloadDefault } from "./useFramePreload";
export { default as useReducedMotionDefault } from "./useReducedMotion";
export { default as useFrameSequenceDefault } from "./useFrameSequence";
