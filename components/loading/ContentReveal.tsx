"use client";

/**
 * ContentReveal component - Staggered reveal animation wrapper.
 * Animates children with staggered timing after loading completes.
 */

import { motion } from "framer-motion";
import { Children, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Props for ContentReveal component.
 */
export interface ContentRevealProps {
  /** Whether content should be revealed */
  isRevealed: boolean;
  /** Content to reveal */
  children: ReactNode;
  /** Delay between each child animation in seconds (default: 0.05) */
  staggerDelay?: number;
  /** Optional custom className for styling */
  className?: string;
}

/**
 * Animation variants for container.
 */
const containerVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

/**
 * Animation variants for each child item.
 */
const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

/**
 * Animation variants for reduced motion (instant reveal).
 */
const reducedMotionVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0,
    },
  },
};

/**
 * Content reveal wrapper with staggered child animations.
 * Children animate in sequence with fade and slide up effect.
 * Respects user's reduced motion preference.
 */
export function ContentReveal({
  isRevealed,
  children,
  staggerDelay = 0.05,
  className = "",
}: ContentRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  // Create custom container variants with provided stagger delay
  const customContainerVariants = {
    ...containerVariants,
    visible: {
      ...containerVariants.visible,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
      },
    },
  };

  // Use reduced motion variants if preferred
  const activeContainerVariants = prefersReducedMotion
    ? reducedMotionVariants
    : customContainerVariants;

  const activeItemVariants = prefersReducedMotion
    ? reducedMotionVariants
    : itemVariants;

  // Convert children to array
  const childrenArray = Children.toArray(children);

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate={isRevealed ? "visible" : "hidden"}
      variants={activeContainerVariants}
      style={{
        // FOUC prevention - hide content until revealed
        visibility: isRevealed ? "visible" : "hidden",
      }}
    >
      {childrenArray.map((child, index) => (
        <motion.div key={index} variants={activeItemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

export default ContentReveal;
