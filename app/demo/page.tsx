import { MotionDemo } from "@/components/demo/motion-demo";
import { ThreeDemo } from "@/components/demo/three-demo";
import { UIDemo } from "@/components/demo/ui-demo";
import { StoreDemo } from "@/components/demo/store-demo";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export const metadata = {
  title: "Library Integration Demo",
  description: "Verification page for animation and UI libraries",
};

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Library Integration Demo
            </h1>
            <p className="mt-2 text-muted-foreground">
              Session 05: Animation Libraries Verification
            </p>
          </div>
          <ThemeToggle />
        </header>

        {/* Demo grid */}
        <div className="grid gap-6 md:grid-cols-2">
          <MotionDemo />
          <ThreeDemo />
          <UIDemo />
          <StoreDemo />
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            All libraries configured successfully. Ready for Session 06: Scroll
            and Parallax Utilities.
          </p>
        </footer>
      </div>
    </main>
  );
}
