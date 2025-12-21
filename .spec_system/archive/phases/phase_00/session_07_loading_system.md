# Session 07: Loading System

**Session ID**: `phase00-session07-loading-system`
**Status**: Not Started
**Estimated Tasks**: ~20-25
**Estimated Duration**: 2-3 hours

---

## Objective

Implement the loading screen component with progress tracking, visual feedback, and staggered content reveal animation after asset preload completes.

---

## Scope

### In Scope (MVP)
- Full-screen loading overlay component
- Centered logo display (placeholder or actual)
- Horizontal progress bar with percentage indicator
- Preload progress tracking for frame sequences
- Loading state management with Zustand
- Staggered content reveal animation using Framer Motion
- 0.5s ease-out fade transition on dismiss
- prefers-reduced-motion support (instant reveal)

### Out of Scope
- WebGL effect in loader (placeholder only, implemented Phase 01)
- Actual frame sequence rendering
- Hero/product section components

---

## Prerequisites

- [ ] Session 05 completed (Framer Motion, Zustand available)
- [ ] Session 06 completed (preload hook available)
- [ ] Asset URLs configured for preload testing

---

## Deliverables

1. `components/LoadingScreen.tsx` - Full overlay component
2. `components/LoadingProgress.tsx` - Progress bar with percentage
3. `components/ContentReveal.tsx` - Staggered reveal wrapper
4. `stores/loadingStore.ts` - Zustand store for loading state
5. Integration with preload hook from Session 06
6. Reduced motion fallback (instant reveal)
7. Loading screen demo/test page

---

## Success Criteria

- [ ] Loading overlay covers full viewport
- [ ] Progress bar accurately reflects preload progress
- [ ] Percentage updates smoothly (not jumpy)
- [ ] Content reveal animation staggers correctly
- [ ] 0.5s fade transition when loading completes
- [ ] prefers-reduced-motion shows instant reveal
- [ ] Loading screen prevents interaction until complete
- [ ] No flash of unstyled content (FOUC)
- [ ] Works correctly on page refresh
