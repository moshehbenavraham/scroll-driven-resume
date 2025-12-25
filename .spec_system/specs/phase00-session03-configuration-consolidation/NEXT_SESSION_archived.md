# NEXT_SESSION.md

## Session Recommendation

**Generated**: 2025-12-24
**Project State**: Phase 00 - Code Audit Remediation
**Completed Sessions**: 2 of 6

---

## Recommended Next Session

**Session ID**: `phase00-session03-configuration-consolidation`
**Session Name**: Configuration Consolidation
**Estimated Duration**: 2-3 hours
**Estimated Tasks**: ~15
**Priority**: P1 - Should Fix

---

## Why This Session Next?

### Prerequisites Met
- [x] Session 01: Frame Preload Error Handling (completed 2025-12-24)
- [x] Session 02: Texture Loader Refactor (completed 2025-12-24)

### Dependencies
- **Builds on**: Sessions 01-02 established stable preload and texture loading
- **Enables**: Session 04 (Documentation Alignment) requires env var standardization from this session

### Project Progression

Session 03 is the natural next step in the P1 remediation work:

1. **Logical Order**: P0 reliability issues (Sessions 01-02) are resolved. Session 03 addresses P1 configuration drift.
2. **Blocking Dependency**: Session 04 (Documentation) cannot proceed until env vars are standardized - docs must match the final configuration.
3. **Technical Debt Reduction**: Eliminates duplicate `SEQUENCE_FRAME_COUNTS` definitions that could cause future inconsistencies.
4. **Single Source of Truth**: Establishes `types/animation.ts:FRAME_COUNTS` as canonical, preventing future drift.

---

## Session Overview

### Objective
Consolidate frame count configuration and environment variables to single sources of truth, eliminating duplicate definitions and configuration drift.

### Key Deliverables
1. Single `FRAME_COUNTS` source in `types/animation.ts`
2. All hooks import from `types/animation.ts` (no local definitions)
3. Standardized `NEXT_PUBLIC_ASSET_BASE_URL` usage with `/assets` prefix
4. Updated `lib/frame-utils.ts` with consistent URL generation
5. `.env.example` file with documented variables
6. All existing tests pass

### Scope Summary
- **In Scope (MVP)**: Remove duplicate frame count definitions, standardize env vars, create .env.example
- **Out of Scope**: Documentation updates (Session 04), test environment changes (Session 05), new config options

---

## Technical Considerations

### Technologies/Patterns
- TypeScript barrel exports and re-exports
- Next.js environment variable conventions (`NEXT_PUBLIC_*`)
- Single source of truth pattern for configuration

### Files to Modify
- `hooks/useUnifiedFrameAnimation.ts` - Remove `SEQUENCE_FRAME_COUNTS`
- `hooks/useFrameSequence.ts` - Remove `SEQUENCE_FRAME_COUNTS`
- `lib/frame-utils.ts` - Standardize env var usage
- Root `.env.example` - Create with documented variables

### Potential Challenges
- **Import cycles**: Ensure `types/animation.ts` doesn't create circular dependencies
- **Build verification**: Changes to frame counts could affect static builds if types change
- **Env var migration**: Must ensure both dev and production environments are updated

---

## Current State Analysis

### Configuration Drift Identified (from audit)
```
Frame counts exist in multiple places:
- types/animation.ts:412 exports FRAME_COUNTS (canonical source)
- hooks/useUnifiedFrameAnimation.ts:32 defines SEQUENCE_FRAME_COUNTS
- hooks/useFrameSequence.ts:30 also defines SEQUENCE_FRAME_COUNTS

Env var confusion:
- Docs emphasize NEXT_PUBLIC_ASSET_BASE_URL (with /assets)
- Runtime uses NEXT_PUBLIC_FRAME_BASE_URL (without /assets)
```

### PRD Design Decision
> **Environment variable standardization: Use `NEXT_PUBLIC_ASSET_BASE_URL` with `/assets` prefix**
> Rationale: Aligns with Nginx proxy path (`/assets/*`); more semantic than frame-specific naming

---

## Alternative Sessions

If this session is blocked:

1. **Session 05: Test Environment Improvements** - Could be done in parallel since it focuses on test mocking, not configuration. However, it's lower priority (P2) and Session 03 is quick (2-3 hours).

2. **Session 06: Code Quality Polish** - Depends on Sessions 01-05 being complete. Not recommended.

---

## Success Criteria

- [ ] Single `FRAME_COUNTS` definition in `types/animation.ts`
- [ ] No duplicate `SEQUENCE_FRAME_COUNTS` definitions in codebase
- [ ] All frame count usages import from `types/animation.ts`
- [ ] `NEXT_PUBLIC_ASSET_BASE_URL` is the only asset env var
- [ ] URL generation in `lib/frame-utils.ts` uses `/assets` prefix
- [ ] `.env.example` created with documented variables
- [ ] All existing unit tests pass
- [ ] `npm run lint` passes with zero warnings
- [ ] `npm run type-check` passes with no errors
- [ ] `npm run build` succeeds

---

## Next Steps

Run `/sessionspec` to generate the formal task specification.
