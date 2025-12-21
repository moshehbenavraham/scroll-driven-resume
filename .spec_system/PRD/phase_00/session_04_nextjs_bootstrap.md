# Session 04: Next.js Bootstrap

**Session ID**: `phase00-session04-nextjs-bootstrap`
**Status**: Not Started
**Estimated Tasks**: ~25-30
**Estimated Duration**: 3-4 hours

---

## Objective

Initialize the Next.js 15 project with TypeScript strict mode, Tailwind CSS 4, ESLint 9 flat config, and Prettier with proper project structure.

---

## Scope

### In Scope (MVP)
- Initialize Next.js 15 with App Router and TypeScript
- Configure TypeScript with strict mode (no implicit any)
- Install and configure Tailwind CSS 4 with oxide engine
- Set up ESLint 9 with flat config (next, typescript plugins)
- Configure Prettier with Tailwind plugin
- Create base project structure (app/, components/, lib/, hooks/, types/)
- Set up next/font for optimized font loading
- Configure next-themes for dark/light mode foundation
- Create base layout with theme provider
- Verify zero lint errors, zero type errors

### Out of Scope
- Animation libraries (Session 05)
- UI component libraries (Session 05)
- Scroll/parallax utilities (Session 06)

---

## Prerequisites

- [ ] Node.js 20+ installed
- [ ] Session 03 completed (asset URLs known for environment config)

---

## Deliverables

1. Next.js 15 project initialized with App Router
2. TypeScript configuration with strict mode enabled
3. Tailwind CSS 4 configured with custom theme tokens
4. ESLint 9 flat config (`eslint.config.mjs`)
5. Prettier configuration with Tailwind plugin
6. Base project structure:
   ```
   app/
   ├── layout.tsx
   ├── page.tsx
   └── globals.css
   components/
   ├── ui/
   └── sections/
   lib/
   ├── utils.ts
   └── cn.ts
   hooks/
   types/
   ```
7. Theme provider with dark/light mode support
8. Custom font configuration via next/font

---

## Success Criteria

- [ ] `npm run dev` starts without errors
- [ ] `npm run build` completes with zero warnings
- [ ] `npm run lint` passes with zero errors
- [ ] TypeScript strict mode enabled and working
- [ ] Tailwind CSS 4 classes applying correctly
- [ ] Dark/light mode toggle functioning
- [ ] Custom fonts loading without layout shift
- [ ] Base page renders with placeholder content
