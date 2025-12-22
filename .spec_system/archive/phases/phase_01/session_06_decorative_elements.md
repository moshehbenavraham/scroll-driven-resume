# Session 06: Decorative Elements

**Session ID**: `phase01-session06-decorative-elements`
**Status**: Not Started
**Estimated Tasks**: ~15-20
**Estimated Duration**: 2-3 hours

---

## Objective

Add mid-layer decorative elements to hero and product sections including floating geometric shapes, staggered reveal animations, gradient meshes, and subtle noise textures that enhance visual depth without overwhelming the core frame animation.

---

## Scope

### In Scope (MVP)

- Decorative element components:
  - Floating geometric shapes (circles, triangles, polygons)
  - Connection lines between elements
  - Gradient mesh backgrounds
  - Subtle noise/grain texture overlay
- Staggered reveal animations on scroll using Framer Motion
- Integration with parallax mid-layer (0.3x-0.5x speed)
- CSS-based decorative effects (not WebGL):
  - SVG shapes with CSS animations
  - CSS gradients and blur effects
  - Pseudo-element decorations
- Asymmetric placement breaking grid conventions
- Respect prefers-reduced-motion (show static, hide animated elements)

### Out of Scope

- WebGL-based decorative effects (use CSS/SVG only)
- Interactive decorative elements (hover, click)
- User-customizable decorative themes
- Dense particle fields (keep minimal and purposeful)

---

## Prerequisites

- [ ] Session 05 complete (Parallax Layer System)
- [ ] Parallax layers working in Hero and Product sections
- [ ] Framer Motion scroll animations working

---

## Deliverables

1. `components/decorative/FloatingShape.tsx` - Geometric shape component
2. `components/decorative/ConnectionLine.tsx` - SVG connection lines
3. `components/decorative/GradientMesh.tsx` - Gradient background mesh
4. `components/decorative/NoiseOverlay.tsx` - Grain texture overlay
5. Hero section decorative element placement
6. Product section decorative element placement
7. Staggered reveal animation configurations

---

## Success Criteria

- [ ] Decorative shapes float at parallax mid-layer speed
- [ ] Staggered reveals trigger as sections scroll into view
- [ ] Gradient meshes add atmospheric depth to sections
- [ ] Noise texture adds organic, non-digital feel
- [ ] Elements placed asymmetrically with intentional negative space
- [ ] 60fps maintained with all decorative elements active
- [ ] prefers-reduced-motion shows minimal static decorations
- [ ] Elements complement rather than compete with frame animation
- [ ] Mobile view shows simplified decorative elements
- [ ] No layout shift from decorative element loading
