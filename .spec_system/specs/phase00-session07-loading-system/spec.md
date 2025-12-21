# Session Specification

**Session ID**: `phase00-session07-loading-system`
**Phase**: 00 - Foundation
**Status**: Not Started
**Created**: 2025-12-22

---

## 1. Session Overview

This session implements the loading system that serves as the "front door" to the portfolio. When users first visit the site, they see a full-screen loading overlay that displays progress as frame sequences are preloaded in the background. Once loading completes, the overlay fades out with a 0.5s ease-out transition, and the main content reveals with a staggered animation sequence.

The loading system integrates with the `useFramePreload` hook from Session 06 to track actual asset loading progress. It uses a dedicated Zustand store to manage loading state globally, allowing any component to check loading status. For accessibility, users with `prefers-reduced-motion` enabled see an instant reveal without animations.

This is the final session of Phase 00 (Foundation). Completing this session unlocks Phase 01 (Core Animation) where the actual frame sequences and hero sections will be implemented. The loading system provides the critical infrastructure to ensure those animations have a smooth start.

---

## 2. Objectives

1. Create a full-screen loading overlay component with centered logo placeholder and visual styling
2. Implement a horizontal progress bar with percentage indicator that reflects preload progress
3. Build a staggered content reveal wrapper using Framer Motion's AnimatePresence and staggerChildren
4. Create a Zustand store for loading state management with clean separation from animation state

---

## 3. Prerequisites

### Required Sessions
- [x] `phase00-session05-animation-libraries` - Framer Motion 12 and Zustand installed
- [x] `phase00-session06-scroll-parallax-utilities` - `useFramePreload` hook available

### Required Tools/Knowledge
- Framer Motion 12 AnimatePresence, staggerChildren, variants API
- Zustand state management patterns
- CSS custom properties for theming
- Next.js 15 app router patterns

### Environment Requirements
- Node.js 20+ installed
- Docker stack running (MinIO serving frames via Nginx for testing)
- Asset URLs configured in environment variables

---

## 4. Scope

### In Scope (MVP)
- Full-screen loading overlay covering viewport
- Centered logo placeholder (text or SVG)
- Horizontal progress bar (0-100%)
- Percentage text indicator with smooth updates
- Loading state Zustand store
- Staggered content reveal animation (5-7 children)
- 0.5s ease-out fade transition on dismiss
- Integration with `useFramePreload` hook
- `prefers-reduced-motion` support (instant reveal)
- Pointer-events blocking during load
- Demo page for testing loading behavior
- Unit tests for loading store

### Out of Scope (Deferred)
- WebGL effect in loader - *Reason: Phase 01 scope, placeholder only*
- Actual frame sequence rendering - *Reason: Phase 01 scope*
- Hero/product section components - *Reason: Phase 01 scope*
- Custom logo asset - *Reason: User content, placeholder acceptable*
- Loading screen skip button - *Reason: Not in PRD requirements*

---

## 5. Technical Approach

### Architecture

```
app/
  layout.tsx           # Wrap children with LoadingProvider
  page.tsx             # Main page (wrapped by ContentReveal)
  demo/
    loading/
      page.tsx         # Loading demo page

components/
  loading/
    LoadingScreen.tsx     # Full-screen overlay
    LoadingProgress.tsx   # Progress bar + percentage
    LoadingLogo.tsx       # Centered logo placeholder
    ContentReveal.tsx     # Staggered reveal wrapper
    LoadingProvider.tsx   # Provider connecting store + preload
    index.ts              # Barrel export

stores/
  loading-store.ts        # Loading state Zustand store

hooks/
  useReducedMotion.ts     # Media query hook for prefers-reduced-motion
  index.ts                # Update barrel export
```

### Design Patterns
- **Provider Pattern**: `LoadingProvider` wraps app and manages preload lifecycle
- **Compound Components**: LoadingScreen composed of LoadingLogo + LoadingProgress
- **State Machine**: Loading states: idle -> loading -> complete -> revealed
- **Progressive Enhancement**: Full animation by default, instant reveal for reduced motion

### Technology Stack
- **Framer Motion 12**: AnimatePresence, motion.div, staggerChildren, variants
- **Zustand**: Loading store with devtools middleware
- **CSS Variables**: Consistent theming with existing design tokens
- **Next.js 15**: App router, client components where needed

---

## 6. Deliverables

### Files to Create

| File | Purpose | Est. Lines |
|------|---------|------------|
| `components/loading/LoadingScreen.tsx` | Full-screen overlay with AnimatePresence | ~80 |
| `components/loading/LoadingProgress.tsx` | Progress bar with percentage | ~60 |
| `components/loading/LoadingLogo.tsx` | Centered logo placeholder | ~40 |
| `components/loading/ContentReveal.tsx` | Staggered reveal wrapper | ~70 |
| `components/loading/LoadingProvider.tsx` | Provider managing preload lifecycle | ~80 |
| `components/loading/index.ts` | Barrel export | ~10 |
| `stores/loading-store.ts` | Zustand store for loading state | ~70 |
| `hooks/useReducedMotion.ts` | Media query hook for accessibility | ~35 |
| `app/demo/loading/page.tsx` | Demo page for testing | ~80 |
| `__tests__/stores/loading-store.test.ts` | Unit tests for store | ~100 |

### Files to Modify

| File | Changes | Est. Lines |
|------|---------|------------|
| `hooks/index.ts` | Add useReducedMotion export | ~5 |
| `stores/index.ts` | Add loading store export | ~3 |
| `app/layout.tsx` | Optional: Add LoadingProvider wrapper (or defer to Phase 01) | ~10 |

---

## 7. Success Criteria

### Functional Requirements
- [ ] Loading overlay covers full viewport (100vw x 100vh, fixed position)
- [ ] Overlay has dark semi-transparent background with blur
- [ ] Logo is centered horizontally and vertically
- [ ] Progress bar width reflects actual preload progress (0-100%)
- [ ] Percentage text updates smoothly (interpolated, not jumpy)
- [ ] Overlay fades out with 0.5s ease-out when loading completes
- [ ] Content reveal animates with staggered timing (50ms delay per child)
- [ ] `prefers-reduced-motion` shows instant reveal (no animations)
- [ ] Overlay blocks pointer events during loading
- [ ] No flash of unstyled content (FOUC) - content hidden until reveal
- [ ] Loading works correctly on page refresh
- [ ] Demo page demonstrates full loading lifecycle

### Testing Requirements
- [ ] Unit tests for loading store (setProgress, setComplete, reset)
- [ ] Unit tests for useReducedMotion hook
- [ ] Manual testing: Load demo page, verify smooth progress updates
- [ ] Manual testing: Enable reduced motion in OS, verify instant reveal
- [ ] Manual testing: Refresh page, verify no FOUC

### Quality Gates
- [ ] All files ASCII-encoded (no Unicode characters)
- [ ] Unix LF line endings
- [ ] Code follows project ESLint/Prettier conventions
- [ ] TypeScript strict mode - no errors
- [ ] No console warnings in development
- [ ] Components are properly memoized where beneficial

---

## 8. Implementation Notes

### Key Considerations

1. **Hydration Safety**: Loading state must be initialized to `true` on server and client to prevent hydration mismatch. Use `suppressHydrationWarning` if needed.

2. **Progress Smoothing**: Raw preload progress may be jumpy. Consider using `framer-motion`'s `useSpring` or CSS transitions to smooth the progress bar width.

3. **Z-Index Management**: Loading overlay must be above all content. Use z-index of 9999 or CSS layer.

4. **Exit Animation Timing**: Use `AnimatePresence` with `mode="wait"` to ensure overlay fully exits before content reveals.

5. **FOUC Prevention**: Content should start with `opacity: 0` and `visibility: hidden` until loading completes.

### Potential Challenges

- **Server/Client State Sync**: Loading store initializes on client only. Use `useEffect` for client-only operations.
  - *Mitigation*: Initialize store with `isLoading: true` default, update on client mount.

- **Progress Callback Frequency**: `useFramePreload` may fire progress callbacks rapidly.
  - *Mitigation*: Debounce store updates or use `requestAnimationFrame` for visual updates.

- **AnimatePresence Exit Timing**: Exit animation must complete before content reveals.
  - *Mitigation*: Use `onExitComplete` callback to trigger content reveal.

### ASCII Reminder

All output files must use ASCII-only characters (0-127). Avoid:
- Smart quotes ("" -> "")
- Em/en dashes (-- not --)
- Non-breaking spaces
- Unicode symbols

---

## 9. Testing Strategy

### Unit Tests

**Loading Store** (`loading-store.test.ts`):
- `setProgress` updates progress value correctly
- `setProgress` clamps to 0-100 range
- `setComplete` sets isComplete to true and isLoading to false
- `reset` returns store to initial state
- Store is properly typed

**useReducedMotion Hook** (`useReducedMotion.test.ts`):
- Returns false by default (no preference)
- Returns true when media query matches
- Updates on media query change

### Integration Tests

- LoadingProvider correctly integrates with useFramePreload
- Progress updates flow from preload hook to store to UI

### Manual Testing

| Scenario | Expected Behavior |
|----------|-------------------|
| Fresh page load | Overlay appears, progress bar fills, content reveals |
| Page refresh | Same behavior, no cached state issues |
| Slow network (throttle to 3G) | Progress bar updates gradually |
| Fast network | Progress bar fills quickly, smooth transition |
| Reduced motion enabled | Overlay disappears instantly, content shows immediately |
| Mobile viewport | Overlay covers full screen, progress bar visible |

### Edge Cases

- Zero frames to preload (empty array) - should complete immediately
- Network error during preload - should still complete (graceful degradation)
- User navigates away during load - cleanup without errors
- Very fast preload (all cached) - still show brief loading for visual consistency

---

## 10. Dependencies

### External Libraries

| Library | Version | Purpose |
|---------|---------|---------|
| framer-motion | ^12.0.0 | AnimatePresence, motion, variants |
| zustand | ^5.0.0 | Loading state store |
| next | ^15.0.0 | App router, client components |
| react | ^19.0.0 | Hooks, components |

### Internal Dependencies

| Module | Import | Purpose |
|--------|--------|---------|
| `@/hooks/useFramePreload` | Preload progress tracking | Connect to loading store |
| `@/stores/animation-store` | Animation preferences | Check reduced motion preference |
| `@/lib/cn` | Class name utility | Conditional styling |

### Other Sessions

- **Depends on**:
  - `phase00-session05-animation-libraries` (Framer Motion, Zustand)
  - `phase00-session06-scroll-parallax-utilities` (useFramePreload hook)

- **Depended by**:
  - `phase01-session01-*` (Hero section will use loading orchestration)
  - All future sections that need loading state awareness

---

## 11. Component Specifications

### LoadingScreen

```tsx
interface LoadingScreenProps {
  isLoading: boolean;
  progress: number;
}
```

- Fixed position, full viewport
- Dark background with backdrop blur
- Centers children (logo + progress)
- Uses AnimatePresence for exit animation
- Blocks pointer events during loading

### LoadingProgress

```tsx
interface LoadingProgressProps {
  progress: number; // 0-100
  showPercentage?: boolean;
}
```

- Horizontal progress bar
- Animated width transition (CSS or Framer Motion)
- Optional percentage text
- Uses theme colors (accent for fill, muted for background)

### ContentReveal

```tsx
interface ContentRevealProps {
  isRevealed: boolean;
  children: React.ReactNode;
  staggerDelay?: number; // ms between children, default 50
}
```

- Wraps page content
- Children animate in with stagger
- Uses variants for enter animation (fade + slide up)
- Respects reduced motion preference

### LoadingProvider

```tsx
interface LoadingProviderProps {
  children: React.ReactNode;
  frameUrls?: string[]; // Optional for manual control
  autoStart?: boolean;
}
```

- Manages preload lifecycle
- Connects useFramePreload to loading store
- Provides context for loading state (optional)

---

## 12. Store Specification

### Loading Store Schema

```typescript
interface LoadingState {
  // State
  isLoading: boolean;
  isComplete: boolean;
  progress: number;          // 0-100
  error: string | null;

  // Actions
  setProgress: (progress: number) => void;
  setComplete: () => void;
  setError: (error: string) => void;
  reset: () => void;
}
```

### Initial State

```typescript
const initialState = {
  isLoading: true,   // Start loading by default
  isComplete: false,
  progress: 0,
  error: null,
};
```

---

## Next Steps

Run `/tasks` to generate the implementation task checklist.
