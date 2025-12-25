# Task Checklist

**Session ID**: `phase00-session03-configuration-consolidation`
**Total Tasks**: 20
**Estimated Duration**: 2-3 hours
**Created**: 2025-12-24
**Completed**: 2025-12-24

---

## Legend

- `[x]` = Completed
- `[ ]` = Pending
- `[P]` = Parallelizable (can run with other [P] tasks)
- `[S0003]` = Session reference (Phase 00, Session 03)
- `TNNN` = Task ID

---

## Progress Summary

| Category | Total | Done | Remaining |
|----------|-------|------|-----------|
| Setup | 3 | 3 | 0 |
| Foundation | 3 | 3 | 0 |
| Implementation | 8 | 8 | 0 |
| Testing | 6 | 6 | 0 |
| **Total** | **20** | **20** | **0** |

---

## Setup (3 tasks)

Initial verification and environment preparation.

- [x] T001 [S0003] Verify prerequisites: all tests pass (`npm test`)
- [x] T002 [S0003] Verify types/animation.ts exports FRAME_COUNTS at line 412
- [x] T003 [S0003] Verify hooks/index.ts re-exports FRAME_COUNTS from useFrameSequence

---

## Foundation (3 tasks)

Confirm existing structures before modifications.

- [x] T004 [S0003] Search codebase to catalog all SEQUENCE_FRAME_COUNTS usages
- [x] T005 [S0003] Search codebase to catalog all NEXT_PUBLIC_FRAME_BASE_URL usages
- [x] T006 [S0003] Document current frame URL format for comparison after changes

---

## Implementation (8 tasks)

Main configuration consolidation work.

### Frame Count Consolidation

- [x] T007 [S0003] Remove SEQUENCE_FRAME_COUNTS definition from useUnifiedFrameAnimation.ts (lines 32-35)
- [x] T008 [S0003] Add FRAME_COUNTS import from @/types/animation in useUnifiedFrameAnimation.ts
- [x] T009 [S0003] Update useUnifiedFrameAnimation.ts to use FRAME_COUNTS[sequence] instead of SEQUENCE_FRAME_COUNTS[sequence] (line 118)
- [x] T010 [S0003] Remove SEQUENCE_FRAME_COUNTS definition from useFrameSequence.ts (lines 30-33)
- [x] T011 [S0003] Update useFrameSequence.ts to use imported FRAME_COUNTS (line 72)

### Environment Variable Standardization

- [x] T012 [S0003] Update lib/frame-utils.ts: rename FRAME_BASE_URL to ASSET_BASE_URL (line 21)
- [x] T013 [S0003] Update lib/frame-utils.ts: change env var from NEXT_PUBLIC_FRAME_BASE_URL to NEXT_PUBLIC_ASSET_BASE_URL (line 22)
- [x] T014 [S0003] Update .env.example: ensure NEXT_PUBLIC_ASSET_BASE_URL uses /assets path (line 64)

---

## Testing (6 tasks)

Verification and quality assurance.

- [x] T015 [S0003] Run grep to verify no SEQUENCE_FRAME_COUNTS in source files
- [x] T016 [S0003] Run grep to verify no NEXT_PUBLIC_FRAME_BASE_URL in source files
- [x] T017 [S0003] Run full test suite (`npm test`) - all 624 tests pass
- [x] T018 [S0003] Run type-check (`npm run type-check`) - no errors
- [x] T019 [S0003] Run lint (`npm run lint`) - zero warnings
- [x] T020 [S0003] Run build (`npm run build`) - must succeed

---

## Completion Checklist

Before marking session complete:

- [x] All 20 tasks marked `[x]`
- [x] All 624 tests passing
- [x] Zero lint warnings
- [x] Type-check clean
- [x] Build succeeds
- [x] All files ASCII-encoded
- [x] implementation-notes.md updated
- [x] Ready for `/validate`

---

## Notes

### Parallelization
Tasks T007-T011 (frame count changes) can be done in sequence within 2-3 edits.
Tasks T012-T014 (env var changes) can be done in parallel with frame count tasks if desired.
Tasks T015-T016 (verification greps) are parallelizable.
Tasks T017-T020 must run after all implementation is complete.

### Key File Locations
| File | Line Numbers | Change |
|------|-------------|--------|
| `hooks/useUnifiedFrameAnimation.ts` | 32-35, 118 | Remove SEQUENCE_FRAME_COUNTS, import FRAME_COUNTS |
| `hooks/useFrameSequence.ts` | 30-33, 72 | Remove SEQUENCE_FRAME_COUNTS, use imported FRAME_COUNTS |
| `lib/frame-utils.ts` | 21-22 | Rename variable, change env var name |
| `.env.example` | 64 | Verify /assets path |

### Expected Changes Summary
1. **types/animation.ts** - No changes (already exports FRAME_COUNTS)
2. **hooks/index.ts** - No changes (already re-exports FRAME_COUNTS)
3. **useUnifiedFrameAnimation.ts** - Remove local constant, add import, update usage
4. **useFrameSequence.ts** - Remove local constant (keep re-export), update usage
5. **lib/frame-utils.ts** - Rename constant and change env var name
6. **.env.example** - Verify correct value with /assets prefix

### URL Format Comparison
- **Before**: `${NEXT_PUBLIC_FRAME_BASE_URL}/frames-desktop/hero/frame_0001.webp`
- **After**: `${NEXT_PUBLIC_ASSET_BASE_URL}/frames-desktop/hero/frame_0001.webp`
- **Note**: The `/assets` path is now in the env var VALUE, not hardcoded

### Fallback Default Change
- **Before**: `http://localhost:8089`
- **After**: `http://localhost:8089/assets`

---

## Next Steps

Run `/validate` to verify session completeness.
