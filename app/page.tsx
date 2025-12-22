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
      <main id="main-content">
        <HeroSection
          isRevealed={isContentRevealed}
          onLoadProgress={handleLoadProgress}
          onLoadComplete={handleLoadComplete}
        />

        {/* Placeholder sections for navigation - will be replaced in future sessions */}
        <section
          id="about"
          className="flex min-h-screen items-center justify-center bg-background"
          aria-label="About section"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold text-muted-foreground">About</h2>
            <p className="mt-2 text-muted-foreground">Coming in Phase 02 Session 02</p>
          </div>
        </section>

        <section
          id="skills"
          className="flex min-h-screen items-center justify-center bg-background/50"
          aria-label="Skills section"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold text-muted-foreground">Skills</h2>
            <p className="mt-2 text-muted-foreground">Coming in Phase 02 Session 03</p>
          </div>
        </section>

        <section
          id="projects"
          className="flex min-h-screen items-center justify-center bg-background"
          aria-label="Projects section"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold text-muted-foreground">Projects</h2>
            <p className="mt-2 text-muted-foreground">Coming in Phase 02 Session 04</p>
          </div>
        </section>

        <ProductSection isRevealed={isContentRevealed} />

        <section
          id="contact"
          className="flex min-h-screen items-center justify-center bg-background/50"
          aria-label="Contact section"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold text-muted-foreground">Contact</h2>
            <p className="mt-2 text-muted-foreground">Coming in Phase 02 Session 05</p>
          </div>
        </section>
      </main>
    </>
  );
}
