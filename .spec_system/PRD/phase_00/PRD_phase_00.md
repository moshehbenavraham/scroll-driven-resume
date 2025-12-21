# PRD Phase 00: Foundation

**Status**: In Progress
**Sessions**: 7 (initial estimate)
**Estimated Duration**: 14-21 hours (across multiple days)

**Progress**: 1/7 sessions (14%)

---

## Overview

Establish the core infrastructure for the scroll-synchronized frame animated parallax portfolio. This phase covers asset optimization, Docker stack setup, Next.js project initialization, library configuration, core animation utilities, and the loading system.

---

## Progress Tracker

| Session | Name | Status | Est. Tasks | Validated |
|---------|------|--------|------------|-----------|
| 01 | Asset Optimization | Complete | 22 | 2025-12-21 |
| 02 | Docker Infrastructure | Not Started | ~20-25 | - |
| 03 | Asset Deployment | Not Started | ~15-20 | - |
| 04 | Next.js Bootstrap | Not Started | ~25-30 | - |
| 05 | Animation & UI Libraries | Not Started | ~20-25 | - |
| 06 | Scroll & Parallax Utilities | Not Started | ~20-25 | - |
| 07 | Loading System | Not Started | ~20-25 | - |

---

## Completed Sessions

### Session 01: Asset Optimization
- **Completed**: 2025-12-21
- **Tasks**: 22/22
- **Summary**: Optimized hero and product frame sequences to meet storage targets using WebP encoding at Q32-Q22 quality levels

---

## Upcoming Sessions

- Session 01: Asset Optimization (BLOCKER - must complete first)

---

## Objectives

1. **Optimize frame assets** - Reduce hero/product sequences to under 10MB each, create mobile variants under 5MB each
2. **Set up Docker infrastructure** - MinIO + PostgreSQL + Nginx stack for asset storage and CDN-like delivery
3. **Upload and verify assets** - Deploy optimized frames to MinIO, verify Nginx caching and CORS
4. **Initialize Next.js project** - Next.js 15 with TypeScript strict, Tailwind CSS 4, ESLint 9 flat config
5. **Configure animation ecosystem** - Framer Motion 12, Three.js/R3F, Radix UI, shadcn/ui
6. **Build core utilities** - Scroll and parallax hooks for frame animation system
7. **Implement loading system** - Loading screen with progress tracking and content reveal

---

## Prerequisites

- Node.js 20+ installed
- Docker and Docker Compose installed
- Source frame sequences available in `docs/media-assets/`
- ImageMagick or cwebp CLI tools for asset optimization

---

## Technical Considerations

### Architecture
- Self-hosted Docker stack for local development
- Next.js App Router with React Server Components
- Client-side animation with Framer Motion and React Three Fiber
- Zustand for client state management

### Technologies
- Next.js 15, React 19, TypeScript 5.x
- Tailwind CSS 4 (oxide engine)
- Framer Motion 12, Three.js, React Three Fiber
- MinIO, PostgreSQL, Nginx (Docker)
- Radix UI, shadcn/ui, Lucide React

### Risks
- **Asset size**: Sequences may not compress to target size without quality loss - mitigate with quality testing and potential frame decimation
- **Docker complexity**: Local Docker stack adds setup overhead - mitigate with clear documentation and health checks
- **Library conflicts**: Multiple animation libraries may conflict - mitigate with isolated testing and dynamic imports

---

## Success Criteria

Phase complete when:
- [ ] All 7 sessions completed
- [ ] Hero sequence optimized to < 10MB (mobile < 5MB)
- [ ] Product sequence optimized to < 10MB (mobile < 5MB)
- [ ] Docker stack operational with MinIO serving assets via Nginx
- [ ] Next.js 15 running with zero lint errors, zero type errors
- [ ] All animation and UI libraries configured and verified
- [ ] Scroll and parallax hooks tested and documented
- [ ] Loading screen functioning with progress and reveal animation

---

## Dependencies

### Depends On
- (None - this is the foundation phase)

### Enables
- Phase 01: Core Animation
- Phase 02: Content and Polish
