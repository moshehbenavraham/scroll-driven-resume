"use client";

/**
 * Home page with hero and product sections featuring scroll-synchronized
 * frame animations.
 */

import { useState, useCallback } from "react";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProductSection } from "@/components/sections/ProductSection";
import { LoadingScreen } from "@/components/loading/LoadingScreen";

/**
 * Home page component.
 * Renders the hero section with loading screen integration.
 */
export default function Home() {
  // Loading state management
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isContentRevealed, setIsContentRevealed] = useState(false);

  // Handle frame sequence load progress
  const handleLoadProgress = useCallback((percent: number) => {
    setLoadProgress(percent);
  }, []);

  // Handle frame sequence load complete
  const handleLoadComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Handle loading screen exit animation complete
  const handleExitComplete = useCallback(() => {
    setIsContentRevealed(true);
  }, []);

  return (
    <>
      {/* Loading overlay */}
      <LoadingScreen
        isLoading={isLoading}
        progress={loadProgress}
        onExitComplete={handleExitComplete}
      />

      {/* Main content */}
      <main>
        <HeroSection
          isRevealed={isContentRevealed}
          onLoadProgress={handleLoadProgress}
          onLoadComplete={handleLoadComplete}
        />
        <ProductSection isRevealed={isContentRevealed} />
      </main>
    </>
  );
}
