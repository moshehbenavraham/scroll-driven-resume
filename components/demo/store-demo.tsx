"use client";

import { useEffect } from "react";
import { useAnimationStore } from "@/stores";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, RotateCcw } from "lucide-react";

export function StoreDemo() {
  const {
    isLoading,
    loadProgress,
    prefersReducedMotion,
    animationsEnabled,
    isPlaying,
    setLoadProgress,
    setIsPlaying,
    setPrefersReducedMotion,
    reset,
  } = useAnimationStore();

  // Detect prefers-reduced-motion on mount
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [setPrefersReducedMotion]);

  const handleProgress = () => {
    const newProgress = loadProgress >= 100 ? 0 : loadProgress + 25;
    setLoadProgress(newProgress, `Loading... ${newProgress}%`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Zustand State Store</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* State display */}
        <div className="bg-muted rounded-lg p-4 font-mono text-sm">
          <pre className="whitespace-pre-wrap">
            {JSON.stringify(
              {
                isLoading,
                loadProgress,
                prefersReducedMotion,
                animationsEnabled,
                isPlaying,
              },
              null,
              2
            )}
          </pre>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={handleProgress}>
            Progress +25%
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <Pause className="mr-1 h-4 w-4" />
            ) : (
              <Play className="mr-1 h-4 w-4" />
            )}
            {isPlaying ? "Pause" : "Play"}
          </Button>
          <Button variant="outline" size="sm" onClick={reset}>
            <RotateCcw className="mr-1 h-4 w-4" />
            Reset
          </Button>
        </div>

        <p className="text-muted-foreground text-sm">
          Global state management with Zustand. Changes update all subscribers.
        </p>
      </CardContent>
    </Card>
  );
}
