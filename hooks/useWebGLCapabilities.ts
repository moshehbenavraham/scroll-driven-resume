"use client";

/**
 * useWebGLCapabilities hook - GPU detection and quality settings.
 * Detects WebGL support, GPU tier, and provides adaptive quality settings.
 * Includes mobile detection and reduced motion preference integration.
 */

import { useMemo, useSyncExternalStore } from "react";
import { useReducedMotion } from "./useReducedMotion";
import type {
  WebGLCapabilities,
  WebGLSupport,
  GPUTier,
  QualitySettings,
  WebGLDisableReason,
} from "@/types/webgl";

/** Mobile viewport breakpoint (matches Tailwind's md breakpoint) */
const MOBILE_BREAKPOINT = 768;

/** Low-end GPU indicators in renderer strings */
const LOW_END_GPU_PATTERNS = [
  /intel.*hd.*graphics/i,
  /intel.*uhd/i,
  /mali-4/i,
  /mali-t6/i,
  /adreno.*3/i,
  /adreno.*4/i,
  /powervr.*sgx/i,
  /apple.*a7/i,
  /apple.*a8/i,
];

/** High-end GPU indicators in renderer strings */
const HIGH_END_GPU_PATTERNS = [
  /nvidia.*rtx/i,
  /nvidia.*gtx.*10/i,
  /nvidia.*gtx.*16/i,
  /nvidia.*gtx.*20/i,
  /nvidia.*gtx.*30/i,
  /nvidia.*gtx.*40/i,
  /radeon.*rx.*5/i,
  /radeon.*rx.*6/i,
  /radeon.*rx.*7/i,
  /apple.*m[1-9]/i,
  /adreno.*6/i,
  /adreno.*7/i,
  /mali-g7/i,
  /mali-g[89]/i,
];

/**
 * Quality settings for each GPU tier.
 */
const QUALITY_BY_TIER: Record<GPUTier, QualitySettings> = {
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

/**
 * Detect WebGL support and capabilities.
 */
function detectWebGLSupport(): WebGLSupport {
  const defaultSupport: WebGLSupport = {
    webgl1: false,
    webgl2: false,
    maxTextureSize: 0,
    maxVertexUniforms: 0,
    vendor: "",
    renderer: "",
  };

  if (typeof window === "undefined") {
    return defaultSupport;
  }

  try {
    const canvas = document.createElement("canvas");

    // Try WebGL 2 first
    let gl: WebGLRenderingContext | WebGL2RenderingContext | null =
      canvas.getContext("webgl2");
    const hasWebGL2 = gl !== null;

    // Fall back to WebGL 1
    if (!gl) {
      gl =
        (canvas.getContext("webgl") as WebGLRenderingContext | null) ||
        (canvas.getContext(
          "experimental-webgl"
        ) as WebGLRenderingContext | null);
    }

    if (!gl) {
      return defaultSupport;
    }

    // Get GPU info via WEBGL_debug_renderer_info extension
    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    const vendor = debugInfo
      ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
      : gl.getParameter(gl.VENDOR);
    const renderer = debugInfo
      ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
      : gl.getParameter(gl.RENDERER);

    return {
      webgl1: true,
      webgl2: hasWebGL2,
      maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE) || 0,
      maxVertexUniforms: gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS) || 0,
      vendor: String(vendor || ""),
      renderer: String(renderer || ""),
    };
  } catch {
    return defaultSupport;
  }
}

/**
 * Determine GPU tier from WebGL support info.
 */
function calculateGPUTier(support: WebGLSupport): GPUTier {
  if (!support.webgl1) {
    return "unsupported";
  }

  const renderer = support.renderer.toLowerCase();

  // Check for high-end GPUs
  for (const pattern of HIGH_END_GPU_PATTERNS) {
    if (pattern.test(renderer)) {
      return "high";
    }
  }

  // Check for low-end GPUs
  for (const pattern of LOW_END_GPU_PATTERNS) {
    if (pattern.test(renderer)) {
      return "low";
    }
  }

  // Use texture size as a fallback indicator
  if (support.maxTextureSize >= 16384) {
    return "high";
  } else if (support.maxTextureSize >= 8192) {
    return "medium";
  } else if (support.maxTextureSize >= 4096) {
    return "low";
  }

  // Default to medium if no strong indicators
  return "medium";
}

/**
 * Check if viewport is mobile-sized.
 */
function isMobileViewport(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return window.innerWidth < MOBILE_BREAKPOINT;
}

/**
 * Hook to detect WebGL capabilities and provide quality settings.
 * Automatically handles mobile detection, reduced motion preferences,
 * and GPU tier-based quality adjustment.
 *
 * @returns WebGLCapabilities object with isEnabled, tier, quality, and support info
 *
 * @example
 * const { isEnabled, tier, quality } = useWebGLCapabilities();
 *
 * if (!isEnabled) {
 *   return <WebGLFallback />;
 * }
 *
 * return <ParticleField quality={quality} />;
 */
// Cache WebGL support detection (only runs once per page load)
let cachedSupport: WebGLSupport | null = null;

function getWebGLSupportSnapshot(): WebGLSupport {
  if (cachedSupport === null) {
    cachedSupport = detectWebGLSupport();
  }
  return cachedSupport;
}

/**
 * Reset the WebGL support cache.
 * Only used in tests to ensure fresh detection.
 * @internal
 */
export function _resetWebGLCache(): void {
  cachedSupport = null;
}

// Cached server snapshot (must be stable reference to avoid infinite loops)
const SERVER_WEBGL_SUPPORT: WebGLSupport = {
  webgl1: false,
  webgl2: false,
  maxTextureSize: 0,
  maxVertexUniforms: 0,
  vendor: "",
  renderer: "",
};

function getWebGLSupportServerSnapshot(): WebGLSupport {
  return SERVER_WEBGL_SUPPORT;
}

function subscribeToWebGL(_callback: () => void): () => void {
  // WebGL support doesn't change, so no subscription needed
  return () => {};
}

// Mobile viewport detection
function getMobileSnapshot(): boolean {
  return isMobileViewport();
}

function getMobileServerSnapshot(): boolean {
  return false;
}

function subscribeToMobile(callback: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }
  // Debounce resize events to prevent flashing during scroll
  // (some browsers fire resize events when scrolling due to address bar)
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  const debouncedCallback = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(callback, 150);
  };
  window.addEventListener("resize", debouncedCallback);
  return () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    window.removeEventListener("resize", debouncedCallback);
  };
}

export function useWebGLCapabilities(): WebGLCapabilities {
  const prefersReducedMotion = useReducedMotion();

  // Use useSyncExternalStore for WebGL support (static after initial detection)
  const support = useSyncExternalStore(
    subscribeToWebGL,
    getWebGLSupportSnapshot,
    getWebGLSupportServerSnapshot
  );

  // Use useSyncExternalStore for mobile viewport detection
  const isMobile = useSyncExternalStore(
    subscribeToMobile,
    getMobileSnapshot,
    getMobileServerSnapshot
  );

  // Calculate capabilities based on all factors
  const capabilities = useMemo((): WebGLCapabilities => {
    const tier = calculateGPUTier(support);
    const quality = QUALITY_BY_TIER[tier];

    // Determine if WebGL should be enabled and why if not
    let isEnabled = true;
    let disableReason: WebGLDisableReason | undefined;

    if (!support.webgl1) {
      isEnabled = false;
      disableReason = "no-webgl";
    } else if (isMobile) {
      isEnabled = false;
      disableReason = "mobile-viewport";
    } else if (prefersReducedMotion) {
      isEnabled = false;
      disableReason = "reduced-motion";
    } else if (tier === "unsupported") {
      isEnabled = false;
      disableReason = "low-performance";
    }

    return {
      isEnabled,
      tier,
      quality,
      support,
      disableReason,
    };
  }, [support, isMobile, prefersReducedMotion]);

  return capabilities;
}

export default useWebGLCapabilities;
