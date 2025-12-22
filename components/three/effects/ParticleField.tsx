"use client";

/**
 * ParticleField effect - Floating particle system for hero section.
 * Uses native Three.js points with scroll-synchronized animation.
 */

import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";

/**
 * Seeded pseudo-random number generator (mulberry32).
 * Creates deterministic random sequences from a seed.
 */
function createSeededRandom(seed: number): () => number {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

interface ParticleFieldProps {
  scrollProgress: MotionValue<number>;
  quality: {
    particleCount: number;
    opacityMultiplier: number;
  };
  color?: string;
  sizeRange?: [number, number];
  spread?: [number, number, number];
  speed?: number;
  isActive?: boolean;
}

/**
 * Create a circular gradient texture for soft particles.
 */
function createCircleTexture(): THREE.Texture {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d")!;
  const center = size / 2;

  // Create radial gradient for soft circular particle
  const gradient = ctx.createRadialGradient(center, center, 0, center, center, center);
  gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
  gradient.addColorStop(0.3, "rgba(255, 255, 255, 0.8)");
  gradient.addColorStop(0.7, "rgba(255, 255, 255, 0.3)");
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/** Default particle color (soft purple) */
const DEFAULT_COLOR = "#a855f7";

/** Default particle size range */
const DEFAULT_SIZE_RANGE: [number, number] = [0.05, 0.12];

/** Default spread area [width, height, depth] */
const DEFAULT_SPREAD: [number, number, number] = [8, 6, 2];

/** Default movement speed */
const DEFAULT_SPEED = 0.2;

/**
 * Floating particle field effect that responds to scroll position.
 */
export function ParticleField({
  scrollProgress,
  quality,
  color = DEFAULT_COLOR,
  sizeRange = DEFAULT_SIZE_RANGE,
  spread = DEFAULT_SPREAD,
  speed = DEFAULT_SPEED,
  isActive = true,
}: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = quality.particleCount;

  // Create circular texture once
  const circleTexture = useMemo(() => createCircleTexture(), []);

  // Generate stable seed once on first render (using useState initializer)
  const [seed] = useState(() => Date.now());

  // Memoize spread and speed values
  const spreadWidth = spread[0];
  const spreadHeight = spread[1];
  const spreadDepth = spread[2];
  const speedValue = speed;

  // Generate initial particle data with seeded randomness
  const { positions, velocities } = useMemo(() => {
    const random = createSeededRandom(seed);
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      pos[i3] = (random() - 0.5) * spreadWidth;
      pos[i3 + 1] = (random() - 0.5) * spreadHeight;
      pos[i3 + 2] = (random() - 0.5) * spreadDepth;

      vel[i3] = (random() - 0.5) * speedValue;
      vel[i3 + 1] = (random() - 0.5) * speedValue;
      vel[i3 + 2] = (random() - 0.5) * speedValue * 0.5;
    }

    return { positions: pos, velocities: vel };
  }, [particleCount, seed, spreadWidth, spreadHeight, spreadDepth, speedValue]);

  // Calculate particle size based on quality
  const minSize = sizeRange[0];
  const maxSize = sizeRange[1];
  const particleSize = useMemo(() => {
    return minSize + (maxSize - minSize) * quality.opacityMultiplier;
  }, [minSize, maxSize, quality.opacityMultiplier]);

  // Calculate opacity
  const opacity = quality.opacityMultiplier * 0.8;

  // Track scroll progress
  const scrollRef = useRef(0);

  // Animate particles each frame
  useFrame((state, delta) => {
    // Update scroll value
    scrollRef.current = scrollProgress.get();

    if (!pointsRef.current || !isActive) {
      return;
    }

    const points = pointsRef.current;
    const positionAttr = points.geometry.attributes.position;
    if (!positionAttr) {return;}

    const posArray = positionAttr.array as Float32Array;
    const scrollInfluence = scrollRef.current;
    const halfWidth = spreadWidth / 2;
    const halfHeight = spreadHeight / 2;
    const halfDepth = spreadDepth / 2;

    // Apply animation to each particle
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Base movement
      posArray[i3] += velocities[i3] * delta;
      posArray[i3 + 1] += velocities[i3 + 1] * delta;
      posArray[i3 + 2] += velocities[i3 + 2] * delta;

      // Scroll-synchronized drift
      posArray[i3 + 1] += scrollInfluence * delta * 0.3;

      // Wrap particles at boundaries
      if (posArray[i3] > halfWidth) {posArray[i3] = -halfWidth;}
      if (posArray[i3] < -halfWidth) {posArray[i3] = halfWidth;}
      if (posArray[i3 + 1] > halfHeight) {posArray[i3 + 1] = -halfHeight;}
      if (posArray[i3 + 1] < -halfHeight) {posArray[i3 + 1] = halfHeight;}
      if (posArray[i3 + 2] > halfDepth) {posArray[i3 + 2] = -halfDepth;}
      if (posArray[i3 + 2] < -halfDepth) {posArray[i3 + 2] = halfDepth;}
    }

    positionAttr.needsUpdate = true;

    // Subtle rotation based on scroll and time
    points.rotation.y = scrollInfluence * Math.PI * 0.1;
    points.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        transparent
        color={color}
        size={particleSize}
        sizeAttenuation
        depthWrite={false}
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        map={circleTexture}
        alphaMap={circleTexture}
      />
    </points>
  );
}

export default ParticleField;
