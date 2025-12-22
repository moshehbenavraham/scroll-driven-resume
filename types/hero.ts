/**
 * Type definitions for hero section components.
 */

import type { ReactNode } from "react";

// ============================================================================
// Social Link Types
// ============================================================================

/**
 * Social platform identifier.
 */
export type SocialPlatform = "github" | "linkedin" | "twitter" | "email";

/**
 * Configuration for a single social link.
 */
export interface SocialLinkConfig {
  /** Platform identifier */
  platform: SocialPlatform;
  /** Display label (for screen readers) */
  label: string;
  /** Target URL or mailto link */
  href: string;
}

/**
 * Props for SocialLinks component.
 */
export interface SocialLinksProps {
  /** Optional additional CSS classes */
  className?: string;
  /** Optional custom links (uses defaults if not provided) */
  links?: SocialLinkConfig[];
}

// ============================================================================
// Skill Indicator Types
// ============================================================================

/**
 * Skill category identifier.
 */
export type SkillCategory = "ai" | "development" | "product" | "leadership";

/**
 * Configuration for a single skill indicator.
 */
export interface SkillConfig {
  /** Skill category identifier */
  category: SkillCategory;
  /** Display label */
  label: string;
  /** Short description */
  description: string;
}

/**
 * Props for SkillIndicators component.
 */
export interface SkillIndicatorsProps {
  /** Optional additional CSS classes */
  className?: string;
  /** Optional custom skills (uses defaults if not provided) */
  skills?: SkillConfig[];
}

// ============================================================================
// Hero Content Types
// ============================================================================

/**
 * Props for HeroContent component.
 */
export interface HeroContentProps {
  /** Name to display */
  name?: string;
  /** Title/role to display */
  title?: string;
  /** Tagline text */
  tagline?: string;
  /** Optional additional CSS classes */
  className?: string;
  /** Optional child elements (skills, social links) */
  children?: ReactNode;
}

// ============================================================================
// Hero Section Types
// ============================================================================

/**
 * Props for HeroSection component.
 */
export interface HeroSectionProps {
  /** Optional additional CSS classes */
  className?: string;
  /** Whether content should be revealed (for loading sync) */
  isRevealed?: boolean;
  /** Callback when frame sequence load completes */
  onLoadComplete?: () => void;
  /** Callback for frame sequence load progress */
  onLoadProgress?: (percent: number) => void;
}

// ============================================================================
// Default Content Configuration
// ============================================================================

/**
 * Default hero content values.
 */
export const DEFAULT_HERO_CONTENT = {
  name: "Mosheh Ben Avraham",
  title: "AI Engineer & Product Leader",
  tagline: "Building the future of AI-powered products",
} as const;

/**
 * Default skill configurations.
 */
export const DEFAULT_SKILLS: SkillConfig[] = [
  {
    category: "ai",
    label: "AI/ML",
    description: "Machine Learning & AI Systems",
  },
  {
    category: "development",
    label: "Development",
    description: "Full-Stack Engineering",
  },
  {
    category: "product",
    label: "Product",
    description: "Product Strategy & Leadership",
  },
  {
    category: "leadership",
    label: "Leadership",
    description: "Team Building & Mentorship",
  },
] as const;

/**
 * Default social link configurations.
 */
export const DEFAULT_SOCIAL_LINKS: SocialLinkConfig[] = [
  {
    platform: "github",
    label: "GitHub Profile",
    href: "https://github.com/moshehbenavraham",
  },
  {
    platform: "linkedin",
    label: "LinkedIn Profile",
    href: "https://linkedin.com/in/moshehbenavraham",
  },
  {
    platform: "twitter",
    label: "Twitter Profile",
    href: "https://twitter.com/moshehbenavraham",
  },
  {
    platform: "email",
    label: "Send Email",
    href: "mailto:hello@mosheh.dev",
  },
] as const;
