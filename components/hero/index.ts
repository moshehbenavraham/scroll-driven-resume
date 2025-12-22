/**
 * Barrel export for hero components.
 */

export { HeroContent } from "./HeroContent";
export { SkillIndicators } from "./SkillIndicators";
export { SocialLinks } from "./SocialLinks";

// Re-export types for convenience
export type {
  HeroContentProps,
  SkillIndicatorsProps,
  SocialLinksProps,
  SkillConfig,
  SocialLinkConfig,
} from "@/types/hero";
