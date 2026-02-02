# Task Checklist

**Session ID**: `phase00-session05-test-environment-improvements`
**Total Tasks**: 20
**Estimated Duration**: 2-3 hours
**Created**: 2025-12-25

---

## Legend

- `[x]` = Completed
- `[ ]` = Pending
- `[P]` = Parallelizable (can run with other [P] tasks)
- `[S0005]` = Session reference (Phase 00, Session 05)
- `TNNN` = Task ID

---

## Progress Summary

| Category | Total | Done | Remaining |
|----------|-------|------|-----------|
| Setup | 3 | 3 | 0 |
| Foundation | 5 | 5 | 0 |
| Implementation | 7 | 7 | 0 |
| Testing | 5 | 5 | 0 |
| **Total** | **20** | **20** | **0** |

---

## Setup (3 tasks)

Initial verification and baseline capture.

- [x] T001 [S0005] Run full test suite and capture current warnings baseline (`npm test 2>&1`)
- [x] T002 [S0005] Count specific warning occurrences ("not implemented", "Multiple instances")
- [x] T003 [S0005] Verify all 624 tests currently passing before modifications

---

## Foundation (5 tasks)

Design mock structures and understand requirements.

- [x] T004 [S0005] [P] Research minimal WebGLRenderingContext methods needed for Three.js init
- [x] T005 [S0005] [P] Research minimal CanvasRenderingContext2D methods needed
- [x] T006 [S0005] [P] Identify Three.js module resolution path in node_modules
- [x] T007 [S0005] Design canvas mock structure with type-safe stubs for 2D context
- [x] T008 [S0005] Design WebGL context mock with getParameter, getExtension, shader methods

---

## Implementation (7 tasks)

Main canvas mock and alias implementation.

- [x] T009 [S0005] Add CanvasRenderingContext2D mock stub to setup.ts (`__tests__/setup.ts`)
- [x] T010 [S0005] Add WebGLRenderingContext mock stub to setup.ts (`__tests__/setup.ts`)
- [x] T011 [S0005] Implement HTMLCanvasElement.prototype.getContext override (`__tests__/setup.ts`)
- [x] T012 [S0005] Add WebGL2 context support to getContext mock (`__tests__/setup.ts`)
- [x] T013 [S0005] Handle experimental-webgl context type variant (`__tests__/setup.ts`)
- [x] T014 [S0005] Add Three.js resolve alias to Vitest config (`vitest.config.ts`)
- [x] T015 [S0005] Add @react-three/fiber and drei aliases if needed (`vitest.config.ts`)

---

## Testing (5 tasks)

Verification and quality assurance.

- [x] T016 [S0005] Run full test suite and verify all 624 tests still pass
- [x] T017 [S0005] Verify no "HTMLCanvasElement.getContext() not implemented" in stderr
- [x] T018 [S0005] Verify no "Multiple instances of Three.js" warning in stderr
- [x] T019 [S0005] Run quality gates: lint, type-check, coverage thresholds
- [x] T020 [S0005] Validate ASCII encoding and Unix LF on modified files

---

## Completion Checklist

Before marking session complete:

- [x] All tasks marked `[x]`
- [x] All 624 tests passing
- [x] Zero warnings in test stderr output
- [x] `npm run lint` passes
- [x] `npm run type-check` passes
- [x] Coverage thresholds maintained
- [x] All files ASCII-encoded with Unix LF
- [x] implementation-notes.md updated
- [x] Ready for `/validate`

---

## Notes

### Parallelization
Tasks T004-T006 can be worked on simultaneously (research phase).

### Task Timing
- Setup: ~15 min
- Foundation: ~30 min
- Implementation: ~60-90 min
- Testing: ~30 min

### Dependencies
1. T001-T003 must complete before any modifications
2. T007-T008 depend on T004-T006 research
3. T009-T013 are sequential (build up mock progressively)
4. T014-T015 can parallel with canvas mock work
5. T016-T020 must follow all implementation

### Canvas Mock Implementation Order
```
T009: 2D context stub (minimal)
T010: WebGL context stub (Three.js-focused)
T011: getContext override (dispatcher)
T012: WebGL2 support (extension)
T013: experimental-webgl (legacy support)
```

### Three.js Alias Strategy
Primary alias needed:
```typescript
'three': path.resolve(__dirname, 'node_modules/three')
```

May also need (T015):
- `@react-three/fiber` points to its three dep
- `@react-three/drei` points to its three dep

### Key WebGL Methods for Three.js
Based on Three.js init requirements:
- `getParameter` (returns null/0 for GL constants)
- `getExtension` (returns null)
- `createShader`, `createProgram` (return empty objects)
- `getShaderPrecisionFormat` (returns precision object)
- `getContextAttributes` (returns default attributes)

---

## Next Steps

Run `/implement` to begin AI-led implementation.
