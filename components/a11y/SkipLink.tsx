"use client";

import { focusMainContent } from "@/lib/a11y";

/**
 * Skip link component for keyboard users to bypass navigation
 * Appears on focus and allows jumping directly to main content
 */
export function SkipLink() {
  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    focusMainContent();
  }

  return (
    <a
      href="#main-content"
      onClick={handleClick}
      className="focus:bg-background focus:text-foreground focus:ring-ring sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:px-4 focus:py-2 focus:ring-2 focus:ring-offset-2"
    >
      Skip to main content
    </a>
  );
}
