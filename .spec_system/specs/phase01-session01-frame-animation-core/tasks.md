# Task Checklist

**Session ID**: `phase01-session01-frame-animation-core`
**Total Tasks**: 25
**Estimated Duration**: 8-10 hours
**Created**: 2025-12-22

---

## Legend

- `[x]` = Completed
- `[ ]` = Pending
- `[P]` = Parallelizable (can run with other [P] tasks)
- `[S0101]` = Session reference (Phase 01, Session 01)
- `TNNN` = Task ID

---

## Progress Summary

| Category | Total | Done | Remaining |
|----------|-------|------|-----------|
| Setup | 3 | 3 | 0 |
| Foundation | 7 | 7 | 0 |
| Implementation | 9 | 9 | 0 |
| Testing | 6 | 6 | 0 |
| **Total** | **25** | **25** | **0** |

---

## Setup (3 tasks)

Initial configuration and environment preparation.

- [x] T001 [S0101] Verify Docker stack running and MinIO serving frames at localhost:9000
- [x] T002 [S0101] Create `components/animation/` directory structure
- [x] T003 [S0101] Verify existing hooks (`useFrameAnimation`, `useFramePreload`) work correctly

---

## Foundation (7 tasks)

Core types, utilities, and base implementations.

- [x] T004 [S0101] [P] Add FrameSequence component prop types to `types/animation.ts`
- [x] T005 [S0101] [P] Add FrameQuality and URL generation types to `types/animation.ts`
- [x] T006 [S0101] Create MinIO URL generator - `getFrameUrl()` function (`lib/frame-utils.ts`)
- [x] T007 [S0101] Create frame URL batch generator - `generateFrameUrls()` (`lib/frame-utils.ts`)
- [x] T008 [S0101] Add quality detection utility - `getOptimalQuality()` (`lib/frame-utils.ts`)
- [x] T009 [S0101] Add sequence-specific state to animation store (`stores/animation-store.ts`)
- [x] T010 [S0101] Create `useFrameSequence` integration hook shell (`hooks/useFrameSequence.ts`)

---

## Implementation (9 tasks)

Main feature implementation.

- [x] T011 [S0101] Implement `useFrameSequence` hook - integrate animation + preload + store
- [x] T012 [S0101] [P] Create `FrameImage.tsx` - individual frame component with lazy loading
- [x] T013 [S0101] Create `FrameSequence.tsx` shell with props and container setup
- [x] T014 [S0101] Implement opacity-based frame stacking in FrameSequence
- [x] T015 [S0101] Add frame virtualization logic - render current +/- 2 frames only
- [x] T016 [S0101] Add reduced motion support - static first frame when `prefers-reduced-motion`
- [x] T017 [S0101] Add mobile detection with static fallback (viewport < 768px)
- [x] T018 [S0101] Create barrel export (`components/animation/index.ts`) and update hooks index
- [x] T019 [S0101] Create demo page (`app/demo/frames/page.tsx`) with hero sequence

---

## Testing (6 tasks)

Verification and quality assurance.

- [x] T020 [S0101] [P] Write unit tests for `lib/frame-utils.ts` (`__tests__/lib/frame-utils.test.ts`)
- [x] T021 [S0101] [P] Write unit tests for `useFrameSequence` hook (`__tests__/hooks/useFrameSequence.test.ts`)
- [x] T022 [S0101] [P] Write component tests for FrameSequence (`__tests__/components/FrameSequence.test.tsx`)
- [x] T023 [S0101] Run full test suite - ensure >80% coverage on new code
- [x] T024 [S0101] Validate ASCII encoding and lint on all new files
- [x] T025 [S0101] Manual testing: demo page scroll, reduced motion, mobile viewport

---

## Completion Checklist

Before marking session complete:

- [x] All tasks marked `[x]`
- [x] All tests passing (vitest) - 181 tests
- [x] All files ASCII-encoded (no unicode in code)
- [x] TypeScript strict mode - zero errors
- [x] ESLint passing - zero warnings (1 intentional disable)
- [x] implementation-notes.md updated
- [x] Ready for `/validate`

---

## Notes

### Parallelization
Tasks marked `[P]` can be worked on simultaneously:
- T004 + T005: Independent type definitions
- T012: FrameImage is independent of hook implementation
- T020 + T021 + T022: Tests for different modules

### Task Timing
Target ~20-25 minutes per task.

### Dependencies
- T006-T008 depend on T004-T005 (types must exist first)
- T011 depends on T010 (hook shell first)
- T013-T017 depend on T011-T012 (hooks and FrameImage ready)
- T020-T022 depend on implementation completion

### Key Technical Decisions
1. **Opacity stacking over canvas**: Use CSS opacity transitions for GPU acceleration
2. **Frame virtualization**: Only 5 frames in DOM at once (current +/- 2)
3. **MinIO URL pattern**: `{baseUrl}/{sequence}-frames{-mobile?}/frame_{NNNN}.webp`
4. **Mobile breakpoint**: 768px - static frame fallback below this width

### MinIO URL Structure
```
Desktop: http://localhost:9000/resume-assets/hero-frames/frame_0001.webp
Mobile:  http://localhost:9000/resume-assets/hero-frames-mobile/frame_0001.webp
```

---

## Next Steps

Run `/implement` to begin AI-led implementation.
