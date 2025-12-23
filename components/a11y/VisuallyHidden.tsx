import type { ReactNode } from 'react';

interface VisuallyHiddenProps {
  children: ReactNode;
  /** HTML element to render. Defaults to span */
  as?: 'span' | 'div';
}

/**
 * Visually hidden component for screen reader only text
 * Content is hidden visually but accessible to screen readers
 */
export function VisuallyHidden({
  children,
  as: Component = 'span',
}: VisuallyHiddenProps) {
  return <Component className="sr-only">{children}</Component>;
}
