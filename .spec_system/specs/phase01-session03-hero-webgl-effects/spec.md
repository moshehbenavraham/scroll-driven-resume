# Session Specification

**Session ID**: `phase01-session03-hero-webgl-effects`
**Phase**: 01 - Core Animation
**Status**: Not Started
**Created**: 2025-12-22

---

## 1. Session Overview

This session adds WebGL accent effects to the hero section, creating the final "wow" layer that elevates the portfolio from impressive to premium. The WebGL effects will be implemented as a subtle, ambient layer that complements the scroll-synchronized frame animation without overwhelming it.

The hero section already has a solid z-index layered architecture (frame sequence at z-0, gradient overlay at z-10, content at z-20). This session introduces a new WebGL layer at z-5 that sits between the frame sequence and the gradient, creating an ethereal effect that enhances the cinematic portrait animation. The effects respond to scroll position, creating a synchronized visual narrative.

A critical aspect of this session is establishing robust performance monitoring and graceful degradation patterns. The WebGL capabilities detection system will be reusable across the project, automatically disabling effects on mobile devices, low-end hardware, and when users prefer reduced motion. This foundation enables future sessions to add WebGL effects to the product section with minimal additional work.

---

## 2. Objectives

1. **Implement HeroWebGLEffect component** - Create a WebGL effect layer that integrates seamlessly with the existing hero section z-index architecture
2. **Build particle/shader effect system** - Develop at least one visually compelling effect (particle field or glow aura) that responds to scroll position
3. **Create GPU capabilities detection** - Build `useWebGLCapabilities` hook for automatic quality adjustment and graceful degradation
4. **Ensure performance targets** - Maintain 60fps with WebGL active, with automatic fallback when performance degrades

---

## 3. Prerequisites

### Required Sessions
- [x] `phase00-session05-animation-libraries` - R3F, drei, and three.js configured
- [x] `phase00-session06-scroll-parallax-utilities` - Scroll progress hooks available
- [x] `phase01-session01-frame-animation-core` - Frame animation system working
- [x] `phase01-session02-hero-section` - Hero section structure with z-index layers

### Required Tools/Knowledge
- React Three Fiber declarative 3D patterns
- Three.js particle systems or shader materials
- WebGL context management and cleanup
- GPU capability detection APIs

### Environment Requirements
- Modern browser with WebGL 2.0 support (development)
- Node.js 20+ with Next.js 16.1.0
- Docker stack running (MinIO serving hero frames)

---

## 4. Scope

### In Scope (MVP)
- `HeroWebGLEffect` component rendering in hero section at z-5
- At least one effect type (particle field OR glow aura - choose during implementation)
- Scroll-synchronized effect intensity/behavior
- `useWebGLCapabilities` hook for GPU detection
- Automatic quality reduction on lower-end devices
- CSS fallback (subtle gradient/blur) when WebGL unavailable
- Respect `prefers-reduced-motion` (disable WebGL)
- Mobile detection and bypass (< 768px viewport)
- Integration with existing `CanvasWrapper` component
- Memory leak prevention (proper cleanup on unmount)

### Out of Scope (Deferred)
- Product section WebGL effects - *Reason: Session 04 scope*
- Multiple simultaneous effect types - *Reason: Keep MVP focused*
- Post-processing effects (bloom, depth of field) - *Reason: Performance risk*
- User interaction with WebGL (click, drag) - *Reason: Not required for MVP*
- Complex 3D scenes or models - *Reason: Accent effects only per PRD*
- WebGL effect customization UI - *Reason: Not in requirements*

---

## 5. Technical Approach

### Architecture

The WebGL effect will be implemented as a new layer in the hero section's existing z-index stack:

```
HeroSection (300vh)
  |-- Sticky Container (100vh)
       |-- Layer z-0:  FrameSequence (existing)
       |-- Layer z-5:  HeroWebGLEffect (NEW)
       |-- Layer z-10: Gradient Overlay (existing)
       |-- Layer z-20: Content (existing)
```

The `HeroWebGLEffect` component will:
1. Use `useWebGLCapabilities` to check if WebGL should be enabled
2. If enabled, render a `CanvasWrapper` with the effect scene
3. Subscribe to scroll progress via `useScrollProgress` or Framer Motion's `useScroll`
4. Pass scroll progress to the effect for synchronized animation
5. On unmount, ensure all Three.js resources are disposed

### Design Patterns

- **Capability Detection Pattern**: Check WebGL support, GPU tier, and user preferences before rendering
- **Adaptive Quality Pattern**: Automatically reduce particle count or effect complexity based on frame rate
- **Graceful Degradation Pattern**: Fall back to CSS effects when WebGL unavailable
- **Resource Cleanup Pattern**: Use useEffect cleanup to dispose Three.js geometries, materials, textures

### Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React Three Fiber | ^9.4.2 | Declarative WebGL/Three.js |
| @react-three/drei | ^10.7.7 | Helper components (Points, shaders) |
| Three.js | ^0.170.0 | 3D graphics engine |
| Framer Motion | ^12.23.26 | Scroll progress integration |

---

## 6. Deliverables

### Files to Create

| File | Purpose | Est. Lines |
|------|---------|------------|
| `components/three/HeroWebGLEffect.tsx` | Main WebGL effect component for hero section | ~80-100 |
| `components/three/effects/ParticleField.tsx` | Floating particle system effect | ~120-150 |
| `components/three/effects/GlowAura.tsx` | Shader-based glow effect (alternative to particles) | ~100-120 |
| `components/three/effects/index.ts` | Effect exports barrel file | ~10 |
| `hooks/useWebGLCapabilities.ts` | GPU detection and quality settings hook | ~100-120 |
| `components/three/fallbacks/WebGLFallback.tsx` | CSS fallback when WebGL unavailable | ~40-50 |
| `types/webgl.ts` | TypeScript types for WebGL capabilities and effects | ~50-60 |

### Files to Modify

| File | Changes | Est. Lines |
|------|---------|------------|
| `components/sections/HeroSection.tsx` | Add z-5 WebGL effect layer | ~15-20 |
| `components/three/index.ts` | Export new WebGL components | ~5 |
| `hooks/index.ts` | Export useWebGLCapabilities | ~2 |
| `types/index.ts` | Export webgl types | ~2 |

---

## 7. Success Criteria

### Functional Requirements
- [ ] WebGL effect visible in hero section on capable browsers
- [ ] Effect responds to scroll position (intensity, position, or behavior changes)
- [ ] Effect renders at z-5 (between frame sequence and gradient)
- [ ] Effect auto-disables on mobile (< 768px viewport)
- [ ] Effect auto-disables when prefers-reduced-motion is set
- [ ] CSS fallback displays when WebGL is unavailable
- [ ] Effect does not block interaction with hero content

### Performance Requirements
- [ ] 60fps maintained with WebGL effect active
- [ ] No frame drops during scroll on modern devices
- [ ] Effect auto-degrades quality when FPS drops below 30
- [ ] Effect complements frame animation without visual competition

### Testing Requirements
- [ ] Unit tests for `useWebGLCapabilities` hook
- [ ] Unit tests for capability detection logic
- [ ] Manual testing on Chrome, Firefox, Safari, Edge
- [ ] Manual testing with reduced motion preference enabled
- [ ] Manual testing on mobile viewport sizes

### Quality Gates
- [ ] All files ASCII-encoded (0-127)
- [ ] Unix LF line endings
- [ ] Zero TypeScript errors (strict mode)
- [ ] Zero ESLint warnings
- [ ] Code follows project conventions
- [ ] No memory leaks from WebGL context (verified via DevTools)

---

## 8. Implementation Notes

### Key Considerations

1. **Z-Index Integration**: The hero section uses z-0, z-10, z-20. The WebGL effect layer at z-5 must be absolutely positioned within the sticky container, not creating a new stacking context that breaks the layering.

2. **Canvas Positioning**: The R3F Canvas needs `pointer-events: none` to allow clicks to pass through to underlying frame sequence and content.

3. **Scroll Synchronization**: Use the same scroll progress source as the frame animation to ensure visual synchronization. The hero section scroll runway is 300vh mapping to 192 frames.

4. **Effect Design**: Choose ONE effect type and do it well. Particle field creates ethereal floating elements; glow aura creates a subtle energy effect around the portrait area. Both can be scroll-synchronized.

5. **Performance Budget**: Target < 1ms per frame for WebGL rendering. Monitor with `useFrame` callback timing or Performance API.

### Potential Challenges

| Challenge | Mitigation |
|-----------|------------|
| Canvas overlapping breaks z-index | Use `pointer-events: none`, position within sticky container |
| WebGL context limits (max 8-16 contexts) | Single shared canvas, dispose on unmount |
| Particle count causing frame drops | Start with 500 particles, adaptively reduce to 100 |
| Mobile Safari WebGL quirks | Test early, implement CSS fallback |
| Hydration mismatch with SSR | Use dynamic import with `ssr: false` (already in CanvasWrapper) |

### ASCII Reminder

All output files must use ASCII-only characters (0-127). No Unicode symbols, emojis, or special characters in code or comments.

---

## 9. Testing Strategy

### Unit Tests

| Test File | Tests |
|-----------|-------|
| `__tests__/hooks/useWebGLCapabilities.test.ts` | GPU detection, quality tiers, reduced motion, mobile detection |
| `__tests__/components/HeroWebGLEffect.test.tsx` | Render conditions, fallback display, prop passing |

### Integration Tests

- WebGL effect renders correctly within HeroSection
- Scroll progress properly propagates to effect
- Capability detection correctly enables/disables effect

### Manual Testing

| Scenario | Expected Result |
|----------|-----------------|
| Desktop Chrome, scroll hero section | Effect visible, responds to scroll, 60fps |
| Desktop Firefox, scroll hero section | Effect visible, responds to scroll, 60fps |
| Desktop Safari, scroll hero section | Effect visible, responds to scroll, 60fps |
| Mobile viewport (< 768px) | No WebGL, CSS fallback shown |
| Enable "prefers-reduced-motion" | No WebGL, CSS fallback or no effect |
| Disable WebGL in browser | CSS fallback shown, no errors |
| Rapid scroll up/down | No frame drops, no visual glitches |
| Navigate away and back | No memory leaks, effect re-initializes |

### Edge Cases

- WebGL context lost/restored (GPU reset)
- Very low-end device with weak GPU
- High DPI displays (4K, Retina)
- Browser with WebGL disabled via flags
- Tab backgrounded (should pause animation)

---

## 10. Dependencies

### External Libraries

| Library | Version | Purpose |
|---------|---------|---------|
| @react-three/fiber | ^9.4.2 | React renderer for Three.js |
| @react-three/drei | ^10.7.7 | Effect helpers (Points, shaders, PointMaterial) |
| three | ^0.170.0 | 3D graphics engine |
| framer-motion | ^12.23.26 | useScroll for scroll synchronization |

### Internal Dependencies

- `components/three/canvas-wrapper.tsx` - Existing Canvas wrapper component
- `hooks/useReducedMotion.ts` - Motion preference detection
- `hooks/useScrollProgress.ts` - Section-scoped scroll progress
- `lib/cn.ts` - Class name utility

### Other Sessions

- **Depends on**: phase01-session02-hero-section (HeroSection structure)
- **Depended by**: phase01-session04-product-section (may reuse WebGL patterns)

---

## 11. Effect Design Options

Choose ONE during implementation based on visual testing:

### Option A: Particle Field

Floating particles that drift around the portrait area:
- 200-500 particles (adaptive)
- Slow random movement + subtle scroll response
- Fade in/out at edges
- Colors: soft white/purple/blue tones
- Implementation: drei's `<Points>` with `<PointMaterial>`

### Option B: Glow Aura

Shader-based energy effect around portrait center:
- Radial gradient that pulses with scroll
- Subtle color shifts (purple -> blue -> teal)
- Soft edges that blend with gradient overlay
- Implementation: Custom shader material or drei effects

### Option C: Geometric Shapes (Simplest)

Floating polygonal shapes:
- 5-10 low-poly shapes (triangles, hexagons)
- Slow rotation + drift
- Semi-transparent with soft edges
- Implementation: drei primitives with custom animation

**Recommendation**: Start with Option A (Particle Field) as it provides the most "wow" with straightforward implementation using drei's Points component.

---

## Next Steps

Run `/tasks` to generate the implementation task checklist.
