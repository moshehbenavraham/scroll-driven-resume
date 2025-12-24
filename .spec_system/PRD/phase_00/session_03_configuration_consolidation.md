# Session 03: Configuration Consolidation

**Session ID**: `phase00-session03-configuration-consolidation`
**Status**: Not Started
**Estimated Tasks**: ~15
**Estimated Duration**: 2-3 hours
**Priority**: P1 - Should Fix

---

## Objective

Consolidate frame count configuration and environment variables to single sources of truth, eliminating duplicate definitions and configuration drift.

---

## Scope

### In Scope (MVP)
- Designate `types/animation.ts:FRAME_COUNTS` as the canonical source
- Remove duplicate `SEQUENCE_FRAME_COUNTS` from `hooks/useUnifiedFrameAnimation.ts`
- Remove duplicate `SEQUENCE_FRAME_COUNTS` from `hooks/useFrameSequence.ts`
- Standardize on `NEXT_PUBLIC_ASSET_BASE_URL` with `/assets` prefix
- Update `lib/frame-utils.ts` to use standardized env var
- Add `.env.example` with documented env vars
- Verify all imports use the canonical source

### Out of Scope
- Documentation updates (Session 04)
- Test environment changes (Session 05)
- Adding new configuration options
- Runtime configuration validation

---

## Prerequisites

- [ ] Sessions 01 and 02 completed (or parallel if isolated)
- [ ] Understand current frame count definitions across codebase
- [ ] Review current env var usage in `lib/frame-utils.ts`
- [ ] Existing tests pass (`npm test`)

---

## Deliverables

1. Single `FRAME_COUNTS` source in `types/animation.ts`
2. All hooks import from `types/animation.ts`
3. Standardized `NEXT_PUBLIC_ASSET_BASE_URL` usage
4. Updated `lib/frame-utils.ts` with consistent URL generation
5. `.env.example` file with documented variables
6. All existing tests still pass

---

## Technical Details

### Current Issue (from audit)
Frame counts exist in multiple places:
- `types/animation.ts:412` exports `FRAME_COUNTS` (canonical source)
- `hooks/useUnifiedFrameAnimation.ts:32` defines `SEQUENCE_FRAME_COUNTS`
- `hooks/useFrameSequence.ts:30` also defines `SEQUENCE_FRAME_COUNTS`

Env var confusion:
- Docs emphasize `NEXT_PUBLIC_ASSET_BASE_URL` (with `/assets`)
- Runtime uses `NEXT_PUBLIC_FRAME_BASE_URL` (without `/assets`)

### Solution Approach
1. Audit all `SEQUENCE_FRAME_COUNTS` and `FRAME_COUNTS` usages
2. Update imports to use `types/animation.ts`
3. Remove duplicate definitions
4. Standardize on `NEXT_PUBLIC_ASSET_BASE_URL`
5. Update URL generation to include `/assets` prefix consistently
6. Create `.env.example` with:
   ```
   # Asset serving base URL (MinIO via Nginx)
   NEXT_PUBLIC_ASSET_BASE_URL=http://localhost:8089/assets
   ```

### Design Decision (from PRD)
> **Environment variable standardization: Use `NEXT_PUBLIC_ASSET_BASE_URL` with `/assets` prefix**
> Rationale: Aligns with Nginx proxy path (`/assets/*`); more semantic than frame-specific naming

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
