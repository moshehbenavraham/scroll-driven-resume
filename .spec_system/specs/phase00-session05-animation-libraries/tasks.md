# Task Checklist

**Session ID**: `phase00-session05-animation-libraries`
**Total Tasks**: 23
**Estimated Duration**: 6-8 hours
**Created**: 2025-12-21

---

## Legend

- `[x]` = Completed
- `[ ]` = Pending
- `[P]` = Parallelizable (can run with other [P] tasks)
- `[S0005]` = Session reference (Phase 00, Session 05)
- `TNNN` = Task ID

---

## Progress Summary

| Category | Total | Done | Remaining |
|----------|-------|------|-----------|
| Setup | 4 | 4 | 0 |
| Foundation | 6 | 6 | 0 |
| Implementation | 9 | 9 | 0 |
| Testing | 4 | 4 | 0 |
| **Total** | **23** | **23** | **0** |

---

## Setup (4 tasks)

Initial configuration and environment preparation.

- [x] T001 [S0005] Verify prerequisites (Node 20+, npm 10+, dev server runs)
- [x] T002 [S0005] Measure baseline bundle size with `npm run build`
- [x] T003 [S0005] Create directory structure (`stores/`, `components/three/`, `components/demo/`)
- [x] T004 [S0005] Install all npm dependencies (framer-motion, three, @react-three/fiber, @react-three/drei, zustand, lucide-react, class-variance-authority, @radix-ui/react-slot)

---

## Foundation (6 tasks)

Core structures, stores, and shadcn/ui setup.

- [x] T005 [S0005] Initialize shadcn/ui and create `components.json` configuration
- [x] T006 [S0005] Verify/update `tailwind.config.ts` for shadcn/ui compatibility
- [x] T007 [S0005] Verify `tsconfig.json` has @/ path alias configured
- [x] T008 [S0005] Create Zustand animation store skeleton (`stores/animation-store.ts`)
- [x] T009 [S0005] Create store exports barrel file (`stores/index.ts`)
- [x] T010 [S0005] [P] Create shadcn/ui Button component with CVA variants (`components/ui/button.tsx`)

---

## Implementation (9 tasks)

Main component implementation.

- [x] T011 [S0005] [P] Create shadcn/ui Card component set (`components/ui/card.tsx`)
- [x] T012 [S0005] Create dynamic R3F Canvas wrapper with SSR safety (`components/three/canvas-wrapper.tsx`)
- [x] T013 [S0005] Create basic Three.js test scene component (`components/three/scene.tsx`)
- [x] T014 [S0005] [P] Create Framer Motion verification component (`components/demo/motion-demo.tsx`)
- [x] T015 [S0005] [P] Create R3F Canvas verification component (`components/demo/three-demo.tsx`)
- [x] T016 [S0005] [P] Create shadcn/ui + Lucide verification component (`components/demo/ui-demo.tsx`)
- [x] T017 [S0005] Create demo page route (`app/demo/page.tsx`)
- [x] T018 [S0005] Wire up all demo components on /demo page
- [x] T019 [S0005] Add prefers-reduced-motion detection to animation store

---

## Testing (4 tasks)

Verification and quality assurance.

- [x] T020 [S0005] Run `npm run build` and verify zero errors
- [x] T021 [S0005] Run `npm run type-check` and verify zero errors
- [x] T022 [S0005] Run `npm run lint` and verify zero warnings
- [x] T023 [S0005] Manual testing: verify /demo page, animations, 3D cube, dark mode

---

## Completion Checklist

Before marking session complete:

- [x] All tasks marked `[x]`
- [x] All tests passing (`npm run build`, `npm run type-check`, `npm run lint`)
- [x] All files ASCII-encoded (0-127 characters only)
- [x] Bundle size delta documented in implementation-notes.md
- [x] /demo page loads without console errors
- [x] R3F Canvas renders without hydration mismatch
- [x] Ready for `/validate`

---

## Notes

### Parallelization
Tasks marked `[P]` can be worked on simultaneously:
- T010, T011 (UI components)
- T014, T015, T016 (demo components)

### Task Dependencies
```
T001-T003 --> T004 (install packages)
T004 --> T005-T007 (config after packages)
T005-T007 --> T008-T011 (components need config)
T012 --> T013 (scene needs wrapper)
T012-T016 --> T017-T018 (demo page needs components)
T018 --> T019 (add final store features)
T019 --> T020-T023 (test after implementation)
```

### Package Installation Order
Install all packages in a single command for efficiency:
```bash
npm install framer-motion@^12 three@^0.170 @react-three/fiber@^9 @react-three/drei@^10 zustand@^5 lucide-react class-variance-authority @radix-ui/react-slot
```

### SSR Safety Critical
The R3F canvas-wrapper.tsx MUST use dynamic import with `ssr: false`:
```tsx
const Scene = dynamic(() => import("./scene"), { ssr: false });
```

### shadcn/ui Initialization
Use `npx shadcn@latest init` but carefully review any Tailwind config changes. May need manual merge to preserve Tailwind CSS 4 setup.

---

## Next Steps

Run `/validate` to verify session completeness.
