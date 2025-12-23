"use client";

/**
 * Footer component - Site footer with navigation, copyright, and scroll-to-top.
 * Provides consistent branding and navigation at the bottom of the page.
 */

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { FooterNav, ScrollToTop } from "@/components/footer";
import type { FooterProps } from "@/types/contact";

/**
 * Footer animation variants.
 */
const footerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

/**
 * Reduced motion variants.
 */
const reducedMotionVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0 } },
};

/**
 * Get current year for copyright.
 */
function getCurrentYear(): number {
  return new Date().getFullYear();
}

/**
 * Site footer with navigation and copyright.
 * Includes scroll-to-top button as a separate fixed element.
 *
 * @param props - Component props
 * @param props.className - Optional additional CSS classes
 *
 * @example
 * <Footer />
 */
export function Footer({ className }: FooterProps) {
  const prefersReducedMotion = useReducedMotion();
  const currentYear = getCurrentYear();

  const activeVariants = prefersReducedMotion
    ? reducedMotionVariants
    : footerVariants;

  return (
    <>
      <motion.footer
        className={cn(
          "relative",
          "border-t border-border/30",
          "bg-background/80 backdrop-blur-sm",
          "py-12",
          className
        )}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={activeVariants}
        role="contentinfo"
      >
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-8">
            {/* Navigation links */}
            <FooterNav />

            {/* Divider */}
            <div className="h-px w-24 bg-border/50" aria-hidden="true" />

            {/* Copyright */}
            <div className="flex flex-col items-center gap-2 text-center">
              <p className="text-sm text-muted-foreground">
                {currentYear} Mosheh Ben Avraham. All rights reserved.
              </p>
              <p className="text-xs text-muted-foreground/60">
                Built with Next.js, Tailwind CSS, and Framer Motion
              </p>
            </div>
          </div>
        </div>
      </motion.footer>

      {/* Scroll to top button (fixed position, outside footer) */}
      <ScrollToTop />
    </>
  );
}

export default Footer;
