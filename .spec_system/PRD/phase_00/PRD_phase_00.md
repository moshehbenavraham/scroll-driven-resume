# PRD Phase 00: Code Audit Remediation

**Status**: In Progress
**Sessions**: 6 (initial estimate)
**Estimated Duration**: 2-3 days

**Progress**: 3/6 sessions (50%)

---

## Overview

Phase 00 addresses critical reliability issues identified in the code audit (2025-12-24). The audit revealed that the animation/loading pipeline has P0 issues that can strand users behind loading overlays, P1 resource leaks and configuration drift, and P2 test environment noise that can mask real issues. This phase remediates all findings while maintaining the existing high standards (strict TypeScript, zero ESLint warnings, 98%+ test coverage).

---

## Progress Tracker

| Session | Name | Status | Est. Tasks | Validated |
|---------|------|--------|------------|-----------|
| 01 | Frame Preload Error Handling | Complete | 24 | 2025-12-24 |
| 02 | Texture Loader Refactor | Complete | 24 | 2025-12-24 |
| 03 | Configuration Consolidation | Complete | 20 | 2025-12-25 |
| 04 | Documentation Alignment | Not Started | ~15 | - |
| 05 | Test Environment Improvements | Not Started | ~20 | - |
| 06 | Code Quality Polish | Not Started | ~15 | - |

---

## Completed Sessions

- Session 01: Frame Preload Error Handling (P0 - Critical) - Completed 2025-12-24
- Session 02: Texture Loader Refactor (P1 - Resource Leaks) - Completed 2025-12-24
- Session 03: Configuration Consolidation (P1 - Config Drift) - Completed 2025-12-25

---

## Upcoming Sessions

- Session 04: Documentation Alignment (P1 - Doc Drift)

---

## Objectives

1. **Fix P0 critical reliability issue** - Ensure `useFramePreload` completion progresses even when frames fail to load
2. **Fix P1 resource leaks** - Refactor `useTextureLoader` to eliminate polling and cache failures properly
3. **Fix P1 configuration drift** - Consolidate frame counts and environment variables to single sources of truth
4. **Fix P1 documentation drift** - Update all docs to match actual runtime behavior
5. **Address P2 test noise** - Reduce test environment warnings for cleaner CI signal
6. **Address P2 code quality** - Remove lint suppressions and clean up barrel exports

---

## Prerequisites

- Phase 00 is the first phase (remediation before new features)
- Existing codebase passes all checks: `npm run lint`, `npm run type-check`, `npm test`
- 590 unit tests and E2E suite provide safety net for refactoring

---

## Technical Considerations

### Architecture
- Frame animation pipeline: `useFramePreload` → `useTextureLoader` → `FramePlane`
- Loading overlay dismissal depends on preload completion callbacks
- WebGL/canvas fallback rendering paths must both be maintained

### Technologies
- React 19 hooks patterns for state and cleanup
- Three.js texture management with LRU eviction
- Vitest for unit testing, Playwright for E2E
- Next.js App Router with static prerender

### Risks
- **Regression risk**: Changes to preload/texture hooks could break existing animation behavior
  - Mitigation: Comprehensive existing test suite (590 tests); add targeted tests for error paths
- **Cache behavior changes**: Modifying texture loader caching could affect GPU memory usage
  - Mitigation: Test on lower-memory devices; maintain LRU eviction logic
- **Documentation drift recurrence**: Manual docs can drift again over time
  - Mitigation: Consider adding doc generation or validation in CI (future phase)

---

## Success Criteria

Phase complete when:
- [ ] All 6 sessions completed and validated
- [x] `useFramePreload` handles frame failures gracefully (P0 resolved)
- [x] No `setInterval` polling in `useTextureLoader` (P1 resolved)
- [x] Single `FRAME_COUNTS` export used everywhere (P1 resolved)
- [x] Single asset env var story documented and implemented (P1 resolved)
- [ ] Docs match actual env var and version usage (P1 resolved)
- [ ] Test output has reduced stderr noise (P2)
- [ ] No inline lint suppressions for import issues (P2)
- [ ] `npm run lint` passes with zero warnings
- [ ] `npm run type-check` passes with no errors
- [ ] `npm test` passes (590+ tests)

---

## Dependencies

### Depends On
- None (Phase 00 is remediation before new features)

### Enables
- Future phases can proceed on a stable, well-documented foundation
