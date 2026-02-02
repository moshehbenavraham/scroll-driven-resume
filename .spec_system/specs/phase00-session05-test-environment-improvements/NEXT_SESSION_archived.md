# NEXT_SESSION.md

## Session Recommendation

**Generated**: 2025-12-25
**Project State**: Phase 00 - Code Audit Remediation
**Completed Sessions**: 4 of 6

---

## Recommended Next Session

**Session ID**: `phase00-session05-test-environment-improvements`
**Session Name**: Test Environment Improvements
**Estimated Duration**: 2-4 hours
**Estimated Tasks**: ~20

---

## Why This Session Next?

### Prerequisites Met
- [x] Session 01 (Frame Preload Error Handling) - P0 critical fix complete
- [x] Session 02 (Texture Loader Refactor) - P1 resource leak fix complete
- [x] Session 03 (Configuration Consolidation) - P1 config drift fix complete
- [x] Session 04 (Documentation Alignment) - P1 docs accuracy complete

### Dependencies
- **Builds on**: Sessions 01-04 (core reliability and configuration fixes)
- **Enables**: Session 06 (Code Quality Polish) - which requires clean test output as prerequisite

### Project Progression

Session 05 is the natural next step in the Phase 00 remediation sequence:

1. **P0 Critical (Done)**: Frame preload error handling fixed - users no longer stuck behind loading overlays
2. **P1 Important (Done)**: Resource leaks eliminated, configuration consolidated, docs aligned
3. **P2 Nice-to-Have (Next)**: Test environment noise reduction - now that core fixes are stable, improve developer experience with clean CI output
4. **P2 Final (Pending)**: Code quality polish - requires Session 05 complete per explicit prerequisite

The test environment improvements will:
- Eliminate spurious warnings that could mask real issues
- Provide cleaner CI signal for validating the core fixes implemented in Sessions 01-04
- Set up proper mocking patterns for future test development

---

## Session Overview

### Objective

Reduce test environment warning noise in unit tests to improve CI signal clarity and prevent real issues from being masked by expected warnings.

### Key Deliverables
1. Canvas mock/polyfill in test setup - eliminate JSDOM "getContext not implemented" warnings
2. R3F primitives mock configuration - prevent React DOM tag warnings for Three.js components
3. Resolved Three.js multiple instances warning - clean up import/bundling issues
4. Clean test output with no spurious warnings in stderr
5. All 590+ existing tests passing with 98%+ coverage maintained

### Scope Summary
- **In Scope (MVP)**: Canvas mocking, R3F primitive mocks, Three.js duplicate fix, Vitest setup updates, clean test output
- **Out of Scope**: Expanding test coverage, adding new test files, E2E improvements, performance testing

---

## Technical Considerations

### Technologies/Patterns
- Vitest configuration (`vitest.config.ts`, `vitest.setup.ts`)
- JSDOM canvas mocking patterns
- `@react-three/fiber` mock strategies
- Three.js import aliasing to prevent duplicate instances

### Potential Challenges
- **Canvas WebGL context**: May need both 2D and WebGL context mocks depending on component usage
- **R3F integration**: Mocking may need to preserve some actual behavior for meaningful tests
- **Three.js bundling**: Duplicate instances often stem from dependency tree issues - may need Vitest resolve aliases
- **Coverage preservation**: Mocking changes must not inadvertently skip code paths

### Current Warnings to Resolve
From code audit findings:
- `JSDOM: "Not implemented: HTMLCanvasElement.getContext()"`
- `React warnings for <ambientLight> (R3F tags in JSDOM)`
- `"Multiple instances of Three.js being imported."`

---

## Alternative Sessions

If this session is blocked:

1. **Session 06 (Code Quality Polish)** - Can be done in parallel for lint suppression and barrel export work, but security header and Docker pinning should wait
2. **Start Phase 01** - If Phase 00 P2 items are deprioritized, could begin next phase (if defined)

---

## Next Steps

Run `/sessionspec` to generate the formal specification with detailed task breakdown.
