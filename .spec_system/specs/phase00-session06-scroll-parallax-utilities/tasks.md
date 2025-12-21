# Task Checklist

**Session ID**: `phase00-session06-scroll-parallax-utilities`
**Total Tasks**: 24
**Estimated Duration**: 8-10 hours
**Created**: 2025-12-21

---

## Legend

- `[x]` = Completed
- `[ ]` = Pending
- `[P]` = Parallelizable (can run with other [P] tasks)
- `[S0006]` = Session reference (Phase 00, Session 06)
- `TNNN` = Task ID

---

## Progress Summary

| Category | Total | Done | Remaining |
|----------|-------|------|-----------|
| Setup | 4 | 4 | 0 |
| Foundation | 5 | 5 | 0 |
| Implementation | 9 | 9 | 0 |
| Testing | 4 | 4 | 0 |
| Validation | 2 | 2 | 0 |
| **Total** | **24** | **24** | **0** |

---

## Setup (4 tasks)

Initial configuration and environment preparation.

- [x] T001 [S0006] Install vitest and testing dependencies (`package.json`)
- [x] T002 [S0006] Create vitest.config.ts with React support (`vitest.config.ts`)
- [x] T003 [S0006] Update tsconfig.json with vitest types if needed (`tsconfig.json`)
- [x] T004 [S0006] Create __tests__ directory structure (`__tests__/`)

---

## Foundation (5 tasks)

Core types and utility functions that hooks depend on.

- [x] T005 [S0006] Create animation types with hook interfaces (`types/animation.ts`)
- [x] T006 [S0006] Update types barrel export with animation re-exports (`types/index.ts`)
- [x] T007 [S0006] Create scroll utility functions - calculateFrameIndex, normalizeProgress, calculateParallaxOffset (`lib/scroll-utils.ts`)
- [x] T008 [S0006] [P] Add test and coverage scripts to package.json (`package.json`)
- [x] T009 [S0006] [P] Verify existing utils.ts has clamp, lerp, mapRange (`lib/utils.ts`)

---

## Implementation (9 tasks)

Main hook implementations and demo page.

- [x] T010 [S0006] Create useScrollProgress hook - section-scoped 0-1 progress (`hooks/useScrollProgress.ts`)
- [x] T011 [S0006] Create useFrameAnimation hook - scroll to frame index mapping (`hooks/useFrameAnimation.ts`)
- [x] T012 [S0006] [P] Create useParallax hook - parallax transform values (`hooks/useParallax.ts`)
- [x] T013 [S0006] Create useFramePreload hook - priority-based preloading with callbacks (`hooks/useFramePreload.ts`)
- [x] T014 [S0006] Create hooks barrel export (`hooks/index.ts`)
- [x] T015 [S0006] Create demo page directory and layout (`app/demo/scroll/`)
- [x] T016 [S0006] Implement demo page with all hooks visualization (`app/demo/scroll/page.tsx`)
- [x] T017 [S0006] Add demo section components - ScrollProgressDemo, FrameAnimationDemo (`app/demo/scroll/page.tsx`)
- [x] T018 [S0006] Add ParallaxDemo and PreloadDemo sections (`app/demo/scroll/page.tsx`)

---

## Testing (4 tasks)

Unit tests and test execution.

- [x] T019 [S0006] [P] Write scroll-utils unit tests - boundary cases, speed calculations (`__tests__/lib/scroll-utils.test.ts`)
- [x] T020 [S0006] [P] Write useScrollProgress tests - before/during/after section (`__tests__/hooks/useScrollProgress.test.ts`)
- [x] T021 [S0006] [P] Write useFrameAnimation tests - frame boundaries, direction (`__tests__/hooks/useFrameAnimation.test.ts`)
- [x] T022 [S0006] [P] Write useParallax tests - speed multipliers, transforms (`__tests__/hooks/useParallax.test.ts`)

---

## Validation (2 tasks)

Quality gates and final verification.

- [x] T023 [S0006] Run full test suite, verify >90% coverage, fix any failures (`npm run test`)
- [x] T024 [S0006] Run lint and type-check, verify zero errors/warnings (`npm run lint && npm run type-check`)

---

## Completion Checklist

Before marking session complete:

- [ ] All 24 tasks marked `[x]`
- [ ] All tests passing with >90% coverage
- [ ] `npm run lint` passes with zero warnings
- [ ] `npm run type-check` passes with zero errors
- [ ] All files ASCII-encoded (0-127 characters only)
- [ ] Demo page functional at `/demo/scroll`
- [ ] Ready for `/validate`

---

## Notes

### Parallelization Opportunities
- T008 + T009: Package.json updates and utils verification
- T012: useParallax can be built alongside other hooks
- T019-T022: All test files can be written in parallel

### Task Dependencies
- T005-T007 must complete before T010-T014 (hooks need types and utils)
- T010 must complete before T011 (useFrameAnimation uses useScrollProgress internally)
- T014 must complete before T016-T018 (demo imports from barrel export)
- T010-T014 must complete before T019-T022 (tests need hooks)

### Key Implementation Details

**MotionValue Pattern**: All hooks must use Framer Motion's `MotionValue` instead of React state to avoid re-renders during scroll.

**Frame Index Formula**: `Math.floor(progress * (totalFrames - 1))` with `clamp()` safety.

**Preload Strategy**:
- First 10 frames: `new Image()` with high priority
- Remaining frames: `requestIdleCallback` chunked loading

**Section Targeting**: Use `useScroll({ target: ref, offset: ["start end", "end start"] })`.

### Frame Counts Reference
- Hero sequence: 192 frames
- Product sequence: 144 frames

---

## API Signatures (Quick Reference)

```typescript
// useScrollProgress
function useScrollProgress(options: {
  target: RefObject<HTMLElement>;
  offset?: [string, string];
}): { progress: MotionValue<number>; isInView: boolean }

// useFrameAnimation
function useFrameAnimation(options: {
  target: RefObject<HTMLElement>;
  totalFrames: number;
  offset?: [string, string];
}): { frameIndex: MotionValue<number>; progress: MotionValue<number>; direction: "up" | "down" | null; isActive: boolean }

// useParallax
function useParallax(options: {
  target: RefObject<HTMLElement>;
  speed?: number;
  offset?: [string, string];
}): { y: MotionValue<number>; x: MotionValue<number>; opacity: MotionValue<number> }

// useFramePreload
function useFramePreload(options: {
  frames: string[];
  priorityCount?: number;
  onProgress?: (percent: number) => void;
  onComplete?: () => void;
  onError?: (url: string, error: Error) => void;
}): { isLoading: boolean; isComplete: boolean; progress: number; loadedCount: number; totalCount: number; startPreload: () => void }
```

---

## Next Steps

Run `/implement` to begin AI-led implementation.
