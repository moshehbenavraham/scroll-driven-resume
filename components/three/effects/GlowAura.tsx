"use client";

/**
 * GlowAura effect - Shader-based radial glow for hero section.
 * Creates a soft, pulsing energy effect that responds to scroll.
 */

import { useRef, useMemo } from "react";
import { useFrame, extend } from "@react-three/fiber";
import * as THREE from "three";
import type { GlowAuraProps } from "@/types/webgl";

/** Default inner glow color (purple) */
const DEFAULT_INNER_COLOR = "#9333ea";

/** Default outer glow color (blue) */
const DEFAULT_OUTER_COLOR = "#3b82f6";

/** Default glow radius */
const DEFAULT_RADIUS = 3;

/** Default pulse intensity */
const DEFAULT_PULSE_INTENSITY = 0.3;

/**
 * Custom shader material for the glow effect.
 */
class GlowMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        uTime: { value: 0 },
        uScrollProgress: { value: 0 },
        uInnerColor: { value: new THREE.Color(DEFAULT_INNER_COLOR) },
        uOuterColor: { value: new THREE.Color(DEFAULT_OUTER_COLOR) },
        uOpacity: { value: 0.5 },
        uPulseIntensity: { value: DEFAULT_PULSE_INTENSITY },
      },
      vertexShader: `
        varying vec2 vUv;

        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uScrollProgress;
        uniform vec3 uInnerColor;
        uniform vec3 uOuterColor;
        uniform float uOpacity;
        uniform float uPulseIntensity;

        varying vec2 vUv;

        void main() {
          // Calculate distance from center
          vec2 center = vec2(0.5);
          float dist = distance(vUv, center);

          // Create smooth radial gradient
          float gradient = 1.0 - smoothstep(0.0, 0.5, dist);

          // Add pulsing effect based on time and scroll
          float pulse = sin(uTime * 2.0 + uScrollProgress * 3.14159) * uPulseIntensity;
          gradient *= (1.0 + pulse);

          // Mix colors based on distance
          vec3 color = mix(uOuterColor, uInnerColor, gradient);

          // Scroll-based color shift
          float colorShift = uScrollProgress * 0.5;
          color = mix(color, uInnerColor, colorShift * gradient);

          // Apply opacity with soft edges
          float alpha = gradient * uOpacity * (1.0 - dist * 0.5);

          // Fade in based on scroll progress
          alpha *= smoothstep(0.0, 0.2, uScrollProgress) * 0.8 + 0.2;

          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
  }
}

// Extend Three.js with custom material (not used in JSX but kept for reference)
extend({ GlowMaterial });

/**
 * Shader-based glow aura effect that responds to scroll position.
 * Creates a soft, pulsing energy effect around the center.
 *
 * @param props - Component props
 * @param props.scrollProgress - MotionValue for scroll synchronization
 * @param props.quality - Quality settings from GPU tier
 * @param props.innerColor - Center color of glow
 * @param props.outerColor - Edge color of glow
 * @param props.radius - Glow radius
 * @param props.pulseIntensity - Pulse strength (0-1)
 * @param props.isActive - Whether animation is active
 *
 * @example
 * <GlowAura
 *   scrollProgress={scrollYProgress}
 *   quality={quality}
 *   innerColor="#9333ea"
 *   outerColor="#3b82f6"
 * />
 */
export function GlowAura({
  scrollProgress,
  quality,
  innerColor = DEFAULT_INNER_COLOR,
  outerColor = DEFAULT_OUTER_COLOR,
  radius = DEFAULT_RADIUS,
  pulseIntensity = DEFAULT_PULSE_INTENSITY,
  isActive = true,
}: GlowAuraProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Track scroll progress
  const scrollRef = useRef(0);

  // Update scroll value from MotionValue
  useFrame(() => {
    scrollRef.current = scrollProgress.get();
  });

  // Create color instances
  const colors = useMemo(
    () => ({
      inner: new THREE.Color(innerColor),
      outer: new THREE.Color(outerColor),
    }),
    [innerColor, outerColor]
  );

  // Calculate opacity based on quality
  const baseOpacity = quality.opacityMultiplier * 0.4;

  // Create the shader material instance
  const material = useMemo(() => new GlowMaterial(), []);

  // Reference for the material to update uniforms
  const materialRef = useRef(material);

  // Animate shader uniforms each frame
  useFrame((state) => {
    if (!materialRef.current || !isActive) {
      return;
    }

    const mat = materialRef.current;

    // Update time uniform
    mat.uniforms.uTime.value = state.clock.elapsedTime;

    // Update scroll progress
    mat.uniforms.uScrollProgress.value = scrollRef.current;

    // Update colors (in case they change)
    mat.uniforms.uInnerColor.value = colors.inner;
    mat.uniforms.uOuterColor.value = colors.outer;

    // Update opacity
    mat.uniforms.uOpacity.value = baseOpacity;

    // Update pulse intensity
    mat.uniforms.uPulseIntensity.value = pulseIntensity;
  });

  // Scale based on radius and quality
  const scale = radius * (0.8 + quality.opacityMultiplier * 0.2);

  return (
    <mesh ref={meshRef} scale={[scale, scale, 1]} position={[0, 0, -1]}>
      <planeGeometry args={[2, 2, 1, 1]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

export default GlowAura;
