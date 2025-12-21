# Session Specification

**Session ID**: `phase00-session06-scroll-parallax-utilities`
**Phase**: 00 - Foundation
**Status**: Not Started
**Created**: 2025-12-21

---

## 1. Session Overview

This session creates the core scroll and parallax utility hooks that power the frame animation and layered depth effects throughout the portfolio. These hooks form the animation infrastructure that Phase 01 components will consume to create the scroll-synchronized cinematic experience.

The portfolio's signature effect - scroll position controlling video-like frame playback - requires precise mapping between scroll percentage and frame index. Users scrolling down advance the animation; scrolling up reverses it. This session builds the hooks that make this possible, along with parallax utilities that create the dimensional depth effect with background, mid-layer, and foreground elements moving at different speeds.

All hooks integrate with Framer Motion 12's `useScroll` and `useTransform` APIs, leveraging the library's optimized scroll handling and motion value system. Performance is critical - these utilities must maintain 60fps during scroll events with no jank or frame drops.

---

## 2. Objectives

1. Create `useFrameAnimation` hook that maps section-scoped scroll progress to discrete frame indices for video-like playback
2. Create `useParallax` hook that generates transform values at configurable speeds (0.3x-1.3x) for layered depth effects
3. Create `useScrollProgress` hook that returns normalized 0-1 progress within section boundaries
4. Create `useFramePreload` hook that implements priority-based preloading (first 10 frames immediately, stream remainder)
5. Establish TypeScript types for the animation system that extend existing types in `types/index.ts`
6. Achieve >90% unit test coverage on utility functions with Vitest

---

## 3. Prerequisites

### Required Sessions
- [x] `phase00-session05-animation-libraries` - Framer Motion 12 installed and configured

### Required Tools/Knowledge
- Framer Motion `useScroll`, `useTransform`, `useMotionValue` APIs
- React 19 hooks patterns (useRef, useEffect, useCallback)
- TypeScript strict mode and generics
- Vitest testing framework

### Environment Requirements
- Next.js 16.1.0 development server operational (`npm run dev`)
- MinIO asset server running (for preload testing with real URLs)
- Node.js 20+ runtime

---

## 4. Scope

### In Scope (MVP)
- `useFrameAnimation` hook with section targeting and direction detection
- `useParallax` hook with configurable speed multipliers
- `useScrollProgress` hook with boundary detection
- `useFramePreload` hook with priority loading and progress callbacks
- Scroll utility functions in `lib/scroll-utils.ts`
- Extended animation types in `types/animation.ts`
- Vitest unit tests for all utility functions
- Demo page showing hooks in action at `/demo/scroll`

### Out of Scope (Deferred)
- Actual frame rendering components - *Reason: Phase 01 scope*
- WebGL particle effects - *Reason: Phase 01 scope*
- Loading screen integration - *Reason: Session 07 scope*
- Mobile-specific optimizations - *Reason: Phase 02 scope*

---

## 5. Technical Approach

### Architecture

```
hooks/
  useFrameAnimation.ts   # Scroll % -> frame index mapping
  useParallax.ts         # Parallax transform generation
  useScrollProgress.ts   # Section-scoped scroll progress
  useFramePreload.ts     # Frame preloading with callbacks
  index.ts               # Barrel export

lib/
  scroll-utils.ts        # Pure utility functions
  utils.ts               # Existing utils (clamp, lerp, mapRange)

types/
  animation.ts           # Animation-specific types
  index.ts               # Existing types + re-exports
```

### Design Patterns

- **Custom Hooks Pattern**: Each utility is a composable React hook that can be combined
- **Motion Value Pattern**: Use Framer Motion's `MotionValue` for reactive scroll values without re-renders
- **Options Object Pattern**: All hooks accept a configuration object for flexibility
- **Callback Pattern**: Preload hook uses callbacks for progress/completion events

### Technology Stack

- Framer Motion 12.23.26 - `useScroll`, `useTransform`, `useMotionValue`
- React 19.2.3 - hooks, refs, effects
- TypeScript 5.x - strict mode, no implicit any
- Vitest - unit testing (to be added this session)

---

## 6. Deliverables

### Files to Create

| File | Purpose | Est. Lines |
|------|---------|------------|
| `hooks/useFrameAnimation.ts` | Maps scroll progress to frame index | ~80 |
| `hooks/useParallax.ts` | Creates parallax transform values | ~60 |
| `hooks/useScrollProgress.ts` | Section-scoped scroll percentage | ~70 |
| `hooks/useFramePreload.ts` | Priority-based frame preloading | ~120 |
| `hooks/index.ts` | Barrel exports for all hooks | ~15 |
| `lib/scroll-utils.ts` | Scroll calculation utilities | ~80 |
| `types/animation.ts` | Animation system types | ~100 |
| `app/demo/scroll/page.tsx` | Demo page for hooks | ~150 |
| `__tests__/hooks/useFrameAnimation.test.ts` | Unit tests | ~80 |
| `__tests__/hooks/useParallax.test.ts` | Unit tests | ~60 |
| `__tests__/hooks/useScrollProgress.test.ts` | Unit tests | ~70 |
| `__tests__/lib/scroll-utils.test.ts` | Unit tests | ~100 |
| `vitest.config.ts` | Vitest configuration | ~30 |

### Files to Modify

| File | Changes | Est. Lines |
|------|---------|------------|
| `types/index.ts` | Add re-exports from animation.ts | ~5 |
| `package.json` | Add vitest, @testing-library/react | ~10 |
| `tsconfig.json` | Add vitest types if needed | ~3 |

---

## 7. Success Criteria

### Functional Requirements
- [ ] `useFrameAnimation` correctly maps scroll 0-100% to frame index 0-N
- [ ] `useFrameAnimation` returns direction ("up" | "down" | null)
- [ ] `useParallax` creates smooth transforms at 0.3x, 0.5x, 1.0x, 1.3x speeds
- [ ] `useScrollProgress` returns 0 before section, 0-1 during, 1 after
- [ ] `useFramePreload` loads first 10 frames with priority
- [ ] `useFramePreload` fires `onProgress` callback with percentage
- [ ] `useFramePreload` fires `onComplete` when all frames loaded
- [ ] All hooks integrate cleanly with Framer Motion `useScroll`

### Performance Requirements
- [ ] No jank at 60fps during continuous scroll
- [ ] No unnecessary React re-renders (use MotionValue)
- [ ] Preload does not block main thread

### Testing Requirements
- [ ] Vitest configured and running
- [ ] Unit tests written for all utility functions
- [ ] >90% code coverage on `lib/scroll-utils.ts`
- [ ] Hook behavior tests with Testing Library

### Quality Gates
- [ ] `npm run lint` passes with zero warnings
- [ ] `npm run type-check` passes with zero errors
- [ ] All files ASCII-encoded (0-127 characters only)
- [ ] Unix LF line endings
- [ ] Code follows existing project conventions

---

## 8. Implementation Notes

### Key Considerations

1. **MotionValue vs State**: Use Framer Motion's `MotionValue` instead of React state for scroll values. MotionValues update without triggering re-renders, critical for 60fps performance.

2. **Section Targeting**: `useScrollProgress` must accept a `ref` to the target section element. Use `useScroll({ target: ref, offset: ["start end", "end start"] })` for section-scoped progress.

3. **Frame Index Calculation**: `frameIndex = Math.floor(progress * (totalFrames - 1))` ensures we never exceed bounds. Use `clamp()` from existing utils as safety.

4. **Preload Strategy**: Load frames 1-10 with `<link rel="preload">` or `new Image()`. Stream remaining frames with lower priority using `requestIdleCallback` or chunked loading.

5. **Direction Detection**: Track previous scroll position to determine direction. Use `useMotionValueEvent` to listen for scroll changes.

### Potential Challenges

- **Safari Scroll Behavior**: Safari has different scroll event timing. Test thoroughly and consider `useLayoutEffect` for measurement.
- **Frame Count Mismatch**: Hero has 192 frames, product has 144. Hooks must handle variable frame counts via configuration.
- **Preload Race Conditions**: Multiple preload requests for same frame should be deduplicated. Use a Set to track in-flight requests.

### ASCII Reminder

All output files must use ASCII-only characters (0-127). Avoid smart quotes, em-dashes, and non-ASCII symbols.

---

## 9. Testing Strategy

### Unit Tests

**scroll-utils.ts**:
- `calculateFrameIndex(progress, totalFrames)` - boundary cases (0, 1, 0.5)
- `calculateParallaxOffset(scrollY, speed, containerHeight)` - various speeds
- `normalizeProgress(scrollY, sectionTop, sectionHeight, viewportHeight)` - boundary detection

**useFrameAnimation**:
- Returns correct frame at scroll boundaries
- Direction changes correctly on scroll reversal
- Handles zero frames gracefully

**useParallax**:
- Returns MotionValue with correct initial value
- Speed multiplier applied correctly

**useScrollProgress**:
- Returns 0 before section enters viewport
- Returns 1 after section exits viewport
- Normalizes 0-1 during section traverse

### Integration Tests

- Demo page renders without errors
- Scroll interactions update values in real-time
- Multiple hooks compose without conflict

### Manual Testing

- [ ] Open `/demo/scroll` in Chrome, Firefox, Safari
- [ ] Scroll through demo sections, verify smooth animation
- [ ] Check DevTools Performance panel for jank
- [ ] Verify preload network requests fire correctly

### Edge Cases

- Window resize during scroll
- Very fast scroll (momentum scrolling)
- Section height smaller than viewport
- Zero frames in sequence configuration

---

## 10. Dependencies

### External Libraries

| Library | Version | Purpose |
|---------|---------|---------|
| framer-motion | ^12.23.26 | Scroll hooks, motion values |
| vitest | ^3.0.0 | Unit testing framework |
| @testing-library/react | ^16.0.0 | React hook testing |
| @vitejs/plugin-react | ^4.0.0 | Vitest React support |

### Internal Dependencies

- `lib/utils.ts` - `clamp()`, `lerp()`, `mapRange()` functions
- `types/index.ts` - `FrameSequence`, `AnimationState` types

### Other Sessions

- **Depends on**: `phase00-session05-animation-libraries` (Framer Motion installed)
- **Depended by**: `phase00-session07-loading-system` (uses `useFramePreload`)

---

## 11. API Reference

### useFrameAnimation

```typescript
interface UseFrameAnimationOptions {
  target: RefObject<HTMLElement>;
  totalFrames: number;
  offset?: [string, string]; // Default: ["start end", "end start"]
}

interface UseFrameAnimationReturn {
  frameIndex: MotionValue<number>;
  progress: MotionValue<number>;
  direction: "up" | "down" | null;
  isActive: boolean;
}

function useFrameAnimation(options: UseFrameAnimationOptions): UseFrameAnimationReturn;
```

### useParallax

```typescript
interface UseParallaxOptions {
  target: RefObject<HTMLElement>;
  speed?: number; // Default: 0.5 (0.3-1.3 range)
  offset?: [string, string];
}

interface UseParallaxReturn {
  y: MotionValue<number>;
  x: MotionValue<number>;
  opacity: MotionValue<number>;
}

function useParallax(options: UseParallaxOptions): UseParallaxReturn;
```

### useScrollProgress

```typescript
interface UseScrollProgressOptions {
  target: RefObject<HTMLElement>;
  offset?: [string, string];
}

interface UseScrollProgressReturn {
  progress: MotionValue<number>;
  isInView: boolean;
}

function useScrollProgress(options: UseScrollProgressOptions): UseScrollProgressReturn;
```

### useFramePreload

```typescript
interface UseFramePreloadOptions {
  frames: string[]; // Array of frame URLs
  priorityCount?: number; // Default: 10
  onProgress?: (percent: number) => void;
  onComplete?: () => void;
  onError?: (url: string, error: Error) => void;
}

interface UseFramePreloadReturn {
  isLoading: boolean;
  isComplete: boolean;
  progress: number; // 0-100
  loadedCount: number;
  totalCount: number;
  startPreload: () => void;
}

function useFramePreload(options: UseFramePreloadOptions): UseFramePreloadReturn;
```

---

## Next Steps

Run `/tasks` to generate the implementation task checklist.
