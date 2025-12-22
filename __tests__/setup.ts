/**
 * Vitest test setup file.
 * Configures global test environment for React and Framer Motion testing.
 */

import "@testing-library/jest-dom/vitest";

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
