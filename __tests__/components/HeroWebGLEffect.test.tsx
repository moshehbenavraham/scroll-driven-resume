/**
 * Unit tests for HeroWebGLEffect component.
 * Tests render conditions, fallback display, and prop passing.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { HeroWebGLEffect } from "@/components/three/HeroWebGLEffect";

// Mock the hooks and components
vi.mock("@/hooks/useWebGLCapabilities", () => ({
  useWebGLCapabilities: vi.fn(),
}));

vi.mock("framer-motion", () => ({
  useScroll: vi.fn(() => ({
    scrollYProgress: { get: () => 0, set: () => {} },
  })),
}));

// Mock CanvasWrapper to avoid WebGL context issues in tests
vi.mock("@/components/three/canvas-wrapper", () => ({
  CanvasWrapper: vi.fn(({ children, fallback }) => (
    <div data-testid="canvas-wrapper">{children || fallback}</div>
  )),
}));

// Mock the effects
vi.mock("@/components/three/effects/ParticleField", () => ({
  ParticleField: vi.fn(() => <div data-testid="particle-field" />),
}));

vi.mock("@/components/three/effects/GlowAura", () => ({
  GlowAura: vi.fn(() => <div data-testid="glow-aura" />),
}));

// Mock the fallback
vi.mock("@/components/three/fallbacks/WebGLFallback", () => ({
  WebGLFallback: vi.fn(({ reason }) => (
    <div data-testid="webgl-fallback" data-reason={reason} />
  )),
}));

import { useWebGLCapabilities } from "@/hooks/useWebGLCapabilities";

const mockUseWebGLCapabilities = useWebGLCapabilities as ReturnType<
  typeof vi.fn
>;

describe("HeroWebGLEffect", () => {
  beforeEach(() => {
    // Default: WebGL enabled
    mockUseWebGLCapabilities.mockReturnValue({
      isEnabled: true,
      tier: "high",
      quality: {
        particleCount: 500,
        enableShaders: true,
        opacityMultiplier: 1.0,
        enableGlow: true,
        targetFPS: 60,
      },
      support: {
        webgl1: true,
        webgl2: true,
        maxTextureSize: 16384,
        maxVertexUniforms: 1024,
        vendor: "Test",
        renderer: "Test Renderer",
      },
      disableReason: undefined,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders canvas wrapper when WebGL is enabled", () => {
    render(<HeroWebGLEffect />);

    expect(screen.getByTestId("canvas-wrapper")).toBeInTheDocument();
  });

  it("renders fallback when WebGL is disabled", () => {
    mockUseWebGLCapabilities.mockReturnValue({
      isEnabled: false,
      tier: "unsupported",
      quality: {
        particleCount: 0,
        enableShaders: false,
        opacityMultiplier: 0,
        enableGlow: false,
        targetFPS: 0,
      },
      support: {
        webgl1: false,
        webgl2: false,
        maxTextureSize: 0,
        maxVertexUniforms: 0,
        vendor: "",
        renderer: "",
      },
      disableReason: "no-webgl",
    });

    render(<HeroWebGLEffect />);

    expect(screen.getByTestId("webgl-fallback")).toBeInTheDocument();
    expect(screen.getByTestId("webgl-fallback")).toHaveAttribute(
      "data-reason",
      "no-webgl"
    );
  });

  it("renders fallback on mobile viewport", () => {
    mockUseWebGLCapabilities.mockReturnValue({
      isEnabled: false,
      tier: "high",
      quality: {
        particleCount: 500,
        enableShaders: true,
        opacityMultiplier: 1.0,
        enableGlow: true,
        targetFPS: 60,
      },
      support: {
        webgl1: true,
        webgl2: true,
        maxTextureSize: 16384,
        maxVertexUniforms: 1024,
        vendor: "Test",
        renderer: "Test Renderer",
      },
      disableReason: "mobile-viewport",
    });

    render(<HeroWebGLEffect />);

    expect(screen.getByTestId("webgl-fallback")).toBeInTheDocument();
    expect(screen.getByTestId("webgl-fallback")).toHaveAttribute(
      "data-reason",
      "mobile-viewport"
    );
  });

  it("renders fallback when reduced motion is preferred", () => {
    mockUseWebGLCapabilities.mockReturnValue({
      isEnabled: false,
      tier: "high",
      quality: {
        particleCount: 500,
        enableShaders: true,
        opacityMultiplier: 1.0,
        enableGlow: true,
        targetFPS: 60,
      },
      support: {
        webgl1: true,
        webgl2: true,
        maxTextureSize: 16384,
        maxVertexUniforms: 1024,
        vendor: "Test",
        renderer: "Test Renderer",
      },
      disableReason: "reduced-motion",
    });

    render(<HeroWebGLEffect />);

    expect(screen.getByTestId("webgl-fallback")).toBeInTheDocument();
    expect(screen.getByTestId("webgl-fallback")).toHaveAttribute(
      "data-reason",
      "reduced-motion"
    );
  });

  it("renders fallback when disabled prop is true", () => {
    render(<HeroWebGLEffect disabled />);

    expect(screen.getByTestId("webgl-fallback")).toBeInTheDocument();
  });

  it("renders fallback when effectType is none", () => {
    render(<HeroWebGLEffect effectType="none" />);

    expect(screen.getByTestId("webgl-fallback")).toBeInTheDocument();
  });

  it("sets data-webgl attribute to fallback when disabled", () => {
    mockUseWebGLCapabilities.mockReturnValue({
      isEnabled: false,
      tier: "unsupported",
      quality: {
        particleCount: 0,
        enableShaders: false,
        opacityMultiplier: 0,
        enableGlow: false,
        targetFPS: 0,
      },
      support: {
        webgl1: false,
        webgl2: false,
        maxTextureSize: 0,
        maxVertexUniforms: 0,
        vendor: "",
        renderer: "",
      },
      disableReason: "no-webgl",
    });

    const { container } = render(<HeroWebGLEffect />);

    expect(container.firstChild).toHaveAttribute("data-webgl", "fallback");
  });

  it("sets data-webgl attribute to active when enabled", () => {
    const { container } = render(<HeroWebGLEffect />);

    expect(container.firstChild).toHaveAttribute("data-webgl", "active");
  });

  it("sets data-tier attribute when enabled", () => {
    const { container } = render(<HeroWebGLEffect />);

    expect(container.firstChild).toHaveAttribute("data-tier", "high");
  });

  it("has pointer-events-none class when enabled", () => {
    const { container } = render(<HeroWebGLEffect />);

    expect(container.firstChild).toHaveClass("pointer-events-none");
  });

  it("applies custom className", () => {
    const { container } = render(<HeroWebGLEffect className="custom-class" />);

    expect(container.firstChild).toHaveClass("custom-class");
  });
});
