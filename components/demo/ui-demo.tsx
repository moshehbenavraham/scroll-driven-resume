"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Star, Zap, ArrowRight, Settings, Download } from "lucide-react";

export function UIDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>shadcn/ui + Lucide Icons</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Button variants */}
        <div>
          <h4 className="mb-3 text-sm font-medium">Button Variants</h4>
          <div className="flex flex-wrap gap-2">
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </div>
        </div>

        {/* Button sizes */}
        <div>
          <h4 className="mb-3 text-sm font-medium">Button Sizes</h4>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon">
              <Settings />
            </Button>
          </div>
        </div>

        {/* Icons */}
        <div>
          <h4 className="mb-3 text-sm font-medium">Lucide Icons</h4>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              <span className="text-sm">Heart</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="text-sm">Star</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-500" />
              <span className="text-sm">Zap</span>
            </div>
            <div className="flex items-center gap-2">
              <Download className="h-5 w-5 text-green-500" />
              <span className="text-sm">Download</span>
            </div>
          </div>
        </div>

        {/* Button with icon */}
        <div>
          <h4 className="mb-3 text-sm font-medium">Button with Icon</h4>
          <Button>
            Continue <ArrowRight />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
