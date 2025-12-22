# Task Checklist

**Session ID**: `phase01-session05-parallax-layer-system`
**Total Tasks**: 25
**Estimated Duration**: 8-10 hours
**Created**: 2025-12-22

---

## Legend

- `[x]` = Completed
- `[ ]` = Pending
- `[P]` = Parallelizable (can run with other [P] tasks)
- `[S0105]` = Session reference (Phase 01, Session 05)
- `TNNN` = Task ID

---

## Progress Summary

| Category | Total | Done | Remaining |
|----------|-------|------|-----------|
| Setup | 3 | 3 | 0 |
| Foundation | 7 | 7 | 0 |
| Implementation | 11 | 11 | 0 |
| Testing | 4 | 4 | 0 |
| **Total** | **25** | **25** | **0** |

---

## Setup (3 tasks)

Initial configuration and environment preparation.

- [x] T001 [S0105] Verify prerequisites met (useParallax, useReducedMotion hooks exist)
- [x] T002 [S0105] Create directory structure (`components/parallax/`, `__tests__/components/parallax/`)
- [x] T003 [S0105] Verify dev server runs without errors

---

## Foundation (7 tasks)

Core types, hooks, and base implementations.

- [x] T004 [S0105] Define parallax type definitions (`types/parallax.ts`)
- [x] T005 [S0105] Update animation types with parallax context (`types/animation.ts`)
- [x] T006 [S0105] Implement useIsMobile hook (`hooks/useIsMobile.ts`)
- [x] T007 [S0105] Implement useParallaxTransform hook (`hooks/useParallaxTransform.ts`)
- [x] T008 [S0105] Create ParallaxContext for container/layer communication (`components/parallax/ParallaxContext.tsx`)
- [x] T009 [S0105] Export new hooks from barrel file (`hooks/index.ts`)
- [x] T010 [S0105] Create parallax components barrel export (`components/parallax/index.ts`)

---

## Implementation (11 tasks)

Main feature implementation.

- [x] T011 [S0105] Implement ParallaxContainer component base structure (`components/parallax/ParallaxContainer.tsx`)
- [x] T012 [S0105] Add scroll context provider to ParallaxContainer
- [x] T013 [S0105] Add layer count validation to ParallaxContainer (max 5 layers)
- [x] T014 [S0105] Implement ParallaxLayer component base structure (`components/parallax/ParallaxLayer.tsx`)
- [x] T015 [S0105] Add transform calculations to ParallaxLayer
- [x] T016 [S0105] Add GPU acceleration hints to ParallaxLayer (will-change, translate3d)
- [x] T017 [S0105] Add reduced motion support to ParallaxLayer
- [x] T018 [S0105] Add mobile detection disable to ParallaxLayer
- [x] T019 [S0105] Integrate parallax layers into HeroSection (`components/sections/HeroSection.tsx`)
- [x] T020 [S0105] Integrate parallax layers into ProductSection (`components/sections/ProductSection.tsx`)
- [x] T021 [S0105] Verify HeroSection and ProductSection render correctly with parallax

---

## Testing (4 tasks)

Verification and quality assurance.

- [x] T022 [S0105] [P] Write unit tests for useIsMobile hook (`__tests__/hooks/useIsMobile.test.ts`)
- [x] T023 [S0105] [P] Write unit tests for useParallaxTransform hook (`__tests__/hooks/useParallaxTransform.test.ts`)
- [x] T024 [S0105] [P] Write component tests for ParallaxLayer (`__tests__/components/parallax/ParallaxLayer.test.tsx`)
- [x] T025 [S0105] Run test suite, verify build passes, validate ASCII encoding

---

## Completion Checklist

Before marking session complete:

- [x] All tasks marked `[x]`
- [x] All tests passing (355/355)
- [x] All files ASCII-encoded
- [x] implementation-notes.md updated
- [x] Ready for `/validate`

---

## Notes

### Parallelization
Tasks marked `[P]` can be worked on simultaneously (T022, T023, T024 are independent tests).

### Task Timing
Target ~20-25 minutes per task.

### Dependencies
- T004-T005: Type definitions must be complete before hooks
- T006-T007: Hooks must be complete before components
- T008-T010: Context and exports needed for component integration
- T011-T018: ParallaxContainer must be done before ParallaxLayer integration
- T019-T020: Require all component implementation complete
- T022-T024: Can run in parallel once implementations are complete

### Key Technical Considerations
1. Z-Index preservation: HeroSection uses z-0 (canvas), z-10 (gradient), z-20 (content)
2. Speed range: 0 (fixed), 0.3-0.5 (mid-layer), 1.0-1.3 (foreground)
3. Mobile breakpoint: 768px (disable parallax below)
4. GPU acceleration: translate3d(0, Ypx, 0) transforms
5. Reduced motion: Respect prefers-reduced-motion preference

---

## Next Steps

Run `/implement` to begin AI-led implementation.
