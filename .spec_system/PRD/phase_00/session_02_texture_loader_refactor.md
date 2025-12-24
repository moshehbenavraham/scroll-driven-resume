# Session 02: Texture Loader Refactor

**Session ID**: `phase00-session02-texture-loader-refactor`
**Status**: Not Started
**Estimated Tasks**: ~25
**Estimated Duration**: 3-4 hours
**Priority**: P1 - Should Fix

---

## Objective

Refactor `useTextureLoader` to eliminate polling-based concurrent load handling, prevent resource leaks, and properly cache failed loads as terminal states.

---

## Scope

### In Scope (MVP)
- Replace `setInterval` polling with per-index promise registry for deduplication
- Cache failed loads as terminal states to prevent infinite polling
- Track intervals in refs and clear on component unmount
- Maintain existing LRU eviction logic for GPU texture pool
- Add proper cleanup in useEffect for all timers/intervals
- Add targeted unit tests for concurrent load scenarios
- Add tests for failure caching

### Out of Scope
- Changes to frame preload (Session 01)
- Configuration consolidation (Session 03)
- GPU memory optimization beyond current LRU
- WebGL context recovery

---

## Prerequisites

- [ ] Session 01 completed (or can run in parallel if isolated)
- [ ] Understand current `useTextureLoader` implementation (`hooks/useTextureLoader.ts`)
- [ ] Review LRU eviction logic
- [ ] Existing tests pass (`npm test`)

---

## Deliverables

1. Refactored `useTextureLoader` with promise-based deduplication
2. Failure caching mechanism (terminal states)
3. Proper useEffect cleanup for all async resources
4. Unit tests for concurrent load scenarios
5. Unit tests for failure caching
6. All existing tests still pass

---

## Technical Details

### Current Issue (from audit)
In `hooks/useTextureLoader.ts` (lines 102-112), when a frame is "already loading", the code starts a `setInterval` polling loop waiting for `img.complete`. This interval can run indefinitely:
1. **Failed loads**: Image is never added to cache, interval never finds complete image
2. **Component unmount**: Interval continues running (not tracked in refs)

### Solution Approach
1. Create a `loadingPromises` Map to track in-flight loads by frame index
2. When a load is requested:
   - If already in cache → return cached result
   - If already loading → return existing promise from `loadingPromises`
   - Otherwise → create new promise, store in `loadingPromises`, start load
3. On load complete (success or failure):
   - Remove from `loadingPromises`
   - Add to cache (including failures as terminal states with error flag)
4. Track all async resources in refs for cleanup
5. Clear all resources on unmount

### Key Interfaces
```typescript
interface CachedTexture {
  texture: THREE.Texture | null;
  failed: boolean;
  timestamp: number;
}

// loadingPromises: Map<number, Promise<CachedTexture>>
```

---

## Success Criteria

- [ ] No `setInterval` polling in `useTextureLoader`
- [ ] Concurrent loads for same index deduplicated via promise registry
- [ ] Failed loads cached as terminal states (no retry loops)
- [ ] All async resources cleaned up on unmount
- [ ] LRU eviction logic preserved and working
- [ ] All existing unit tests pass
- [ ] New unit tests cover concurrent load scenarios (≥5 new tests)
- [ ] New unit tests cover failure caching (≥3 new tests)
- [ ] `npm run lint` passes with zero warnings
- [ ] `npm run type-check` passes with no errors
