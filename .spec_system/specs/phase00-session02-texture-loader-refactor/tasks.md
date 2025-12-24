# Task Checklist

**Session ID**: `phase00-session02-texture-loader-refactor`
**Total Tasks**: 24
**Estimated Duration**: 8-10 hours
**Created**: 2025-12-24

---

## Legend

- `[x]` = Completed
- `[ ]` = Pending
- `[P]` = Parallelizable (can run with other [P] tasks)
- `[S0002]` = Session reference (Phase 00, Session 02)
- `TNNN` = Task ID

---

## Progress Summary

| Category | Total | Done | Remaining |
|----------|-------|------|-----------|
| Setup | 3 | 3 | 0 |
| Foundation | 5 | 5 | 0 |
| Implementation | 9 | 9 | 0 |
| Testing | 7 | 7 | 0 |
| **Total** | **24** | **24** | **0** |

---

## Setup (3 tasks)

Initial configuration and environment preparation.

- [x] T001 [S0002] Verify prerequisites: run `npm test` and `npm run lint` to confirm passing baseline
- [x] T002 [S0002] Review current `useTextureLoader.ts` structure and identify all async patterns (setInterval, requestIdleCallback, setTimeout)
- [x] T003 [S0002] Create test file skeleton (`hooks/useTextureLoader.test.ts`) with Vitest imports and Three.js mocks

---

## Foundation (5 tasks)

Core structures and base implementations.

- [x] T004 [S0002] Define `CachedTexture` interface with `texture`, `failed`, and `timestamp` fields (`hooks/useTextureLoader.ts`)
- [x] T005 [S0002] Add `loadingPromisesRef` using `useRef<Map<number, Promise<CachedTexture>>>` for promise registry (`hooks/useTextureLoader.ts`)
- [x] T006 [S0002] Add `idleCallbackHandleRef` using `useRef<number | null>` for requestIdleCallback tracking (`hooks/useTextureLoader.ts`)
- [x] T007 [S0002] Add `timeoutHandlesRef` using `useRef<Set<ReturnType<typeof setTimeout>>>` for timeout tracking (`hooks/useTextureLoader.ts`)
- [x] T008 [S0002] Update `imageCacheRef` type from `HTMLImageElement` to `CachedTexture` and update all references (`hooks/useTextureLoader.ts`)

---

## Implementation (9 tasks)

Main feature implementation.

- [x] T009 [S0002] Replace setInterval polling (lines 102-112) with promise deduplication pattern (`hooks/useTextureLoader.ts`)
- [x] T010 [S0002] Implement failure caching in `loadImage` - cache failed loads with `failed: true` (`hooks/useTextureLoader.ts`)
- [x] T011 [S0002] Update `loadImage` to create and store promise in `loadingPromisesRef` before loading (`hooks/useTextureLoader.ts`)
- [x] T012 [S0002] Update `loadImage` to clean up promise from registry after resolution/rejection (`hooks/useTextureLoader.ts`)
- [x] T013 [S0002] Track requestIdleCallback handle in `idleCallbackHandleRef` (lines 295-312) (`hooks/useTextureLoader.ts`)
- [x] T014 [S0002] Track setTimeout handles in `timeoutHandlesRef` (lines 313-320 fallback) (`hooks/useTextureLoader.ts`)
- [x] T015 [S0002] Update cleanup effect to cancel idle callbacks and clear timeouts on unmount (`hooks/useTextureLoader.ts`)
- [x] T016 [S0002] Update `getTexture` to handle `CachedTexture` type and skip failed entries (`hooks/useTextureLoader.ts`)
- [x] T017 [S0002] Ensure failed cache entries participate in LRU eviction with proper timestamp tracking (`hooks/useTextureLoader.ts`)

---

## Testing (7 tasks)

Verification and quality assurance.

- [x] T018 [S0002] [P] Write concurrent load deduplication tests - 5 tests covering shared promises (`hooks/useTextureLoader.test.ts`)
- [x] T019 [S0002] [P] Write failure caching tests - 3 tests covering cached failures and LRU (`hooks/useTextureLoader.test.ts`)
- [x] T020 [S0002] [P] Write cleanup tests - pending load cancellation and state update prevention (`hooks/useTextureLoader.test.ts`)
- [x] T021 [S0002] [P] Write edge case tests - unmount during load, rapid requests, mixed success/failure (`hooks/useTextureLoader.test.ts`)
- [x] T022 [S0002] Run `npm test` and verify all tests pass
- [x] T023 [S0002] Run `npm run lint` and `npm run type-check` - fix any issues
- [x] T024 [S0002] Validate ASCII encoding on all modified files (0-127 characters only)

---

## Completion Checklist

Before marking session complete:

- [x] All tasks marked `[x]`
- [x] All tests passing (`npm test`)
- [x] No lint warnings (`npm run lint`)
- [x] No type errors (`npm run type-check`)
- [x] All files ASCII-encoded
- [x] implementation-notes.md updated
- [x] Ready for `/validate`

---

## Notes

### Parallelization
Tasks T018-T021 (test writing) can be worked on simultaneously after implementation is complete.

### Task Timing
Target ~20-25 minutes per task.

### Dependencies
- T004-T008 (Foundation) must complete before T009-T017 (Implementation)
- T009-T017 must complete before T018-T024 (Testing)
- T003 can be done in parallel with T004-T008

### Critical Path
T009 (setInterval replacement) is the core refactor - ensure thorough testing.

### Key Files
| File | Purpose |
|------|---------|
| `hooks/useTextureLoader.ts` | Main refactor target (~80 lines changed) |
| `hooks/useTextureLoader.test.ts` | New test file (~300 lines) |

### Problem Code Reference
Lines 102-112 in `useTextureLoader.ts`:
```typescript
// setInterval polling - REMOVE THIS
const checkInterval = setInterval(() => {
  const img = imageCacheRef.current.get(index);
  if (img && img.complete) {
    clearInterval(checkInterval);
    resolve(img);
  }
}, 10);
```

Replace with:
```typescript
// Promise deduplication - USE THIS
if (loadingPromisesRef.current.has(index)) {
  return loadingPromisesRef.current.get(index)!;
}
```

---

## Next Steps

Run `/implement` to begin AI-led implementation.
