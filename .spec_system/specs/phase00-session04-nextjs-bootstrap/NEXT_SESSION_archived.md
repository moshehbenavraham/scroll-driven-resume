# NEXT_SESSION.md

## Session Recommendation

**Generated**: 2025-12-21
**Project State**: Phase 00 - Foundation
**Completed Sessions**: 3 of 7

---

## Recommended Next Session

**Session ID**: `phase00-session04-nextjs-bootstrap`
**Session Name**: Next.js Bootstrap
**Estimated Duration**: 3-4 hours
**Estimated Tasks**: 25-30

---

## Why This Session Next?

### Prerequisites Met
- [x] Node.js 20+ installed
- [x] Session 03 completed (asset URLs known for environment config)
- [x] Docker infrastructure operational (MinIO serving optimized WebP frames)

### Dependencies
- **Builds on**: Session 03 (Asset Deployment) - provides CDN URLs for environment configuration
- **Enables**: Session 05 (Animation Libraries), Session 06 (Scroll/Parallax), Session 07 (Loading System)

### Project Progression

Session 04 is the critical inflection point from infrastructure to application development. The first three sessions established the foundation:

1. **Session 01** optimized 45MB of frame assets down to web-ready WebP sequences
2. **Session 02** created the Docker stack (MinIO + PostgreSQL + Nginx) for self-hosted asset delivery
3. **Session 03** deployed 672 optimized frames to MinIO with CDN-like caching via Nginx

With assets deployed and accessible, we now shift to building the Next.js application that will consume them. Session 04 initializes the entire frontend foundation - the project structure, tooling, and configuration that every subsequent session depends on. This is the gateway to Phase 01's core animation work.

---

## Session Overview

### Objective

Initialize the Next.js 15 project with TypeScript strict mode, Tailwind CSS 4, ESLint 9 flat config, and Prettier with proper project structure.

### Key Deliverables
1. Next.js 15 project with App Router and TypeScript strict mode
2. Tailwind CSS 4 configured with custom theme tokens (CSS variables)
3. ESLint 9 flat config + Prettier with Tailwind plugin
4. Base project structure: `app/`, `components/`, `lib/`, `hooks/`, `types/`
5. Theme provider with dark/light mode via next-themes
6. Custom font configuration via next/font (zero layout shift)
7. Base layout rendering with placeholder content
8. Zero lint errors, zero type errors, zero warnings

### Scope Summary
- **In Scope (MVP)**: Project initialization, TypeScript config, Tailwind 4, ESLint 9, Prettier, folder structure, next-themes, next/font, base layout
- **Out of Scope**: Animation libraries (Session 05), UI component libraries (Session 05), scroll/parallax utilities (Session 06)

---

## Technical Considerations

### Technologies/Patterns
- **Next.js 15** with App Router and React Server Components
- **TypeScript 5.x** with strict mode (no implicit any)
- **Tailwind CSS 4** with oxide engine and CSS variable theme tokens
- **ESLint 9** flat config (`eslint.config.mjs`) with Next.js and TypeScript plugins
- **Prettier** with tailwind-prettier-plugin for class sorting
- **next-themes** for dark/light mode with system preference detection
- **next/font** for optimized font loading without layout shift

### Potential Challenges
- **Tailwind CSS 4 configuration**: New oxide engine has different configuration patterns than v3
- **ESLint 9 flat config**: Migration from `.eslintrc` to `eslint.config.mjs` requires plugin compatibility checks
- **TypeScript strict mode**: May surface type issues in third-party libraries
- **Font loading**: Choosing appropriate display/body fonts that match the design philosophy

### Asset Integration
The MinIO asset URLs from Session 03 should be configured in environment variables:
```
NEXT_PUBLIC_ASSET_BASE_URL=http://localhost:9000/resume-assets
```

---

## Alternative Sessions

If this session is blocked:

1. **None applicable** - Session 04 is a hard dependency for all remaining Phase 00 sessions. There are no viable alternatives within Phase 00.

2. **Phase 01 planning** - If Node.js or tooling issues block Session 04, time could be spent planning Phase 01 session specifications via `/phasebuild` for the Core Animation phase.

---

## Verification Checklist

After session completion, verify:
- [ ] `npm run dev` starts without errors
- [ ] `npm run build` completes with zero warnings
- [ ] `npm run lint` passes with zero errors
- [ ] TypeScript strict mode enabled and enforced
- [ ] Tailwind CSS 4 classes applying correctly
- [ ] Dark/light mode toggle functioning
- [ ] Custom fonts loading without layout shift
- [ ] Base page renders with placeholder content

---

## Next Steps

Run `/sessionspec` to generate the formal specification with detailed task breakdown.
