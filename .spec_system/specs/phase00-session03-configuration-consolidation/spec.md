# Session Specification

**Session ID**: `phase00-session03-configuration-consolidation`
**Phase**: 00 - Code Audit Remediation
**Status**: Not Started
**Created**: 2025-12-24
**Priority**: P1 - Should Fix
**Estimated Duration**: 2-3 hours
**Estimated Tasks**: ~15

---

## 1. Session Overview

This session eliminates configuration drift in the scroll-driven-resume codebase by establishing single sources of truth for frame counts and environment variables. The code audit identified duplicate `SEQUENCE_FRAME_COUNTS` definitions in two hooks that shadow the canonical `FRAME_COUNTS` export, creating maintenance risk and potential for inconsistency.

Additionally, environment variable naming is inconsistent: the runtime code uses `NEXT_PUBLIC_FRAME_BASE_URL` while documentation emphasizes `NEXT_PUBLIC_ASSET_BASE_URL`. The PRD design decision mandates standardizing on `NEXT_PUBLIC_ASSET_BASE_URL` with an `/assets` prefix to align with the Nginx proxy path.

This session is a prerequisite for Session 04 (Documentation Alignment), which cannot proceed until the configuration is finalized. The changes are low-risk refactoring with full test coverage to catch regressions.

---

## 2. Objectives

1. **Eliminate frame count duplication**: Remove all `SEQUENCE_FRAME_COUNTS` definitions and use `FRAME_COUNTS` from `types/animation.ts` exclusively
2. **Standardize environment variables**: Migrate from `NEXT_PUBLIC_FRAME_BASE_URL` to `NEXT_PUBLIC_ASSET_BASE_URL` with `/assets` prefix
3. **Update .env.example**: Document the standardized environment variable with proper path
4. **Verify zero regressions**: All 590+ tests pass, lint and type-check remain clean

---

## 3. Prerequisites

### Required Sessions
- [x] `phase00-session01-frame-preload-error-handling` - Error-resilient frame preloading complete
- [x] `phase00-session02-texture-loader-refactor` - Promise-based texture loading complete

### Required Tools/Knowledge
- TypeScript module exports and re-exports
- Next.js environment variable conventions (`NEXT_PUBLIC_*`)
- Understanding of frame URL generation in `lib/frame-utils.ts`

### Environment Requirements
- Node.js 20+
- All project dependencies installed (`npm install`)
- Tests passing (`npm test`)

---

## 4. Scope

### In Scope (MVP)
- Remove `SEQUENCE_FRAME_COUNTS` from `hooks/useUnifiedFrameAnimation.ts` (line 32-35)
- Remove `SEQUENCE_FRAME_COUNTS` from `hooks/useFrameSequence.ts` (line 30-33)
- Update both hooks to import and use `FRAME_COUNTS` from `types/animation.ts`
- Change `lib/frame-utils.ts` to use `NEXT_PUBLIC_ASSET_BASE_URL` instead of `NEXT_PUBLIC_FRAME_BASE_URL`
- Update URL generation to handle `/assets` prefix correctly
- Update `.env.example` with correct `NEXT_PUBLIC_ASSET_BASE_URL` path
- Verify all imports and usages are consistent

### Out of Scope (Deferred)
- Documentation updates - *Session 04*
- Test environment improvements - *Session 05*
- Adding runtime configuration validation - *Future enhancement*
- Adding new frame sequences or configuration options - *Not part of remediation*

---

## 5. Technical Approach

### Architecture

The configuration consolidation follows a "single source of truth" pattern:

```
types/animation.ts (CANONICAL)
    |
    +-- FRAME_COUNTS: { hero: 192, product: 144 }
    |
    v
hooks/useFrameSequence.ts -----> imports FRAME_COUNTS
hooks/useUnifiedFrameAnimation.ts -----> imports FRAME_COUNTS
```

For environment variables:

```
.env / .env.example
    |
    +-- NEXT_PUBLIC_ASSET_BASE_URL=http://localhost:8089/assets
    |
    v
lib/frame-utils.ts -----> reads NEXT_PUBLIC_ASSET_BASE_URL
    |
    v
getFrameUrl() -----> generates: ${ASSET_BASE_URL}/frames-desktop/hero/frame_0001.webp
```

### Design Patterns
- **Single Source of Truth**: One canonical location for configuration values
- **Re-export Pattern**: `hooks/useFrameSequence.ts` re-exports `FRAME_COUNTS` for API convenience

### Technology Stack
- TypeScript 5.x with strict mode
- Next.js 16.1.0 environment variable system
- Vitest for test verification

---

## 6. Deliverables

### Files to Create
| File | Purpose | Est. Lines |
|------|---------|------------|
| None | No new files needed | - |

### Files to Modify
| File | Changes | Est. Lines |
|------|---------|------------|
| `hooks/useUnifiedFrameAnimation.ts` | Remove `SEQUENCE_FRAME_COUNTS`, import `FRAME_COUNTS`, update usage | ~10 |
| `hooks/useFrameSequence.ts` | Remove `SEQUENCE_FRAME_COUNTS`, update to use imported `FRAME_COUNTS` | ~10 |
| `lib/frame-utils.ts` | Change env var from `NEXT_PUBLIC_FRAME_BASE_URL` to `NEXT_PUBLIC_ASSET_BASE_URL`, update URL generation | ~5 |
| `.env.example` | Update `NEXT_PUBLIC_ASSET_BASE_URL` to use `/assets` path, add comments | ~5 |

### Files to Verify (No Changes Expected)
| File | Verification |
|------|-------------|
| `types/animation.ts` | Confirm `FRAME_COUNTS` export at line 412 is correct |
| `hooks/index.ts` | Verify re-export of `FRAME_COUNTS` still works |
| `__tests__/hooks/useFrameSequence.test.ts` | Confirm tests import from correct location |

---

## 7. Success Criteria

### Functional Requirements
- [ ] `FRAME_COUNTS` is the only frame count definition in codebase
- [ ] No `SEQUENCE_FRAME_COUNTS` variable exists anywhere in source code
- [ ] All frame count usages import from `types/animation.ts` or re-export
- [ ] `NEXT_PUBLIC_ASSET_BASE_URL` is the only asset URL env var in runtime code
- [ ] Frame URLs generate correctly with new env var

### Testing Requirements
- [ ] All 590+ existing unit tests pass
- [ ] `npm run lint` passes with zero warnings
- [ ] `npm run type-check` passes with no errors
- [ ] `npm run build` succeeds

### Quality Gates
- [ ] All files ASCII-encoded
- [ ] Unix LF line endings
- [ ] Code follows project conventions (strict TypeScript, ESLint rules)
- [ ] No circular dependencies introduced

---

## 8. Implementation Notes

### Key Considerations

1. **Import Path Consistency**: Use `@/types/animation` path alias for imports
2. **Re-export Preservation**: Keep `FRAME_COUNTS` re-export in `hooks/useFrameSequence.ts` for API stability
3. **URL Structure**: New URL format will be:
   - Old: `${FRAME_BASE_URL}/frames-desktop/hero/frame_0001.webp`
   - New: `${ASSET_BASE_URL}/frames-desktop/hero/frame_0001.webp`
   - Note: `/assets` is now in the env var value, not hardcoded

4. **Env Var Default**: Update fallback from `http://localhost:8089` to `http://localhost:8089/assets`

### Current State (Before)

**hooks/useUnifiedFrameAnimation.ts:32-35**
```typescript
const SEQUENCE_FRAME_COUNTS: Record<string, number> = {
  hero: 192,
  product: 144,
};
```

**hooks/useFrameSequence.ts:30-33**
```typescript
const SEQUENCE_FRAME_COUNTS: Record<string, number> = {
  hero: 192,
  product: 144,
};
```

**lib/frame-utils.ts:21-22**
```typescript
const FRAME_BASE_URL =
  process.env.NEXT_PUBLIC_FRAME_BASE_URL || "http://localhost:8089";
```

### Target State (After)

**hooks/useUnifiedFrameAnimation.ts**
```typescript
import { FRAME_COUNTS } from "@/types/animation";
// ... use FRAME_COUNTS[sequence] instead of SEQUENCE_FRAME_COUNTS[sequence]
```

**hooks/useFrameSequence.ts**
```typescript
import { FRAME_COUNTS } from "@/types/animation";
export { FRAME_COUNTS } from "@/types/animation"; // Keep re-export
// ... use FRAME_COUNTS[sequence] instead of SEQUENCE_FRAME_COUNTS[sequence]
```

**lib/frame-utils.ts**
```typescript
const ASSET_BASE_URL =
  process.env.NEXT_PUBLIC_ASSET_BASE_URL || "http://localhost:8089/assets";
```

### Potential Challenges
- **Build cache**: May need to clear `.next` cache after env var rename
- **Test mocking**: Tests that mock env vars need updated variable name

### ASCII Reminder
All output files must use ASCII-only characters (0-127).

---

## 9. Testing Strategy

### Unit Tests
- Existing `__tests__/hooks/useFrameSequence.test.ts` covers frame count usage
- Existing `__tests__/lib/frame-utils.test.ts` covers URL generation
- No new tests needed - changes are pure refactoring

### Integration Tests
- Frame sequence hooks should continue to work with animation store
- URL generation should produce valid MinIO paths

### Manual Testing
1. Start development server: `npm run dev`
2. Verify hero section loads frames correctly
3. Verify product section loads frames correctly
4. Check browser network tab for correct asset URLs

### Edge Cases
- Empty/undefined env var falls back to localhost default
- Invalid sequence ID returns 0 frames (existing behavior)

---

## 10. Dependencies

### External Libraries
- None - pure TypeScript refactoring

### Other Sessions
- **Depends on**: `phase00-session01`, `phase00-session02` (completed)
- **Depended by**: `phase00-session04-documentation-alignment` (env vars must be finalized first)

---

## 11. Verification Commands

Run these commands to verify session completion:

```bash
# 1. Search for duplicate definitions (should return only types/animation.ts)
grep -rn "FRAME_COUNTS\|SEQUENCE_FRAME_COUNTS" --include="*.ts" --include="*.tsx" | grep -v node_modules | grep -v ".spec_system"

# 2. Search for old env var (should return nothing in source)
grep -rn "NEXT_PUBLIC_FRAME_BASE_URL" --include="*.ts" --include="*.tsx" | grep -v node_modules

# 3. Run all tests
npm test

# 4. Type check
npm run type-check

# 5. Lint check
npm run lint

# 6. Build
npm run build
```

---

## Next Steps

Run `/tasks` to generate the implementation task checklist.
