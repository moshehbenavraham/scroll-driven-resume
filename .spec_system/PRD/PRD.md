# scroll-driven-resume - Product Requirements Document

## Overview

Modern Resume Site is a high-quality animated portfolio website built with Next.js 16, React 19, and WebGL (Three.js/R3F). The site features a scroll-synchronized frame animation system with a unified WebGL renderer and canvas fallback, parallax effects, and interactive sections for hero, products, about, skills, projects, and contact.

A comprehensive code audit (2025-12-24) identified reliability issues in the animation/loading pipeline that can cause user-facing failures. This PRD defines the remediation work to address those findings while maintaining the existing high standards (strict TypeScript, zero ESLint warnings, 98%+ test coverage).

## Goals

1. Fix critical reliability issues that can leave users stuck behind loading overlays
2. Eliminate resource leaks in the texture loading pipeline
3. Consolidate configuration drift and establish single sources of truth
4. Maintain zero-warning, zero-error lint and type-check status
5. Preserve or improve existing test coverage (590 unit tests, E2E suite)
6. Reduce test environment noise to improve CI signal clarity
7. Improve developer experience by aligning docs with actual runtime behavior

## Non-Goals

- Adding new features or sections to the site
- Redesigning the visual appearance or UX
- Migrating to a different framework or major library versions
- Implementing server-side features (API routes, authentication)
- Performance optimization beyond fixing the identified issues
- Adding a CMS or content management system
- Internationalization or multi-language support

## Users and Use Cases

### Primary Users

- **Visitors**: People viewing the portfolio site who expect smooth animations and fast loading
- **Developers**: Contributors who need to understand, build, and deploy the codebase

### Key Use Cases

1. **Visitor views site on stable network**: Site loads, animations play smoothly, all sections accessible
2. **Visitor views site on unstable network**: Site degrades gracefully; partial frame failures do not block content
3. **Developer runs local dev environment**: Clear setup, matching docs, predictable behavior
4. **Developer deploys to production**: Consistent behavior via Docker/Coolify with Nginx reverse proxy

## Requirements

### MVP Requirements (P0 - Must Fix)

- [ ] Fix `useFramePreload` so that completion progresses even when individual frames fail to load
- [ ] Ensure loading overlay dismissal cannot be blocked by transient network errors
- [ ] Add overall timeout for preload completion as a safety net
- [ ] Track attempted vs successful frame counts separately

### P1 Requirements (Should Fix)

- [ ] Refactor `useTextureLoader` to eliminate polling-based concurrent load handling
- [ ] Replace `setInterval` polling with per-index promise registry for deduplication
- [ ] Cache failed loads as terminal states to prevent infinite polling
- [ ] Track intervals in refs and clear on component unmount
- [ ] Consolidate frame count configuration to single source of truth (`types/animation.ts`)
- [ ] Remove duplicate `SEQUENCE_FRAME_COUNTS` definitions in hooks
- [ ] Standardize asset environment variables (`NEXT_PUBLIC_FRAME_BASE_URL` vs `NEXT_PUBLIC_ASSET_BASE_URL`)
- [ ] Update documentation to match actual runtime configuration

### P2 Requirements (Nice-to-Have)

- [ ] Add canvas polyfill/mocking for test environment to reduce JSDOM warnings
- [ ] Mock R3F primitives in unit tests to eliminate DOM tag warnings
- [ ] Investigate and fix "multiple Three.js instances" warning in tests
- [ ] Remove inline lint suppressions by restructuring imports (e.g., `ParallaxContainer.tsx`)
- [ ] Complete or remove incomplete barrel exports (`components/sections/index.ts`)
- [ ] Review and harden security headers in Docker/Nginx configuration

### Deferred Requirements

- Bundle size analysis and optimization
- Content Security Policy implementation
- Dependency vulnerability remediation (npm audit)
- Expanding test coverage scope beyond current include list

## Non-Functional Requirements

- **Performance**: Maintain static prerender for fast TTFB; priority frames load within 2 seconds on typical connection
- **Reliability**: No user-facing loading stalls from transient network issues; graceful degradation on WebGL failure
- **Security**: Maintain existing security headers; no regression in posture
- **Accessibility**: Preserve existing a11y features (SkipLink, focus styles, reduced motion support)
- **Maintainability**: Zero ESLint warnings, zero TypeScript errors, single source of truth for configuration

## Constraints and Dependencies

- Must maintain compatibility with production deployment via Docker/Coolify with Nginx
- Cannot break existing E2E tests or reduce unit test coverage below 98%
- Changes must pass `npm run lint` with `--max-warnings=0`
- Changes must pass `npm run type-check` with strict TypeScript
- Docker compose uses MinIO for asset storage; must maintain backward compatibility

## Phases

This PRD is delivered via phases. Each phase is implemented via multiple 2-4 hour sessions (15-30 tasks each).

| Phase | Name | Sessions | Status |
|-------|------|----------|--------|
| 00 | Code Audit Remediation | 6 | Not Started |

## Phase 00: Code Audit Remediation

### Objectives

1. Fix P0 critical reliability issue in frame preloading
2. Fix P1 resource leak and configuration drift issues
3. Address P2 test environment and code quality improvements
4. Validate all fixes with existing test suites

### Sessions (To Be Defined)

Sessions are defined via `/phasebuild` as `session_NN_name.md` stubs under `.spec_system/PRD/phase_00/`.

**Recommended Session Breakdown:**

1. **Frame Preload Error Handling** (P0): Fix `useFramePreload` completion logic
2. **Texture Loader Refactor** (P1): Eliminate polling, add proper cleanup
3. **Configuration Consolidation** (P1): Single source of truth for frame counts and env vars
4. **Documentation Alignment** (P1): Update docs to match runtime reality
5. **Test Environment Improvements** (P2): Canvas mocking, R3F warnings, Three.js imports
6. **Code Quality Polish** (P2): Lint suppressions, barrel exports, Nginx security headers

**Note**: Run `/phasebuild` to generate session stubs.

## Technical Stack

- **Next.js 16.1.0** - App Router with static prerender
- **React 19.2.3** - UI framework
- **TypeScript 5.x** - Strict mode enabled
- **Tailwind CSS 4.x** - Utility-first styling
- **React Three Fiber** - WebGL/3D rendering with Three.js 0.170
- **Framer Motion 12.x** - Scroll animations and transitions
- **Zustand 5.x** - State management for loading/animation
- **Vitest** - Unit testing (590 tests)
- **Playwright** - E2E testing with axe-core accessibility checks

## Success Criteria

- [ ] `useFramePreload` handles frame failures gracefully (P0 resolved)
- [ ] No `setInterval` polling in `useTextureLoader` (P1 resolved)
- [ ] Single `FRAME_COUNTS` export used everywhere (P1 resolved)
- [ ] Docs match actual env var usage (P1 resolved)
- [ ] `npm run lint` passes with zero warnings
- [ ] `npm run type-check` passes with no errors
- [ ] `npm test` passes (590+ tests)
- [ ] Test output has reduced stderr noise (P2)
- [ ] No inline lint suppressions for import issues (P2)

## Risks

- **Regression risk**: Changes to preload/texture hooks could break existing animation behavior
  - Mitigation: Comprehensive existing test suite; add targeted tests for error paths
- **Cache behavior changes**: Modifying texture loader caching could affect GPU memory usage
  - Mitigation: Test on lower-memory devices; maintain LRU eviction logic
- **Documentation drift recurrence**: Manual docs can drift again over time
  - Mitigation: Consider adding doc generation or validation in CI

## Assumptions

- Existing 590 unit tests adequately cover happy-path behavior
- MinIO/Nginx asset serving infrastructure remains unchanged
- No concurrent major framework upgrades during remediation
- Development team has access to test devices for WebGL verification

## Design Decisions (Resolved)

The following questions were resolved with industry-standard approaches:

1. **Failed frame loads: Retry with exponential backoff, then treat as permanent after 3 attempts**
   - Rationale: Transient network issues are common; 3 retries with backoff (1s, 2s, 4s) handles most cases without blocking indefinitely

2. **Preload timeout: 30 seconds overall, with progress-based early completion**
   - Rationale: 30s is the standard "patient user" threshold; if 80%+ frames load, proceed with partial content

3. **Loading overlay behavior: Silent graceful degradation with partial content**
   - Rationale: Users prefer seeing content over error states; log failures for debugging but do not block UX

4. **Environment variable standardization: Use `NEXT_PUBLIC_ASSET_BASE_URL` with `/assets` prefix**
   - Rationale: Aligns with Nginx proxy path (`/assets/*`); more semantic than frame-specific naming

5. **Security headers: Nginx configuration is canonical (production deployment)**
   - Rationale: Coolify/Docker/Nginx is the sole production path; align all security headers in `docker/nginx/conf.d/default.conf`
