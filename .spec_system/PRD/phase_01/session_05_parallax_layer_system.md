# Session 05: Parallax Layer System

**Session ID**: `phase01-session05-parallax-layer-system`
**Status**: Not Started
**Estimated Tasks**: ~15-20
**Estimated Duration**: 2-3 hours

---

## Objective

Implement the multi-layer parallax system using Framer Motion hooks to create dimensional depth across hero and product sections with background, mid-layer, and foreground elements moving at different scroll speeds.

---

## Scope

### In Scope (MVP)

- Parallax layer component: `<ParallaxLayer speed={0.5}>`
- Three-tier layer system:
  - **Background layer**: Frame animation (fixed within section, 0x speed relative to section)
  - **Mid-layer**: Decorative elements at 0.3x-0.5x scroll speed
  - **Foreground layer**: Text and UI at 1x-1.3x scroll speed
- Framer Motion integration: `useScroll`, `useTransform` for smooth interpolation
- Maximum 5 active parallax layers per section
- GPU-accelerated transforms (translate3d, will-change)
- Integration with existing scroll utilities from Phase 00
- Respect prefers-reduced-motion (disable parallax, show static positions)
- Mobile detection: disable parallax below 768px viewport

### Out of Scope

- Decorative element design (Session 06)
- Complex 3D parallax (z-depth perspective)
- Horizontal parallax effects
- Parallax on mouse movement

---

## Prerequisites

- [ ] Sessions 02 and 04 complete (Hero and Product sections)
- [ ] `useScrollProgress` and parallax utilities from Phase 00
- [ ] Framer Motion hooks available

---

## Deliverables

1. `components/parallax/ParallaxContainer.tsx` - Section wrapper managing layers
2. `components/parallax/ParallaxLayer.tsx` - Individual parallax layer component
3. `hooks/useParallaxTransform.ts` - Hook for parallax calculations
4. Integration of parallax layers into Hero section
5. Integration of parallax layers into Product section
6. Performance profiling for parallax scroll

---

## Success Criteria

- [ ] Parallax layers create visible depth perception
- [ ] Background layer remains fixed relative to section
- [ ] Mid-layer moves at 0.3x-0.5x scroll speed
- [ ] Foreground layer moves at 1x-1.3x scroll speed
- [ ] 60fps maintained during scroll with parallax active
- [ ] No parallax "jumps" or discontinuities at section boundaries
- [ ] prefers-reduced-motion disables parallax
- [ ] Mobile view disables parallax (static positioning)
- [ ] Maximum 5 layers enforced per section
- [ ] GPU acceleration verified (transform3d, will-change)
