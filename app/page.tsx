import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header with theme toggle */}
      <header className="fixed right-0 top-0 z-50 p-4">
        <ThemeToggle />
      </header>

      {/* Main content area */}
      <main className="flex flex-1 flex-col items-center justify-center px-4">
        <div className="mx-auto max-w-2xl text-center">
          {/* Display font heading */}
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-6xl">
            Creative Developer
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Building immersive digital experiences with modern web technologies.
            This is a placeholder for the cinematic portfolio.
          </p>

          {/* Status indicators */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              <span>Next.js 16 Ready</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              <span>Tailwind CSS 4</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              <span>Theme System</span>
            </div>
          </div>

          {/* Asset URL verification */}
          <div className="mt-8 rounded-lg border border-border bg-card p-4 text-left text-sm">
            <p className="font-medium text-card-foreground">
              Environment Check
            </p>
            <p className="mt-2 font-mono text-xs text-muted-foreground">
              NEXT_PUBLIC_ASSET_BASE_URL:{" "}
              {process.env.NEXT_PUBLIC_ASSET_BASE_URL ?? "not set"}
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        <p>Phase 00 Session 04 - Next.js Bootstrap Complete</p>
      </footer>
    </div>
  );
}
