"use client";

/**
 * NavLink component - Individual navigation link with active state styling.
 * Supports smooth scroll navigation using native behavior with scroll-margin.
 */

import { useCallback } from "react";
import { cn } from "@/lib/cn";
import type { NavLinkProps } from "@/types/navigation";

/**
 * Navigation link with active state indication.
 * Handles smooth scrolling to target section and visual active state.
 *
 * @param props - Component props
 * @param props.href - Target section href (e.g., "#about")
 * @param props.children - Link content
 * @param props.isActive - Whether this link is currently active
 * @param props.onClick - Optional click handler
 * @param props.className - Additional CSS classes
 *
 * @example
 * <NavLink href="#about" isActive={activeSection === "about"}>
 *   About
 * </NavLink>
 */
export function NavLink({
  href,
  children,
  isActive = false,
  onClick,
  className,
}: NavLinkProps) {
  /**
   * Handle link click with smooth scroll.
   */
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();

      // Extract section ID from href
      const sectionId = href.replace("#", "");
      const element = document.getElementById(sectionId);

      if (element) {
        // Smooth scroll to element
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      // Call optional onClick handler
      onClick?.();
    },
    [href, onClick]
  );

  return (
    <a
      href={href}
      onClick={handleClick}
      className={cn(
        // Base styles
        "relative px-3 py-2 text-sm font-medium transition-colors duration-150",
        // Inactive state
        "text-muted-foreground hover:text-foreground",
        // Active state
        isActive && "text-foreground",
        // Focus styles for accessibility
        "focus-visible:ring-ring focus-visible:ring-offset-background rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        className
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {children}
      {/* Active indicator underline */}
      <span
        className={cn(
          "bg-foreground absolute bottom-0 left-1/2 h-0.5 -translate-x-1/2 transition-all duration-200",
          isActive ? "w-4/5 opacity-100" : "w-0 opacity-0"
        )}
        aria-hidden="true"
      />
    </a>
  );
}

export default NavLink;
