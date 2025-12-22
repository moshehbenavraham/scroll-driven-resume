# Session Specification

**Session ID**: `phase01-session05-parallax-layer-system`
**Phase**: 01 - Core Animation
**Status**: Not Started
**Created**: 2025-12-22

---

## 1. Session Overview

This session implements the multi-layer parallax system that creates dimensional depth across the Hero and Product sections. The parallax effect makes elements at different "depths" move at different speeds as the user scrolls, creating an immersive 3D-like experience without actual WebGL 3D rendering overhead.

The system establishes three conceptual layers: a background layer (frame animation at 0x relative speed, fixed within its section), a mid-layer (decorative elements at 0.3x-0.5x scroll speed), and a foreground layer (text and UI at 1x-1.3x scroll speed). This layered architecture is foundational for Session 06 (Decorative Elements), which will populate the mid-layer with floating geometric shapes and visual embellishments.

The implementation leverages the existing `useParallax` hook from Phase 00 while adding component-level abstractions (`ParallaxContainer`, `ParallaxLayer`) that encapsulate the complexity of parallax transforms, mobile detection, reduced motion support, and GPU acceleration hints. These components integrate seamlessly with the existing Hero and Product section architectures.

---

## 2. Objectives

1. Create reusable `ParallaxContainer` and `ParallaxLayer` components that wrap Framer Motion parallax logic
2. Implement a custom `useParallaxTransform` hook that extends the existing `useParallax` with section-boundary awareness
3. Integrate parallax layers into HeroSection and ProductSection without breaking existing frame animation and WebGL effects
4. Ensure 60fps scroll performance with GPU-accelerated transforms and proper will-change hints

---

## 3. Prerequisites

### Required Sessions
- [x] `phase00-session06-scroll-parallax-utilities` - Provides `useScrollProgress`, `useParallax`, `useReducedMotion` hooks
- [x] `phase01-session02-hero-section` - HeroSection component with frame animation
- [x] `phase01-session04-product-section` - ProductSection component with burst animation

### Required Tools/Knowledge
- Framer Motion `useScroll`, `useTransform`, `useSpring` hooks
- CSS GPU acceleration techniques (`translate3d`, `will-change`)
- React Context API for parallax state sharing
- TypeScript generics for component props

### Environment Requirements
- Node.js 20+ with Next.js 15 dev server running
- Browser DevTools for performance profiling
- Chrome Rendering panel for paint flashing validation

---

## 4. Scope

### In Scope (MVP)
- `ParallaxContainer` component: Section wrapper that establishes parallax context
- `ParallaxLayer` component: Individual layer with configurable speed (0.3-1.3 range)
- `useParallaxTransform` hook: Enhanced parallax calculations with section-boundary clamping
- `useIsMobile` hook: SSR-safe viewport width detection for parallax disable
- Integration with HeroSection (wrap existing layers in parallax structure)
- Integration with ProductSection (wrap existing layers in parallax structure)
- Maximum 5 layers per section enforcement (configurable prop)
- GPU acceleration via `translate3d(0, Ypx, 0)` transforms
- `will-change: transform` hints for compositor optimization
- Respect `prefers-reduced-motion` (disable parallax, show static positions)
- Disable parallax below 768px viewport width (mobile)
- Unit tests for parallax hooks and components

### Out of Scope (Deferred)
- Decorative element content (shapes, lines, meshes) - *Reason: Session 06 scope*
- Complex 3D z-depth perspective transforms - *Reason: Not required by PRD*
- Horizontal parallax effects - *Reason: PRD specifies vertical only*
- Mouse-driven parallax (pointer position affects layers) - *Reason: PRD specifies scroll only*
- Parallax on elements outside Hero/Product sections - *Reason: Session 06+ scope*

---

## 5. Technical Approach

### Architecture

The parallax system uses a Container/Layer pattern where `ParallaxContainer` establishes the scroll context and `ParallaxLayer` applies transforms based on its speed prop:

```
<ParallaxContainer containerRef={sectionRef}>
  <ParallaxLayer speed={0} layer="background">
    {/* Frame animation canvas - fixed relative to section */}
  </ParallaxLayer>

  <ParallaxLayer speed={0.4} layer="mid">
    {/* Decorative elements - slow parallax */}
  </ParallaxLayer>

  <ParallaxLayer speed={1.0} layer="foreground">
    {/* Text content - normal scroll speed */}
  </ParallaxLayer>
</ParallaxContainer>
```

The container uses React Context to share scroll progress with child layers, avoiding prop drilling and enabling nested layer structures.

### Design Patterns
- **Container/Presentational**: Container manages state, Layer handles rendering
- **Compound Components**: Container and Layer work together via context
- **Custom Hooks**: Encapsulate Framer Motion logic for reuse
- **Render Props (optional)**: Allow custom transform functions

### Technology Stack
- Framer Motion 12.x - `useScroll`, `useTransform`, `motion.div`
- React 19 - `createContext`, `useContext`, `useMemo`
- TypeScript 5.x - Strict typing for all props and returns
- Tailwind CSS 4 - Utility classes for positioning

---

## 6. Deliverables

### Files to Create
| File | Purpose | Est. Lines |
|------|---------|------------|
| `components/parallax/ParallaxContainer.tsx` | Section wrapper with scroll context | ~80 |
| `components/parallax/ParallaxLayer.tsx` | Individual parallax layer component | ~100 |
| `components/parallax/index.ts` | Barrel export for parallax components | ~10 |
| `hooks/useParallaxTransform.ts` | Enhanced parallax transform hook | ~60 |
| `hooks/useIsMobile.ts` | SSR-safe mobile detection hook | ~40 |
| `types/parallax.ts` | Type definitions for parallax system | ~80 |
| `__tests__/hooks/useParallaxTransform.test.ts` | Unit tests for parallax hook | ~100 |
| `__tests__/hooks/useIsMobile.test.ts` | Unit tests for mobile detection | ~60 |
| `__tests__/components/parallax/ParallaxLayer.test.tsx` | Component tests | ~80 |

### Files to Modify
| File | Changes | Est. Lines |
|------|---------|------------|
| `components/sections/HeroSection.tsx` | Wrap layers in ParallaxContainer/Layer | ~30 |
| `components/sections/ProductSection.tsx` | Wrap layers in ParallaxContainer/Layer | ~30 |
| `hooks/index.ts` | Export new hooks | ~5 |
| `types/animation.ts` | Add/update parallax-related types | ~20 |

---

## 7. Success Criteria

### Functional Requirements
- [ ] `ParallaxContainer` establishes scroll context for child layers
- [ ] `ParallaxLayer speed={0}` renders fixed relative to section (no parallax)
- [ ] `ParallaxLayer speed={0.3-0.5}` moves slower than scroll (mid-layer effect)
- [ ] `ParallaxLayer speed={1.0-1.3}` moves at or faster than scroll (foreground effect)
- [ ] Parallax layers create visible depth perception when scrolling
- [ ] No "jump" artifacts at section boundaries (smooth transitions)
- [ ] Maximum 5 layers enforced per container (warning logged if exceeded)
- [ ] HeroSection renders correctly with parallax integration
- [ ] ProductSection renders correctly with parallax integration

### Accessibility Requirements
- [ ] `prefers-reduced-motion: reduce` disables all parallax transforms
- [ ] Static fallback positions preserve layout when parallax disabled
- [ ] No content shifts or layout instability from parallax

### Performance Requirements
- [ ] 60fps maintained during scroll with all parallax layers active
- [ ] GPU acceleration applied via `translate3d` transforms
- [ ] `will-change: transform` set on parallax layer elements
- [ ] No layout thrashing (only composite properties animated)

### Testing Requirements
- [ ] Unit tests for `useParallaxTransform` hook (speed clamping, transform calculations)
- [ ] Unit tests for `useIsMobile` hook (SSR safety, breakpoint detection)
- [ ] Component tests for `ParallaxLayer` (renders, applies transforms)
- [ ] Manual testing: Chrome DevTools Performance panel shows no jank
- [ ] Manual testing: Layers move at expected speeds relative to scroll

### Quality Gates
- [ ] All files ASCII-encoded (0-127 characters only)
- [ ] Unix LF line endings
- [ ] ESLint passes with zero errors
- [ ] TypeScript strict mode passes with zero errors
- [ ] Prettier formatting applied
- [ ] No console errors or warnings in development

---

## 8. Implementation Notes

### Key Considerations

1. **Z-Index Management**: HeroSection and ProductSection already use z-index layers (0: canvas, 10: gradient, 20: content). Parallax layers must maintain this hierarchy while adding depth transforms.

2. **Scroll Offset Calculation**: The parallax offset should be calculated relative to the section's scroll progress, not the page. Use Framer Motion's `offset: ["start end", "end start"]` to scope transforms.

3. **Transform Origin**: Parallax transforms should use `transform-origin: center` to prevent elements from shifting horizontally during vertical parallax.

4. **Pointer Events**: Mid-layer parallax elements should have `pointer-events: none` to prevent blocking clicks on foreground content.

5. **Mobile Detection Timing**: The `useIsMobile` hook must handle SSR (return `false` on server) and hydration (avoid mismatch by deferring detection to effect).

### Potential Challenges

1. **Section Boundary Jumps**: If parallax transforms aren't clamped to section bounds, elements may "jump" when entering/leaving sections.
   - *Mitigation*: Clamp transform values to 0 at section start and reset at section end.

2. **Frame Animation Z-Fighting**: Adding parallax to the canvas layer could cause z-fighting with gradient overlay.
   - *Mitigation*: Keep frame animation at speed 0 (no parallax) to maintain existing z-index behavior.

3. **Performance on Older Devices**: Multiple parallax layers may cause jank on older devices.
   - *Mitigation*: Limit to 5 layers max, use `will-change` sparingly, consider reducing layers on performance warnings.

4. **SSR Hydration Mismatch**: Mobile detection on server vs client could cause hydration errors.
   - *Mitigation*: Use `useSyncExternalStore` pattern (like existing `useReducedMotion`) for SSR-safe detection.

### ASCII Reminder
All output files must use ASCII-only characters (0-127). Avoid curly quotes, em-dashes, and non-ASCII symbols.

---

## 9. Testing Strategy

### Unit Tests

**useParallaxTransform.test.ts**
- Returns correct y transform for speed < 1 (negative offset at start, positive at end)
- Returns correct y transform for speed > 1 (opposite direction)
- Clamps speed to valid range (0.1-2.0)
- Returns identity transform when disabled
- Respects reduced motion preference

**useIsMobile.test.ts**
- Returns false during SSR
- Returns true when viewport < 768px
- Returns false when viewport >= 768px
- Updates on resize
- Cleans up event listener on unmount

### Component Tests

**ParallaxLayer.test.tsx**
- Renders children
- Applies transform style when enabled
- Does not apply transform when mobile
- Does not apply transform when reduced motion preferred
- Accepts custom speed prop
- Logs warning when > 5 layers in container

### Integration Tests

**ParallaxContainer.test.tsx**
- Provides context to child layers
- Multiple layers receive independent transforms
- Handles nested containers (edge case)

### Manual Testing

1. **Visual Depth Test**: Scroll through Hero section, verify mid-layer elements (when added in S06) move slower than foreground text
2. **Performance Test**: Open Chrome DevTools > Performance, record scroll, verify no frames > 16ms
3. **Mobile Test**: Resize viewport to < 768px, verify no parallax transforms applied
4. **Reduced Motion Test**: Enable `prefers-reduced-motion` in OS, verify static positions

### Edge Cases
- Rapid scroll direction changes (no jitter)
- Browser zoom levels (transforms scale correctly)
- Tab visibility change during scroll (no accumulated offset on return)
- Section height changes (dynamic content)

---

## 10. Dependencies

### External Libraries
- `framer-motion`: ^12.0.0 (already installed)
- `react`: ^19.0.0 (already installed)

### Internal Dependencies
- `hooks/useParallax.ts` - Existing parallax hook (will be extended)
- `hooks/useReducedMotion.ts` - Motion preference detection
- `hooks/useScrollProgress.ts` - Section scroll progress
- `types/animation.ts` - Existing animation types
- `lib/cn.ts` - Class name utility

### Other Sessions
- **Depends on**: phase00-session06-scroll-parallax-utilities, phase01-session02-hero-section, phase01-session04-product-section
- **Depended by**: phase01-session06-decorative-elements (requires parallax mid-layer)

---

## Next Steps

Run `/tasks` to generate the implementation task checklist.
