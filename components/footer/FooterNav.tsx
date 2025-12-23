"use client";

/**
 * FooterNav component - Navigation links for site footer.
 * Provides internal section links and external links with appropriate styling.
 */

import { cn } from "@/lib/cn";
import { DEFAULT_FOOTER_LINKS, type FooterNavProps } from "@/types/contact";

/**
 * Footer navigation links component.
 * Renders a horizontal list of navigation links.
 *
 * @param props - Component props
 * @param props.className - Optional additional CSS classes
 * @param props.links - Optional custom links (uses defaults if not provided)
 *
 * @example
 * <FooterNav />
 */
export function FooterNav({
  className,
  links = DEFAULT_FOOTER_LINKS,
}: FooterNavProps) {
  /**
   * Handle smooth scroll to section.
   */
  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    // Only handle internal section links
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.slice(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  };

  return (
    <nav
      className={cn("flex flex-wrap justify-center gap-2 sm:gap-4", className)}
      aria-label="Footer navigation"
    >
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          onClick={(e) => handleClick(e, link.href)}
          className={cn(
            // 44px minimum touch target with padding
            "inline-flex items-center justify-center",
            "min-h-[44px] px-3 py-2",
            "text-sm font-medium",
            "text-muted-foreground hover:text-foreground",
            "transition-colors duration-200",
            "focus:ring-accent focus:ring-2 focus:ring-offset-2 focus:outline-none",
            "focus:ring-offset-background rounded-md"
          )}
          {...(link.isExternal && {
            target: "_blank",
            rel: "noopener noreferrer",
          })}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}

export default FooterNav;
