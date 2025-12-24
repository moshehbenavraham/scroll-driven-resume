# Task Checklist

**Session ID**: `phase00-session01-frame-preload-error-handling`
**Total Tasks**: 24
**Estimated Duration**: 8-10 hours
**Created**: 2025-12-24

---

## Legend

- `[x]` = Completed
- `[ ]` = Pending
- `[P]` = Parallelizable (can run with other [P] tasks)
- `[S0001]` = Session reference (Phase 00, Session 01)
- `TNNN` = Task ID

---

## Progress Summary

| Category | Total | Done | Remaining |
|----------|-------|------|-----------|
| Setup | 3 | 3 | 0 |
| Foundation | 5 | 5 | 0 |
| Implementation | 8 | 8 | 0 |
| Testing | 8 | 8 | 0 |
| **Total** | **24** | **24** | **0** |

---

## Setup (3 tasks)

Initial configuration and environment preparation.

- [x] T001 [S0001] Verify prerequisites: run `npm test` and `npm run lint` pass
- [x] T002 [S0001] Create test directory structure (`__tests__/hooks/`)
- [x] T003 [S0001] Read existing hook implementation and identify change points

---

## Foundation (5 tasks)

Core structures, types, and constants.

- [x] T004 [S0001] [P] Add retry/timeout constants to `hooks/useFramePreload.ts`
  - `MAX_RETRIES = 3`
  - `RETRY_DELAYS = [1000, 2000, 4000]` (exponential backoff)
  - `OVERALL_TIMEOUT = 30000` (30 seconds)
  - `SUCCESS_THRESHOLD = 0.8` (80%)

- [x] T005 [S0001] [P] Add internal tracking types/interfaces to hook
  - `RetryEntry` interface: `{ url: string, attempts: number, timeoutId?: NodeJS.Timeout }`
  - `PreloadStats` interface: `{ attemptedCount: number, successCount: number, failedUrls: Map<string, number> }`

- [x] T006 [S0001] Add new refs for tracking state
  - `retryTimeouts: useRef<Set<NodeJS.Timeout>>`
  - `overallTimeout: useRef<NodeJS.Timeout | null>`
  - `failedUrls: useRef<Map<string, number>>` (url -> retry count)
  - `attemptedCount: useRef<number>`
  - `successCount: useRef<number>`

- [x] T007 [S0001] Create helper function: `calculateBackoffDelay(attempt: number)`
  - Returns delay based on attempt number: 1000 * 2^(attempt-1)
  - Capped at max retry delay

- [x] T008 [S0001] Create helper function: `shouldComplete()`
  - Checks if all frames attempted
  - Checks 80% success threshold
  - Returns boolean indicating completion ready

---

## Implementation (8 tasks)

Main feature logic modifications.

- [x] T009 [S0001] Refactor `loadImage` to track attempts vs successes
  - Increment `attemptedCount` on both success AND failure
  - Only increment `successCount` on actual success
  - Remove URL from in-flight on both success and error

- [x] T010 [S0001] Implement retry scheduling in `onerror` handler
  - Check if url has retries remaining (< MAX_RETRIES)
  - If yes: schedule retry with exponential backoff
  - If no: mark as permanently failed, increment attemptedCount
  - Store timeout ID in `retryTimeouts` ref for cleanup

- [x] T011 [S0001] Create `retryLoad(url: string, attempt: number)` function
  - Create new Image element for retry
  - On success: increment successCount, update progress
  - On failure: recursively schedule next retry or give up
  - Check isMounted.current before all state updates

- [x] T012 [S0001] Implement 30-second overall timeout
  - Set timeout in `startPreload` function
  - Store timeout ID in `overallTimeout` ref
  - On timeout: force completion regardless of pending loads
  - Clear timeout on normal completion

- [x] T013 [S0001] Implement 80% success threshold early completion
  - In completion check: if successCount >= 80% of totalCount
  - AND all non-retrying frames attempted
  - Trigger early completion, cancel pending retries

- [x] T014 [S0001] Refactor completion logic in useEffect
  - Change from `loadedCount === totalCount` to `attemptedCount === totalCount`
  - Add check for 80% threshold condition
  - Add check for timeout condition
  - Ensure only one completion path executes

- [x] T015 [S0001] Implement comprehensive cleanup on unmount
  - Clear overall timeout (`overallTimeout.current`)
  - Clear all retry timeouts (iterate `retryTimeouts` Set)
  - Set `isMounted.current = false` FIRST (before clearing)
  - Clear the retry timeout Set

- [x] T016 [S0001] Update progress calculation and callbacks
  - Progress based on `successCount / totalCount`
  - Fire progress callback with updated value
  - Ensure backward compatibility with existing API

---

## Testing (8 tasks)

Unit tests and validation.

- [x] T017 [S0001] Create test file with MockImage class and setup
  - Create `__tests__/hooks/useFramePreload.test.ts`
  - Implement MockImage class with configurable success/failure
  - Add vitest setup with fake timers
  - Mock requestIdleCallback

- [x] T018 [S0001] [P] Write tests: basic error handling
  - `test_single_failure_completes`: One image fails, hook completes
  - `test_multiple_failures_complete`: 50% images fail, hook completes
  - `test_backward_compatibility`: Existing usage patterns work

- [x] T019 [S0001] [P] Write tests: retry logic
  - `test_retry_succeeds`: Image fails first attempt, succeeds on retry
  - `test_max_retries_exhausted`: Image fails all 3 retries, hook completes
  - `test_exponential_backoff_timing`: Verify 1s, 2s, 4s delays

- [x] T020 [S0001] [P] Write tests: timeout and threshold
  - `test_timeout_forces_completion`: Slow loads exceed 30s, hook completes
  - `test_80_percent_threshold`: At 80%+ success, completes without waiting

- [x] T021 [S0001] [P] Write tests: cleanup and edge cases
  - `test_unmount_cancels_retries`: Unmount clears all pending operations
  - `test_progress_updates_correctly`: Progress reflects successful loads only
  - `test_empty_frames_array`: Should complete immediately

- [x] T022 [S0001] Run full test suite and fix any failures
  - Execute `npm test`
  - Verify all 590+ existing tests still pass
  - Fix any regressions introduced

- [x] T023 [S0001] Run lint and type-check
  - Execute `npm run lint`
  - Execute `npm run type-check`
  - Fix any lint warnings or type errors

- [x] T024 [S0001] Validate ASCII encoding and final build
  - Check all modified files for ASCII-only characters (0-127)
  - Verify Unix LF line endings
  - Run `npm run build` to confirm production build succeeds

---

## Completion Checklist

Before marking session complete:

- [x] All 24 tasks marked `[x]`
- [x] All tests passing (590+ existing + 14 new = 604 total)
- [x] Zero lint warnings
- [x] Zero type errors
- [x] All files ASCII-encoded
- [x] `npm run build` succeeds
- [x] implementation-notes.md updated
- [x] Ready for `/validate`

---

## Notes

### Parallelization
Tasks marked `[P]` can be worked on simultaneously:
- T004, T005 (foundation types/constants)
- T018, T019, T020, T021 (test categories can be written in parallel)

### Critical Path
The following tasks are sequential dependencies:
1. T001-T003 (setup) must complete first
2. T004-T008 (foundation) before implementation
3. T009-T016 (implementation) in order - each builds on previous
4. T017 (test setup) before T18-T21 (test writing)
5. T22-T24 (validation) must be last

### Key Risk Areas
- **Race conditions on unmount**: T015 must set isMounted=false before clearing timeouts
- **Retry stacking**: Limit concurrent retries to prevent resource exhaustion
- **Timer cleanup**: Every setTimeout must be tracked and cleared

### ASCII Encoding Reminder
All source files must use ASCII-only characters (0-127). Common violations:
- Smart quotes ("") - use straight quotes ("")
- Em-dashes (-) - use double hyphens (--)
- Ellipsis (...) - use three periods (...)

---

## Next Steps

Run `/implement` to begin AI-led task-by-task implementation.
