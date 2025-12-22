"use client";

/**
 * NavLinks component - Desktop navigation link list.
 * Renders all navigation links with active state management.
 */

import { useCallback } from "react";
import { cn } from "@/lib/cn";
import { NavLink } from "./NavLink";
import { NAV_LINKS, type NavLinksProps } from "@/types/navigation";

/**
 * Desktop navigation links list.
 * Displays horizontal navigation with active section highlighting.
 *
 * @param props - Component props
 * @param props.activeSection - Currently active section ID
 * @param props.onLinkClick - Callback when a link is clicked
 * @param props.className - Additional CSS classes
 *
 * @example
 * <NavLinks
 *   activeSection="about"
 *   onLinkClick={(id) => console.log("Navigated to:", id)}
 * />
 */
export function NavLinks({
  activeSection,
  onLinkClick,
  className,
}: NavLinksProps) {
  /**
   * Handle link click - extract section ID and call callback.
   */
  const handleLinkClick = useCallback(
    (sectionId: string) => {
      onLinkClick?.(sectionId);
    },
    [onLinkClick]
  );

  return (
    <div
      className={cn(
        // Hide on mobile, show on medium screens and up
        "hidden md:flex",
        // Flex layout with gap
        "items-center gap-1",
        className
      )}
      role="group"
      aria-label="Desktop navigation links"
    >
      {NAV_LINKS.map((link) => (
        <NavLink
          key={link.id}
          href={link.href}
          isActive={activeSection === link.id}
          onClick={() => handleLinkClick(link.id)}
        >
          {link.label}
        </NavLink>
      ))}
    </div>
  );
}

export default NavLinks;
