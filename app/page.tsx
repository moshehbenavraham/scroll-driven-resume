"use client";

/**
 * Home page with hero and product sections featuring scroll-synchronized
 * frame animations.
 */

import { useState, useCallback } from "react";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProductSection } from "@/components/sections/ProductSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { Footer } from "@/components/sections/Footer";
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

        {/* About section */}
        <AboutSection isRevealed={isContentRevealed} />

        {/* Skills section */}
        <SkillsSection isRevealed={isContentRevealed} />

        {/* Projects section */}
        <ProjectsSection isRevealed={isContentRevealed} />

        <ProductSection isRevealed={isContentRevealed} />

        {/* Contact section */}
        <ContactSection isRevealed={isContentRevealed} />
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
