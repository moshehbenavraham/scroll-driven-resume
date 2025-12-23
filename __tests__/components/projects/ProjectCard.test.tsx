/* eslint-disable @next/next/no-img-element */
/**
 * Tests for ProjectCard component.
 */

import { render, screen } from "@testing-library/react";
import { vi, beforeEach } from "vitest";
import { ProjectCard } from "@/components/projects/ProjectCard";
import type { Project } from "@/types/projects";

// Track if reduced motion is enabled for tests
let mockReducedMotion = false;

// Mock useReducedMotion hook
vi.mock("@/hooks/useReducedMotion", () => ({
  useReducedMotion: vi.fn(() => mockReducedMotion),
}));

// Mock framer-motion
vi.mock("framer-motion", async () => {
  const actual = await vi.importActual("framer-motion");
  return {
    ...actual,
    motion: {
      article: ({
        children,
        className,
        ...props
      }: React.PropsWithChildren<{ className?: string }>) => (
        <article className={className} {...props}>
          {children}
        </article>
      ),
    },
  };
});

// Mock next/image
vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    className,
  }: {
    src: string;
    alt: string;
    className?: string;
  }) => <img src={src} alt={alt} className={className} />,
}));

const mockProject: Project = {
  id: "test-project",
  title: "Test Project",
  description: "A test project description for unit testing.",
  thumbnail: "/images/test.webp",
  technologies: ["TypeScript", "React", "Next.js", "Node.js"],
  liveUrl: "https://example.com",
  sourceUrl: "https://github.com/example/test",
};

describe("ProjectCard", () => {
  beforeEach(() => {
    mockReducedMotion = false;
  });

  it("renders without crashing", () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText("Test Project")).toBeInTheDocument();
  });

  it("renders project title", () => {
    render(<ProjectCard project={mockProject} />);
    expect(
      screen.getByRole("heading", { name: "Test Project" })
    ).toBeInTheDocument();
  });

  it("renders project description", () => {
    render(<ProjectCard project={mockProject} />);
    expect(
      screen.getByText("A test project description for unit testing.")
    ).toBeInTheDocument();
  });

  it("renders project thumbnail", () => {
    render(<ProjectCard project={mockProject} />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "/images/test.webp");
    expect(img).toHaveAttribute("alt", "Test Project project screenshot");
  });

  it("renders tech badges", () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Next.js")).toBeInTheDocument();
  });

  it("limits tech badges to 5", () => {
    const manyTechProject: Project = {
      ...mockProject,
      technologies: ["T1", "T2", "T3", "T4", "T5", "T6", "T7"],
    };
    render(<ProjectCard project={manyTechProject} />);
    expect(screen.getByText("T1")).toBeInTheDocument();
    expect(screen.getByText("T5")).toBeInTheDocument();
    expect(screen.queryByText("T6")).not.toBeInTheDocument();
  });

  it("renders project links", () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText("Live Demo")).toBeInTheDocument();
    expect(screen.getByText("Source")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <ProjectCard project={mockProject} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("has hover effect classes", () => {
    const { container } = render(<ProjectCard project={mockProject} />);
    expect(container.firstChild).toHaveClass("hover:-translate-y-2");
    expect(container.firstChild).toHaveClass("hover:shadow-lg");
  });

  it("has group class for child hover effects", () => {
    const { container } = render(<ProjectCard project={mockProject} />);
    expect(container.firstChild).toHaveClass("group");
  });

  it("has height-full for equal heights in grid", () => {
    const { container } = render(<ProjectCard project={mockProject} />);
    expect(container.firstChild).toHaveClass("h-full");
  });

  it("renders as article element", () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByRole("article")).toBeInTheDocument();
  });

  it("shows correct title hierarchy (h3)", () => {
    render(<ProjectCard project={mockProject} />);
    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading).toHaveTextContent("Test Project");
  });

  it("respects isRevealed prop", () => {
    const { container, rerender } = render(
      <ProjectCard project={mockProject} isRevealed={false} />
    );
    expect(container.firstChild).toBeInTheDocument();

    rerender(<ProjectCard project={mockProject} isRevealed={true} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("handles project with no live URL", () => {
    const noLiveProject: Project = {
      ...mockProject,
      liveUrl: undefined,
    };
    render(<ProjectCard project={noLiveProject} />);
    expect(screen.queryByText("Live Demo")).not.toBeInTheDocument();
    expect(screen.getByText("Source")).toBeInTheDocument();
  });

  it("handles project with no source URL", () => {
    const noSourceProject: Project = {
      ...mockProject,
      sourceUrl: undefined,
    };
    render(<ProjectCard project={noSourceProject} />);
    expect(screen.getByText("Live Demo")).toBeInTheDocument();
    expect(screen.queryByText("Source")).not.toBeInTheDocument();
  });

  it("handles project with no links", () => {
    const noLinksProject: Project = {
      ...mockProject,
      liveUrl: undefined,
      sourceUrl: undefined,
    };
    render(<ProjectCard project={noLinksProject} />);
    expect(screen.queryByText("Live Demo")).not.toBeInTheDocument();
    expect(screen.queryByText("Source")).not.toBeInTheDocument();
  });

  describe("reduced motion", () => {
    beforeEach(() => {
      mockReducedMotion = true;
    });

    it("renders correctly with reduced motion", () => {
      render(<ProjectCard project={mockProject} isRevealed={true} />);
      expect(screen.getByText("Test Project")).toBeInTheDocument();
    });
  });
});
