"use client";

/**
 * ProjectLinks component - External link buttons for project cards.
 * Displays live demo and source code links with icons.
 */

import { ExternalLink, Github } from "lucide-react";
import { cn } from "@/lib/cn";
import type { ProjectLinksProps } from "@/types/projects";

/**
 * External link buttons for live demo and source code.
 * All links open in new tabs with proper security attributes.
 *
 * @param props - Component props
 * @param props.liveUrl - Live demo URL (optional)
 * @param props.sourceUrl - Source code repository URL (optional)
 * @param props.className - Optional additional CSS classes
 *
 * @example
 * <ProjectLinks
 *   liveUrl="https://example.com"
 *   sourceUrl="https://github.com/example/repo"
 * />
 */
export function ProjectLinks({
  liveUrl,
  sourceUrl,
  className,
}: ProjectLinksProps) {
  // Don't render if no links provided
  if (!liveUrl && !sourceUrl) {
    return null;
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {liveUrl ? (
        <a
          href={liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            // Base styling
            "inline-flex items-center gap-1.5",
            "text-sm font-medium",
            // Colors
            "text-muted-foreground",
            // Hover state
            "hover:text-accent",
            // Transition
            "transition-colors duration-200"
          )}
          aria-label="View live demo (opens in new tab)"
        >
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
          <span>Live Demo</span>
        </a>
      ) : null}
      {sourceUrl ? (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            // Base styling
            "inline-flex items-center gap-1.5",
            "text-sm font-medium",
            // Colors
            "text-muted-foreground",
            // Hover state
            "hover:text-accent",
            // Transition
            "transition-colors duration-200"
          )}
          aria-label="View source code (opens in new tab)"
        >
          <Github className="h-4 w-4" aria-hidden="true" />
          <span>Source</span>
        </a>
      ) : null}
    </div>
  );
}

export default ProjectLinks;
