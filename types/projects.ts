/**
 * Type definitions for projects section components.
 */

// ============================================================================
// Project Types
// ============================================================================

/**
 * Configuration for a single portfolio project.
 */
export interface Project {
  /** Unique identifier for the project */
  id: string;
  /** Project title */
  title: string;
  /** Brief description of the project (2-3 sentences) */
  description: string;
  /** Thumbnail image URL or path */
  thumbnail: string;
  /** Technologies used in the project */
  technologies: string[];
  /** Live demo URL (optional) */
  liveUrl?: string;
  /** Source code repository URL (optional) */
  sourceUrl?: string;
}

/**
 * Props for ProjectCard component.
 */
export interface ProjectCardProps {
  /** Project data */
  project: Project;
  /** Whether the card should be revealed (for animations) */
  isRevealed?: boolean;
  /** Animation delay in seconds */
  delay?: number;
  /** Optional additional CSS classes */
  className?: string;
}

/**
 * Props for TechBadge component.
 */
export interface TechBadgeProps {
  /** Technology name */
  technology: string;
  /** Optional additional CSS classes */
  className?: string;
}

/**
 * Props for ProjectLinks component.
 */
export interface ProjectLinksProps {
  /** Live demo URL (optional) */
  liveUrl?: string;
  /** Source code repository URL (optional) */
  sourceUrl?: string;
  /** Optional additional CSS classes */
  className?: string;
}

/**
 * Props for ProjectImage component.
 */
export interface ProjectImageProps {
  /** Image URL or path */
  src: string;
  /** Alt text for the image */
  alt: string;
  /** Optional additional CSS classes */
  className?: string;
}

/**
 * Props for ProjectsDecorative component.
 */
export interface ProjectsDecorativeProps {
  /** Optional additional CSS classes */
  className?: string;
}

/**
 * Props for ProjectsSection component.
 */
export interface ProjectsSectionProps {
  /** Optional additional CSS classes */
  className?: string;
  /** Whether content should be revealed (for loading sync) */
  isRevealed?: boolean;
}

// ============================================================================
// Default Content Configuration
// ============================================================================

/**
 * Default project configurations for the portfolio.
 * Placeholder images use gradient backgrounds until real screenshots are added.
 */
export const DEFAULT_PROJECTS: Project[] = [
  {
    id: "ai-platform",
    title: "AI Analytics Platform",
    description:
      "Enterprise analytics platform with ML-powered insights. Features real-time data processing, custom dashboards, and predictive modeling for business intelligence.",
    thumbnail: "/images/projects/ai-platform.webp",
    technologies: ["Python", "TensorFlow", "React", "PostgreSQL", "Docker"],
    liveUrl: "https://example.com/ai-platform",
    sourceUrl: "https://github.com/example/ai-platform",
  },
  {
    id: "ecommerce-app",
    title: "E-Commerce Mobile App",
    description:
      "Full-featured mobile commerce application with AR product visualization, real-time inventory sync, and personalized recommendations engine.",
    thumbnail: "/images/projects/ecommerce-app.webp",
    technologies: ["React Native", "Node.js", "MongoDB", "Redis", "AWS"],
    liveUrl: "https://example.com/ecommerce",
    sourceUrl: "https://github.com/example/ecommerce",
  },
  {
    id: "devops-toolkit",
    title: "DevOps Automation Toolkit",
    description:
      "Infrastructure as code toolkit for CI/CD pipelines. Automates deployment workflows, monitoring setup, and security compliance checks.",
    thumbnail: "/images/projects/devops-toolkit.webp",
    technologies: ["Go", "Terraform", "Kubernetes", "GitHub Actions"],
    sourceUrl: "https://github.com/example/devops-toolkit",
  },
  {
    id: "nlp-chatbot",
    title: "NLP Customer Support Bot",
    description:
      "Intelligent chatbot using transformer models for natural language understanding. Handles multi-turn conversations with context awareness.",
    thumbnail: "/images/projects/nlp-chatbot.webp",
    technologies: ["Python", "PyTorch", "FastAPI", "React", "Redis"],
    liveUrl: "https://example.com/chatbot-demo",
    sourceUrl: "https://github.com/example/nlp-chatbot",
  },
  {
    id: "data-viz",
    title: "Real-Time Data Visualization",
    description:
      "Interactive dashboard for streaming data visualization. Supports WebSocket connections, custom chart types, and collaborative annotations.",
    thumbnail: "/images/projects/data-viz.webp",
    technologies: ["TypeScript", "D3.js", "Next.js", "WebSocket", "InfluxDB"],
    liveUrl: "https://example.com/data-viz",
  },
] as const;
