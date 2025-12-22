"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";

// Subscribe function for useSyncExternalStore (no-op as mount state doesn't change)
const emptySubscribe = () => () => {};

// Hook to track if component is mounted (client-side)
function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true, // Client snapshot - always true on client
    () => false // Server snapshot - always false on server
  );
}

/**
 * Theme toggle button component.
 * Cycles through light, dark, and system themes.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) {
    return (
      <button
        className={cn(
          "inline-flex h-10 w-10 items-center justify-center rounded-md",
          "border-input bg-background border",
          "hover:bg-accent hover:text-accent-foreground",
          "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
          "transition-colors",
          className
        )}
        aria-label="Toggle theme"
      >
        <span className="h-5 w-5" />
      </button>
    );
  }

  const cycleTheme = () => {
    if (theme === "system") {
      setTheme("light");
    } else if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("system");
    }
  };

  return (
    <button
      onClick={cycleTheme}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-md",
        "border-input bg-background border",
        "hover:bg-accent hover:text-accent-foreground",
        "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
        "transition-colors",
        className
      )}
      aria-label={`Current theme: ${theme}. Click to change.`}
      title={`Theme: ${theme}`}
    >
      {resolvedTheme === "dark" ? (
        // Moon icon for dark mode
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ) : (
        // Sun icon for light mode
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      )}
    </button>
  );
}
