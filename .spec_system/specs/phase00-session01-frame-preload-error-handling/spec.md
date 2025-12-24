# Session Specification

**Session ID**: `phase00-session01-frame-preload-error-handling`
**Phase**: 00 - Code Audit Remediation
**Status**: Not Started
**Created**: 2025-12-24
**Priority**: P0 - Critical

---

## 1. Session Overview

This session addresses a critical bug in the `useFramePreload` hook that can leave users stranded behind loading overlays indefinitely. The current implementation tracks `loadedCount` but only increments it on successful image loads. When `img.onerror` fires, the promise resolves but `loadedCount` is not incremented, meaning `loadedCount` never reaches `totalCount` and the completion callback never fires.

The fix involves tracking attempted loads separately from successful loads, implementing retry logic with exponential backoff for transient failures, and adding a 30-second timeout as a safety net. This ensures the loading experience completes gracefully even under adverse network conditions, with the option to proceed with partial content (80%+ success threshold).

This is the first session in Phase 00 (Code Audit Remediation) and establishes a foundation for subsequent reliability fixes. By resolving the P0 critical issue first, we deliver immediate value and enable clean validation of the P1/P2 fixes that follow.

---

## 2. Objectives

1. **Error-resilient completion**: `useFramePreload` completes even when individual frames fail to load
2. **Retry with backoff**: Failed frames are retried up to 3 times with exponential backoff (1s, 2s, 4s)
3. **Safety timeout**: Overall 30-second timeout prevents indefinite loading states
4. **Graceful degradation**: Proceed with partial content when 80%+ frames load successfully
5. **Clean resource management**: All in-flight loads, retries, and timeouts are cancelled on unmount

---

## 3. Prerequisites

### Required Sessions
- None (first session in phase)

### Required Tools/Knowledge
- React hooks patterns (useRef, useCallback, useEffect cleanup)
- Promise-based async patterns with cancellation
- Vitest testing framework for mocking Image objects

### Environment Requirements
- Node.js with npm (existing project setup)
- Existing tests pass: `npm test`
- Lint passes: `npm run lint`

---

## 4. Scope

### In Scope (MVP)
- Track `attemptedCount` and `successCount` separately
- Increment `attemptedCount` on both `onload` and `onerror`
- Trigger completion based on `attemptedCount === totalCount`
- Retry failed frames up to 3 times with exponential backoff (1s, 2s, 4s delays)
- Add 30-second overall timeout that forces completion
- Implement 80% success threshold for graceful degradation
- Add proper cleanup for retries and timeouts on unmount
- Add new unit tests for error scenarios (minimum 5 new tests)
- Maintain backward compatibility with existing hook API

### Out of Scope (Deferred)
- **Texture loader changes** - *Session 02*
- **Configuration consolidation** - *Session 03*
- **UI changes to loading overlay** - *Not in remediation scope*
- **Error reporting to external services** - *Future enhancement*
- **Retry UI feedback** - *Would require loading overlay changes*

---

## 5. Technical Approach

### Architecture

The refactored hook maintains the existing API but adds internal tracking for:

1. **Dual counter system**: `attemptedCount` (all attempts) vs `successCount` (successful loads)
2. **Retry queue**: Failed URLs tracked in a Map with retry count
3. **Timeout ref**: Overall 30s timeout stored in ref for cleanup
4. **Retry timeouts**: Individual retry timeouts stored in Set for cleanup

```
[startPreload]
     |
     v
[Load Priority Frames] --onerror--> [Track Failure, Schedule Retry]
     |                                       |
     v                                       v
[Load Background Frames] <--- [Retry with Backoff]
     |                                       |
     v                                       v
[attemptedCount === totalCount] <---+-------+
     |
     v
[Check Success Rate >= 80%]
     |
     v
[Fire onComplete / Graceful Degradation]
```

### Design Patterns
- **Ref-based cleanup**: All async resources (timeouts, retry handles) tracked in refs for deterministic cleanup
- **Exponential backoff**: Delay = 1000 * 2^(attemptNumber-1) ms
- **Promise-based retry**: Each retry creates new promise, allows cancellation via isMounted check

### Technology Stack
- React 19.2.3 (hooks: useState, useCallback, useRef, useEffect)
- TypeScript 5.x (strict mode)
- Vitest for unit testing

---

## 6. Deliverables

### Files to Create
| File | Purpose | Est. Lines |
|------|---------|------------|
| `__tests__/hooks/useFramePreload.test.ts` | Unit tests for error scenarios | ~200 |

### Files to Modify
| File | Changes | Est. Lines Changed |
|------|---------|------------|
| `hooks/useFramePreload.ts` | Add retry logic, dual counters, timeout | ~80 |
| `types/animation.ts` | Add PreloadStatus type (optional) | ~15 |

---

## 7. Success Criteria

### Functional Requirements
- [ ] `useFramePreload` completes when all frames have been attempted (success or failure)
- [ ] Failed frames are retried up to 3 times with exponential backoff
- [ ] Progress callback continues to fire during retries
- [ ] 30-second timeout forces completion regardless of frame status
- [ ] At 80%+ success rate, completion fires without waiting for retries
- [ ] Component unmount cancels all pending retries and timeouts
- [ ] Existing API remains backward compatible

### Testing Requirements
- [ ] Unit test: Single frame failure still completes
- [ ] Unit test: Multiple frame failures still complete
- [ ] Unit test: Retry succeeds on second attempt
- [ ] Unit test: Max retries (3) exhausted, then completes
- [ ] Unit test: 30-second timeout forces completion
- [ ] Unit test: 80% threshold triggers early completion
- [ ] Unit test: Unmount cancels retries and timeouts
- [ ] All 590+ existing tests still pass

### Quality Gates
- [ ] `npm run lint` passes with zero warnings
- [ ] `npm run type-check` passes with no errors
- [ ] `npm run build` succeeds
- [ ] All files ASCII-encoded (0-127)
- [ ] Unix LF line endings

---

## 8. Implementation Notes

### Key Considerations

1. **Backward compatibility**: The return type `UseFramePreloadReturn` must remain unchanged. Internally we add `attemptedCount` and `successCount`, but externally `loadedCount` continues to mean "successfully loaded" for progress calculation.

2. **Progress during retries**: When a frame fails and enters retry, we should NOT increment `loadedCount` until retry succeeds or exhausts. However, `attemptedCount` does increment, allowing completion to trigger.

3. **Completion vs progress semantics**:
   - `progress` = `successCount / totalCount * 100` (reflects actual successful loads)
   - Completion triggers when `attemptedCount === totalCount` AND either:
     - All retries exhausted, OR
     - 80%+ success rate achieved, OR
     - 30s timeout elapsed

### Potential Challenges

- **Race condition on unmount**: Must set `isMounted.current = false` before clearing timeout refs to prevent callbacks from running after unmount. Solution: Use synchronous check at start of all callbacks.

- **Retry stacking**: If network recovers slowly, multiple retries for different frames could stack. Solution: Limit concurrent retries (e.g., max 3 concurrent retry operations).

- **Timer reference cleanup**: Need to track all `setTimeout` handles in a Set and clear them on unmount.

### ASCII Reminder
All output files must use ASCII-only characters (0-127). Avoid smart quotes, em-dashes, and other Unicode characters in code and comments.

---

## 9. Testing Strategy

### Unit Tests

**File**: `__tests__/hooks/useFramePreload.test.ts`

1. **test_single_failure_completes**: One image fails, hook still completes
2. **test_multiple_failures_complete**: 50% images fail, hook completes
3. **test_retry_succeeds**: Image fails first attempt, succeeds on retry
4. **test_max_retries_exhausted**: Image fails all 3 retries, hook completes
5. **test_exponential_backoff_timing**: Verify 1s, 2s, 4s delays between retries
6. **test_timeout_forces_completion**: Slow loads exceed 30s, hook completes
7. **test_80_percent_threshold**: At 80%+ success, completes without waiting
8. **test_unmount_cancels_retries**: Unmount clears all pending operations
9. **test_progress_updates_correctly**: Progress reflects successful loads only
10. **test_backward_compatibility**: Existing usage patterns still work

### Mocking Strategy

```typescript
// Mock Image constructor
class MockImage {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  crossOrigin = "";

  private _src = "";
  get src() { return this._src; }
  set src(value: string) {
    this._src = value;
    // Simulate async load
    setTimeout(() => {
      if (value.includes("fail")) {
        this.onerror?.();
      } else {
        this.onload?.();
      }
    }, 10);
  }
}
```

### Manual Testing
- Load site with simulated slow network (Chrome DevTools throttling)
- Observe loading overlay dismisses even with frame 404s
- Verify animations play with missing frames (graceful degradation)

### Edge Cases
- Empty frames array (should complete immediately)
- All frames fail (should complete after retries exhaust)
- Unmount during retry backoff period
- Very fast success (under 100ms total load time)

---

## 10. Dependencies

### External Libraries
- react: 19.2.3
- vitest: existing version (for testing)

### Other Sessions
- **Depends on**: None
- **Depended by**:
  - Session 02 (Texture Loader Refactor) - can run in parallel
  - Session 03 (Configuration Consolidation) - can run in parallel

---

## Current Implementation Analysis

### Bug Location
**File**: `hooks/useFramePreload.ts`
**Lines**: 117-131 (onerror handler)

```typescript
img.onerror = () => {
  if (!isMounted.current) {
    return;
  }
  // Remove from in-flight
  inFlightUrls.current.delete(url);
  // Report error
  const error = new Error(`Failed to load image: ${url}`);
  onError?.(url, error);
  // Still resolve to continue loading other frames
  resolve();  // <-- BUG: Does not increment loadedCount!
};
```

### Completion Logic
**Lines**: 234-246

```typescript
if (
  loadedCount === totalCount &&  // <-- Never true if any frame fails
  totalCount > 0 &&
  !completionHandled.current
) {
  completionHandled.current = true;
  // ...
  onComplete?.();
}
```

---

## Next Steps

Run `/tasks` to generate the implementation task checklist.
