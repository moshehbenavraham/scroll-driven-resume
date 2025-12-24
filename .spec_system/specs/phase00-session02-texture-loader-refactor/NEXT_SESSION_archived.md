# NEXT_SESSION.md

## Session Recommendation

**Generated**: 2025-12-24
**Project State**: Phase 00 - Code Audit Remediation
**Completed Sessions**: 1 of 6

---

## Recommended Next Session

**Session ID**: `phase00-session02-texture-loader-refactor`
**Session Name**: Texture Loader Refactor
**Estimated Duration**: 3-4 hours
**Estimated Tasks**: ~25
**Priority**: P1 - Should Fix

---

## Why This Session Next?

### Prerequisites Met
- [x] Session 01 completed (phase00-session01-frame-preload-error-handling)
- [x] Existing tests pass (confirmed via prior session completion)
- [x] Understand current `useTextureLoader` implementation

### Dependencies
- **Builds on**: Session 01 (Frame Preload Error Handling) - error handling patterns established
- **Enables**: Session 03 (Configuration Consolidation) - clean loader needed before consolidating config

### Project Progression

Session 02 is the logical next step in the Code Audit Remediation phase. The Phase 00 roadmap follows a clear priority hierarchy:

1. **P0 (Critical)**: Session 01 - Frame preload reliability ✅ DONE
2. **P1 (Should Fix)**: Sessions 02, 03, 04 - Resource leaks, config drift, docs
3. **P2 (Nice-to-Have)**: Sessions 05, 06 - Test environment, code polish

With P0 resolved, we now address the P1 resource leak in `useTextureLoader`. This hook has a `setInterval` polling pattern that can:
- Run indefinitely if a frame fails to load
- Continue running after component unmount (memory leak)
- Cause CPU waste from constant polling

This must be fixed before moving to configuration consolidation (Session 03) because:
1. Both hooks share frame-loading infrastructure
2. Session 03's env var changes affect URL generation in texture loading
3. We need a stable, leak-free loader before changing its configuration

---

## Session Overview

### Objective

Refactor `useTextureLoader` to eliminate polling-based concurrent load handling, prevent resource leaks, and properly cache failed loads as terminal states.

### Key Deliverables

1. **Promise-based deduplication**: Replace `setInterval` polling with a `loadingPromises` Map registry
2. **Failure caching**: Cache failed loads as terminal states to prevent infinite polling
3. **Proper cleanup**: Track all async resources in refs, clear on unmount
4. **LRU preservation**: Maintain existing GPU texture eviction logic
5. **Test coverage**: Add unit tests for concurrent loads and failure caching (8+ new tests)

### Scope Summary

- **In Scope (MVP)**: Promise registry, failure states, cleanup, LRU, tests
- **Out of Scope**: Configuration changes (Session 03), GPU memory optimization, WebGL context recovery

---

## Technical Considerations

### Technologies/Patterns

- React hooks with proper cleanup (`useEffect` return)
- Promise-based async deduplication pattern
- TypeScript strict mode with proper typing
- Three.js `Texture` management
- Vitest for unit testing

### Key Interface

```typescript
interface CachedTexture {
  texture: THREE.Texture | null;
  failed: boolean;
  timestamp: number;
}

// loadingPromises: Map<number, Promise<CachedTexture>>
```

### Potential Challenges

1. **Race conditions**: Multiple concurrent requests for same frame index must coalesce correctly
2. **Cleanup timing**: Unmount during active loads requires careful promise cancellation
3. **LRU interaction**: Failure states should still participate in eviction to prevent cache bloat
4. **GPU memory**: Must dispose textures properly when evicted from cache

### Files to Modify

- `hooks/useTextureLoader.ts` - Primary refactor target
- `hooks/useTextureLoader.test.ts` - Add new test cases

---

## Alternative Sessions

If this session is blocked:

1. **Session 03 (Configuration Consolidation)** - Can run if loader refactor is blocked, but will require revisiting loader afterward
2. **Session 04 (Documentation Alignment)** - Docs-only changes, can run independently if code changes blocked

---

## Success Criteria

- [ ] No `setInterval` polling in `useTextureLoader`
- [ ] Concurrent loads for same index deduplicated via promise registry
- [ ] Failed loads cached as terminal states (no retry loops)
- [ ] All async resources cleaned up on unmount
- [ ] LRU eviction logic preserved and working
- [ ] All existing unit tests pass
- [ ] New unit tests cover concurrent load scenarios (5+ new tests)
- [ ] New unit tests cover failure caching (3+ new tests)
- [ ] `npm run lint` passes with zero warnings
- [ ] `npm run type-check` passes with no errors

---

## Next Steps

Run `/sessionspec` to generate the formal specification with detailed task breakdown.
