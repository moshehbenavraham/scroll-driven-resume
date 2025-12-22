# Session 01: Frame Animation Core

**Session ID**: `phase01-session01-frame-animation-core`
**Status**: Not Started
**Estimated Tasks**: ~20-25
**Estimated Duration**: 3-4 hours

---

## Objective

Build the scroll-synchronized frame animation engine that maps scroll position to frame index, handles frame preloading, and provides smooth opacity-based frame switching for the hero and product sections.

---

## Scope

### In Scope (MVP)

- TypeScript utility function: `scrollPercentToFrame(scrollPercent: number, totalFrames: number): number`
- Frame preloader hook: `useFramePreload(frameUrls: string[], options: PreloadOptions)`
- Frame animation component: `<FrameSequence>` with scroll-driven frame switching
- Opacity-based frame transitions (stack all frames, change opacity)
- Initial preload strategy: load first 10 frames immediately, background-load remainder
- Integration with existing `useScrollProgress` hook from Phase 00
- Frame URL generator for MinIO-hosted assets: `getFrameUrl(sequence: 'hero' | 'product', index: number, quality: 'desktop' | 'mobile')`
- Animation state management with Zustand (current frame, loading progress, preload status)

### Out of Scope

- Hero section layout and content (Session 02)
- Product section layout and content (Session 04)
- WebGL effects (Session 03)
- Parallax layers (Session 05)
- Canvas-based rendering (evaluate later if opacity approach has issues)

---

## Prerequisites

- [ ] Phase 00 sessions complete
- [ ] MinIO serving WebP frames at expected URLs
- [ ] `useScrollProgress` hook available from Phase 00
- [ ] Framer Motion configured in project

---

## Deliverables

1. `lib/frame-animation.ts` - Core utilities for scroll-to-frame mapping
2. `hooks/useFrameSequence.ts` - Hook managing frame state and scroll synchronization
3. `components/animation/FrameSequence.tsx` - React component for frame rendering
4. `stores/animation-store.ts` - Zustand store for animation state
5. Unit tests for frame animation utilities
6. Integration test with scroll simulation

---

## Success Criteria

- [ ] `scrollPercentToFrame` correctly maps 0-100% scroll to frame indices
- [ ] Frame preloader loads first 10 frames in under 2 seconds on 4G
- [ ] Frame switching achieves 60fps during scroll
- [ ] Opacity transitions are smooth (no flash/flicker)
- [ ] Scroll up correctly reverses frame sequence
- [ ] Background frame loading does not block UI
- [ ] Animation state accessible via Zustand store
- [ ] All utility functions have TypeScript types
- [ ] Vitest tests passing with >80% coverage
