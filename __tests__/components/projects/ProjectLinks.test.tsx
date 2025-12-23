/**
 * Tests for ProjectLinks component.
 */

import { render, screen } from "@testing-library/react";
import { ProjectLinks } from "@/components/projects/ProjectLinks";

describe("ProjectLinks", () => {
  it("renders without crashing with both links", () => {
    render(
      <ProjectLinks
        liveUrl="https://example.com"
        sourceUrl="https://github.com/example"
      />
    );
    expect(screen.getByText("Live Demo")).toBeInTheDocument();
    expect(screen.getByText("Source")).toBeInTheDocument();
  });

  it("renders only live demo link when sourceUrl is missing", () => {
    render(<ProjectLinks liveUrl="https://example.com" />);
    expect(screen.getByText("Live Demo")).toBeInTheDocument();
    expect(screen.queryByText("Source")).not.toBeInTheDocument();
  });

  it("renders only source link when liveUrl is missing", () => {
    render(<ProjectLinks sourceUrl="https://github.com/example" />);
    expect(screen.queryByText("Live Demo")).not.toBeInTheDocument();
    expect(screen.getByText("Source")).toBeInTheDocument();
  });

  it("returns null when no links provided", () => {
    const { container } = render(<ProjectLinks />);
    expect(container.firstChild).toBeNull();
  });

  it("live demo link has correct href", () => {
    render(<ProjectLinks liveUrl="https://example.com" />);
    const link = screen.getByRole("link", {
      name: /view live demo/i,
    });
    expect(link).toHaveAttribute("href", "https://example.com");
  });

  it("source link has correct href", () => {
    render(<ProjectLinks sourceUrl="https://github.com/example" />);
    const link = screen.getByRole("link", {
      name: /view source code/i,
    });
    expect(link).toHaveAttribute("href", "https://github.com/example");
  });

  it("links open in new tab", () => {
    render(
      <ProjectLinks
        liveUrl="https://example.com"
        sourceUrl="https://github.com/example"
      />
    );
    const links = screen.getAllByRole("link");
    links.forEach((link) => {
      expect(link).toHaveAttribute("target", "_blank");
    });
  });

  it("links have security rel attribute", () => {
    render(
      <ProjectLinks
        liveUrl="https://example.com"
        sourceUrl="https://github.com/example"
      />
    );
    const links = screen.getAllByRole("link");
    links.forEach((link) => {
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  it("renders icons", () => {
    const { container } = render(
      <ProjectLinks
        liveUrl="https://example.com"
        sourceUrl="https://github.com/example"
      />
    );
    const svgs = container.querySelectorAll("svg");
    expect(svgs).toHaveLength(2);
  });

  it("icons have aria-hidden for accessibility", () => {
    const { container } = render(
      <ProjectLinks
        liveUrl="https://example.com"
        sourceUrl="https://github.com/example"
      />
    );
    const svgs = container.querySelectorAll("svg");
    svgs.forEach((svg) => {
      expect(svg).toHaveAttribute("aria-hidden", "true");
    });
  });

  it("applies custom className", () => {
    const { container } = render(
      <ProjectLinks
        liveUrl="https://example.com"
        className="custom-class"
      />
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("links have accessible labels", () => {
    render(
      <ProjectLinks
        liveUrl="https://example.com"
        sourceUrl="https://github.com/example"
      />
    );
    expect(
      screen.getByRole("link", { name: /view live demo/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /view source code/i })
    ).toBeInTheDocument();
  });
});
