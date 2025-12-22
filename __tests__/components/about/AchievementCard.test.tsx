/**
 * Tests for AchievementCard component.
 */

import { render, screen } from "@testing-library/react";
import { vi, beforeEach } from "vitest";
import { AchievementCard } from "@/components/about/AchievementCard";
import type { AchievementConfig } from "@/types/about";

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

const mockAchievement: AchievementConfig = {
  id: "test",
  icon: "calendar",
  value: 10,
  suffix: "+",
  label: "Years Experience",
};

describe("AchievementCard", () => {
  beforeEach(() => {
    mockReducedMotion = false;
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders without crashing", () => {
    render(<AchievementCard achievement={mockAchievement} />);
    expect(screen.getByText("Years Experience")).toBeInTheDocument();
  });

  it("renders icon", () => {
    const { container } = render(
      <AchievementCard achievement={mockAchievement} />
    );
    // Check for SVG icon
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("renders label", () => {
    render(<AchievementCard achievement={mockAchievement} />);
    expect(screen.getByText("Years Experience")).toBeInTheDocument();
  });

  it("renders suffix with value", () => {
    render(<AchievementCard achievement={mockAchievement} isRevealed={false} />);
    // When not revealed, counter starts at 0
    expect(screen.getByText("0+")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <AchievementCard achievement={mockAchievement} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("handles achievement without suffix", () => {
    const achievementNoSuffix: AchievementConfig = {
      id: "test",
      icon: "folder",
      value: 50,
      label: "Projects",
    };
    render(<AchievementCard achievement={achievementNoSuffix} isRevealed={false} />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("shows final value immediately when reduced motion preferred", () => {
    mockReducedMotion = true;
    render(<AchievementCard achievement={mockAchievement} isRevealed={true} />);
    // With reduced motion, should show final value immediately
    expect(screen.getByText("10+")).toBeInTheDocument();
  });

  it("has proper card styling", () => {
    const { container } = render(
      <AchievementCard achievement={mockAchievement} />
    );
    expect(container.firstChild).toHaveClass("rounded-xl");
  });

  it("renders with different icon types", () => {
    const icons: Array<AchievementConfig["icon"]> = [
      "calendar",
      "folder",
      "code",
      "users",
    ];

    icons.forEach((icon) => {
      const { container, unmount } = render(
        <AchievementCard
          achievement={{ ...mockAchievement, icon }}
          key={icon}
        />
      );
      expect(container.querySelector("svg")).toBeInTheDocument();
      unmount();
    });
  });

  it("has tabular-nums class for counter stability", () => {
    const { container } = render(
      <AchievementCard achievement={mockAchievement} />
    );
    const valueElement = container.querySelector(".tabular-nums");
    expect(valueElement).toBeInTheDocument();
  });

  it("has uppercase label styling", () => {
    render(<AchievementCard achievement={mockAchievement} />);
    const label = screen.getByText("Years Experience");
    expect(label).toHaveClass("uppercase");
  });
});
