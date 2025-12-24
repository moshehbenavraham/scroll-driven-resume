# Session 04: Documentation Alignment

**Session ID**: `phase00-session04-documentation-alignment`
**Status**: Not Started
**Estimated Tasks**: ~15
**Estimated Duration**: 2-3 hours
**Priority**: P1 - Should Fix

---

## Objective

Update all documentation to accurately reflect the actual runtime configuration, framework versions, and deployment setup, eliminating drift between docs and code.

---

## Scope

### In Scope (MVP)
- Update Next.js version references (15 → 16) in all docs
- Align asset env var documentation with Session 03 changes
- Update `.env` handling documentation (`.gitignore` behavior)
- Clarify Docker Node version vs docs (20+ vs 22)
- Update `docs/ASSET_URLS.md` to match runtime URL generation
- Update `docs/environments.md` with accurate env var list
- Update `docs/ARCHITECTURE.md` if needed
- Review and update README if needed

### Out of Scope
- Adding new documentation
- Implementing doc generation/validation in CI (future phase)
- API documentation
- Storybook or component documentation

---

## Prerequisites

- [ ] Session 03 completed (env var standardization done)
- [ ] Current env var and configuration state is final
- [ ] Existing tests pass (`npm test`)

---

## Deliverables

1. Updated `docs/ASSET_URLS.md` matching runtime behavior
2. Updated `docs/environments.md` with accurate env vars
3. Updated `docs/ARCHITECTURE.md` with correct Next.js version
4. Updated README.md with correct versions and setup
5. All version references aligned across docs

---

## Technical Details

### Current Issues (from audit)
- **Next.js version drift**: docs mention Next.js 15, repo uses Next.js 16
- **Asset env var naming drift**:
  - docs emphasize `NEXT_PUBLIC_ASSET_BASE_URL` (with `/assets`)
  - runtime uses `NEXT_PUBLIC_FRAME_BASE_URL` (without `/assets`)
- **`.env` handling drift**: docs describe `.env` as committed, but `.gitignore` ignores it
- **Docker node version vs docs**: docs require Node 20+, Docker uses Node 22

### Solution Approach
1. Search all markdown files for "Next.js 15" and update to "Next.js 16"
2. Update all env var references to use `NEXT_PUBLIC_ASSET_BASE_URL`
3. Update `.env` documentation to reflect gitignore behavior
4. Add note about Node 22 in Docker
5. Cross-reference all changes with Session 03 env var standardization

### Files to Review
- `docs/ASSET_URLS.md`
- `docs/environments.md`
- `docs/ARCHITECTURE.md`
- `README.md`
- Any other `.md` files with version references

---

## Success Criteria

- [ ] All docs reference Next.js 16 (not 15)
- [ ] All docs use `NEXT_PUBLIC_ASSET_BASE_URL` consistently
- [ ] `.env` handling documented correctly (gitignored, use `.env.example`)
- [ ] Node version documented accurately (22 in Docker)
- [ ] `docs/ASSET_URLS.md` matches actual URL generation
- [ ] `docs/environments.md` has accurate env var list
- [ ] No stale or conflicting version references
- [ ] README setup instructions work as documented
