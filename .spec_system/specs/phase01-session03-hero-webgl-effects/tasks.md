# Task Checklist

**Session ID**: `phase01-session03-hero-webgl-effects`
**Total Tasks**: 22
**Estimated Duration**: 7-9 hours
**Created**: 2025-12-22

---

## Legend

- `[x]` = Completed
- `[ ]` = Pending
- `[P]` = Parallelizable (can run with other [P] tasks)
- `[S0103]` = Session reference (Phase 01, Session 03)
- `TNNN` = Task ID

---

## Progress Summary

| Category | Total | Done | Remaining |
|----------|-------|------|-----------|
| Setup | 2 | 2 | 0 |
| Foundation | 7 | 7 | 0 |
| Implementation | 9 | 9 | 0 |
| Testing | 4 | 4 | 0 |
| **Total** | **22** | **22** | **0** |

---

## Setup (2 tasks)

Initial configuration and environment preparation.

- [x] T001 [S0103] Verify prerequisites met - R3F/drei configured, HeroSection structure with z-index layers exists
- [x] T002 [S0103] Create directory structure for effects and fallbacks (`components/three/effects/`, `components/three/fallbacks/`)

---

## Foundation (7 tasks)

Core structures, types, and base implementations.

- [x] T003 [S0103] Create WebGL capability types (`types/webgl.ts`) - GPUTier, WebGLCapabilities, QualitySettings interfaces
- [x] T004 [S0103] Create WebGL effect props types (`types/webgl.ts`) - ParticleFieldProps, GlowAuraProps, HeroWebGLEffectProps
- [x] T005 [S0103] Export webgl types from barrel file (`types/index.ts`)
- [x] T006 [S0103] Implement useWebGLCapabilities hook - GPU detection logic (`hooks/useWebGLCapabilities.ts`)
- [x] T007 [S0103] Add quality tier calculation to useWebGLCapabilities - adaptive particle count, effect complexity (`hooks/useWebGLCapabilities.ts`)
- [x] T008 [S0103] Add mobile detection and reduced motion integration to useWebGLCapabilities (`hooks/useWebGLCapabilities.ts`)
- [x] T009 [S0103] Export useWebGLCapabilities from hooks barrel file (`hooks/index.ts`)

---

## Implementation (9 tasks)

Main feature implementation - WebGL effects and integration.

- [x] T010 [S0103] Create WebGLFallback component - CSS gradient/blur fallback (`components/three/fallbacks/WebGLFallback.tsx`)
- [x] T011 [S0103] Create effects barrel file (`components/three/effects/index.ts`)
- [x] T012 [S0103] [P] Implement ParticleField effect - drei Points with PointMaterial (`components/three/effects/ParticleField.tsx`)
- [x] T013 [S0103] [P] Implement GlowAura effect - shader-based radial gradient (`components/three/effects/GlowAura.tsx`)
- [x] T014 [S0103] Add scroll synchronization to ParticleField - intensity/position responds to scroll progress (`components/three/effects/ParticleField.tsx`)
- [x] T015 [S0103] Add scroll synchronization to GlowAura - pulse/color responds to scroll progress (`components/three/effects/GlowAura.tsx`)
- [x] T016 [S0103] Implement HeroWebGLEffect component - capability check, effect selection, CanvasWrapper integration (`components/three/HeroWebGLEffect.tsx`)
- [x] T017 [S0103] Export WebGL components from three barrel file (`components/three/index.ts`)
- [x] T018 [S0103] Integrate HeroWebGLEffect into HeroSection at z-5 layer (`components/sections/HeroSection.tsx`)

---

## Testing (4 tasks)

Verification and quality assurance.

- [x] T019 [S0103] [P] Write unit tests for useWebGLCapabilities hook (`__tests__/hooks/useWebGLCapabilities.test.ts`)
- [x] T020 [S0103] [P] Write unit tests for HeroWebGLEffect render conditions (`__tests__/components/HeroWebGLEffect.test.tsx`)
- [x] T021 [S0103] Run TypeScript compilation and ESLint - fix any errors or warnings
- [x] T022 [S0103] Manual testing - scroll behavior, fallback display, mobile viewport, reduced motion

---

## Completion Checklist

Before marking session complete:

- [x] All tasks marked `[x]`
- [x] All tests passing
- [x] All files ASCII-encoded
- [x] implementation-notes.md updated
- [x] Ready for `/validate`

---

## Notes

### Parallelization
Tasks marked `[P]` can be worked on simultaneously:
- T012 and T013: ParticleField and GlowAura effects are independent
- T014 and T015: Scroll sync for each effect can be done in parallel
- T019 and T020: Unit tests are independent

### Task Timing
Target ~20-25 minutes per task.

### Dependencies
- T003-T005 (types) must complete before T006-T009 (hooks)
- T006-T009 (hooks) must complete before T016 (HeroWebGLEffect)
- T010-T011 (fallback/barrel) can run parallel with T012-T015 (effects)
- T016 (HeroWebGLEffect) must complete before T018 (integration)
- T017 (exports) must complete before T18 (integration)

### Effect Selection
The spec recommends **Particle Field** (Option A) as the primary effect. GlowAura is implemented as an alternative. During T016, choose which effect to render by default based on visual testing.

### Key Technical Considerations
1. **Z-Index**: WebGL layer at z-5 within sticky container, `pointer-events: none`
2. **SSR**: Use dynamic import with `ssr: false` (existing CanvasWrapper pattern)
3. **Cleanup**: Dispose Three.js resources on unmount to prevent memory leaks
4. **Performance**: Start with 500 particles, adaptively reduce to 100 based on FPS

---

## Next Steps

Run manual testing (T022) then `/validate` to verify session completeness.
