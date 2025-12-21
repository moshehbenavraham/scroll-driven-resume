"use client";

import { CanvasWrapper } from "@/components/three/canvas-wrapper";
import Scene from "@/components/three/scene";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ThreeDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>React Three Fiber</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full rounded-lg overflow-hidden bg-background">
          <CanvasWrapper>
            <Scene />
          </CanvasWrapper>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          3D rotating cube with distort material, rendered via R3F.
        </p>
      </CardContent>
    </Card>
  );
}
