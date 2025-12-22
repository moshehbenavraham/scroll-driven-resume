"use client";

/**
 * ParallaxContext - Shared state between ParallaxContainer and ParallaxLayer.
 * Provides scroll progress, enabled state, and layer registration.
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useMotionValue, type MotionValue } from "framer-motion";
import {
  MAX_PARALLAX_LAYERS,
  type ParallaxContextValue,
} from "@/types/parallax";

/**
 * Context for sharing parallax state between container and layers.
 */
const ParallaxContext = createContext<ParallaxContextValue | null>(null);

/**
 * Hook to access parallax context.
 * Throws error if used outside ParallaxContainer.
 *
 * @returns ParallaxContextValue
 * @throws Error if no ParallaxContainer ancestor
 *
 * @example
 * function ParallaxLayer() {
 *   const { scrollProgress, isEnabled } = useParallaxContext();
 *   // ...
 * }
 */
export function useParallaxContext(): ParallaxContextValue {
  const context = useContext(ParallaxContext);

  if (!context) {
    throw new Error(
      "useParallaxContext must be used within a ParallaxContainer"
    );
  }

  return context;
}

/**
 * Safe hook to access parallax context without throwing.
 * Returns null if no container is present.
 *
 * @returns ParallaxContextValue or null
 *
 * @example
 * const context = useParallaxContextSafe();
 * if (context?.isEnabled) {
 *   // Apply parallax
 * }
 */
export function useParallaxContextSafe(): ParallaxContextValue | null {
  return useContext(ParallaxContext);
}

/**
 * Props for ParallaxProvider component.
 */
interface ParallaxProviderProps {
  /** Container element reference for scroll tracking */
  containerRef: React.RefObject<HTMLElement | null>;
  /** Scroll progress MotionValue */
  scrollProgress: MotionValue<number>;
  /** Whether parallax is enabled */
  isEnabled: boolean;
  /** Whether user prefers reduced motion */
  prefersReducedMotion: boolean;
  /** Whether viewport is mobile */
  isMobile: boolean;
  /** Maximum allowed layers */
  maxLayers?: number;
  /** Child elements */
  children: React.ReactNode;
}

/**
 * Provider component for parallax context.
 * Used internally by ParallaxContainer.
 */
export function ParallaxProvider({
  containerRef,
  scrollProgress,
  isEnabled,
  prefersReducedMotion,
  isMobile,
  maxLayers = MAX_PARALLAX_LAYERS,
  children,
}: ParallaxProviderProps) {
  const [layerCount, setLayerCount] = useState(0);

  // Register a layer and return unregister function
  const registerLayer = useCallback(() => {
    setLayerCount((prev) => {
      const newCount = prev + 1;
      if (newCount > maxLayers) {
        console.warn(
          `[ParallaxContainer] Maximum layer count (${maxLayers}) exceeded. ` +
            `Current: ${newCount}. Performance may be affected.`
        );
      }
      return newCount;
    });

    // Return cleanup function
    return () => {
      setLayerCount((prev) => Math.max(0, prev - 1));
    };
  }, [maxLayers]);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo<ParallaxContextValue>(
    () => ({
      containerRef,
      scrollProgress,
      isEnabled,
      prefersReducedMotion,
      isMobile,
      registerLayer,
      layerCount,
    }),
    [
      containerRef,
      scrollProgress,
      isEnabled,
      prefersReducedMotion,
      isMobile,
      registerLayer,
      layerCount,
    ]
  );

  return (
    <ParallaxContext.Provider value={value}>
      {children}
    </ParallaxContext.Provider>
  );
}

/**
 * Create a default scroll progress for standalone usage.
 * Returns a static MotionValue at 0.5 (mid-scroll).
 */
export function useDefaultScrollProgress(): MotionValue<number> {
  return useMotionValue(0.5);
}

export { ParallaxContext };
