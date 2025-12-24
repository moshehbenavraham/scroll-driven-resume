# NEXT_SESSION.md

## Session Recommendation

**Generated**: 2025-12-24
**Project State**: Phase 00 - Code Audit Remediation
**Completed Sessions**: 0

---

## Recommended Next Session

**Session ID**: `phase00-session01-frame-preload-error-handling`
**Session Name**: Frame Preload Error Handling
**Estimated Duration**: 2-4 hours
**Estimated Tasks**: ~20
**Priority**: P0 - Critical

---

## Why This Session Next?

### Prerequisites Met
- [x] Fresh phase with no prior dependencies
- [x] Codebase exists with current `useFramePreload` implementation
- [x] Existing test suite available for validation

### Dependencies
- **Builds on**: None (first session in phase)
- **Enables**: Session 02 (Texture Loader Refactor), Session 03 (Configuration Consolidation)

### Project Progression

This is the only P0 (critical) issue identified in the code audit. The `useFramePreload` hook currently has a blocking bug: when individual frames fail to load (e.g., transient network errors), `loadedCount` never reaches `totalCount`, leaving users stuck behind the loading overlay indefinitely.

Starting here ensures:
1. **Critical user-facing issue resolved first** - Users won't be stranded on loading screens
2. **Foundation for subsequent sessions** - Reliable preload completion enables clean testing of other fixes
3. **Immediate value delivery** - P0 fix shipped before P1/P2 polish work

---

## Session Overview

### Objective

Fix the `useFramePreload` hook so that preload completion progresses even when individual frames fail to load, preventing users from being stranded behind loading overlays.

### Key Deliverables
1. Refactored `useFramePreload` with error-resilient completion logic
2. Retry mechanism with exponential backoff (1s, 2s, 4s delays)
3. Overall 30-second timeout as safety net
4. Progress-based early completion (proceed at 80%+ success rate)
5. Proper cleanup on component unmount
6. Unit tests for all error scenarios (≥5 new tests)

### Scope Summary
- **In Scope (MVP)**: Track attempted vs successful counts separately, retry failed frames, timeout safety net, cleanup on unmount, error path tests
- **Out of Scope**: Texture loader changes (Session 02), configuration consolidation (Session 03), UI changes to loading overlay, external error reporting

---

## Technical Considerations

### Technologies/Patterns
- React hooks with useRef for cleanup tracking
- Promise-based retry with exponential backoff
- setTimeout for overall timeout safety net
- Vitest for unit testing error scenarios

### Potential Challenges
- **Cleanup timing**: Must cancel retries and timeouts on unmount without race conditions
- **Progress calculation**: Need to report progress during retries without confusing users
- **Test isolation**: Mocking image load failures in unit tests requires careful setup

### Key Code Locations
- `hooks/useFramePreload.ts` - Primary target for refactoring
- `hooks/useUnifiedFrameAnimation.ts` - Consumer of preload completion
- `components/sections/hero/HeroSection.tsx` - Wires loading overlay dismissal

---

## Alternative Sessions

If this session is blocked:
1. **Session 02 (Texture Loader Refactor)** - Can proceed in parallel if issues are isolated, addresses resource leaks
2. **Session 03 (Configuration Consolidation)** - Lower risk configuration cleanup, no runtime behavior changes

---

## Next Steps

Run `/sessionspec` to generate the formal specification.
