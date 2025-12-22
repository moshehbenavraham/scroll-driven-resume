"use client";

/**
 * Demo page for frame sequence animation.
 * Tests scroll-synchronized frame animation with hero sequence.
 */

import { useRef, useState } from "react";
import { FrameSequence } from "@/components/animation";
import { useAnimationStore } from "@/stores/animation-store";

export default function FramesDemoPage() {
  // Reference to the scroll section
  const heroSectionRef = useRef<HTMLElement>(null);
  const productSectionRef = useRef<HTMLElement>(null);

  // Track loading state
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [heroProgress, setHeroProgress] = useState(0);
  const [productLoaded, setProductLoaded] = useState(false);
  const [productProgress, setProductProgress] = useState(0);

  // Get sequence state from store
  const heroSequence = useAnimationStore((state) => state.sequences.hero);
  const productSequence = useAnimationStore((state) => state.sequences.product);

  return (
    <main className="bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 right-0 left-0 z-50 bg-black/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-bold">Frame Animation Demo</h1>
          <p className="text-sm text-gray-400">
            Session 01: Frame Animation Core
          </p>
        </div>
      </header>

      {/* Status panel */}
      <div className="fixed bottom-4 left-4 z-50 rounded-lg bg-black/80 p-4 font-mono text-xs backdrop-blur-sm">
        <div className="mb-2 font-bold text-green-400">Hero Sequence</div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <span className="text-gray-400">Frame:</span>
          <span>
            {heroSequence.currentFrame} / {heroSequence.totalFrames - 1}
          </span>
          <span className="text-gray-400">Progress:</span>
          <span>{heroProgress}%</span>
          <span className="text-gray-400">Active:</span>
          <span
            className={
              heroSequence.isActive ? "text-green-400" : "text-gray-500"
            }
          >
            {heroSequence.isActive ? "Yes" : "No"}
          </span>
          <span className="text-gray-400">Direction:</span>
          <span>{heroSequence.direction ?? "none"}</span>
          <span className="text-gray-400">Loaded:</span>
          <span className={heroLoaded ? "text-green-400" : "text-yellow-400"}>
            {heroLoaded ? "Yes" : "Loading..."}
          </span>
        </div>

        <div className="mt-4 mb-2 font-bold text-blue-400">
          Product Sequence
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <span className="text-gray-400">Frame:</span>
          <span>
            {productSequence.currentFrame} / {productSequence.totalFrames - 1}
          </span>
          <span className="text-gray-400">Progress:</span>
          <span>{productProgress}%</span>
          <span className="text-gray-400">Active:</span>
          <span
            className={
              productSequence.isActive ? "text-green-400" : "text-gray-500"
            }
          >
            {productSequence.isActive ? "Yes" : "No"}
          </span>
          <span className="text-gray-400">Direction:</span>
          <span>{productSequence.direction ?? "none"}</span>
          <span className="text-gray-400">Loaded:</span>
          <span
            className={productLoaded ? "text-green-400" : "text-yellow-400"}
          >
            {productLoaded ? "Yes" : "Loading..."}
          </span>
        </div>
      </div>

      {/* Spacer before hero */}
      <section className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4 text-4xl font-bold">Scroll Down</h2>
          <p className="text-gray-400">
            Scroll to see the frame animation in action
          </p>
          <div className="mt-8 animate-bounce text-2xl">&#8595;</div>
        </div>
      </section>

      {/* Hero frame sequence section */}
      <section
        ref={heroSectionRef}
        className="relative h-[300vh]"
        aria-label="Hero animation section"
      >
        {/* Sticky container for frames */}
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <FrameSequence
            sequence="hero"
            containerRef={heroSectionRef}
            onLoadProgress={setHeroProgress}
            onLoadComplete={() => setHeroLoaded(true)}
            className="h-full w-full"
          />

          {/* Overlay content */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-5xl font-bold text-white drop-shadow-lg">
                Hero Sequence
              </h2>
              <p className="mt-2 text-xl text-white/80 drop-shadow">
                192 frames, scroll-synchronized
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Spacer between sequences */}
      <section className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4 text-3xl font-bold">Hero Complete</h2>
          <p className="text-gray-400">
            Continue scrolling for product sequence
          </p>
          <div className="mt-8 animate-bounce text-2xl">&#8595;</div>
        </div>
      </section>

      {/* Product frame sequence section */}
      <section
        ref={productSectionRef}
        className="relative h-[300vh]"
        aria-label="Product animation section"
      >
        {/* Sticky container for frames */}
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <FrameSequence
            sequence="product"
            containerRef={productSectionRef}
            onLoadProgress={setProductProgress}
            onLoadComplete={() => setProductLoaded(true)}
            className="h-full w-full"
          />

          {/* Overlay content */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-5xl font-bold text-white drop-shadow-lg">
                Product Sequence
              </h2>
              <p className="mt-2 text-xl text-white/80 drop-shadow">
                144 frames, scroll-synchronized
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4 text-3xl font-bold">Demo Complete</h2>
          <p className="text-gray-400">
            Both frame sequences rendered successfully
          </p>
          <p className="mt-4 text-sm text-gray-500">
            Ready for Session 02: Hero Section
          </p>
        </div>
      </section>
    </main>
  );
}
