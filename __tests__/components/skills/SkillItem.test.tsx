/**
 * Tests for SkillItem component.
 */

import { render, screen } from "@testing-library/react";
import { SkillItem } from "@/components/skills/SkillItem";

describe("SkillItem", () => {
  it("renders without crashing", () => {
    render(<SkillItem skill="TypeScript" />);
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("renders skill text correctly", () => {
    render(<SkillItem skill="React" />);
    expect(screen.getByText("React")).toBeInTheDocument();
  });

  it("renders as list item", () => {
    render(<SkillItem skill="Next.js" />);
    expect(screen.getByRole("listitem")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<SkillItem skill="Python" className="custom-class" />);
    const item = screen.getByRole("listitem");
    expect(item).toHaveClass("custom-class");
  });

  it("has base text styling", () => {
    render(<SkillItem skill="Go" />);
    const item = screen.getByRole("listitem");
    expect(item).toHaveClass("text-sm");
    expect(item).toHaveClass("text-muted-foreground");
  });

  it("has hover transition styling", () => {
    render(<SkillItem skill="Node.js" />);
    const item = screen.getByRole("listitem");
    expect(item).toHaveClass("transition-colors");
    expect(item).toHaveClass("duration-200");
  });

  it("handles long skill names gracefully", () => {
    const longSkill = "Natural Language Processing and Understanding";
    render(<SkillItem skill={longSkill} />);
    expect(screen.getByText(longSkill)).toBeInTheDocument();
  });

  it("handles skill names with special characters", () => {
    render(<SkillItem skill="A/B Testing" />);
    expect(screen.getByText("A/B Testing")).toBeInTheDocument();
  });

  it("handles empty skill string", () => {
    render(<SkillItem skill="" />);
    const item = screen.getByRole("listitem");
    expect(item).toBeInTheDocument();
    expect(item).toHaveTextContent("");
  });
});
