/**
 * Tests for SocialLinks component.
 */

import { render, screen } from "@testing-library/react";
import { SocialLinks } from "@/components/hero/SocialLinks";
import { DEFAULT_SOCIAL_LINKS } from "@/types/hero";

describe("SocialLinks", () => {
  it("renders without crashing", () => {
    render(<SocialLinks />);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("renders four social links by default", () => {
    render(<SocialLinks />);
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(4);
  });

  it("renders with correct aria-labels", () => {
    render(<SocialLinks />);

    expect(screen.getByLabelText("GitHub Profile")).toBeInTheDocument();
    expect(screen.getByLabelText("LinkedIn Profile")).toBeInTheDocument();
    expect(screen.getByLabelText("Twitter Profile")).toBeInTheDocument();
    expect(screen.getByLabelText("Send Email")).toBeInTheDocument();
  });

  it("renders external links with target=_blank", () => {
    render(<SocialLinks />);

    const githubLink = screen.getByLabelText("GitHub Profile");
    const linkedinLink = screen.getByLabelText("LinkedIn Profile");
    const twitterLink = screen.getByLabelText("Twitter Profile");

    expect(githubLink).toHaveAttribute("target", "_blank");
    expect(linkedinLink).toHaveAttribute("target", "_blank");
    expect(twitterLink).toHaveAttribute("target", "_blank");
  });

  it("renders email link without target=_blank", () => {
    render(<SocialLinks />);

    const emailLink = screen.getByLabelText("Send Email");
    expect(emailLink).not.toHaveAttribute("target");
  });

  it("renders with correct hrefs", () => {
    render(<SocialLinks />);

    DEFAULT_SOCIAL_LINKS.forEach((link) => {
      const element = screen.getByLabelText(link.label);
      expect(element).toHaveAttribute("href", link.href);
    });
  });

  it("applies custom className", () => {
    render(<SocialLinks className="custom-class" />);

    const nav = screen.getByRole("navigation");
    expect(nav).toHaveClass("custom-class");
  });

  it("renders custom links when provided", () => {
    const customLinks = [
      {
        platform: "github" as const,
        label: "Custom GitHub",
        href: "https://github.com/custom",
      },
    ];

    render(<SocialLinks links={customLinks} />);

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(1);
    expect(screen.getByLabelText("Custom GitHub")).toBeInTheDocument();
  });

  it("has accessible navigation landmark", () => {
    render(<SocialLinks />);

    const nav = screen.getByRole("navigation");
    expect(nav).toHaveAttribute("aria-label", "Social media links");
  });
});
