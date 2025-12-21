"use client";

/**
 * Loading Demo Page - Tests loading screen lifecycle.
 * Demonstrates the full loading flow with configurable options.
 */

import { useState, useCallback } from "react";
import { LoadingProvider } from "@/components/loading";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Generate mock frame URLs for testing.
 */
function generateMockFrameUrls(count: number): string[] {
  // Use placeholder images that will load quickly for demo
  return Array.from({ length: count }, (_, i) => {
    // Use different sizes to simulate real frames
    const size = 100 + (i % 5) * 50;
    return `https://picsum.photos/${size}/${size}?random=${i}`;
  });
}

/**
 * Demo content that appears after loading.
 */
function DemoContent() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Loading System Demo
            </h1>
            <p className="mt-2 text-muted-foreground">
              Session 07: Loading System Verification
            </p>
          </div>
          <ThemeToggle />
        </header>

        {/* Status card */}
        <div className="mb-6 rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold">Loading Complete!</h2>
          <p className="mt-2 text-muted-foreground">
            The loading screen has finished and content is now revealed.
          </p>
          <p className="mt-2 text-sm">
            Reduced motion preference:{" "}
            <span className="font-mono">
              {prefersReducedMotion ? "enabled" : "disabled"}
            </span>
          </p>
        </div>

        {/* Stagger demo items */}
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-lg border bg-card p-4 transition-colors hover:bg-accent"
            >
              <h3 className="font-medium">Content Block {i}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                This content appeared with staggered animation.
              </p>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-8 rounded-lg border bg-muted/50 p-6">
          <h2 className="text-lg font-semibold">Testing Instructions</h2>
          <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-muted-foreground">
            <li>Refresh the page to see the loading screen again</li>
            <li>Enable Reduce motion in your OS settings to test instant reveal</li>
            <li>Use browser DevTools to throttle network and see slow loading</li>
            <li>Check browser console for any errors or warnings</li>
          </ul>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Loading system configured successfully. Ready for Phase 01: Core Animation.
          </p>
        </footer>
      </div>
    </main>
  );
}

/**
 * Demo page wrapper with controls.
 */
function LoadingDemoControls() {
  const [frameCount, setFrameCount] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [key, setKey] = useState(0);

  const handleRestart = useCallback(() => {
    setKey((prev) => prev + 1);
    setIsLoading(true);
  }, []);

  // Generate mock frame URLs
  const frameUrls = generateMockFrameUrls(frameCount);

  return (
    <div>
      {/* Controls panel (only visible when not loading) */}
      {!isLoading && (
        <div className="fixed bottom-4 right-4 z-50 rounded-lg border bg-card p-4 shadow-lg">
          <h3 className="text-sm font-semibold">Demo Controls</h3>
          <div className="mt-2 space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground">Frames:</label>
              <input
                type="number"
                min={0}
                max={100}
                value={frameCount}
                onChange={(e) => setFrameCount(Number(e.target.value))}
                className="w-16 rounded border bg-background px-2 py-1 text-xs"
              />
            </div>
            <button
              onClick={handleRestart}
              className="w-full rounded bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
            >
              Restart Loading
            </button>
          </div>
        </div>
      )}

      {/* Loading provider with demo content */}
      <LoadingProvider
        key={key}
        frameUrls={frameUrls}
        autoStart
        minLoadingTime={1000}
      >
        <DemoContent />
      </LoadingProvider>
    </div>
  );
}

export default function LoadingDemoPage() {
  return <LoadingDemoControls />;
}
