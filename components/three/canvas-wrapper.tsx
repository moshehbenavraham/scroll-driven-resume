"use client";

import { Suspense, type ReactNode } from "react";
import dynamic from "next/dynamic";
import type { CanvasProps } from "@react-three/fiber";

// Dynamically import Canvas with SSR disabled to avoid hydration errors
const Canvas = dynamic(
  () => import("@react-three/fiber").then((mod) => mod.Canvas),
  { ssr: false }
);

interface CanvasWrapperProps extends Omit<CanvasProps, "children"> {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
}

function DefaultFallback() {
  // Invisible fallback to prevent flash during Suspense
  return <div className="h-full w-full" />;
}

export function CanvasWrapper({
  children,
  fallback,
  className,
  ...props
}: CanvasWrapperProps) {
  return (
    <Suspense fallback={fallback ?? <DefaultFallback />}>
      <Canvas
        className={className}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 5], fov: 50 }}
        {...props}
      >
        {children}
      </Canvas>
    </Suspense>
  );
}
