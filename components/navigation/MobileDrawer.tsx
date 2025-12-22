"use client";

/**
 * MobileDrawer component - Slide-in drawer for mobile navigation.
 * Uses Radix Dialog for accessibility and focus trapping.
 */

import { useCallback } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";
import { NavLink } from "./NavLink";
import { NAV_LINKS, type MobileDrawerProps } from "@/types/navigation";

/**
 * Slide animation variants for drawer.
 */
const drawerVariants = {
  closed: {
    x: "100%",
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 40,
    },
  },
  open: {
    x: 0,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 40,
    },
  },
};

/**
 * Overlay fade animation variants.
 */
const overlayVariants = {
  closed: {
    opacity: 0,
  },
  open: {
    opacity: 1,
  },
};

/**
 * Mobile navigation drawer with slide-in animation.
 * Includes overlay backdrop and focus trapping.
 *
 * @param props - Component props
 * @param props.isOpen - Whether the drawer is open
 * @param props.onClose - Close handler
 * @param props.activeSection - Currently active section ID
 * @param props.onLinkClick - Callback when a link is clicked
 *
 * @example
 * <MobileDrawer
 *   isOpen={menuOpen}
 *   onClose={() => setMenuOpen(false)}
 *   activeSection="about"
 * />
 */
export function MobileDrawer({
  isOpen,
  onClose,
  activeSection,
  onLinkClick,
}: MobileDrawerProps) {
  /**
   * Handle link click - close drawer and call callback.
   */
  const handleLinkClick = useCallback(
    (sectionId: string) => {
      onLinkClick?.(sectionId);
      onClose();
    },
    [onLinkClick, onClose]
  );

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AnimatePresence>
        {isOpen ? (
          <Dialog.Portal forceMount>
            {/* Overlay backdrop */}
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-40 bg-black/50"
                variants={overlayVariants}
                initial="closed"
                animate="open"
                exit="closed"
                transition={{ duration: 0.2 }}
              />
            </Dialog.Overlay>

            {/* Drawer content */}
            <Dialog.Content asChild>
              <motion.div
                id="mobile-menu"
                className={cn(
                  // Position and sizing
                  "fixed right-0 top-0 bottom-0 z-50",
                  "w-[280px] max-w-[80vw]",
                  // Background and border
                  "bg-background border-l border-border",
                  // Shadow
                  "shadow-xl"
                )}
                variants={drawerVariants}
                initial="closed"
                animate="open"
                exit="closed"
                aria-label="Mobile navigation menu"
              >
                {/* Drawer header */}
                <div className="flex h-16 items-center justify-between border-b border-border px-4">
                  <Dialog.Title className="text-lg font-semibold">
                    Menu
                  </Dialog.Title>
                  <Dialog.Close asChild>
                    <button
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-md",
                        "hover:bg-accent hover:text-accent-foreground",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      )}
                      aria-label="Close menu"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </Dialog.Close>
                </div>

                {/* Navigation links */}
                <nav className="flex flex-col gap-1 p-4" aria-label="Mobile navigation">
                  {NAV_LINKS.map((link) => (
                    <NavLink
                      key={link.id}
                      href={link.href}
                      isActive={activeSection === link.id}
                      onClick={() => handleLinkClick(link.id)}
                      className="py-3 text-base"
                    >
                      {link.label}
                    </NavLink>
                  ))}
                </nav>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  );
}

export default MobileDrawer;
