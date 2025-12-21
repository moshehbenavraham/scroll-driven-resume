"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Box, MeshDistortMaterial } from "@react-three/drei";
import type { Mesh } from "three";

interface RotatingCubeProps {
  position?: [number, number, number];
  color?: string;
  speed?: number;
}

function RotatingCube({
  position = [0, 0, 0],
  color = "#8b5cf6",
  speed = 1,
}: RotatingCubeProps) {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5 * speed;
      meshRef.current.rotation.y += delta * 0.7 * speed;
    }
  });

  return (
    <Box ref={meshRef} args={[1.5, 1.5, 1.5]} position={position}>
      <MeshDistortMaterial
        color={color}
        speed={2}
        distort={0.3}
        radius={1}
      />
    </Box>
  );
}

export default function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <RotatingCube />
    </>
  );
}
