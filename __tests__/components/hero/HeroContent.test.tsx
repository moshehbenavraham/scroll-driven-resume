/**
 * Tests for HeroContent component.
 */

import { render, screen } from "@testing-library/react";
import { HeroContent } from "@/components/hero/HeroContent";
import { DEFAULT_HERO_CONTENT } from "@/types/hero";

describe("HeroContent", () => {
  it("renders without crashing", () => {
    render(<HeroContent />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("renders default name", () => {
    render(<HeroContent />);
    expect(screen.getByText(DEFAULT_HERO_CONTENT.name)).toBeInTheDocument();
  });

  it("renders default title", () => {
    render(<HeroContent />);
    expect(screen.getByText(DEFAULT_HERO_CONTENT.title)).toBeInTheDocument();
  });

  it("renders default tagline", () => {
    render(<HeroContent />);
    expect(screen.getByText(DEFAULT_HERO_CONTENT.tagline)).toBeInTheDocument();
  });

  it("renders custom name when provided", () => {
    render(<HeroContent name="Custom Name" />);
    expect(screen.getByText("Custom Name")).toBeInTheDocument();
  });

  it("renders custom title when provided", () => {
    render(<HeroContent title="Custom Title" />);
    expect(screen.getByText("Custom Title")).toBeInTheDocument();
  });

  it("renders custom tagline when provided", () => {
    render(<HeroContent tagline="Custom Tagline" />);
    expect(screen.getByText("Custom Tagline")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<HeroContent className="custom-class" />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass("custom-class");
  });

  it("renders children content", () => {
    render(
      <HeroContent>
        <div data-testid="child">Child Content</div>
      </HeroContent>
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("renders name in h1 element", () => {
    render(<HeroContent />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent(DEFAULT_HERO_CONTENT.name);
  });

  it("centers content with flex layout", () => {
    const { container } = render(<HeroContent />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass("flex");
    expect(wrapper).toHaveClass("flex-col");
    expect(wrapper).toHaveClass("items-center");
    expect(wrapper).toHaveClass("justify-center");
  });

  it("has responsive text sizing", () => {
    render(<HeroContent />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveClass("text-4xl");
    expect(heading).toHaveClass("md:text-5xl");
    expect(heading).toHaveClass("lg:text-6xl");
  });
});
