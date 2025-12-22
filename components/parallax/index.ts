/**
 * Parallax components barrel export.
 * Provides convenient access to parallax system components.
 */

// Components
export { ParallaxContainer } from "./ParallaxContainer";
export { ParallaxLayer } from "./ParallaxLayer";

// Context
export {
  useParallaxContext,
  useParallaxContextSafe,
  ParallaxProvider,
} from "./ParallaxContext";

// Re-export types for convenience
export type {
  ParallaxLayerType,
  ParallaxContainerProps,
  ParallaxLayerProps,
  ParallaxContextValue,
} from "@/types/parallax";

export {
  PARALLAX_LAYER_SPEEDS,
  MAX_PARALLAX_LAYERS,
} from "@/types/parallax";
