# Session 01: Frame Preload Error Handling

**Session ID**: `phase00-session01-frame-preload-error-handling`
**Status**: Not Started
**Estimated Tasks**: ~20
**Estimated Duration**: 2-4 hours
**Priority**: P0 - Critical

---

## Objective

Fix the `useFramePreload` hook so that preload completion progresses even when individual frames fail to load, preventing users from being stranded behind loading overlays.

---

## Scope

### In Scope (MVP)
- Track attempted vs successful frame counts separately
- Treat frame load errors as "done" for progress/completion purposes
- Implement retry with exponential backoff (1s, 2s, 4s) for failed frames
- Add overall 30-second timeout as safety net
- Implement progress-based early completion (proceed at 80%+ success rate)
- Add cleanup/cancellation for in-flight loads on unmount
- Add targeted unit tests for error paths

### Out of Scope
- Changes to texture loader (Session 02)
- Configuration consolidation (Session 03)
- UI changes to loading overlay
- Error reporting to external services

---

## Prerequisites

- [ ] Understand current `useFramePreload` implementation (`hooks/useFramePreload.ts`)
- [ ] Review how loading overlay dismissal is wired (`HeroSection` → `UnifiedHeroCanvas` → `useUnifiedFrameAnimation`)
- [ ] Existing tests pass (`npm test`)

---

## Deliverables

1. Refactored `useFramePreload` hook with error-resilient completion logic
2. Retry mechanism with exponential backoff
3. Overall timeout safety net
4. Proper cleanup on unmount
5. Unit tests for all error scenarios
6. All existing tests still pass

---

## Technical Details

### Current Issue (from audit)
In `hooks/useFramePreload.ts`, `img.onerror` resolves without incrementing `loadedCount`. Completion is triggered only when `loadedCount === totalCount`, so a single failing image can prevent `onComplete`.

### Solution Approach
1. Track `attemptedCount` and `successCount` separately
2. Increment `attemptedCount` on both `onload` and `onerror`
3. Trigger completion when `attemptedCount === totalCount`
4. Before final completion, retry failed frames up to 3 times with backoff
5. Add 30-second overall timeout that forces completion
6. If 80%+ frames succeed, proceed (graceful degradation)

### Design Decision (from PRD)
> **Failed frame loads: Retry with exponential backoff, then treat as permanent after 3 attempts**
> Rationale: Transient network issues are common; 3 retries with backoff (1s, 2s, 4s) handles most cases without blocking indefinitely

---

## Success Criteria

- [ ] `useFramePreload` completes even when frames fail to load
- [ ] Failed frames are retried up to 3 times with exponential backoff
- [ ] Overall 30-second timeout prevents indefinite loading
- [ ] Progress updates continue during retries
- [ ] Component unmount cleans up in-flight loads
- [ ] All existing unit tests pass
- [ ] New unit tests cover error scenarios (≥5 new tests)
- [ ] `npm run lint` passes with zero warnings
- [ ] `npm run type-check` passes with no errors
