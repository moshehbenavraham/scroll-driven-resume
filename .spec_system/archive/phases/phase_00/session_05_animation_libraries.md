# Session 05: Animation & UI Libraries

**Session ID**: `phase00-session05-animation-libraries`
**Status**: Not Started
**Estimated Tasks**: ~20-25
**Estimated Duration**: 2-3 hours

---

## Objective

Install and configure the animation ecosystem (Framer Motion, Three.js/R3F) and UI component libraries (Radix UI, shadcn/ui) with proper integration and type safety.

---

## Scope

### In Scope (MVP)
- Install and configure Framer Motion 12
- Install Three.js and React Three Fiber (@react-three/fiber)
- Install @react-three/drei for helper components
- Install and configure Radix UI primitives
- Initialize shadcn/ui with copy-paste components
- Install Zustand for client state management
- Install Lucide React for icons
- Configure clsx + tailwind-merge for cn() utility
- Install class-variance-authority for component variants
- Create basic component examples to verify integration
- Verify all libraries work together without conflicts

### Out of Scope
- Building scroll/parallax hooks (Session 06)
- Building loading screen (Session 07)
- Implementing actual animations

---

## Prerequisites

- [ ] Session 04 completed (Next.js project with Tailwind)
- [ ] Understanding of each library's purpose and API

---

## Deliverables

1. Framer Motion configured and verified
2. Three.js / React Three Fiber configured with basic canvas test
3. @react-three/drei installed with common helpers
4. Radix UI primitives installed
5. shadcn/ui initialized with base components (Button, Card, etc.)
6. Zustand store skeleton for animation state
7. Lucide React icons available
8. cn() utility configured (clsx + tailwind-merge)
9. class-variance-authority for variant patterns
10. Integration test component demonstrating all libraries

---

## Success Criteria

- [ ] Framer Motion animations render correctly
- [ ] R3F Canvas renders basic 3D scene
- [ ] Radix UI primitives work with focus management
- [ ] shadcn/ui Button and Card components styled correctly
- [ ] Zustand store reads/writes state properly
- [ ] Lucide icons render at correct sizes
- [ ] cn() utility merges Tailwind classes correctly
- [ ] No TypeScript errors from any library
- [ ] Bundle size increase documented
