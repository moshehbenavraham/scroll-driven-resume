# Session Specification

**Session ID**: `phase00-session02-texture-loader-refactor`
**Phase**: 00 - Code Audit Remediation
**Status**: Not Started
**Created**: 2025-12-24

---

## 1. Session Overview

This session addresses a P1 (Should Fix) resource leak in the `useTextureLoader` hook. The current implementation uses a `setInterval` polling pattern to handle concurrent load requests for the same frame index. This polling approach has critical flaws: intervals run indefinitely when images fail to load, continue running after component unmount, and waste CPU cycles with constant polling.

The refactor replaces this anti-pattern with a promise-based deduplication registry. When multiple components request the same frame simultaneously, they share a single loading promise rather than spawning independent polling intervals. Failed loads are cached as terminal states, preventing infinite retry loops. All async resources are properly tracked in refs and cleaned up on unmount.

This session is the logical successor to Session 01 (Frame Preload Error Handling), building on the error-handling patterns established there. It must be completed before Session 03 (Configuration Consolidation) because both sessions touch frame-loading infrastructure, and we need a stable, leak-free loader before changing its configuration.

---

## 2. Objectives

1. Eliminate `setInterval` polling by implementing promise-based load deduplication
2. Cache failed loads as terminal states to prevent infinite retry loops
3. Track all async resources (intervals, timeouts, idle callbacks) in refs for proper cleanup
4. Preserve existing LRU eviction logic for GPU texture pool management
5. Create comprehensive unit test suite for concurrent loads and failure scenarios

---

## 3. Prerequisites

### Required Sessions
- [x] `phase00-session01-frame-preload-error-handling` - Error handling patterns and reliability improvements

### Required Tools/Knowledge
- React hooks lifecycle (useEffect cleanup patterns)
- Promise-based async deduplication
- Three.js Texture management and disposal
- Vitest testing framework
- TypeScript strict mode

### Environment Requirements
- Node.js with npm
- All project dependencies installed (`npm install`)
- Existing tests passing (`npm test`)

---

## 4. Scope

### In Scope (MVP)
- Replace `setInterval` polling (lines 103-110) with `loadingPromises` Map registry
- Add `CachedTexture` interface with `failed` boolean for terminal states
- Track failed loads in cache to prevent retry loops
- Track idle callbacks and timeouts in refs for cleanup
- Add cleanup in useEffect return for all async resources
- Maintain LRU eviction logic for GPU textures
- Create new test file `hooks/useTextureLoader.test.ts`
- Add unit tests for concurrent load deduplication (5+ tests)
- Add unit tests for failure caching (3+ tests)
- Ensure all lint and type-check passes

### Out of Scope (Deferred)
- GPU memory optimization beyond current LRU - *Reason: Future optimization, not a bug*
- WebGL context recovery - *Reason: Edge case, separate session*
- Configuration changes - *Reason: Session 03 scope*
- Changes to frame preload logic - *Reason: Session 01 scope*

---

## 5. Technical Approach

### Architecture

The core change replaces the polling-based concurrent load handling with a promise registry pattern:

```
Current Flow (Problematic):
Request A for frame 5 --> Start loading
Request B for frame 5 --> setInterval polling for completion
Request C for frame 5 --> setInterval polling for completion
(If load fails, intervals run forever)

New Flow (Promise Registry):
Request A for frame 5 --> Create promise, store in loadingPromises
Request B for frame 5 --> Return same promise from loadingPromises
Request C for frame 5 --> Return same promise from loadingPromises
(Promise resolves/rejects once, all waiters notified)
```

### Design Patterns
- **Promise Deduplication**: Single promise per in-flight request, shared by all waiters
- **Terminal State Caching**: Failed loads cached with error flag, no retries
- **LRU Cache**: Existing pattern preserved for GPU texture pool management
- **Cleanup Refs**: All async handles stored in refs for unmount cleanup

### Technology Stack
- React 18 (hooks: useState, useRef, useEffect, useCallback)
- Three.js r158+ (Texture, dispose)
- TypeScript 5.x (strict mode)
- Vitest (unit testing)

---

## 6. Deliverables

### Files to Create
| File | Purpose | Est. Lines |
|------|---------|------------|
| `hooks/useTextureLoader.test.ts` | Comprehensive unit tests for texture loader | ~300 |

### Files to Modify
| File | Changes | Est. Lines Changed |
|------|---------|------------|
| `hooks/useTextureLoader.ts` | Promise registry, failure caching, cleanup | ~80 |

---

## 7. Success Criteria

### Functional Requirements
- [ ] No `setInterval` polling in `useTextureLoader`
- [ ] Concurrent loads for same frame index deduplicated via promise registry
- [ ] Failed loads cached as terminal states (no retry loops)
- [ ] All async resources (timeouts, idle callbacks) cleaned up on unmount
- [ ] LRU eviction logic preserved and functional
- [ ] Failure states participate in LRU eviction

### Testing Requirements
- [ ] Create `hooks/useTextureLoader.test.ts` test file
- [ ] Unit tests for concurrent load scenarios (>=5 new tests)
- [ ] Unit tests for failure caching (>=3 new tests)
- [ ] All existing project tests pass
- [ ] Test coverage for edge cases (unmount during load, rapid requests)

### Quality Gates
- [ ] `npm run lint` passes with zero warnings
- [ ] `npm run type-check` passes with no errors
- [ ] All files ASCII-encoded (0-127)
- [ ] Unix LF line endings
- [ ] Code follows project conventions (ESLint, Prettier)

---

## 8. Implementation Notes

### Key Considerations

1. **Promise Registry Location**: Use `useRef<Map<number, Promise<CachedTexture>>>` to persist across renders without triggering re-renders

2. **CachedTexture Interface**: Extend the cache to track failure state:
   ```typescript
   interface CachedTexture {
     texture: THREE.Texture | null;
     failed: boolean;
     timestamp: number;
   }
   ```

3. **Failure State in LRU**: Failed entries should still participate in LRU eviction to prevent cache bloat from failed loads

4. **Cleanup Order**: On unmount, cancel pending loads before disposing textures

5. **RequestIdleCallback Tracking**: The current background loading uses `requestIdleCallback` (lines 295-310) - track the handle for cancellation

### Potential Challenges

- **Race Conditions**: Multiple concurrent requests for same frame must coalesce correctly - solved by checking `loadingPromises` before starting new load
- **Cleanup Timing**: Unmount during active loads requires careful promise handling - use abort pattern or mounted flag
- **LRU with Failures**: Ensure failure entries have minimal memory footprint while still occupying cache slots
- **Existing Tests**: No existing test file - must verify behavior through manual testing before and after refactor

### ASCII Reminder
All output files must use ASCII-only characters (0-127). No unicode quotes, dashes, or special characters.

---

## 9. Testing Strategy

### Unit Tests

**Concurrent Load Tests (5+ tests)**:
1. Two concurrent requests for same frame share single promise
2. Multiple concurrent requests all receive same result
3. Second request during loading gets existing promise (no new load started)
4. Promise resolves with correct texture for all waiters
5. Promise rejects with same error for all waiters on failure

**Failure Caching Tests (3+ tests)**:
1. Failed load cached with `failed: true`
2. Subsequent request for failed frame returns cached failure (no retry)
3. Failed entries participate in LRU eviction

**Cleanup Tests**:
1. Pending loads cleaned up on unmount
2. Idle callbacks cancelled on unmount
3. No state updates after unmount

### Integration Tests
- Texture loader works correctly within React component lifecycle
- Frame switching uses cached textures correctly

### Manual Testing
- Load portfolio site, scroll through frames
- Verify no console errors or warnings
- Check browser DevTools for memory stability
- Simulate network failure, verify no infinite loops

### Edge Cases
- Unmount during active load
- Rapid frame switching (many concurrent requests)
- Network timeout (slow failure)
- All frames failing to load
- Mixed success/failure scenario

---

## 10. Dependencies

### External Libraries
- `react`: ^18.2.0
- `three`: ^0.158.0
- `vitest`: ^1.0.0 (dev)
- `@testing-library/react`: ^14.0.0 (dev)

### Other Sessions
- **Depends on**: `phase00-session01-frame-preload-error-handling` (completed)
- **Depended by**: `phase00-session03-configuration-consolidation`

---

## Code Analysis

### Current Problem Code (`hooks/useTextureLoader.ts` lines 102-112)

```typescript
// Already loading
if (loadingRef.current.has(index)) {
  // Wait for existing load
  const checkInterval = setInterval(() => {
    const img = imageCacheRef.current.get(index);
    if (img && img.complete) {
      clearInterval(checkInterval);
      resolve(img);
    }
  }, 10);
  return;
}
```

**Issues**:
1. Interval never clears if image fails (not added to cache)
2. Interval not tracked in ref (continues after unmount)
3. No rejection path for waiting callers on failure

### Solution Pattern

```typescript
// Loading promises registry (add to refs)
const loadingPromisesRef = useRef<Map<number, Promise<CachedTexture>>>(new Map());

// In loadImage:
if (loadingPromisesRef.current.has(index)) {
  // Return existing promise - no polling needed
  return loadingPromisesRef.current.get(index)!;
}

// Create and store promise
const promise = new Promise<CachedTexture>((resolve, reject) => {
  // ... load logic
});
loadingPromisesRef.current.set(index, promise);
```

---

## Next Steps

Run `/tasks` to generate the implementation task checklist.
