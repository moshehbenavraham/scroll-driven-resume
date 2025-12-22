/**
 * Navigation component TypeScript interfaces.
 * Defines types for navbar, navigation links, and mobile menu components.
 */

/**
 * Navigation link configuration.
 */
export interface NavLinkConfig {
  /** Target section ID (without hash, e.g., "about") */
  id: string;
  /** Display label for the link */
  label: string;
  /** Target href (with hash, e.g., "#about") */
  href: string;
}

/**
 * Props for NavLink component.
 */
export interface NavLinkProps {
  /** Target section href (e.g., "#about") */
  href: string;
  /** Link content */
  children: React.ReactNode;
  /** Whether this link is currently active */
  isActive?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Props for NavLinks component (desktop link list).
 */
export interface NavLinksProps {
  /** Currently active section ID */
  activeSection: string | null;
  /** Callback when a link is clicked */
  onLinkClick?: (sectionId: string) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Props for MobileMenuButton component.
 */
export interface MobileMenuButtonProps {
  /** Whether the menu is currently open */
  isOpen: boolean;
  /** Toggle handler */
  onToggle: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Props for MobileDrawer component.
 */
export interface MobileDrawerProps {
  /** Whether the drawer is open */
  isOpen: boolean;
  /** Close handler */
  onClose: () => void;
  /** Currently active section ID */
  activeSection: string | null;
  /** Callback when a link is clicked */
  onLinkClick?: (sectionId: string) => void;
}

/**
 * Props for MobileMenu container component.
 */
export interface MobileMenuProps {
  /** Currently active section ID */
  activeSection: string | null;
  /** Callback when a link is clicked */
  onLinkClick?: (sectionId: string) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Props for main Navbar component.
 */
export interface NavbarProps {
  /** Additional CSS classes */
  className?: string;
  /** Enable scroll-aware hide behavior (hide on down, show on up) */
  hideOnScroll?: boolean;
}

/**
 * Options for useActiveSection hook.
 */
export interface UseActiveSectionOptions {
  /** Array of section IDs to observe (e.g., ["hero", "about", "skills"]) */
  sectionIds: string[];
  /** Intersection threshold (0-1, default: 0.3) */
  threshold?: number;
  /** Root margin for observation (default: "-80px 0px 0px 0px" for navbar height) */
  rootMargin?: string;
}

/**
 * Scroll direction type.
 */
export type ScrollDirection = "up" | "down" | null;

/**
 * Options for useScrollDirection hook.
 */
export interface UseScrollDirectionOptions {
  /** Minimum scroll delta before direction change is registered (default: 10) */
  threshold?: number;
  /** Initial direction (default: null) */
  initialDirection?: ScrollDirection;
}

/**
 * Default navigation links configuration.
 * Used by navbar components.
 */
export const NAV_LINKS: NavLinkConfig[] = [
  { id: "hero", label: "Home", href: "#hero" },
  { id: "about", label: "About", href: "#about" },
  { id: "skills", label: "Skills", href: "#skills" },
  { id: "projects", label: "Projects", href: "#projects" },
  { id: "ai-community", label: "AI Community", href: "#ai-community" },
  { id: "contact", label: "Contact", href: "#contact" },
];

/**
 * Section IDs for navigation (derived from NAV_LINKS).
 */
export const SECTION_IDS = NAV_LINKS.map((link) => link.id);
