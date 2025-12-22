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
        <div className="bg-background h-64 w-full overflow-hidden rounded-lg">
          <CanvasWrapper>
            <Scene />
          </CanvasWrapper>
        </div>
        <p className="text-muted-foreground mt-4 text-sm">
          3D rotating cube with distort material, rendered via R3F.
        </p>
      </CardContent>
    </Card>
  );
}
