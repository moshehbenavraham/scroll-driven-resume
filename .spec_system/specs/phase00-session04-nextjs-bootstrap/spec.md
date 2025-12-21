# Session Specification

**Session ID**: `phase00-session04-nextjs-bootstrap`
**Phase**: 00 - Foundation
**Status**: Not Started
**Created**: 2025-12-21

---

## 1. Session Overview

This session marks the critical transition from infrastructure to application development. With the asset pipeline complete (672 optimized WebP frames deployed to MinIO with CDN-like caching via Nginx), we now build the Next.js application that will consume these assets and deliver the cinematic portfolio experience.

Session 04 establishes the entire frontend foundation: project initialization, tooling configuration, type safety enforcement, and theming infrastructure. Every subsequent session in Phase 00 and beyond depends on this foundation. The goal is a pristine, zero-error codebase with modern tooling that enforces quality from the start.

We use Next.js 15 with App Router for optimal performance via React Server Components, TypeScript strict mode to catch errors at compile time, Tailwind CSS 4 with the new oxide engine for styling, and a robust linting/formatting pipeline with ESLint 9 flat config and Prettier. The theme system via next-themes provides dark/light mode with system preference detection, and next/font eliminates font loading layout shift.

---

## 2. Objectives

1. Initialize a production-ready Next.js 15 project with App Router, TypeScript strict mode, and zero configuration errors
2. Configure Tailwind CSS 4 with custom CSS variable theme tokens for colors, typography, and spacing
3. Establish code quality enforcement via ESLint 9 flat config and Prettier with Tailwind class sorting
4. Create a clean, scalable project structure with proper separation of concerns
5. Implement dark/light mode theming infrastructure with system preference detection

---

## 3. Prerequisites

### Required Sessions
- [x] `phase00-session01-asset-optimization` - Optimized WebP frame sequences
- [x] `phase00-session02-docker-infrastructure` - Docker stack (MinIO + PostgreSQL + Nginx)
- [x] `phase00-session03-asset-deployment` - Assets deployed to MinIO with CDN URLs

### Required Tools/Knowledge
- Node.js 20+ and npm/pnpm package manager
- Understanding of Next.js 15 App Router patterns
- Familiarity with TypeScript strict mode
- Knowledge of Tailwind CSS 4 configuration

### Environment Requirements
- Docker stack running (for asset URL verification)
- Terminal access with npm/pnpm
- Code editor with TypeScript support

---

## 4. Scope

### In Scope (MVP)
- Initialize Next.js 15 with App Router and TypeScript
- Configure TypeScript with strict mode (no implicit any, strict null checks)
- Install and configure Tailwind CSS 4 with oxide engine
- Set up ESLint 9 with flat config (next, typescript, import plugins)
- Configure Prettier with Tailwind class sorting plugin
- Create base project structure (app/, components/, lib/, hooks/, types/)
- Set up next/font for optimized font loading (display + body fonts)
- Configure next-themes for dark/light mode foundation
- Create base layout with theme provider and metadata
- Create placeholder home page with theme toggle
- Configure environment variables for asset URLs
- Verify all quality gates pass (lint, type-check, build)

### Out of Scope (Deferred)
- **Framer Motion** - *Reason: Session 05 scope*
- **Three.js / React Three Fiber** - *Reason: Session 05 scope*
- **Radix UI / shadcn/ui** - *Reason: Session 05 scope*
- **Zustand state management** - *Reason: Session 05 scope*
- **Scroll/parallax hooks** - *Reason: Session 06 scope*
- **Loading screen component** - *Reason: Session 07 scope*
- **Actual content sections** - *Reason: Phase 01/02 scope*

---

## 5. Technical Approach

### Architecture

```
modern-resume-site/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Home page (placeholder)
│   ├── globals.css              # Global styles + Tailwind
│   └── fonts.ts                 # Font configuration
├── components/
│   ├── ui/                      # Reusable UI primitives
│   │   └── theme-toggle.tsx     # Dark/light mode toggle
│   ├── sections/                # Page sections (empty for now)
│   └── providers/
│       └── theme-provider.tsx   # next-themes wrapper
├── lib/
│   ├── utils.ts                 # General utilities
│   └── cn.ts                    # Class name merge utility
├── hooks/                       # Custom React hooks (empty for now)
├── types/
│   └── index.ts                 # Shared TypeScript types
├── public/                      # Static assets
├── eslint.config.mjs            # ESLint 9 flat config
├── prettier.config.mjs          # Prettier configuration
├── tailwind.config.ts           # Tailwind CSS 4 config
├── tsconfig.json                # TypeScript configuration
├── next.config.ts               # Next.js configuration
├── .env.local                   # Environment variables
└── package.json                 # Dependencies and scripts
```

### Design Patterns
- **App Router patterns**: Server Components by default, 'use client' only when needed
- **Provider pattern**: ThemeProvider wraps app for dark/light mode context
- **Utility-first CSS**: Tailwind classes composed via cn() helper
- **Strict typing**: All exports typed, no implicit any, no type assertions without validation

### Technology Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.x | React framework with App Router |
| React | 19.x | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Utility-first CSS |
| ESLint | 9.x | Linting with flat config |
| Prettier | 3.x | Code formatting |
| next-themes | 0.4.x | Theme management |

---

## 6. Deliverables

### Files to Create
| File | Purpose | Est. Lines |
|------|---------|------------|
| `app/layout.tsx` | Root layout with metadata, fonts, theme provider | ~50 |
| `app/page.tsx` | Placeholder home page with theme toggle | ~40 |
| `app/globals.css` | Global styles, Tailwind directives, CSS variables | ~80 |
| `app/fonts.ts` | next/font configuration for display and body fonts | ~25 |
| `components/providers/theme-provider.tsx` | next-themes provider wrapper | ~20 |
| `components/ui/theme-toggle.tsx` | Dark/light mode toggle button | ~35 |
| `lib/utils.ts` | General utility functions | ~15 |
| `lib/cn.ts` | clsx + tailwind-merge utility | ~10 |
| `types/index.ts` | Shared TypeScript type definitions | ~20 |
| `eslint.config.mjs` | ESLint 9 flat config | ~60 |
| `prettier.config.mjs` | Prettier configuration | ~15 |
| `tailwind.config.ts` | Tailwind CSS 4 configuration with theme tokens | ~80 |
| `next.config.ts` | Next.js configuration | ~25 |
| `.env.local` | Environment variables (asset URLs) | ~5 |
| `.env.example` | Example environment file for documentation | ~5 |

### Files to Modify
| File | Changes | Est. Lines |
|------|---------|------------|
| `tsconfig.json` | Enable strict mode, configure paths | ~10 |
| `package.json` | Add scripts, dependencies | ~30 |

### Directories to Create
| Directory | Purpose |
|-----------|---------|
| `components/ui/` | Reusable UI component primitives |
| `components/sections/` | Page section components |
| `components/providers/` | Context providers |
| `lib/` | Utility functions and helpers |
| `hooks/` | Custom React hooks |
| `types/` | TypeScript type definitions |

---

## 7. Success Criteria

### Functional Requirements
- [ ] `npm run dev` starts development server without errors
- [ ] `npm run build` completes with zero warnings
- [ ] `npm run lint` passes with zero errors
- [ ] `npm run type-check` passes with zero errors
- [ ] Home page renders with placeholder content
- [ ] Theme toggle switches between dark and light modes
- [ ] Theme persists across page refreshes
- [ ] System color scheme preference is detected
- [ ] Custom fonts load without layout shift (FOUT eliminated)
- [ ] Tailwind CSS classes apply correctly in both themes
- [ ] Environment variable `NEXT_PUBLIC_ASSET_BASE_URL` accessible

### Testing Requirements
- [ ] Manual testing of theme toggle in Chrome, Firefox, Safari
- [ ] Verify fonts load correctly (no FOUT)
- [ ] Verify dark/light mode styles apply correctly
- [ ] Test system preference detection (OS dark mode toggle)

### Quality Gates
- [ ] All files use ASCII-only characters (0-127)
- [ ] Unix LF line endings throughout
- [ ] No TypeScript `any` types (strict mode enforced)
- [ ] No ESLint warnings or errors
- [ ] Prettier formatting applied to all files
- [ ] No unused imports or variables
- [ ] All exports properly typed

---

## 8. Implementation Notes

### Key Considerations

**Tailwind CSS 4 Configuration**:
Tailwind v4 uses the new oxide engine with a different configuration approach. The `@config` directive in CSS replaces some JavaScript config patterns. CSS variables are first-class citizens for theming.

**ESLint 9 Flat Config**:
ESLint 9 uses `eslint.config.mjs` instead of `.eslintrc`. Plugins must be imported and configured differently. Some plugins may not yet support flat config - verify compatibility before installing.

**Font Selection**:
Choose fonts that align with the portfolio's premium aesthetic:
- Display font: Something distinctive (e.g., Space Grotesk, Clash Display, or similar)
- Body font: Clean, readable (e.g., Inter, Geist, or similar)
- Both must be available via next/font/google or next/font/local

**Theme CSS Variables**:
Define a complete token system in globals.css:
```css
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
  /* ... */
}
.dark {
  --background: 0 0% 3.9%;
  --foreground: 0 0% 98%;
  /* ... */
}
```

### Potential Challenges
- **Tailwind v4 breaking changes**: New config patterns may require adjustment from v3 examples
- **ESLint plugin compatibility**: Some plugins may not support flat config yet
- **next-themes hydration**: Ensure suppressHydrationWarning on html element
- **Font loading**: Large font files can impact LCP if not optimized

### ASCII Reminder
All output files must use ASCII-only characters (0-127). No curly quotes, em dashes, or special Unicode characters in code or config files.

---

## 9. Testing Strategy

### Unit Tests
- None required for this session (foundational setup only)
- Testing infrastructure can be added if time permits

### Integration Tests
- None required for this session

### Manual Testing
1. Start dev server and verify no console errors
2. Toggle theme and verify styles update correctly
3. Refresh page and verify theme persists
4. Check fonts load without layout shift
5. Run production build and verify no warnings
6. Run lint and verify zero errors

### Edge Cases
- System set to dark mode on first visit
- JavaScript disabled (graceful degradation)
- Slow network (font loading behavior)
- Theme toggle rapid clicks (debounce consideration)

---

## 10. Dependencies

### External Libraries
| Library | Version | Purpose |
|---------|---------|---------|
| next | ^15.0.0 | React framework |
| react | ^19.0.0 | UI library |
| react-dom | ^19.0.0 | React DOM |
| typescript | ^5.0.0 | Type checking |
| tailwindcss | ^4.0.0 | CSS framework |
| @tailwindcss/postcss | ^4.0.0 | PostCSS integration |
| postcss | ^8.0.0 | CSS processing |
| eslint | ^9.0.0 | Linting |
| @eslint/js | ^9.0.0 | ESLint base config |
| typescript-eslint | ^8.0.0 | TypeScript ESLint |
| eslint-plugin-react | latest | React linting rules |
| eslint-plugin-react-hooks | latest | Hooks linting rules |
| @next/eslint-plugin-next | latest | Next.js linting rules |
| prettier | ^3.0.0 | Code formatting |
| prettier-plugin-tailwindcss | latest | Tailwind class sorting |
| next-themes | ^0.4.0 | Theme management |
| clsx | ^2.0.0 | Conditional classes |
| tailwind-merge | ^2.0.0 | Tailwind class merging |

### Dev Dependencies
- @types/node
- @types/react
- @types/react-dom

### Other Sessions
- **Depends on**: Sessions 01, 02, 03 (asset pipeline complete)
- **Depended by**: Sessions 05, 06, 07 (all require this foundation)

---

## 11. Environment Variables

```bash
# .env.local
NEXT_PUBLIC_ASSET_BASE_URL=http://localhost:9000/resume-assets
```

```bash
# .env.example
# Asset delivery base URL (MinIO via Nginx cache)
NEXT_PUBLIC_ASSET_BASE_URL=http://localhost:9000/resume-assets
```

---

## 12. Package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . --max-warnings=0",
    "lint:fix": "eslint . --fix",
    "type-check": "tsc --noEmit",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

---

## Next Steps

Run `/tasks` to generate the implementation task checklist.
