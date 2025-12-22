/**
 * Type definitions for about section components.
 */

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

// ============================================================================
// Achievement Types
// ============================================================================

/**
 * Icon names for achievement cards.
 * Using Lucide icon names that are available.
 */
export type AchievementIcon = "calendar" | "folder" | "code" | "users";

/**
 * Configuration for a single achievement card.
 */
export interface AchievementConfig {
  /** Unique identifier for the achievement */
  id: string;
  /** Icon to display */
  icon: AchievementIcon;
  /** Numeric value to display (will be animated) */
  value: number;
  /** Suffix to display after value (e.g., "+", "K") */
  suffix?: string;
  /** Label text below the value */
  label: string;
}

/**
 * Props for AchievementCard component.
 */
export interface AchievementCardProps {
  /** Achievement configuration */
  achievement: AchievementConfig;
  /** Whether the card should be revealed (for animations) */
  isRevealed?: boolean;
  /** Optional additional CSS classes */
  className?: string;
  /** Animation delay in seconds */
  delay?: number;
}

/**
 * Props for Achievements grid container.
 */
export interface AchievementsProps {
  /** Optional custom achievements (uses defaults if not provided) */
  achievements?: AchievementConfig[];
  /** Whether achievements should be revealed */
  isRevealed?: boolean;
  /** Optional additional CSS classes */
  className?: string;
}

// ============================================================================
// Bio Types
// ============================================================================

/**
 * Props for Bio component.
 */
export interface BioProps {
  /** Heading text */
  heading?: string;
  /** Bio paragraphs */
  paragraphs?: string[];
  /** Whether content should be revealed */
  isRevealed?: boolean;
  /** Optional additional CSS classes */
  className?: string;
}

// ============================================================================
// Decorative Types
// ============================================================================

/**
 * Props for AboutDecorative component.
 */
export interface AboutDecorativeProps {
  /** Optional additional CSS classes */
  className?: string;
  /** Optional child elements for composition */
  children?: ReactNode;
}

// ============================================================================
// Section Types
// ============================================================================

/**
 * Props for AboutSection component.
 */
export interface AboutSectionProps {
  /** Optional additional CSS classes */
  className?: string;
  /** Whether content should be revealed (for loading sync) */
  isRevealed?: boolean;
}

// ============================================================================
// Default Content Configuration
// ============================================================================

/**
 * Default bio content values.
 */
export const DEFAULT_BIO_CONTENT = {
  heading: "About Me",
  paragraphs: [
    "I am a passionate AI engineer and product leader with over a decade of experience building innovative software solutions. My journey in technology began with a fascination for how machines can learn and adapt, which evolved into a career focused on creating intelligent systems that solve real-world problems.",
    "Throughout my career, I have led cross-functional teams to deliver products that have impacted millions of users. I believe in the power of combining technical excellence with user-centered design to create experiences that truly matter.",
    "When I am not coding or strategizing, you can find me contributing to open-source projects, mentoring aspiring developers, or exploring the latest advancements in machine learning and artificial intelligence.",
  ],
} as const;

/**
 * Default achievement configurations.
 */
export const DEFAULT_ACHIEVEMENTS: AchievementConfig[] = [
  {
    id: "years",
    icon: "calendar",
    value: 10,
    suffix: "+",
    label: "Years Experience",
  },
  {
    id: "projects",
    icon: "folder",
    value: 50,
    suffix: "+",
    label: "Projects Completed",
  },
  {
    id: "technologies",
    icon: "code",
    value: 20,
    suffix: "+",
    label: "Technologies Mastered",
  },
  {
    id: "community",
    icon: "users",
    value: 1000,
    suffix: "+",
    label: "Community Members",
  },
] as const;

// ============================================================================
// Icon Mapping
// ============================================================================

/**
 * Map of achievement icon names to Lucide icon components.
 * This is populated at runtime to avoid circular imports.
 */
export type IconMap = Record<AchievementIcon, LucideIcon>;
