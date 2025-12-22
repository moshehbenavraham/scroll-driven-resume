/**
 * Three.js/R3F components barrel export.
 * Provides access to all WebGL components and effects.
 */

// Canvas wrapper
export { CanvasWrapper } from "./canvas-wrapper";

// Unified hero canvas (combines frame animation + effects)
export { UnifiedHeroCanvas } from "./UnifiedHeroCanvas";

// Legacy hero WebGL effect (deprecated - use UnifiedHeroCanvas)
export { HeroWebGLEffect } from "./HeroWebGLEffect";

// Individual effects
export { ParticleField, GlowAura, FramePlane } from "./effects";

// Fallback component
export { WebGLFallback } from "./fallbacks/WebGLFallback";
