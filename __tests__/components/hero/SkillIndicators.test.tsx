/**
 * Tests for SkillIndicators component.
 */

import { render, screen } from "@testing-library/react";
import { SkillIndicators } from "@/components/hero/SkillIndicators";
import { DEFAULT_SKILLS } from "@/types/hero";

describe("SkillIndicators", () => {
  it("renders without crashing", () => {
    render(<SkillIndicators />);
    expect(screen.getByRole("list")).toBeInTheDocument();
  });

  it("renders four skill badges by default", () => {
    render(<SkillIndicators />);

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(4);
  });

  it("renders all default skill labels", () => {
    render(<SkillIndicators />);

    DEFAULT_SKILLS.forEach((skill) => {
      expect(screen.getByText(skill.label)).toBeInTheDocument();
    });
  });

  it("renders all default skill descriptions", () => {
    render(<SkillIndicators />);

    DEFAULT_SKILLS.forEach((skill) => {
      expect(screen.getByText(skill.description)).toBeInTheDocument();
    });
  });

  it("applies custom className", () => {
    render(<SkillIndicators className="custom-class" />);

    const list = screen.getByRole("list");
    expect(list).toHaveClass("custom-class");
  });

  it("renders custom skills when provided", () => {
    const customSkills = [
      {
        category: "ai" as const,
        label: "Custom AI",
        description: "Custom AI Description",
      },
    ];

    render(<SkillIndicators skills={customSkills} />);

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(1);
    expect(screen.getByText("Custom AI")).toBeInTheDocument();
    expect(screen.getByText("Custom AI Description")).toBeInTheDocument();
  });

  it("has accessible list landmark", () => {
    render(<SkillIndicators />);

    const list = screen.getByRole("list");
    expect(list).toHaveAttribute("aria-label", "Key skills and expertise");
  });

  it("renders responsive grid classes", () => {
    render(<SkillIndicators />);

    const list = screen.getByRole("list");
    expect(list).toHaveClass("grid");
    expect(list).toHaveClass("grid-cols-2");
    expect(list).toHaveClass("md:grid-cols-4");
  });
});
