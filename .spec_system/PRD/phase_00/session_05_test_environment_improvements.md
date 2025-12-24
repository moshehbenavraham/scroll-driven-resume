# Session 05: Test Environment Improvements

**Session ID**: `phase00-session05-test-environment-improvements`
**Status**: Not Started
**Estimated Tasks**: ~20
**Estimated Duration**: 2-4 hours
**Priority**: P2 - Nice to Have

---

## Objective

Reduce test environment warning noise in unit tests to improve CI signal clarity and prevent real issues from being masked by expected warnings.

---

## Scope

### In Scope (MVP)
- Add canvas polyfill/mocking for test environment
- Mock R3F primitives in unit tests to eliminate DOM tag warnings
- Investigate and fix "multiple Three.js instances" warning
- Update Vitest setup file with proper mocks
- Ensure test output is clean (no spurious warnings)
- Maintain 98%+ test coverage

### Out of Scope
- Expanding test coverage scope beyond current include list
- Adding new test files for uncovered code
- E2E test improvements
- Performance testing

---

## Prerequisites

- [ ] Sessions 01-04 completed
- [ ] Understand current test setup (`vitest.config.ts`, `vitest.setup.ts`)
- [ ] Review current test warnings and their sources
- [ ] Existing tests pass (`npm test`)

---

## Deliverables

1. Canvas mock/polyfill in test setup
2. R3F primitives mock configuration
3. Resolved Three.js multiple instances warning
4. Clean test output with no spurious warnings
5. All existing tests still pass
6. Coverage maintained at 98%+

---

## Technical Details

### Current Issues (from audit)
Test output includes noise that can mask real issues:
- JSDOM: "Not implemented: HTMLCanvasElement.getContext()"
- React warnings for `<ambientLight>` (R3F tags in JSDOM)
- "Multiple instances of Three.js being imported."

### Solution Approach

#### Canvas Mock
```typescript
// vitest.setup.ts
class MockCanvasRenderingContext2D {
  // Implement minimal canvas context mock
}

HTMLCanvasElement.prototype.getContext = vi.fn((contextId) => {
  if (contextId === '2d') {
    return new MockCanvasRenderingContext2D();
  }
  return null;
});
```

#### R3F Primitives Mock
```typescript
// vitest.setup.ts or __mocks__/@react-three/fiber.ts
vi.mock('@react-three/fiber', async () => {
  const actual = await vi.importActual('@react-three/fiber');
  return {
    ...actual,
    Canvas: ({ children }) => <div data-testid="r3f-canvas">{children}</div>,
  };
});
```

#### Three.js Duplicate Investigation
- Check for multiple three.js imports in dependencies
- Verify import paths are consistent
- Consider aliasing in vitest.config.ts

---

## Success Criteria

- [ ] No "HTMLCanvasElement.getContext" warnings in test output
- [ ] No R3F DOM tag warnings in test output
- [ ] No "Multiple instances of Three.js" warnings
- [ ] Test stderr is clean (only actual failures)
- [ ] All 590+ existing tests pass
- [ ] Test coverage remains at 98%+
- [ ] `npm run lint` passes with zero warnings
- [ ] `npm run type-check` passes with no errors
