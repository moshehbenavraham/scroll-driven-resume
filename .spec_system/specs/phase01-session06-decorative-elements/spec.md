# Session Specification

**Session ID**: `phase01-session06-decorative-elements`
**Phase**: 01 - Core Animation
**Status**: Not Started
**Created**: 2025-12-22

---

## 1. Session Overview

This session adds the finishing visual polish to the Core Animation phase by implementing decorative CSS/SVG elements that float in the parallax mid-layer. These elements create atmospheric depth and visual interest without overwhelming the core frame animations that drive the hero and product sections.

The decorative system will include four component types: floating geometric shapes (circles, triangles, polygons), connection lines between elements, gradient mesh backgrounds for atmospheric depth, and a subtle noise/grain texture overlay for an organic feel. All elements will integrate with the existing parallax system at 0.3x-0.5x scroll speed, creating a sense of dimensional layering between the background frame animations and the foreground content.

This is the final session of Phase 01. Completing it delivers a polished visual foundation for the portfolio, with all motion systems (frame animation, parallax, WebGL effects, and decorative elements) working in harmony. The session focuses on CSS/SVG-based effects to maintain 60fps performance alongside the existing WebGL particle effects.

---

## 2. Objectives

1. Create reusable decorative component library with floating shapes, connection lines, gradient meshes, and noise overlays
2. Integrate decorative elements with existing parallax mid-layer (0.4x speed) in Hero and Product sections
3. Implement staggered reveal animations that trigger as sections scroll into view
4. Ensure full accessibility compliance with prefers-reduced-motion and mobile responsiveness

---

## 3. Prerequisites

### Required Sessions
- [x] `phase01-session01-frame-animation-core` - Provides scroll-synchronized frame system
- [x] `phase01-session02-hero-section` - Hero section structure with parallax layers
- [x] `phase01-session03-hero-webgl-effects` - WebGL accent effects (decorative complements these)
- [x] `phase01-session04-product-section` - Product section structure with parallax layers
- [x] `phase01-session05-parallax-layer-system` - Multi-layer parallax infrastructure

### Required Tools/Knowledge
- Framer Motion `useScroll`, `useTransform`, `useInView` hooks
- SVG path syntax for geometric shapes
- CSS gradients (linear, radial, conic)
- CSS `mix-blend-mode` and `backdrop-filter` for visual effects
- Tailwind CSS responsive utilities

### Environment Requirements
- Node.js 20+ with Next.js 15 development server
- Chromium-based browser for visual testing
- React DevTools for performance profiling

---

## 4. Scope

### In Scope (MVP)
- `FloatingShape` component with 4 shape variants (circle, triangle, hexagon, diamond)
- `ConnectionLine` component with animated SVG paths
- `GradientMesh` component with configurable gradient layers
- `NoiseOverlay` component with base64-encoded noise texture
- `DecorativeElements` container component for layout orchestration
- Integration with Hero section (3-5 decorative shapes)
- Integration with Product section (3-5 decorative shapes)
- Staggered reveal animations via Framer Motion
- Responsive behavior (simplified on mobile)
- Accessibility (static fallback for reduced-motion)

### Out of Scope (Deferred)
- WebGL-based decorative effects - *Reason: CSS/SVG performs better alongside existing WebGL*
- Interactive decorative elements (hover, click) - *Reason: Decorative layer should not compete for interaction*
- User-customizable decorative themes - *Reason: Not needed for MVP portfolio*
- Dense particle fields - *Reason: Keep minimal to avoid overwhelming frame animations*
- Custom cursor effects - *Reason: Separate session in Phase 02*

---

## 5. Technical Approach

### Architecture

```
components/decorative/
  index.ts                  # Public exports
  FloatingShape.tsx         # Geometric shape with parallax motion
  ConnectionLine.tsx        # SVG connection lines
  GradientMesh.tsx          # Gradient background component
  NoiseOverlay.tsx          # Grain texture overlay
  DecorativeElements.tsx    # Container/orchestrator component
  shapes/
    index.ts                # Shape path exports
    Circle.tsx              # Circle SVG component
    Triangle.tsx            # Triangle SVG component
    Hexagon.tsx             # Hexagon SVG component
    Diamond.tsx             # Diamond SVG component

types/
  decorative.ts             # Type definitions for decorative system
```

### Design Patterns

- **Compound Component**: `DecorativeElements` container with positioned children
- **Composition over Inheritance**: Shape variants via SVG path swapping, not class hierarchy
- **Hook Reuse**: Leverage existing `useReducedMotion`, `useIsMobile`, parallax hooks
- **Staggered Children**: Framer Motion `staggerChildren` for reveal animations

### Technology Stack

- **Framer Motion 12**: Scroll animations, staggered reveals, `useInView`
- **SVG**: Geometric shapes with `viewBox` for scaling
- **CSS Gradients**: Radial and conic gradients for mesh backgrounds
- **CSS Filters**: `blur()`, `opacity()` for depth effects
- **Tailwind CSS 4**: Responsive positioning, animation utilities

### Z-Index Strategy

The existing parallax layers use:
- Background (frames): z-index 0
- Mid (decorative): z-index 10
- Foreground (content): z-index 20

Decorative elements will be placed in a new mid-layer at z-index 5-8:
- Gradient mesh: z-index 5 (behind shapes)
- Connection lines: z-index 6
- Floating shapes: z-index 7
- Noise overlay: z-index 8 (covers shapes but under content gradient)

---

## 6. Deliverables

### Files to Create

| File | Purpose | Est. Lines |
|------|---------|------------|
| `components/decorative/index.ts` | Public barrel exports | ~15 |
| `components/decorative/FloatingShape.tsx` | Geometric shape with motion | ~80 |
| `components/decorative/ConnectionLine.tsx` | SVG animated line | ~60 |
| `components/decorative/GradientMesh.tsx` | Gradient background | ~50 |
| `components/decorative/NoiseOverlay.tsx` | Grain texture overlay | ~40 |
| `components/decorative/DecorativeElements.tsx` | Container orchestrator | ~100 |
| `components/decorative/shapes/index.ts` | Shape path exports | ~10 |
| `components/decorative/shapes/Circle.tsx` | Circle SVG | ~25 |
| `components/decorative/shapes/Triangle.tsx` | Triangle SVG | ~25 |
| `components/decorative/shapes/Hexagon.tsx` | Hexagon SVG | ~25 |
| `components/decorative/shapes/Diamond.tsx` | Diamond SVG | ~25 |
| `types/decorative.ts` | Type definitions | ~60 |

### Files to Modify

| File | Changes | Est. Lines |
|------|---------|------------|
| `components/sections/HeroSection.tsx` | Add decorative layer | ~25 |
| `components/sections/ProductSection.tsx` | Add decorative layer | ~25 |
| `types/index.ts` | Export decorative types | ~2 |
| `components/sections/index.ts` | Export if needed | ~2 |

---

## 7. Success Criteria

### Functional Requirements
- [ ] Floating shapes render with correct geometry (circle, triangle, hexagon, diamond)
- [ ] Shapes move at parallax mid-layer speed (0.3x-0.5x)
- [ ] Connection lines animate on scroll with SVG path drawing
- [ ] Gradient mesh creates visible atmospheric depth
- [ ] Noise overlay adds subtle grain texture
- [ ] Staggered reveals trigger when sections enter viewport
- [ ] Hero section displays 3-5 decorative elements
- [ ] Product section displays 3-5 decorative elements

### Accessibility Requirements
- [ ] `prefers-reduced-motion: reduce` shows static elements (no animation)
- [ ] All decorative elements have `aria-hidden="true"`
- [ ] No keyboard focus traps on decorative elements
- [ ] Decorative layer has `pointer-events: none`

### Performance Requirements
- [ ] 60fps maintained with all decorative elements active
- [ ] No layout shift (CLS < 0.1) from element loading
- [ ] Decorative elements do not block main thread > 50ms

### Testing Requirements
- [ ] Unit tests for shape components render correctly
- [ ] Unit tests for reduced motion behavior
- [ ] Manual testing in Chrome, Firefox, Safari
- [ ] Mobile viewport testing (simplified decorations)

### Quality Gates
- [ ] All files ASCII-encoded (no special characters)
- [ ] Unix LF line endings
- [ ] ESLint passing with zero warnings
- [ ] TypeScript strict mode with no errors
- [ ] Code follows project JSDoc conventions

---

## 8. Implementation Notes

### Key Considerations

1. **Performance Budget**: The page already has frame animations + WebGL particles. Decorative elements must be lightweight CSS/SVG only. Use `will-change: transform` sparingly.

2. **Z-Index Coordination**: Place decorative elements between z-index 5-8 to avoid conflicting with existing layers (0, 10, 20).

3. **Asymmetric Placement**: Position shapes using percentage-based absolute positioning with intentional asymmetry. Avoid centered/grid layouts.

4. **Blur and Opacity**: Use CSS `blur()` and reduced opacity on distant shapes to create depth perception without WebGL.

5. **Base64 Noise**: Embed noise texture as base64 data URL to avoid additional network requests.

### Potential Challenges

- **Visual Balance**: Decorations must complement frame animations without competing - *Mitigation: Start minimal (3-5 shapes), test visibility, adjust*

- **Mobile Performance**: Even CSS animations can impact low-end mobile - *Mitigation: Reduce/remove decorations below 768px*

- **Stagger Timing**: Getting reveal timing to feel natural - *Mitigation: Use Framer Motion `staggerChildren` with 0.1s delay*

- **Gradient Banding**: Large CSS gradients can show banding - *Mitigation: Add noise overlay to break up banding*

### ASCII Reminder
All output files must use ASCII-only characters (0-127). No special Unicode characters in component files.

---

## 9. Testing Strategy

### Unit Tests

**FloatingShape.test.tsx**
- Renders correct shape variant
- Applies parallax transform style
- Respects reduced motion (static positioning)
- Has aria-hidden attribute

**GradientMesh.test.tsx**
- Renders gradient background
- Accepts custom gradient props
- Has pointer-events-none

**NoiseOverlay.test.tsx**
- Renders with noise texture background
- Has correct opacity
- Has mix-blend-mode applied

### Integration Tests

**DecorativeElements.test.tsx**
- Renders all child elements
- Applies staggered animation delays
- Responds to scroll progress changes

### Manual Testing

1. Open Hero section, scroll slowly, verify shapes move at mid-layer speed
2. Open Product section, verify decorative elements complement burst animation
3. Enable reduced motion in OS settings, verify static fallback
4. Resize to mobile viewport, verify simplified decorations
5. Profile with React DevTools, verify no excessive re-renders

### Edge Cases

- [ ] Very fast scrolling (shapes should not jank)
- [ ] Viewport resize during scroll (shapes should reposition)
- [ ] Reduced motion toggled mid-session (should update immediately)
- [ ] WebGL disabled (decorative elements should still render)

---

## 10. Dependencies

### External Libraries

- `framer-motion`: ^12.0.0 (already installed)
- `tailwind-merge`: ^2.0.0 (already installed via cn())
- `clsx`: ^2.0.0 (already installed via cn())

### Internal Dependencies

- `hooks/useReducedMotion` - Motion preference detection
- `hooks/useIsMobile` - Mobile viewport detection
- `components/parallax/ParallaxLayer` - Mid-layer integration
- `lib/cn` - Class name composition
- `types/parallax` - ParallaxLayerType definitions

### Other Sessions

- **Depends on**:
  - `phase01-session05-parallax-layer-system` (parallax infrastructure)
  - `phase01-session02-hero-section` (Hero section structure)
  - `phase01-session04-product-section` (Product section structure)

- **Depended by**:
  - Phase 02 sessions (will have polished visual foundation)

---

## 11. Visual Reference

### Hero Section Layout

```
+------------------------------------------+
|  [Triangle]              [Circle]        |  <- Top area (shapes)
|       \                    /             |
|        [Line]----[Hexagon]               |  <- Mid area (connection)
|                                          |
|           +----------------+             |
|           |  Hero Content  |             |  <- Foreground
|           +----------------+             |
|                                          |
|  [Diamond]                 [Circle]      |  <- Bottom area (shapes)
+------------------------------------------+
```

### Product Section Layout

```
+------------------------------------------+
|        [Hexagon]      [Diamond]          |  <- Top area
|              \        /                  |
|               [Lines]                    |  <- Connections radiate from center
|                                          |
|           +----------------+             |
|           | Product Burst  |             |  <- Foreground
|           +----------------+             |
|                                          |
|  [Triangle]              [Circle]        |  <- Bottom area
+------------------------------------------+
```

---

## Next Steps

Run `/tasks` to generate the implementation task checklist.
