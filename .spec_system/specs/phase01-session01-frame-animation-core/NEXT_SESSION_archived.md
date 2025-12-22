# NEXT_SESSION.md

## Session Recommendation

**Generated**: 2025-12-22
**Project State**: Phase 01 - Core Animation
**Completed Sessions**: 7 (Phase 00 complete)

---

## Recommended Next Session

**Session ID**: `phase01-session01-frame-animation-core`
**Session Name**: Frame Animation Core
**Estimated Duration**: 3-4 hours
**Estimated Tasks**: 20-25

---

## Why This Session Next?

### Prerequisites Met
- [x] Phase 00 complete (all 7 sessions)
- [x] MinIO serving WebP frames at expected URLs (session 03)
- [x] `useScrollProgress` hook available (session 06)
- [x] `useFramePreload` hook scaffold exists (session 06)
- [x] Framer Motion configured in project (session 05)
- [x] Zustand state management installed (session 05)

### Dependencies
- **Builds on**: Phase 00 foundation (scroll utilities, frame preloader, animation libraries)
- **Enables**: Session 02 (Hero Section), Session 04 (Product Section), and all subsequent Phase 01 sessions

### Project Progression
This session is the critical foundation for Phase 01. The scroll-synchronized frame animation engine is the core technical differentiator of this portfolio - it maps scroll position to video frame index, creating the signature cinematic experience. Every other Phase 01 session (Hero, Product, WebGL, Parallax) depends on this animation system being complete. Starting here ensures a solid technical foundation before building visual components on top.

---

## Session Overview

### Objective
Build the scroll-synchronized frame animation engine that maps scroll position to frame index, handles frame preloading, and provides smooth opacity-based frame switching for the hero and product sections.

### Key Deliverables
1. `lib/frame-animation.ts` - Core utilities for scroll-to-frame mapping
2. `hooks/useFrameSequence.ts` - Hook managing frame state and scroll synchronization
3. `components/animation/FrameSequence.tsx` - React component for frame rendering
4. `stores/animation-store.ts` - Zustand store for animation state
5. Unit tests for frame animation utilities (>80% coverage)
6. Integration test with scroll simulation

### Scope Summary
- **In Scope (MVP)**:
  - `scrollPercentToFrame()` utility mapping 0-100% scroll to frame indices
  - Frame preloader hook with first-10-frames priority loading
  - Opacity-based frame switching (stack frames, toggle visibility)
  - Integration with existing `useScrollProgress` hook
  - Frame URL generator for MinIO-hosted desktop/mobile assets
  - Animation state management via Zustand

- **Out of Scope**:
  - Hero/Product section layouts (Sessions 02, 04)
  - WebGL effects (Session 03)
  - Parallax layers (Session 05)
  - Canvas-based rendering (evaluate later if needed)

---

## Technical Considerations

### Technologies/Patterns
- TypeScript strict mode with explicit types for all frame utilities
- Framer Motion `useScroll`, `useTransform` for scroll synchronization
- Zustand for global animation state (current frame, loading progress)
- React refs for DOM-based frame opacity switching
- Image preloading via `Image()` constructor with promise wrappers

### Potential Challenges
- **Frame switching performance**: 192 stacked images could cause memory pressure - may need virtualization
- **Opacity vs visibility**: `opacity: 0` keeps images in layout; `visibility: hidden` removes from rendering - benchmark both
- **Scroll direction detection**: Need to handle rapid scroll direction changes smoothly
- **Preload orchestration**: Balancing initial load speed vs background loading without blocking UI
- **Mobile memory limits**: 192 full-res images may exceed mobile memory - need responsive frame counts

---

## Alternative Sessions

If this session is blocked:
1. **Session 05 (Parallax Layer System)** - Could build parallax container infrastructure first, though it would be incomplete without frame content to layer over
2. **None recommended** - Session 01 is the true blocker; all Phase 01 sessions depend on it

---

## Next Steps

Run `/sessionspec` to generate the formal specification with detailed task breakdown.
