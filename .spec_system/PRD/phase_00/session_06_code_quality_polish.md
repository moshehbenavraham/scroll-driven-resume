# Session 06: Code Quality Polish

**Session ID**: `phase00-session06-code-quality-polish`
**Status**: Not Started
**Estimated Tasks**: ~15
**Estimated Duration**: 2-3 hours
**Priority**: P2 - Nice to Have

---

## Objective

Remove inline lint suppressions, complete or remove incomplete barrel exports, and review Nginx security headers for consistency across deployment paths.

---

## Scope

### In Scope (MVP)
- Remove inline lint suppressions by restructuring imports
- Fix `ParallaxContainer.tsx` duplicate-imports suppression
- Complete or remove incomplete barrel exports (`components/sections/index.ts`)
- Review and align security headers across Vercel and Nginx configs
- Pin Docker image versions for reproducibility

### Out of Scope
- Full security audit
- CSP implementation (deferred)
- Dependency vulnerability remediation (deferred)
- New feature development

---

## Prerequisites

- [ ] Sessions 01-05 completed
- [ ] Understand current lint suppressions in codebase
- [ ] Review barrel export patterns
- [ ] Existing tests pass (`npm test`)

---

## Deliverables

1. Zero inline `eslint-disable` comments for import issues
2. Complete or removed barrel exports
3. Aligned security headers (Vercel ↔ Nginx)
4. Pinned Docker image versions
5. All existing tests still pass

---

## Technical Details

### Current Issues (from audit)

#### Lint Suppressions
- `components/parallax/ParallaxContainer.tsx` uses `no-duplicate-imports` suppression
- Can be resolved with combined import syntax: `import { X, type Y } from 'module'`

#### Barrel Export Drift
- `components/sections/index.ts` only exports `HeroSection`
- Other sections imported directly from their files
- Either complete the barrel or remove it

#### Security Header Parity
Current differences between Vercel and Nginx:
- `X-Frame-Options`: `DENY` (Vercel) vs `SAMEORIGIN` (Nginx)
- Nginx is canonical for production (Docker/Coolify)

### Design Decision (from PRD)
> **Security headers: Nginx configuration is canonical (production deployment)**
> Rationale: Coolify/Docker/Nginx is the sole production path; align all security headers in `docker/nginx/conf.d/default.conf`

### Solution Approach

#### Import Restructuring
```typescript
// Before
import { MotionValue } from 'framer-motion';
import type { MotionProps } from 'framer-motion'; // eslint-disable-line no-duplicate-imports

// After
import { MotionValue, type MotionProps } from 'framer-motion';
```

#### Barrel Export Decision
Either:
1. Complete barrel: export all sections from `index.ts`
2. Remove barrel: delete `index.ts` if not providing value

#### Docker Image Pinning
```yaml
# Before
image: minio/minio:latest

# After
image: minio/minio:RELEASE.2024-XX-XX
```

---

## Success Criteria

- [ ] No `eslint-disable` comments for `no-duplicate-imports`
- [ ] Barrel exports complete or removed
- [ ] Security headers aligned (Nginx canonical)
- [ ] Docker images pinned to specific versions
- [ ] All existing unit tests pass
- [ ] `npm run lint` passes with zero warnings
- [ ] `npm run type-check` passes with no errors
- [ ] `npm run build` succeeds
- [ ] Phase 00 complete - all 6 sessions done
