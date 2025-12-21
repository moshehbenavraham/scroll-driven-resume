"use client";

/**
 * Scroll Hooks Demo Page
 * Demonstrates all scroll and parallax hooks in action.
 */

import { useRef, useState } from "react";
import { motion, useMotionValueEvent } from "framer-motion";
import {
  useScrollProgress,
  useFrameAnimation,
  useParallax,
  useFramePreload,
} from "@/hooks";
import { generateFrameUrls } from "@/lib/scroll-utils";
import { PARALLAX_SPEEDS } from "@/types/animation";

// ============================================================================
// Demo Section Components
// ============================================================================

/**
 * Demo section for useScrollProgress hook.
 */
function ScrollProgressDemo() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { progress, isInView } = useScrollProgress({ target: sectionRef });
  const [progressValue, setProgressValue] = useState(0);

  useMotionValueEvent(progress, "change", (value) => {
    setProgressValue(value);
  });

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[150vh] bg-gradient-to-b from-slate-900 to-slate-800 px-8 py-24"
    >
      <div className="sticky top-24 mx-auto max-w-2xl">
        <h2 className="mb-8 text-3xl font-bold text-white">useScrollProgress</h2>

        <div className="space-y-6 rounded-xl bg-slate-700/50 p-6 backdrop-blur-sm">
          <div>
            <p className="mb-2 text-sm text-slate-300">Progress (0-1)</p>
            <div className="h-4 overflow-hidden rounded-full bg-slate-600">
              <motion.div
                className="h-full bg-blue-500"
                style={{ width: `${progressValue * 100}%` }}
              />
            </div>
            <p className="mt-2 font-mono text-lg text-white">
              {progressValue.toFixed(4)}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <p className="text-sm text-slate-300">In View:</p>
            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                isInView
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {isInView ? "Yes" : "No"}
            </span>
          </div>
        </div>

        <p className="mt-8 text-center text-slate-400">
          Scroll through this section to see progress update
        </p>
      </div>
    </section>
  );
}

/**
 * Demo section for useFrameAnimation hook.
 */
function FrameAnimationDemo() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { frameIndex, progress, direction, isActive } = useFrameAnimation({
    target: sectionRef,
    totalFrames: 192,
  });

  const [frameValue, setFrameValue] = useState(0);
  const [progressValue, setProgressValue] = useState(0);

  useMotionValueEvent(frameIndex, "change", (value) => {
    setFrameValue(value);
  });

  useMotionValueEvent(progress, "change", (value) => {
    setProgressValue(value);
  });

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[200vh] bg-gradient-to-b from-slate-800 to-indigo-900 px-8 py-24"
    >
      <div className="sticky top-24 mx-auto max-w-2xl">
        <h2 className="mb-8 text-3xl font-bold text-white">useFrameAnimation</h2>

        <div className="space-y-6 rounded-xl bg-indigo-800/50 p-6 backdrop-blur-sm">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="mb-2 text-sm text-indigo-200">Frame Index</p>
              <p className="font-mono text-4xl font-bold text-white">
                {Math.round(frameValue)}
              </p>
              <p className="text-sm text-indigo-300">of 192 frames</p>
            </div>

            <div>
              <p className="mb-2 text-sm text-indigo-200">Progress</p>
              <p className="font-mono text-4xl font-bold text-white">
                {(progressValue * 100).toFixed(1)}%
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <p className="text-sm text-indigo-200">Direction:</p>
              <span className="rounded-full bg-indigo-600/50 px-3 py-1 font-mono text-sm text-white">
                {direction ?? "null"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <p className="text-sm text-indigo-200">Active:</p>
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${
                  isActive
                    ? "bg-green-500/20 text-green-400"
                    : "bg-slate-500/20 text-slate-400"
                }`}
              >
                {isActive ? "Yes" : "No"}
              </span>
            </div>
          </div>

          {/* Frame visualization */}
          <div className="mt-6">
            <p className="mb-3 text-sm text-indigo-200">Frame Visualization</p>
            <div className="flex h-8 gap-px overflow-hidden rounded-lg bg-indigo-900">
              {Array.from({ length: 48 }).map((_, i) => {
                const frameNum = Math.floor((i / 48) * 192);
                const isCurrentRange = Math.abs(frameNum - frameValue) < 4;
                return (
                  <div
                    key={i}
                    className={`flex-1 transition-colors duration-100 ${
                      isCurrentRange ? "bg-indigo-400" : "bg-indigo-700"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Demo section for useParallax hook.
 */
function ParallaxDemo() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const bgParallax = useParallax({
    target: sectionRef,
    speed: PARALLAX_SPEEDS.background,
  });
  const midParallax = useParallax({
    target: sectionRef,
    speed: PARALLAX_SPEEDS.midground,
  });
  const fgParallax = useParallax({
    target: sectionRef,
    speed: PARALLAX_SPEEDS.foreground,
  });

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[200vh] overflow-hidden bg-gradient-to-b from-indigo-900 to-purple-900 px-8 py-24"
    >
      {/* Background layer */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ y: bgParallax.y, opacity: bgParallax.opacity }}
      >
        <div className="h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />
      </motion.div>

      {/* Mid layer */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ y: midParallax.y, opacity: midParallax.opacity }}
      >
        <div className="h-64 w-64 rounded-full bg-indigo-500/30 blur-2xl" />
      </motion.div>

      {/* Foreground layer */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ y: fgParallax.y, opacity: fgParallax.opacity }}
      >
        <div className="h-32 w-32 rounded-full bg-white/20 blur-xl" />
      </motion.div>

      <div className="sticky top-24 mx-auto max-w-2xl">
        <h2 className="mb-8 text-3xl font-bold text-white">useParallax</h2>

        <div className="space-y-4 rounded-xl bg-purple-800/50 p-6 backdrop-blur-sm">
          <p className="text-purple-200">
            Three layers with different parallax speeds create depth:
          </p>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="rounded-lg bg-purple-700/50 p-4">
              <p className="text-2xl font-bold text-purple-300">0.3x</p>
              <p className="text-sm text-purple-400">Background</p>
            </div>
            <div className="rounded-lg bg-purple-700/50 p-4">
              <p className="text-2xl font-bold text-purple-300">0.5x</p>
              <p className="text-sm text-purple-400">Mid-ground</p>
            </div>
            <div className="rounded-lg bg-purple-700/50 p-4">
              <p className="text-2xl font-bold text-purple-300">1.0x</p>
              <p className="text-sm text-purple-400">Foreground</p>
            </div>
          </div>

          <p className="text-sm text-purple-300">
            Watch the glowing orbs move at different speeds as you scroll.
          </p>
        </div>
      </div>
    </section>
  );
}

/**
 * Demo section for useFramePreload hook.
 */
function PreloadDemo() {
  const [demoFrames] = useState(() =>
    // Generate mock frame URLs for demo
    generateFrameUrls("/demo-frames", 50, "webp")
  );

  const preload = useFramePreload({
    frames: demoFrames,
    priorityCount: 10,
    onProgress: (_percent) => {
      // Progress callback - silently handle in demo
    },
    onComplete: () => {
      // Complete callback - silently handle in demo
    },
    onError: (_url, _error) => {
      // Expected to fail in demo since URLs don't exist
    },
  });

  return (
    <section className="min-h-screen bg-gradient-to-b from-purple-900 to-slate-900 px-8 py-24">
      <div className="mx-auto max-w-2xl">
        <h2 className="mb-8 text-3xl font-bold text-white">useFramePreload</h2>

        <div className="space-y-6 rounded-xl bg-slate-800/50 p-6 backdrop-blur-sm">
          <div>
            <p className="mb-2 text-sm text-slate-300">Preload Progress</p>
            <div className="h-4 overflow-hidden rounded-full bg-slate-700">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${preload.progress}%` }}
              />
            </div>
            <p className="mt-2 font-mono text-lg text-white">
              {preload.progress}%
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-slate-700/50 p-4">
              <p className="text-sm text-slate-400">Loaded</p>
              <p className="font-mono text-2xl text-white">
                {preload.loadedCount} / {preload.totalCount}
              </p>
            </div>

            <div className="rounded-lg bg-slate-700/50 p-4">
              <p className="text-sm text-slate-400">Status</p>
              <p className="text-lg font-medium text-white">
                {preload.isComplete
                  ? "Complete"
                  : preload.isLoading
                    ? "Loading..."
                    : "Ready"}
              </p>
            </div>
          </div>

          <button
            onClick={preload.startPreload}
            disabled={preload.isLoading || preload.isComplete}
            className="w-full rounded-lg bg-emerald-600 px-6 py-3 font-medium text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-600"
          >
            {preload.isComplete
              ? "Preload Complete"
              : preload.isLoading
                ? "Loading..."
                : "Start Preload"}
          </button>

          <p className="text-sm text-slate-400">
            Click to start preloading 50 demo frames. First 10 frames load with
            priority, remaining stream in background.
          </p>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// Main Page Component
// ============================================================================

export default function ScrollDemoPage() {
  return (
    <main className="bg-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-700 bg-slate-900/90 px-8 py-6 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-2xl font-bold text-white">
            Scroll & Parallax Hooks Demo
          </h1>
          <p className="text-slate-400">
            Session 06 - Scroll and Parallax Utilities
          </p>
        </div>
      </header>

      {/* Intro */}
      <section className="px-8 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-4xl font-bold text-white">
            Custom Animation Hooks
          </h2>
          <p className="text-lg text-slate-300">
            Scroll down to see each hook in action. These hooks power the
            scroll-synchronized frame animation and parallax effects throughout
            the portfolio.
          </p>
        </div>
      </section>

      {/* Demo Sections */}
      <ScrollProgressDemo />
      <FrameAnimationDemo />
      <ParallaxDemo />
      <PreloadDemo />

      {/* Footer */}
      <footer className="border-t border-slate-700 px-8 py-12">
        <div className="mx-auto max-w-2xl text-center text-slate-400">
          <p>End of demo. All hooks are ready for integration.</p>
        </div>
      </footer>
    </main>
  );
}
