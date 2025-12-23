"use client";

/**
 * ContactSocialLinks component - Social media links styled for contact section.
 * Uses existing SocialLinks pattern with contact-specific styling.
 */

import { Github, Linkedin, Twitter, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  type SocialPlatform,
  type SocialLinkConfig,
  DEFAULT_SOCIAL_LINKS,
} from "@/types/hero";
import type { ContactSocialLinksProps } from "@/types/contact";

/**
 * Icon mapping for social platforms.
 */
const SOCIAL_ICONS: Record<SocialPlatform, typeof Github> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  email: Mail,
};

/**
 * Platform labels for display.
 */
const PLATFORM_LABELS: Record<SocialPlatform, string> = {
  github: "GitHub",
  linkedin: "LinkedIn",
  twitter: "Twitter",
  email: "Email",
};

/**
 * Container animation variants.
 */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

/**
 * Item animation variants.
 */
const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
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
 * Social links styled for the contact section.
 * Displays links vertically with labels.
 *
 * @param props - Component props
 * @param props.className - Optional additional CSS classes
 *
 * @example
 * <ContactSocialLinks className="mt-8" />
 */
export function ContactSocialLinks({ className }: ContactSocialLinksProps) {
  const prefersReducedMotion = useReducedMotion();

  const activeContainerVariants = prefersReducedMotion
    ? reducedMotionVariants
    : containerVariants;

  const activeItemVariants = prefersReducedMotion
    ? reducedMotionVariants
    : itemVariants;

  return (
    <motion.div
      className={cn("flex flex-col gap-6", className)}
      initial="hidden"
      animate="visible"
      variants={activeContainerVariants}
    >
      {/* Section heading */}
      <motion.h3
        className="text-lg font-semibold text-foreground"
        variants={activeItemVariants}
      >
        Connect With Me
      </motion.h3>

      {/* Social links list */}
      <nav aria-label="Social links">
        <ul className="flex flex-col gap-3">
          {DEFAULT_SOCIAL_LINKS.map((link: SocialLinkConfig) => {
            const Icon = SOCIAL_ICONS[link.platform];
            const isExternal = link.platform !== "email";

            return (
              <motion.li key={link.platform} variants={activeItemVariants}>
                <a
                  href={link.href}
                  className={cn(
                    // 44px minimum touch target
                    "group flex items-center gap-3",
                    "min-h-[44px] py-2",
                    "text-muted-foreground hover:text-foreground",
                    "transition-colors duration-200",
                    // Focus styles
                    "rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  )}
                  aria-label={link.label}
                  {...(isExternal && {
                    target: "_blank",
                    rel: "noopener noreferrer",
                  })}
                >
                  <span
                    className={cn(
                      // 44px icon container
                      "flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center",
                      "rounded-lg",
                      "bg-accent/10 group-hover:bg-accent/20",
                      "transition-colors duration-200"
                    )}
                  >
                    <Icon
                      className="h-5 w-5 text-accent"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="font-medium">
                    {PLATFORM_LABELS[link.platform]}
                  </span>
                </a>
              </motion.li>
            );
          })}
        </ul>
      </nav>

      {/* Alternative contact info */}
      <motion.div
        className="mt-4 border-t border-border/50 pt-6"
        variants={activeItemVariants}
      >
        <p className="text-sm text-muted-foreground">
          Prefer a direct approach? Send me an email at{" "}
          <a
            href="mailto:hello@mosheh.dev"
            className="text-accent hover:underline"
          >
            hello@mosheh.dev
          </a>
        </p>
      </motion.div>
    </motion.div>
  );
}

export default ContactSocialLinks;
