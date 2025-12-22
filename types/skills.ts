/**
 * Type definitions for skills section components.
 */

import type { LucideIcon } from "lucide-react";

// ============================================================================
// Skill Types
// ============================================================================

/**
 * Icon names for skill category cards.
 * Using Lucide icon names that represent each category.
 */
export type SkillCategoryIcon = "brain" | "code" | "layers" | "users";

/**
 * Configuration for a single skill category card.
 */
export interface SkillCategoryConfig {
  /** Unique identifier for the category */
  id: string;
  /** Icon to display */
  icon: SkillCategoryIcon;
  /** Category title */
  title: string;
  /** List of skills in this category */
  skills: string[];
}

/**
 * Props for SkillCard component.
 */
export interface SkillCardProps {
  /** Skill category configuration */
  category: SkillCategoryConfig;
  /** Whether the card should be revealed (for animations) */
  isRevealed?: boolean;
  /** Optional additional CSS classes */
  className?: string;
  /** Animation delay in seconds */
  delay?: number;
}

/**
 * Props for SkillItem component.
 */
export interface SkillItemProps {
  /** Skill name/text */
  skill: string;
  /** Optional additional CSS classes */
  className?: string;
}

/**
 * Props for SkillsDecorative component.
 */
export interface SkillsDecorativeProps {
  /** Optional additional CSS classes */
  className?: string;
}

/**
 * Props for SkillsSection component.
 */
export interface SkillsSectionProps {
  /** Optional additional CSS classes */
  className?: string;
  /** Whether content should be revealed (for loading sync) */
  isRevealed?: boolean;
}

// ============================================================================
// Default Content Configuration
// ============================================================================

/**
 * Default skill category configurations.
 */
export const DEFAULT_SKILL_CATEGORIES: SkillCategoryConfig[] = [
  {
    id: "ai-ml",
    icon: "brain",
    title: "AI/ML",
    skills: [
      "Machine Learning",
      "Deep Learning",
      "Natural Language Processing",
      "Computer Vision",
      "TensorFlow",
      "PyTorch",
    ],
  },
  {
    id: "development",
    icon: "code",
    title: "Development",
    skills: ["TypeScript", "React", "Next.js", "Node.js", "Python", "Go"],
  },
  {
    id: "product",
    icon: "layers",
    title: "Product",
    skills: [
      "Product Strategy",
      "User Research",
      "A/B Testing",
      "Roadmap Planning",
      "Stakeholder Management",
      "Agile/Scrum",
    ],
  },
  {
    id: "leadership",
    icon: "users",
    title: "Leadership",
    skills: [
      "Team Building",
      "Mentorship",
      "Cross-functional Collaboration",
      "Technical Architecture",
      "Code Review",
      "Hiring",
    ],
  },
] as const;

// ============================================================================
// Icon Mapping
// ============================================================================

/**
 * Map of skill category icon names to Lucide icon components.
 * This is populated at runtime to avoid circular imports.
 */
export type SkillIconMap = Record<SkillCategoryIcon, LucideIcon>;
