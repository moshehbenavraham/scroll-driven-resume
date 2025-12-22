/**
 * Tests for SkillCard component.
 */

import { render, screen } from "@testing-library/react";
import { vi, beforeEach } from "vitest";
import { SkillCard } from "@/components/skills/SkillCard";
import type { SkillCategoryConfig } from "@/types/skills";

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
      div: ({
        children,
        className,
        ...props
      }: React.PropsWithChildren<{ className?: string }>) => (
        <div className={className} {...props}>
          {children}
        </div>
      ),
    },
  };
});

const mockCategory: SkillCategoryConfig = {
  id: "development",
  icon: "code",
  title: "Development",
  skills: ["TypeScript", "React", "Next.js"],
};

describe("SkillCard", () => {
  beforeEach(() => {
    mockReducedMotion = false;
  });

  it("renders without crashing", () => {
    render(<SkillCard category={mockCategory} />);
    expect(screen.getByText("Development")).toBeInTheDocument();
  });

  it("renders category title", () => {
    render(<SkillCard category={mockCategory} />);
    expect(
      screen.getByRole("heading", { name: "Development" })
    ).toBeInTheDocument();
  });

  it("renders icon", () => {
    const { container } = render(<SkillCard category={mockCategory} />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("renders all skills in list", () => {
    render(<SkillCard category={mockCategory} />);
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Next.js")).toBeInTheDocument();
  });

  it("renders skills list", () => {
    render(<SkillCard category={mockCategory} />);
    expect(screen.getByRole("list")).toBeInTheDocument();
  });

  it("renders correct number of skill items", () => {
    render(<SkillCard category={mockCategory} />);
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(3);
  });

  it("applies custom className", () => {
    const { container } = render(
      <SkillCard category={mockCategory} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("has proper card styling", () => {
    const { container } = render(<SkillCard category={mockCategory} />);
    expect(container.firstChild).toHaveClass("rounded-xl");
    expect(container.firstChild).toHaveClass("p-6");
  });

  it("has hover effect classes", () => {
    const { container } = render(<SkillCard category={mockCategory} />);
    expect(container.firstChild).toHaveClass("hover:-translate-y-1");
    expect(container.firstChild).toHaveClass("hover:shadow-lg");
  });

  it("has height-full for equal heights in grid", () => {
    const { container } = render(<SkillCard category={mockCategory} />);
    expect(container.firstChild).toHaveClass("h-full");
  });

  it("renders with different icon types", () => {
    const icons: Array<SkillCategoryConfig["icon"]> = [
      "brain",
      "code",
      "layers",
      "users",
    ];

    icons.forEach((icon) => {
      const { container, unmount } = render(
        <SkillCard category={{ ...mockCategory, icon }} key={icon} />
      );
      expect(container.querySelector("svg")).toBeInTheDocument();
      unmount();
    });
  });

  it("respects isRevealed prop", () => {
    const { container, rerender } = render(
      <SkillCard category={mockCategory} isRevealed={false} />
    );
    expect(container.firstChild).toBeInTheDocument();

    rerender(<SkillCard category={mockCategory} isRevealed={true} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("handles category with no skills", () => {
    const emptyCategory: SkillCategoryConfig = {
      id: "empty",
      icon: "code",
      title: "Empty",
      skills: [],
    };
    render(<SkillCard category={emptyCategory} />);
    expect(screen.getByText("Empty")).toBeInTheDocument();
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });

  it("shows correct title hierarchy (h3)", () => {
    render(<SkillCard category={mockCategory} />);
    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading).toHaveTextContent("Development");
  });

  describe("reduced motion", () => {
    beforeEach(() => {
      mockReducedMotion = true;
    });

    it("renders correctly with reduced motion", () => {
      render(<SkillCard category={mockCategory} isRevealed={true} />);
      expect(screen.getByText("Development")).toBeInTheDocument();
    });
  });
});
