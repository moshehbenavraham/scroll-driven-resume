"use client";

/**
 * ProjectImage component - Thumbnail image with hover zoom effect.
 * Uses Next.js Image for optimization with overflow-hidden container.
 */

import Image from "next/image";
import { cn } from "@/lib/cn";
import type { ProjectImageProps } from "@/types/projects";

/**
 * Project thumbnail with hover zoom effect.
 * Container clips overflow to keep zoom within bounds.
 *
 * @param props - Component props
 * @param props.src - Image URL or path
 * @param props.alt - Alt text for the image
 * @param props.className - Optional additional CSS classes
 *
 * @example
 * <ProjectImage src="/images/project.webp" alt="Project screenshot" />
 */
export function ProjectImage({ src, alt, className }: ProjectImageProps) {
  return (
    <div
      className={cn(
        // Container clips the zoomed image
        "relative overflow-hidden",
        "rounded-t-lg",
        // Aspect ratio for consistent sizing (16:9)
        "aspect-video",
        // Background while loading
        "bg-muted",
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className={cn(
          // Fill container
          "object-cover",
          // Hover zoom effect (GPU-accelerated)
          "transition-transform duration-300 ease-out",
          // Parent hover triggers zoom via group
          "group-hover:scale-105"
        )}
      />
    </div>
  );
}

export default ProjectImage;
