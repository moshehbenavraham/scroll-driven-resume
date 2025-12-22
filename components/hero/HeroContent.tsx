"use client";

/**
 * HeroContent component - Main content block for hero section.
 * Contains name, title, tagline, and child components (skills, social links).
 */

import { cn } from "@/lib/cn";
import { type HeroContentProps, DEFAULT_HERO_CONTENT } from "@/types/hero";

/**
 * Hero content container with name, title, and tagline.
 * Accepts children for skills and social links.
 *
 * @param props - Component props
 * @param props.name - Name to display (default: from DEFAULT_HERO_CONTENT)
 * @param props.title - Title/role to display (default: from DEFAULT_HERO_CONTENT)
 * @param props.tagline - Tagline text (default: from DEFAULT_HERO_CONTENT)
 * @param props.className - Optional additional CSS classes
 * @param props.children - Optional child elements (skills, social links)
 *
 * @example
 * <HeroContent>
 *   <SkillIndicators />
 *   <SocialLinks />
 * </HeroContent>
 */
export function HeroContent({
  name = DEFAULT_HERO_CONTENT.name,
  title = DEFAULT_HERO_CONTENT.title,
  tagline = DEFAULT_HERO_CONTENT.tagline,
  className,
  children,
}: HeroContentProps) {
  return (
    <div
      className={cn(
        // Container positioning
        "flex flex-col items-center justify-center",
        "text-center",
        // Spacing
        "px-4 py-8 md:px-8 md:py-12",
        // Max width for readability
        "mx-auto max-w-2xl",
        className
      )}
    >
      {/* Name */}
      <h1
        className={cn(
          "text-4xl md:text-5xl lg:text-6xl",
          "font-bold tracking-tight",
          "text-white",
          "mb-2"
        )}
      >
        {name}
      </h1>

      {/* Title */}
      <p
        className={cn(
          "text-xl md:text-2xl lg:text-3xl",
          "font-medium",
          "text-white/80",
          "mb-4"
        )}
      >
        {title}
      </p>

      {/* Tagline */}
      <p className={cn("text-base md:text-lg", "text-white/60", "mb-8")}>
        {tagline}
      </p>

      {/* Children (skills, social links, etc.) */}
      {children}
    </div>
  );
}

export default HeroContent;
