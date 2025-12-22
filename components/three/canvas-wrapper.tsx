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
  return (
    <div className="bg-muted/50 flex h-full w-full items-center justify-center rounded-lg">
      <div className="text-muted-foreground text-sm">Loading 3D scene...</div>
    </div>
  );
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
