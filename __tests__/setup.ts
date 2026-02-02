/**
 * Vitest test setup file.
 * Configures global test environment for React and Framer Motion testing.
 */

import "@testing-library/jest-dom/vitest";

// ============================================================
// Suppress Three.js "Multiple instances" warning in tests
// ============================================================

// Store original console.warn
const originalWarn = console.warn;

// Filter out Three.js multiple instances warning
console.warn = (...args: unknown[]) => {
  const message = args[0];
  if (
    typeof message === "string" &&
    message.includes("Multiple instances of Three.js")
  ) {
    return; // Suppress this specific warning
  }
  originalWarn.apply(console, args);
};

// ============================================================
// Canvas Context Mocks (for Three.js and R3F testing)
// ============================================================

/**
 * Minimal CanvasRenderingContext2D mock.
 * Provides stub methods to satisfy canvas 2D operations.
 */
function createContext2DMock(): Partial<CanvasRenderingContext2D> {
  return {
    fillRect: () => {},
    clearRect: () => {},
    getImageData: () => ({ data: new Uint8ClampedArray(0), width: 0, height: 0, colorSpace: "srgb" }),
    putImageData: () => {},
    createImageData: () => ({ data: new Uint8ClampedArray(0), width: 0, height: 0, colorSpace: "srgb" }),
    setTransform: () => {},
    drawImage: () => {},
    save: () => {},
    restore: () => {},
    beginPath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    closePath: () => {},
    stroke: () => {},
    fill: () => {},
    translate: () => {},
    scale: () => {},
    rotate: () => {},
    arc: () => {},
    fillText: () => {},
    strokeText: () => {},
    measureText: () => ({ width: 0 } as TextMetrics),
    clip: () => {},
    rect: () => {},
    quadraticCurveTo: () => {},
    bezierCurveTo: () => {},
    isPointInPath: () => false,
    transform: () => {},
    getTransform: () => new DOMMatrix(),
    resetTransform: () => {},
    createLinearGradient: () => ({
      addColorStop: () => {},
    } as CanvasGradient),
    createRadialGradient: () => ({
      addColorStop: () => {},
    } as CanvasGradient),
    createPattern: () => null,
    canvas: document.createElement("canvas"),
  };
}

/**
 * Override HTMLCanvasElement.prototype.getContext to return mocks.
 * Handles 2d, webgl, webgl2, and experimental-webgl context types.
 *
 * IMPORTANT: WebGL contexts return null to preserve test behavior where
 * components fall back to 2D rendering. This silences the JSDOM warning
 * while maintaining original component behavior.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(HTMLCanvasElement.prototype as any).getContext = function (
  contextId: string,
  _options?: unknown
): RenderingContext | null {
  if (contextId === "2d") {
    return createContext2DMock() as CanvasRenderingContext2D;
  }
  // Return null for WebGL to preserve fallback behavior in tests
  // This silences JSDOM's "not implemented" warning while keeping
  // component behavior unchanged (they fall back to 2D canvas)
  if (contextId === "webgl" || contextId === "experimental-webgl" || contextId === "webgl2") {
    return null;
  }
  // Return null for unknown context types
  return null;
};

// Mock window.matchMedia for tests
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Mock ResizeObserver for tests
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock IntersectionObserver for tests
global.IntersectionObserver = class IntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [];

  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
};

// Mock requestAnimationFrame for Framer Motion
global.requestAnimationFrame = (callback: FrameRequestCallback) => {
  return setTimeout(callback, 16) as unknown as number;
};

global.cancelAnimationFrame = (id: number) => {
  clearTimeout(id);
};

// Mock requestIdleCallback for preload testing
global.requestIdleCallback = (callback: IdleRequestCallback) => {
  return setTimeout(
    () => callback({ didTimeout: false, timeRemaining: () => 50 }),
    0
  ) as unknown as number;
};

global.cancelIdleCallback = (id: number) => {
  clearTimeout(id);
};
