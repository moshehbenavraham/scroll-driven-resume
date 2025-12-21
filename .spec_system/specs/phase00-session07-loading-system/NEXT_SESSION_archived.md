# NEXT_SESSION.md

## Session Recommendation

**Generated**: 2025-12-22
**Project State**: Phase 00 - Foundation
**Completed Sessions**: 6 of 7

---

## Recommended Next Session

**Session ID**: `phase00-session07-loading-system`
**Session Name**: Loading System
**Estimated Duration**: 2-3 hours
**Estimated Tasks**: 20-25

---

## Why This Session Next?

### Prerequisites Met
- [x] Session 05 completed (Framer Motion 12, Zustand available)
- [x] Session 06 completed (preload hook `usePreloadFrames` available)
- [x] Asset URLs configured (MinIO serving optimized WebP frames via Nginx)

### Dependencies
- **Builds on**: Session 06 scroll/parallax utilities (preload hook, animation state)
- **Enables**: Phase 01 Core Animation (hero/product sections need loading orchestration)

### Project Progression
Session 07 is the **final session of Phase 00 (Foundation)**. This session completes the foundation layer by implementing the loading experience that orchestrates asset preloading and content reveal. Without this, users would see jarring frame loading during scroll animations in Phase 01.

The loading system bridges the infrastructure (sessions 01-03), the framework (session 04), the animation ecosystem (session 05), and the scroll utilities (session 06) into a cohesive user experience. It's the "front door" to the portfolio.

---

## Session Overview

### Objective
Implement the loading screen component with progress tracking, visual feedback, and staggered content reveal animation after asset preload completes.

### Key Deliverables
1. **LoadingScreen.tsx** - Full-screen overlay with centered logo placeholder
2. **LoadingProgress.tsx** - Horizontal progress bar with percentage indicator
3. **ContentReveal.tsx** - Staggered reveal wrapper using Framer Motion
4. **loadingStore.ts** - Zustand store for loading state management
5. **Preload integration** - Connect to `usePreloadFrames` hook from Session 06
6. **Reduced motion fallback** - Instant reveal for `prefers-reduced-motion`
7. **Demo page** - Test page to verify loading behavior

### Scope Summary
- **In Scope (MVP)**: Full overlay, progress tracking, staggered reveal, fade transition, reduced motion support
- **Out of Scope**: WebGL loader effect (deferred to Phase 01), actual frame rendering, hero/product components

---

## Technical Considerations

### Technologies/Patterns
- **Zustand** - Loading state store (progress, isLoading, isComplete)
- **Framer Motion** - AnimatePresence for overlay exit, staggerChildren for reveal
- **usePreloadFrames** - Hook from Session 06 for progress tracking
- **CSS Variables** - Theming consistency with existing design tokens
- **prefers-reduced-motion** - Media query hook for accessibility

### Potential Challenges
- **Progress smoothing** - Raw preload events may cause jumpy progress; need interpolation
- **FOUC prevention** - Content must be hidden until loading completes
- **Hydration mismatch** - Server/client loading state must align
- **Exit animation timing** - Coordinating overlay fade with content reveal

### Component Architecture
```
<LoadingScreen>
  <Logo />
  <LoadingProgress progress={progress} />
</LoadingScreen>
<ContentReveal isLoaded={isComplete}>
  {children}
</ContentReveal>
```

---

## Alternative Sessions

If this session is blocked:

1. **Phase 01 - Session 01** - Begin core frame animation without loading screen (not recommended - poor UX)
2. **Refactor Session** - Clean up existing hooks if issues discovered (unlikely)

*Note: Session 07 has no blockers. All prerequisites are satisfied.*

---

## Phase Completion

Completing this session will:
- **Mark Phase 00 as complete** (7/7 sessions done)
- **Unlock Phase 01: Core Animation** (frame animation, hero section, WebGL effects)

---

## Next Steps

Run `/sessionspec` to generate the formal specification with detailed task checklist.
