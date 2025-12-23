"use client";

/**
 * SocialLinks component - Social media icon links for hero section.
 * Displays GitHub, LinkedIn, Twitter/X, and Email links with icons.
 */

import { Github, Linkedin, Twitter, Mail } from "lucide-react";
import { cn } from "@/lib/cn";
import {
  type SocialLinksProps,
  type SocialPlatform,
  DEFAULT_SOCIAL_LINKS,
} from "@/types/hero";

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
 * Social links component with accessible icon buttons.
 * Opens links in new tabs for external platforms, same tab for email.
 *
 * @param props - Component props
 * @param props.className - Optional additional CSS classes
 * @param props.links - Optional custom links (uses defaults if not provided)
 *
 * @example
 * <SocialLinks className="mt-4" />
 */
export function SocialLinks({
  className,
  links = DEFAULT_SOCIAL_LINKS,
}: SocialLinksProps) {
  return (
    <nav
      className={cn("flex items-center gap-4", className)}
      aria-label="Social links"
    >
      {links.map((link) => {
        const Icon = SOCIAL_ICONS[link.platform];
        const isExternal = link.platform !== "email";

        return (
          <a
            key={link.platform}
            href={link.href}
            className={cn(
              // Base styles with 44px minimum touch target
              "inline-flex items-center justify-center",
              "h-11 w-11 min-h-[44px] min-w-[44px] rounded-full",
              // Colors
              "text-white/70 hover:text-white",
              "bg-white/10 hover:bg-white/20",
              // Transitions
              "transition-all duration-200",
              // Focus styles for accessibility
              "focus:ring-2 focus:ring-white/50 focus:outline-none",
              "focus:ring-offset-2 focus:ring-offset-transparent"
            )}
            aria-label={link.label}
            {...(isExternal && {
              target: "_blank",
              rel: "noopener noreferrer",
            })}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </a>
        );
      })}
    </nav>
  );
}

export default SocialLinks;
