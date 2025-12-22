"use client";

/**
 * ProductCTAs component - Primary and secondary call-to-action buttons.
 * Used in the product section to drive user engagement.
 */

import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { type ProductCTAsProps, DEFAULT_PRODUCT_CTAS } from "@/types/product";

/**
 * Product call-to-action buttons.
 * Renders a primary filled button and a secondary ghost/outline button.
 *
 * @param props - Component props
 * @param props.primary - Primary CTA configuration (default: from DEFAULT_PRODUCT_CTAS)
 * @param props.secondary - Secondary CTA configuration (default: from DEFAULT_PRODUCT_CTAS)
 * @param props.className - Optional additional CSS classes
 * @param props.onPrimaryClick - Click handler for primary button
 * @param props.onSecondaryClick - Click handler for secondary button
 *
 * @example
 * <ProductCTAs
 *   onPrimaryClick={() => console.log('Join clicked')}
 *   onSecondaryClick={() => console.log('Learn more clicked')}
 * />
 */
export function ProductCTAs({
  primary = DEFAULT_PRODUCT_CTAS.primary,
  secondary = DEFAULT_PRODUCT_CTAS.secondary,
  className,
  onPrimaryClick,
  onSecondaryClick,
}: ProductCTAsProps) {
  /**
   * Handle primary button click.
   * Calls custom handler if provided, otherwise navigates to href.
   */
  const handlePrimaryClick = () => {
    if (onPrimaryClick) {
      onPrimaryClick();
    }
  };

  /**
   * Handle secondary button click.
   * Calls custom handler if provided, otherwise navigates to href.
   */
  const handleSecondaryClick = () => {
    if (onSecondaryClick) {
      onSecondaryClick();
    }
  };

  return (
    <div
      className={cn(
        // Flex layout
        "flex flex-col sm:flex-row",
        "items-center justify-center",
        "gap-4",
        className
      )}
    >
      {/* Primary CTA */}
      <Button
        asChild={!onPrimaryClick}
        variant="default"
        size="lg"
        onClick={onPrimaryClick ? handlePrimaryClick : undefined}
        className={cn(
          // Custom styling for brand accent
          "bg-purple-600 hover:bg-purple-700",
          "text-white font-semibold",
          // Size overrides
          "px-8 py-3",
          "text-base md:text-lg",
          // Focus state
          "focus:ring-purple-500",
          // Min width for consistent sizing
          "min-w-[200px]"
        )}
        aria-label={primary.label}
      >
        {onPrimaryClick ? (
          primary.label
        ) : (
          <a href={primary.href}>{primary.label}</a>
        )}
      </Button>

      {/* Secondary CTA */}
      <Button
        asChild={!onSecondaryClick}
        variant="outline"
        size="lg"
        onClick={onSecondaryClick ? handleSecondaryClick : undefined}
        className={cn(
          // Custom styling for ghost/outline on dark
          "border-white/30 hover:border-white/50",
          "bg-transparent hover:bg-white/10",
          "text-white font-medium",
          // Size overrides
          "px-8 py-3",
          "text-base md:text-lg",
          // Min width for consistent sizing
          "min-w-[200px]"
        )}
        aria-label={secondary.label}
      >
        {onSecondaryClick ? (
          secondary.label
        ) : (
          <a href={secondary.href}>{secondary.label}</a>
        )}
      </Button>
    </div>
  );
}

export default ProductCTAs;
