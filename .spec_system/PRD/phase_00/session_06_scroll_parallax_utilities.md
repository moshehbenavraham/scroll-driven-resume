# Session 06: Scroll & Parallax Utilities

**Session ID**: `phase00-session06-scroll-parallax-utilities`
**Status**: Not Started
**Estimated Tasks**: ~20-25
**Estimated Duration**: 2-3 hours

---

## Objective

Create the core scroll and parallax utility hooks that power the frame animation and layered depth effects throughout the portfolio.

---

## Scope

### In Scope (MVP)
- Create `useFrameAnimation` hook (scroll position → frame index)
- Create `useParallax` hook (scroll position → transform offset)
- Create `useScrollProgress` hook (section-scoped scroll percentage)
- Implement scroll position utilities with Framer Motion useScroll
- Support for independent animation zones (hero vs product)
- Preload strategy hook for frame sequences
- Performance optimizations (RAF, will-change hints)
- TypeScript types for all hooks and utilities
- Unit tests for utility functions

### Out of Scope
- Actual frame rendering components (Phase 01)
- WebGL effects (Phase 01)
- Loading screen (Session 07)

---

## Prerequisites

- [ ] Session 05 completed (Framer Motion available)
- [ ] Understanding of Framer Motion useScroll, useTransform APIs
- [ ] Asset URLs known for preload testing

---

## Deliverables

1. `hooks/useFrameAnimation.ts` - Maps scroll to frame index
2. `hooks/useParallax.ts` - Creates parallax transform values
3. `hooks/useScrollProgress.ts` - Section-scoped scroll progress
4. `hooks/useFramePreload.ts` - Preload strategy for frame sequences
5. `lib/scroll-utils.ts` - Scroll calculation utilities
6. `types/animation.ts` - TypeScript types for animation system
7. Unit tests for all utility functions
8. Demo page showing hooks in action

---

## Success Criteria

- [ ] useFrameAnimation correctly maps scroll % to frame index
- [ ] useParallax creates smooth parallax transforms at 0.3x-1.3x speeds
- [ ] useScrollProgress returns 0-1 within section boundaries
- [ ] Preload hook loads first 10 frames immediately, streams rest
- [ ] All hooks work with Framer Motion useScroll
- [ ] Performance: No jank at 60fps during scroll
- [ ] TypeScript types are complete and strict
- [ ] Unit tests pass with >90% coverage on utilities
