# Session Specification

**Session ID**: `phase00-session05-animation-libraries`
**Phase**: 00 - Foundation
**Status**: Not Started
**Created**: 2025-12-21

---

## 1. Session Overview

This session transforms the static Next.js 16 foundation into an animation-ready platform by installing and configuring the complete animation and UI library ecosystem. The project's core value proposition--scroll-synchronized frame animation, parallax layering, and WebGL effects--depends entirely on the libraries configured here.

The session focuses on clean integration without implementing actual animations. This separation of concerns ensures each library is properly configured, type-safe, and conflict-free before building the scroll/parallax hooks in Session 06 and the loading system in Session 07. By the end of this session, developers can import Framer Motion, Three.js/R3F, Zustand, and shadcn/ui components anywhere in the codebase with full TypeScript support.

Key integration challenges include ensuring Three.js works with Next.js SSR (requires dynamic imports), verifying Framer Motion 12 compatibility with React 19, and initializing shadcn/ui with the existing Tailwind CSS 4 configuration.

---

## 2. Objectives

1. **Install animation libraries** - Configure Framer Motion 12, Three.js, React Three Fiber, and @react-three/drei with proper TypeScript types
2. **Initialize UI component system** - Set up shadcn/ui with Radix UI primitives, creating Button and Card base components
3. **Configure state management** - Install Zustand and create animation state store skeleton
4. **Add utility libraries** - Install Lucide React icons and class-variance-authority for component variants
5. **Verify integration** - Create demo components proving all libraries work together without conflicts

---

## 3. Prerequisites

### Required Sessions
- [x] `phase00-session04-nextjs-bootstrap` - Provides Next.js 16, React 19, TypeScript, Tailwind CSS 4, and cn() utility

### Required Tools/Knowledge
- Understanding of npm/package.json dependency management
- Familiarity with React component patterns
- Basic knowledge of Framer Motion and Three.js concepts

### Environment Requirements
- Node.js 20+ installed
- npm 10+ available
- Project runs without errors (`npm run dev`)
- Docker stack running (MinIO assets accessible for future testing)

---

## 4. Scope

### In Scope (MVP)
- Install Framer Motion 12 with React 19 compatibility verification
- Install Three.js + @react-three/fiber + @react-three/drei
- Create dynamic import wrapper for R3F Canvas (SSR safety)
- Initialize shadcn/ui CLI and configure components.json
- Add Button and Card shadcn/ui components
- Install Zustand and create stores/ directory structure
- Create animation state store skeleton (loading progress, animation flags)
- Install Lucide React for icons
- Install class-variance-authority (cva) for component variants
- Create MotionDemo component (Framer Motion verification)
- Create ThreeDemo component (R3F Canvas verification)
- Create UIDemo component (shadcn/ui + icons verification)
- Create integration test page at /demo route
- Update package.json with all new dependencies
- Document bundle size impact

### Out of Scope (Deferred)
- Scroll/parallax hooks - *Session 06*
- Loading screen component - *Session 07*
- Actual frame animation implementation - *Phase 01*
- WebGL particle/shader effects - *Phase 01*
- Additional shadcn/ui components beyond Button/Card - *As needed*

---

## 5. Technical Approach

### Architecture

```
lib/
  cn.ts                    # Already exists - clsx + tailwind-merge
  utils.ts                 # Already exists - general utilities

components/
  ui/
    button.tsx             # shadcn/ui Button component
    card.tsx               # shadcn/ui Card component
    theme-toggle.tsx       # Already exists
  three/
    canvas-wrapper.tsx     # Dynamic import wrapper for R3F
    scene.tsx              # Basic Three.js scene component
  demo/
    motion-demo.tsx        # Framer Motion verification
    three-demo.tsx         # R3F Canvas verification
    ui-demo.tsx            # shadcn/ui + Lucide verification

stores/
  animation-store.ts       # Zustand store for animation state
  index.ts                 # Store exports

app/
  demo/
    page.tsx               # Integration test page
```

### Design Patterns
- **Dynamic Imports**: R3F components use `next/dynamic` with `ssr: false` to avoid SSR hydration errors
- **Client Components**: All animation/Three.js components marked with `"use client"` directive
- **Zustand Slices**: Store organized with clear state slices for loading, animation, and preferences
- **CVA Variants**: Button component uses class-variance-authority for type-safe variant props

### Technology Stack
- **Framer Motion 12.x** - Latest stable with improved scroll APIs
- **Three.js 0.170.x** - Latest stable (check compatibility)
- **@react-three/fiber 9.x** - React 19 compatible version
- **@react-three/drei 10.x** - Helper components for R3F
- **Zustand 5.x** - Latest with React 19 support
- **Lucide React 0.468.x** - Latest icon set
- **class-variance-authority 0.7.x** - Component variant management
- **@radix-ui/react-slot** - Required for shadcn/ui Button asChild

---

## 6. Deliverables

### Files to Create
| File | Purpose | Est. Lines |
|------|---------|------------|
| `components/ui/button.tsx` | shadcn/ui Button with CVA variants | ~60 |
| `components/ui/card.tsx` | shadcn/ui Card component set | ~80 |
| `components/three/canvas-wrapper.tsx` | Dynamic R3F Canvas wrapper | ~25 |
| `components/three/scene.tsx` | Basic Three.js test scene | ~40 |
| `components/demo/motion-demo.tsx` | Framer Motion verification | ~50 |
| `components/demo/three-demo.tsx` | R3F Canvas verification | ~35 |
| `components/demo/ui-demo.tsx` | shadcn/ui + Lucide verification | ~60 |
| `stores/animation-store.ts` | Zustand animation state store | ~45 |
| `stores/index.ts` | Store exports | ~10 |
| `app/demo/page.tsx` | Integration test page | ~80 |
| `components.json` | shadcn/ui configuration | ~20 |

### Files to Modify
| File | Changes | Est. Delta |
|------|---------|------------|
| `package.json` | Add 8 new dependencies | +15 lines |
| `tailwind.config.ts` | Add tailwindcss-animate plugin (if needed) | +5 lines |
| `tsconfig.json` | Verify paths alias for @/ | +2 lines |

---

## 7. Success Criteria

### Functional Requirements
- [ ] Framer Motion `motion.div` animates on page load
- [ ] R3F Canvas renders a rotating 3D cube without SSR errors
- [ ] shadcn/ui Button renders with all variant styles
- [ ] shadcn/ui Card renders with proper styling
- [ ] Lucide icons render at specified sizes
- [ ] Zustand store state updates trigger re-renders
- [ ] /demo page displays all verification components

### Testing Requirements
- [ ] `npm run build` completes without errors
- [ ] `npm run type-check` passes with zero errors
- [ ] `npm run lint` passes with zero warnings
- [ ] /demo page loads without console errors
- [ ] R3F Canvas renders on page refresh (no hydration mismatch)

### Quality Gates
- [ ] All files use ASCII-only characters (0-127)
- [ ] Unix LF line endings throughout
- [ ] No `any` types in production code
- [ ] All components have TypeScript prop interfaces
- [ ] No unused dependencies in package.json
- [ ] Bundle size increase documented in session notes

---

## 8. Implementation Notes

### Key Considerations

**Framer Motion 12 + React 19**: Framer Motion 12 officially supports React 19. No special configuration needed, but verify the motion component renders correctly.

**Three.js SSR Handling**: Three.js accesses `window` and `document` which don't exist during SSR. The canvas-wrapper.tsx must use:
```tsx
import dynamic from "next/dynamic";
const Scene = dynamic(() => import("./scene"), { ssr: false });
```

**shadcn/ui Initialization**: Run `npx shadcn@latest init` but be careful with existing Tailwind config. May need to manually merge rather than overwrite. The CLI will create components.json for future component additions.

**Zustand Store Structure**: Create a minimal store that will be expanded in Session 07:
```tsx
interface AnimationState {
  isLoading: boolean;
  loadProgress: number;
  prefersReducedMotion: boolean;
}
```

### Potential Challenges

| Challenge | Mitigation |
|-----------|------------|
| R3F hydration errors | Use dynamic import with ssr: false |
| shadcn/ui overwrites tailwind.config | Review diff, manually merge if needed |
| Three.js bundle size (~600KB) | Verify tree-shaking, consider code-splitting |
| Framer Motion + React 19 | Use latest FM version, test thoroughly |
| CVA + Tailwind CSS 4 | Verify class generation works correctly |

### ASCII Reminder
All output files must use ASCII-only characters (0-127). No smart quotes, em dashes, or special Unicode characters in code comments or strings.

---

## 9. Testing Strategy

### Unit Tests
- Not required for this session (library configuration only)
- Store logic will be tested in Session 07

### Integration Tests
- The /demo page serves as the integration test
- Visual verification that all libraries render correctly

### Manual Testing
1. Run `npm run dev` and navigate to /demo
2. Verify Framer Motion animation plays on load
3. Verify 3D cube renders and rotates
4. Click Button variants, verify styling
5. Check Card component layout
6. Verify icons render at correct sizes
7. Open React DevTools, verify Zustand store state
8. Test in Chrome, Firefox, Safari (if available)
9. Test dark mode toggle affects all components

### Edge Cases
- Page refresh: R3F Canvas should re-render without errors
- Fast navigation: No memory leaks from Three.js
- prefers-reduced-motion: Motion components should respect (read from store)
- Missing WebGL: Canvas should show fallback or error boundary

---

## 10. Dependencies

### External Libraries (to install)
| Library | Version | Size Impact |
|---------|---------|-------------|
| framer-motion | ^12.0.0 | ~150KB gzipped |
| three | ^0.170.0 | ~600KB (tree-shakeable) |
| @react-three/fiber | ^9.0.0 | ~50KB |
| @react-three/drei | ^10.0.0 | Varies by imports |
| zustand | ^5.0.0 | ~3KB |
| lucide-react | ^0.468.0 | ~5KB (tree-shakeable) |
| class-variance-authority | ^0.7.0 | ~2KB |
| @radix-ui/react-slot | ^1.1.0 | ~2KB |

### Already Installed
- clsx ^2.1.1
- tailwind-merge ^3.4.0
- next-themes ^0.4.6

### Other Sessions
- **Depends on**: phase00-session04-nextjs-bootstrap (completed)
- **Depended by**: phase00-session06-scroll-parallax-utilities, phase00-session07-loading-system

---

## 11. Bundle Size Tracking

Document the before/after bundle sizes:

```
Before Session 05:
- First Load JS: [measure with npm run build]

After Session 05:
- First Load JS: [measure with npm run build]
- Delta: [calculate difference]
```

Expected increase: ~200-300KB gzipped due to Three.js and Framer Motion. This is acceptable given the animation-heavy nature of the project.

---

## Next Steps

Run `/tasks` to generate the implementation task checklist.
