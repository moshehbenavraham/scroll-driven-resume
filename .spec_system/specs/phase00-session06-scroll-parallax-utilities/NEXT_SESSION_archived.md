# NEXT_SESSION.md

## Session Recommendation

**Generated**: 2025-12-21
**Project State**: Phase 00 - Foundation
**Completed Sessions**: 5 of 7

---

## Recommended Next Session

**Session ID**: `phase00-session06-scroll-parallax-utilities`
**Session Name**: Scroll & Parallax Utilities
**Estimated Duration**: 2-3 hours
**Estimated Tasks**: 20-25

---

## Why This Session Next?

### Prerequisites Met
- [x] Session 05 completed (Framer Motion 12 available)
- [x] Understanding of Framer Motion useScroll, useTransform APIs
- [x] Asset URLs configured in MinIO for preload testing

### Dependencies
- **Builds on**: Session 05 (animation-libraries) - Framer Motion hooks and patterns
- **Enables**: Session 07 (loading-system) - requires useFramePreload hook from this session

### Project Progression

Session 06 is the **mandatory** next step because:

1. **Dependency Chain**: Session 07 explicitly lists "Session 06 completed (preload hook available)" as a prerequisite. The loading system cannot track frame preload progress without the `useFramePreload` hook created in this session.

2. **Foundation Completion**: This session creates the core animation infrastructure that Phase 01's frame rendering components will consume. Without these hooks, no frame animation can occur.

3. **Natural Build Order**: The Foundation phase follows a logical progression:
   - Assets optimized (Session 01) → Infrastructure ready (Session 02-03) → Next.js bootstrapped (Session 04) → Animation libraries configured (Session 05) → **Scroll utilities created (Session 06)** → Loading system implemented (Session 07)

---

## Session Overview

### Objective

Create the core scroll and parallax utility hooks that power the frame animation and layered depth effects throughout the portfolio.

### Key Deliverables

1. **`hooks/useFrameAnimation.ts`** - Maps scroll position to frame index (scrollPercent × totalFrames)
2. **`hooks/useParallax.ts`** - Creates parallax transform values at configurable speeds (0.3x-1.3x)
3. **`hooks/useScrollProgress.ts`** - Returns section-scoped scroll percentage (0-1)
4. **`hooks/useFramePreload.ts`** - Preload strategy hook (first 10 frames immediately, stream remainder)
5. **`lib/scroll-utils.ts`** - Scroll calculation utilities with TypeScript types
6. **`types/animation.ts`** - Complete TypeScript types for animation system
7. **Unit tests** - >90% coverage on utility functions
8. **Demo page** - Shows hooks in action with visual feedback

### Scope Summary

- **In Scope (MVP)**: Core hooks using Framer Motion useScroll/useTransform, independent animation zones (hero vs product), performance optimizations (RAF, will-change), TypeScript strict types, unit tests
- **Out of Scope**: Actual frame rendering components (Phase 01), WebGL effects (Phase 01), Loading screen (Session 07)

---

## Technical Considerations

### Technologies/Patterns
- Framer Motion 12 `useScroll` and `useTransform` hooks
- React 19 hooks patterns with TypeScript strict mode
- RequestAnimationFrame for performance-critical scroll handling
- CSS `will-change` hints for GPU acceleration
- Vitest for unit testing utilities

### Potential Challenges

1. **Smooth Scroll Performance**: Mapping scroll events to frame indices at 60fps without jank requires careful use of `useTransform` and avoiding unnecessary re-renders
2. **Section Scoping**: `useScrollProgress` must accurately detect when user enters/exits section boundaries using Intersection Observer or scroll offset calculations
3. **Preload Strategy**: Balancing immediate frame availability with network performance - need to preload critical frames first while streaming the rest

---

## Alternative Sessions

If this session is blocked:

1. **None Available** - Session 07 (loading-system) depends on Session 06 and cannot be started first
2. **Phase 01 Sessions** - Cannot begin until Phase 00 Foundation is complete

*Note: Session 06 is the only unblocked session remaining in Phase 00.*

---

## Next Steps

Run `/sessionspec` to generate the formal specification with detailed task breakdown.
