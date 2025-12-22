"use client";

/**
 * ProductContent component - Main content block for product section.
 * Contains product name, tagline, and optional child components.
 */

import { cn } from "@/lib/cn";
import { type ProductContentProps, DEFAULT_PRODUCT_CONTENT } from "@/types/product";

/**
 * Product content container with name and tagline.
 * Accepts children for stats and CTAs.
 *
 * @param props - Component props
 * @param props.name - Product name to display (default: from DEFAULT_PRODUCT_CONTENT)
 * @param props.tagline - Tagline to display (default: from DEFAULT_PRODUCT_CONTENT)
 * @param props.className - Optional additional CSS classes
 * @param props.children - Optional child elements (stats, CTAs)
 *
 * @example
 * <ProductContent>
 *   <ProductStats />
 *   <ProductCTAs />
 * </ProductContent>
 */
export function ProductContent({
  name = DEFAULT_PRODUCT_CONTENT.name,
  tagline = DEFAULT_PRODUCT_CONTENT.tagline,
  className,
  children,
}: ProductContentProps) {
  return (
    <div
      className={cn(
        // Container positioning
        "flex flex-col items-center justify-center",
        "text-center",
        // Spacing
        "px-4 py-8 md:px-8 md:py-12",
        // Max width for readability
        "mx-auto max-w-3xl",
        className
      )}
    >
      {/* Product Name */}
      <h2
        className={cn(
          "text-3xl md:text-4xl lg:text-5xl",
          "font-bold tracking-tight",
          "text-white",
          "mb-3"
        )}
      >
        {name}
      </h2>

      {/* Tagline */}
      <p
        className={cn(
          "text-lg md:text-xl lg:text-2xl",
          "font-medium",
          "text-white/80",
          "mb-8"
        )}
      >
        {tagline}
      </p>

      {/* Children (stats, CTAs, etc.) */}
      {children}
    </div>
  );
}

export default ProductContent;
