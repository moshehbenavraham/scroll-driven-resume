"use client";

/**
 * MobileMenu component - Container for mobile navigation.
 * Manages state for hamburger button and drawer.
 */

import { useState, useCallback } from "react";
import { cn } from "@/lib/cn";
import { MobileMenuButton } from "./MobileMenuButton";
import { MobileDrawer } from "./MobileDrawer";
import type { MobileMenuProps } from "@/types/navigation";

/**
 * Mobile menu container with hamburger button and drawer.
 * Manages open/close state internally.
 *
 * @param props - Component props
 * @param props.activeSection - Currently active section ID
 * @param props.onLinkClick - Callback when a link is clicked
 * @param props.className - Additional CSS classes
 *
 * @example
 * <MobileMenu
 *   activeSection="about"
 *   onLinkClick={(id) => console.log("Navigated to:", id)}
 * />
 */
export function MobileMenu({
  activeSection,
  onLinkClick,
  className,
}: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Toggle menu open/close state.
   */
  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  /**
   * Close the menu.
   */
  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  /**
   * Handle link click - propagate to parent.
   */
  const handleLinkClick = useCallback(
    (sectionId: string) => {
      onLinkClick?.(sectionId);
    },
    [onLinkClick]
  );

  return (
    <div className={cn("md:hidden", className)}>
      <MobileMenuButton isOpen={isOpen} onToggle={handleToggle} />
      <MobileDrawer
        isOpen={isOpen}
        onClose={handleClose}
        activeSection={activeSection}
        onLinkClick={handleLinkClick}
      />
    </div>
  );
}

export default MobileMenu;
