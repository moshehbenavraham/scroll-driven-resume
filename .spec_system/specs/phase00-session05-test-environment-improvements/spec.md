# Session Specification

**Session ID**: `phase00-session05-test-environment-improvements`
**Phase**: 00 - Code Audit Remediation
**Status**: Not Started
**Created**: 2025-12-25

---

## 1. Session Overview

This session addresses P2 test environment issues identified in the code audit. The test suite (624 tests) runs successfully but produces spurious warnings that clutter CI output and can mask real issues. These warnings fall into three categories: JSDOM canvas context limitations, React Three Fiber DOM tag warnings, and Three.js duplicate instance warnings during test bundling.

The core reliability work (Sessions 01-04) is complete, establishing stable frame preloading, texture loading, configuration, and documentation. With those foundations solid, this session focuses on developer experience by eliminating test noise. Clean test output enables faster debugging, clearer CI signals, and reduced cognitive load when investigating actual failures.

This session prepares the codebase for the final Session 06 (Code Quality Polish) by ensuring test infrastructure is pristine before addressing lint suppressions and barrel exports. The mocking patterns established here will also benefit future test development.

---

## 2. Objectives

1. Eliminate all "HTMLCanvasElement.getContext() not implemented" warnings from test output
2. Suppress Three.js "Multiple instances being imported" warning in test environment
3. Maintain 100% test pass rate (624 tests) with no coverage regression
4. Achieve clean stderr output with only actual test failures visible

---

## 3. Prerequisites

### Required Sessions
- [x] `phase00-session01-frame-preload-error-handling` - Core frame loading stabilized
- [x] `phase00-session02-texture-loader-refactor` - Texture caching refactored
- [x] `phase00-session03-configuration-consolidation` - Configuration sources unified
- [x] `phase00-session04-documentation-alignment` - Docs match runtime behavior

### Required Tools/Knowledge
- Vitest configuration and setup file patterns
- JSDOM limitations and canvas mocking strategies
- Three.js bundling behavior in test environments
- React Three Fiber testing patterns

### Environment Requirements
- Node.js with npm
- Vitest 4.0.16
- JSDOM test environment
- All 624 existing tests passing

---

## 4. Scope

### In Scope (MVP)
- Canvas context mock implementation (2D and WebGL stubs)
- Three.js resolve alias to prevent duplicate instances
- Test setup file enhancements for canvas mocking
- Vitest config updates for Three.js aliasing
- Verification that all 624 tests still pass
- Verification that test stderr is clean

### Out of Scope (Deferred)
- R3F Canvas component mocking - *Reason: Tests currently work via native HTML canvas mocking; R3F-specific mocks add complexity without current benefit*
- Expanding test coverage scope - *Reason: Coverage is already high; expansion is separate work*
- E2E test improvements - *Reason: Playwright tests are out of scope for unit test environment fixes*
- Adding new test files - *Reason: This session fixes infrastructure, not coverage gaps*
- Performance testing - *Reason: Out of scope for P2 quality-of-life improvements*

---

## 5. Technical Approach

### Architecture

The solution involves two parallel strategies:

1. **Canvas Mocking**: Extend `__tests__/setup.ts` to mock `HTMLCanvasElement.prototype.getContext()` before any tests run. The mock returns minimal stub objects for both `2d` and `webgl`/`webgl2` contexts that satisfy Three.js and canvas-based component initialization.

2. **Three.js Aliasing**: Configure Vitest's `resolve.alias` to ensure all Three.js imports resolve to a single module instance, preventing the "multiple instances" warning that occurs when different dependency paths resolve to separate copies.

### Design Patterns
- **Mock Objects**: Minimal canvas context mocks implementing only required interface methods
- **Singleton Alias**: Force all three.js imports through a single resolution path
- **Setup Isolation**: All mocking happens in setup.ts before any test file loads

### Technology Stack
- Vitest 4.0.16 (test runner)
- JSDOM (test environment)
- Three.js 0.170.0 (3D library being mocked)
- @react-three/fiber 9.4.2 (R3F wrapper)

---

## 6. Deliverables

### Files to Create
| File | Purpose | Est. Lines |
|------|---------|------------|
| None | All changes are modifications | - |

### Files to Modify
| File | Changes | Est. Lines Changed |
|------|---------|-------------------|
| `__tests__/setup.ts` | Add canvas getContext mock with 2D and WebGL stubs | ~40 |
| `vitest.config.ts` | Add resolve.alias for three.js singleton | ~5 |

---

## 7. Success Criteria

### Functional Requirements
- [ ] Test output contains no "HTMLCanvasElement.getContext() not implemented" warnings
- [ ] Test output contains no "Multiple instances of Three.js" warnings
- [ ] All 624 existing tests pass
- [ ] No new test failures introduced

### Testing Requirements
- [ ] Run full test suite: `npm test`
- [ ] Verify stderr is clean (redirect and grep for warnings)
- [ ] Run verbose mode: `npm test -- --reporter=verbose 2>&1`

### Quality Gates
- [ ] `npm run lint` passes with zero warnings
- [ ] `npm run type-check` passes with no errors
- [ ] Coverage thresholds maintained (lib/scroll-utils.ts at 90%+)
- [ ] All files ASCII-encoded with Unix LF line endings

---

## 8. Implementation Notes

### Key Considerations

1. **Canvas Mock Completeness**: The mock needs to return objects that satisfy Three.js initialization. This includes:
   - `getContext('2d')` returning a minimal CanvasRenderingContext2D stub
   - `getContext('webgl')` and `getContext('webgl2')` returning WebGLRenderingContext stubs
   - Key methods like `getParameter`, `getExtension`, `createShader`, etc.

2. **WebGL Mock Depth**: Three.js calls various WebGL methods during initialization. The mock needs enough methods to prevent errors, but can return null/noop for most.

3. **Three.js Alias Path**: The alias should point to `node_modules/three` to ensure consistent resolution.

### Potential Challenges

| Challenge | Mitigation |
|-----------|------------|
| Three.js needs specific WebGL methods | Start minimal, add methods as tests reveal needs |
| Canvas mock might break canvas-dependent tests | Run tests after each addition to catch regressions |
| Alias might not fully resolve duplicates | May need to alias drei/fiber's three deps too |
| Some tests might rely on warning output | Unlikely - warnings are noise, not assertions |

### ASCII Reminder
All output files must use ASCII-only characters (0-127).

---

## 9. Testing Strategy

### Unit Tests
- Existing 624 tests serve as regression suite
- No new tests required - this is infrastructure work

### Integration Tests
- Full test suite run validates all components work with mocks
- Canvas-dependent tests (FrameSequence, CanvasFrameRenderer) are integration validators

### Manual Testing
1. Run `npm test` and verify all pass
2. Run `npm test 2>&1 | grep -i "not implemented"` - should return empty
3. Run `npm test 2>&1 | grep -i "multiple instances"` - should return empty
4. Run `npm test -- --reporter=verbose 2>&1` and visually confirm clean output

### Edge Cases
- WebGL 1 vs WebGL 2 context requests
- Context type variations (experimental-webgl)
- Canvas getContext called with unsupported type (should return null)

---

## 10. Dependencies

### External Libraries
- Vitest: 4.0.16
- JSDOM: (bundled with Vitest)
- Three.js: 0.170.0
- @react-three/fiber: 9.4.2
- @react-three/drei: 10.7.7

### Other Sessions
- **Depends on**: Sessions 01-04 (core fixes complete)
- **Depended by**: Session 06 (Code Quality Polish)

---

## 11. Current State Analysis

### Test Suite Status
```
Test Files: 44 passed (44)
Tests: 624 passed (624)
Duration: ~19s
```

### Current Warnings (to eliminate)
```
stderr | __tests__/components/HeroSection.test.tsx
WARNING: Multiple instances of Three.js being imported.

Not implemented: HTMLCanvasElement's getContext() method: without installing the canvas npm package
(appears ~15+ times across various test files)
```

### Existing Setup Mocks
The current `__tests__/setup.ts` already mocks:
- `window.matchMedia`
- `ResizeObserver`
- `IntersectionObserver`
- `requestAnimationFrame` / `cancelAnimationFrame`
- `requestIdleCallback` / `cancelIdleCallback`

The canvas mock will follow these established patterns.

### Three.js Dependency Tree
```
three@0.170.0 (single version, properly deduped)
  - @react-three/fiber@9.4.2
  - @react-three/drei@10.7.7 (+ nested deps)
```

The deduping is correct in npm, but Vitest bundling may create separate instances - alias will force singleton.

---

## Next Steps

Run `/tasks` to generate the implementation task checklist.
