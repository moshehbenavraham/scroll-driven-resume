# Task Checklist

**Session ID**: `phase00-session04-nextjs-bootstrap`
**Total Tasks**: 24
**Estimated Duration**: 8-10 hours
**Created**: 2025-12-21

---

## Legend

- `[x]` = Completed
- `[ ]` = Pending
- `[P]` = Parallelizable (can run with other [P] tasks)
- `[S0004]` = Session reference (Phase 00, Session 04)
- `TNNN` = Task ID

---

## Progress Summary

| Category | Total | Done | Remaining |
|----------|-------|------|-----------|
| Setup | 4 | 4 | 0 |
| Foundation | 6 | 6 | 0 |
| Implementation | 10 | 10 | 0 |
| Testing | 4 | 4 | 0 |
| **Total** | **24** | **24** | **0** |

---

## Setup (4 tasks)

Initial project scaffolding and environment preparation.

- [x] T001 [S0004] Initialize Next.js 15 project with TypeScript and App Router (`npx create-next-app@latest`)
- [x] T002 [S0004] Create directory structure for components, lib, hooks, types (`components/`, `lib/`, `hooks/`, `types/`)
- [x] T003 [S0004] Configure TypeScript strict mode and path aliases (`tsconfig.json`)
- [x] T004 [S0004] Create environment variable files (`.env.local`, `.env.example`)

---

## Foundation (6 tasks)

Core configuration and tooling setup.

- [x] T005 [S0004] Install and configure Tailwind CSS 4 with PostCSS (`tailwind.config.ts`, `postcss.config.mjs`)
- [x] T006 [S0004] Configure ESLint 9 with flat config and plugins (`eslint.config.mjs`)
- [x] T007 [S0004] Configure Prettier with Tailwind class sorting plugin (`prettier.config.mjs`)
- [x] T008 [S0004] Create cn() class merge utility with clsx and tailwind-merge (`lib/cn.ts`)
- [x] T009 [S0004] Create general utility functions module (`lib/utils.ts`)
- [x] T010 [S0004] Define shared TypeScript type definitions (`types/index.ts`)

---

## Implementation (10 tasks)

Main feature implementation for theming and layout.

- [x] T011 [S0004] Configure next/font for display and body fonts (`app/fonts.ts`)
- [x] T012 [S0004] Create CSS variable theme token system in globals.css (`app/globals.css`)
- [x] T013 [S0004] Map CSS variables to Tailwind theme configuration (`tailwind.config.ts`)
- [x] T014 [S0004] Create ThemeProvider wrapper component (`components/providers/theme-provider.tsx`)
- [x] T015 [S0004] Create ThemeToggle button component (`components/ui/theme-toggle.tsx`)
- [x] T016 [S0004] Create root layout with providers and metadata (`app/layout.tsx`)
- [x] T017 [S0004] Create placeholder home page with theme toggle (`app/page.tsx`)
- [x] T018 [S0004] Configure next.config.ts with image domains and options (`next.config.ts`)
- [x] T019 [S0004] Update package.json with all required scripts (`package.json`)
- [x] T020 [S0004] [P] Create placeholder directories with .gitkeep (`components/sections/`, `hooks/`)

---

## Testing (4 tasks)

Verification and quality assurance.

- [x] T021 [S0004] Run type-check and fix any TypeScript errors (`npm run type-check`)
- [x] T022 [S0004] Run lint and fix any ESLint errors (`npm run lint`)
- [x] T023 [S0004] Run production build and verify zero warnings (`npm run build`)
- [x] T024 [S0004] Manual testing: theme toggle, font loading, persistence, system preference

---

## Completion Checklist

Before marking session complete:

- [ ] All tasks marked `[x]`
- [ ] `npm run dev` starts without errors
- [ ] `npm run build` completes with zero warnings
- [ ] `npm run lint` passes with zero errors
- [ ] `npm run type-check` passes with zero errors
- [ ] Theme toggle works correctly in both modes
- [ ] Theme persists across page refreshes
- [ ] System color scheme preference detected
- [ ] Fonts load without layout shift (FOUT eliminated)
- [ ] All files ASCII-encoded (0-127)
- [ ] implementation-notes.md updated
- [ ] Ready for `/validate`

---

## Notes

### Parallelization

Task T020 is marked `[P]` as it creates empty placeholder directories that don't depend on other tasks.

Most tasks in this session are sequential due to configuration dependencies:
- Tailwind config needed before CSS variables
- CSS variables needed before theme provider
- Theme provider needed before layout
- Layout needed before page

### Task Timing

Target ~20-25 minutes per task. Some tasks (T005, T006, T012) may take longer due to configuration complexity.

### Dependencies

Complete tasks in order unless marked `[P]`:
- T001-T004: Sequential project setup
- T005-T010: Sequential config (ESLint needs packages, Tailwind needs PostCSS)
- T011-T020: Sequential features (each builds on previous)
- T021-T024: Sequential validation (type-check before lint before build)

### Critical Paths

1. **Tailwind CSS 4**: New oxide engine has different config patterns from v3
2. **ESLint 9 Flat Config**: Plugin compatibility must be verified
3. **next-themes**: Requires suppressHydrationWarning on html element

### Package Installation Order

```bash
# Step 1: Core Next.js (handled by create-next-app)
# Step 2: Tailwind CSS 4
npm install -D tailwindcss@latest @tailwindcss/postcss@latest postcss

# Step 3: ESLint 9 ecosystem
npm install -D eslint@latest @eslint/js typescript-eslint eslint-plugin-react eslint-plugin-react-hooks @next/eslint-plugin-next

# Step 4: Prettier and plugins
npm install -D prettier prettier-plugin-tailwindcss

# Step 5: Theme and utilities
npm install next-themes clsx tailwind-merge
```

---

## Next Steps

Run `/implement` to begin AI-led implementation.
