/**
 * Type definitions for product section components.
 */

import type { ReactNode } from "react";

// ============================================================================
// Product Stat Types
// ============================================================================

/**
 * Icon identifier for product stats.
 */
export type ProductStatIcon =
  | "users"
  | "book"
  | "code"
  | "calendar"
  | "star"
  | "globe";

/**
 * Configuration for a single product stat.
 */
export interface ProductStat {
  /** Display label (e.g., "Members") */
  label: string;
  /** Display value (e.g., "10,000+") */
  value: string;
  /** Icon identifier */
  icon: ProductStatIcon;
}

/**
 * Props for ProductStats component.
 */
export interface ProductStatsProps {
  /** Array of stats to display */
  stats?: ProductStat[];
  /** Optional additional CSS classes */
  className?: string;
  /** Scroll progress for reveal animation (0-1) */
  scrollProgress?: number;
}

// ============================================================================
// Product Content Types
// ============================================================================

/**
 * Configuration for product content.
 */
export interface ProductContentConfig {
  /** Product name */
  name: string;
  /** Product tagline */
  tagline: string;
}

/**
 * Props for ProductContent component.
 */
export interface ProductContentProps {
  /** Product name */
  name?: string;
  /** Product tagline */
  tagline?: string;
  /** Optional additional CSS classes */
  className?: string;
  /** Optional child elements */
  children?: ReactNode;
}

// ============================================================================
// Product CTA Types
// ============================================================================

/**
 * Configuration for a single CTA button.
 */
export interface ProductCTAConfig {
  /** Button label */
  label: string;
  /** Target URL or anchor */
  href: string;
}

/**
 * Configuration for product CTAs.
 */
export interface ProductCTAsConfig {
  /** Primary CTA button */
  primary: ProductCTAConfig;
  /** Secondary CTA button */
  secondary: ProductCTAConfig;
}

/**
 * Props for ProductCTAs component.
 */
export interface ProductCTAsProps {
  /** Primary CTA configuration */
  primary?: ProductCTAConfig;
  /** Secondary CTA configuration */
  secondary?: ProductCTAConfig;
  /** Optional additional CSS classes */
  className?: string;
  /** Click handler for primary button */
  onPrimaryClick?: () => void;
  /** Click handler for secondary button */
  onSecondaryClick?: () => void;
}

// ============================================================================
// Product Section Types
// ============================================================================

/**
 * Props for ProductSection component.
 */
export interface ProductSectionProps {
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
 * Default product content values.
 */
export const DEFAULT_PRODUCT_CONTENT: ProductContentConfig = {
  name: "AI Community",
  tagline: "Join 10,000+ builders shaping the future of AI",
} as const;

/**
 * Default product stats configuration.
 */
export const DEFAULT_PRODUCT_STATS: ProductStat[] = [
  { label: "Members", value: "10,000+", icon: "users" },
  { label: "Resources", value: "500+", icon: "book" },
  { label: "Projects", value: "1,200+", icon: "code" },
  { label: "Events", value: "50+", icon: "calendar" },
] as const;

/**
 * Default product CTAs configuration.
 */
export const DEFAULT_PRODUCT_CTAS: ProductCTAsConfig = {
  primary: {
    label: "Join the Community",
    href: "#join",
  },
  secondary: {
    label: "Learn More",
    href: "#about",
  },
} as const;
