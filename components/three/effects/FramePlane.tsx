"use client";

/**
 * FramePlane component - Full-viewport plane mesh for displaying frame textures.
 *
 * Renders a Three.js plane that fills the viewport with the current frame texture.
 * Handles aspect ratio to simulate CSS object-fit: cover behavior.
 */

import { useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Props for FramePlane component.
 */
export interface FramePlaneProps {
  /** Current frame texture to display */
  texture: THREE.Texture | null;
  /** Render order for z-layering. Default: 0 */
  renderOrder?: number;
  /** Z-position for depth ordering. Default: -2 */
  zPosition?: number;
}

/**
 * Calculate UV coordinates for object-fit: cover behavior.
 * Crops the texture to fill the viewport while maintaining aspect ratio.
 */
function calculateCoverUVs(
  textureWidth: number,
  textureHeight: number,
  viewportWidth: number,
  viewportHeight: number
): { offset: THREE.Vector2; repeat: THREE.Vector2 } {
  const textureAspect = textureWidth / textureHeight;
  const viewportAspect = viewportWidth / viewportHeight;

  let repeatX = 1;
  let repeatY = 1;
  let offsetX = 0;
  let offsetY = 0;

  if (viewportAspect > textureAspect) {
    // Viewport is wider - crop top and bottom
    repeatY = textureAspect / viewportAspect;
    offsetY = (1 - repeatY) / 2;
  } else {
    // Viewport is taller - crop left and right
    repeatX = viewportAspect / textureAspect;
    offsetX = (1 - repeatX) / 2;
  }

  return {
    offset: new THREE.Vector2(offsetX, offsetY),
    repeat: new THREE.Vector2(repeatX, repeatY),
  };
}

/**
 * Full-viewport plane that displays the current frame texture.
 *
 * @param props - Component props
 * @returns Three.js mesh with frame texture
 *
 * @example
 * <FramePlane
 *   texture={currentTexture}
 *   renderOrder={0}
 *   zPosition={-2}
 * />
 */
export function FramePlane({
  texture,
  renderOrder = 0,
  zPosition = 0,
}: FramePlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const lastTextureRef = useRef<THREE.Texture | null>(null);

  // Get viewport dimensions
  const { viewport, size } = useThree();

  // Update texture and UVs when texture changes
  useFrame(() => {
    if (!materialRef.current) {
      return;
    }

    // Update texture if changed
    if (texture !== lastTextureRef.current) {
      lastTextureRef.current = texture;
      materialRef.current.map = texture;
      materialRef.current.needsUpdate = true;

      // Calculate cover UVs when texture is available
      if (texture && texture.image) {
        const img = texture.image as HTMLImageElement;
        const { offset, repeat } = calculateCoverUVs(
          img.width || 1920,
          img.height || 1080,
          size.width,
          size.height
        );

        // Apply cover UVs to texture (mutable Three.js operation)
        /* eslint-disable react-hooks/immutability */
        texture.offset.copy(offset);
        texture.repeat.copy(repeat);
        texture.needsUpdate = true;
        /* eslint-enable react-hooks/immutability */
      }
    }
  });

  // Show magenta if no texture (for debugging)
  const fallbackColor = texture ? undefined : "#ff00ff";

  return (
    <mesh
      ref={meshRef}
      position={[0, 0, zPosition]}
      renderOrder={renderOrder}
    >
      <planeGeometry args={[viewport.width, viewport.height]} />
      <meshBasicMaterial
        ref={materialRef}
        map={texture}
        color={fallbackColor}
        transparent={false}
        toneMapped={false}
        depthWrite={true}
      />
    </mesh>
  );
}

export default FramePlane;
