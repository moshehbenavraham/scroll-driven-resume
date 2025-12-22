# Session Specification

**Session ID**: `phase01-session04-product-section`
**Phase**: 01 - Core Animation
**Status**: Not Started
**Created**: 2025-12-22

---

## 1. Session Overview

This session builds the AI Community product section - the second of two scroll-synchronized frame animation showcases in the portfolio. While the hero section features a personal portrait sequence (192 frames), the product section showcases an AI Community "burst" animation (144 frames) where a centered product image explodes outward with AI elements.

The implementation follows the proven pattern established in Session 02 (Hero Section), reusing the `UnifiedHeroCanvas` component with `sequence="product"`. The key differentiator is the content overlay: instead of personal branding (name, title, skills), the product section displays community stats, product information, and conversion CTAs.

This session unblocks Session 05 (Parallax Layer System), which requires both Hero and Product sections complete before implementing depth effects across them.

---

## 2. Objectives

1. Build a full-viewport ProductSection component with scroll-synchronized 144-frame burst animation
2. Create product content overlay components (ProductContent, ProductStats, ProductCTAs)
3. Implement scroll-triggered stats reveal animation coordinated with animation progress
4. Ensure mobile fallback with static first frame and stacked content layout

---

## 3. Prerequisites

### Required Sessions
- [x] `phase01-session01-frame-animation-core` - Provides `useFrameSequence` hook and frame URL generation for "product" sequence
- [x] `phase01-session02-hero-section` - Establishes section structure pattern (300vh scroll runway, sticky viewport, layered z-index)
- [x] `phase01-session03-hero-webgl-effects` - Provides `UnifiedHeroCanvas` for combined frame + WebGL rendering

### Required Tools/Knowledge
- Framer Motion `useScroll`, `useTransform` for scroll-triggered animations
- Tailwind CSS responsive utilities (md:, lg: breakpoints)
- TypeScript interfaces and type exports

### Environment Requirements
- Docker stack running (MinIO serving product frames)
- Product frames accessible at `http://localhost:9000/frames/product/frame_NNNN.webp`
- Dev server running (`npm run dev`)

---

## 4. Scope

### In Scope (MVP)
- `ProductSection.tsx` - Main section container with 225vh scroll runway (144 frames)
- `ProductContent.tsx` - AI Community product name and tagline
- `ProductStats.tsx` - Stats display (3-4 stat items: members, resources, projects, etc.)
- `ProductCTAs.tsx` - Primary "Join the Community" and secondary "Learn More" buttons
- Scroll-triggered stats reveal animation (fade + slide as animation progresses)
- Gradient overlay for text contrast over dynamic background
- Mobile layout: static first frame, vertically stacked content
- `prefers-reduced-motion` support: static frame, no scroll animations
- Integration with `UnifiedHeroCanvas` using `sequence="product"`
- Type definitions in `types/product.ts`

### Out of Scope (Deferred)
- Actual AI Community backend integration - *Reason: Static content only for portfolio*
- User authentication - *Reason: No user accounts in MVP*
- Newsletter signup - *Reason: Deferred requirement per PRD*
- Testimonials carousel - *Reason: Deferred requirement per PRD*
- Custom WebGL effect for product section - *Reason: Reuse particles effect from hero*

---

## 5. Technical Approach

### Architecture

The ProductSection follows the same layered architecture as HeroSection:

```
ProductSection (225vh scroll runway)
+-- Sticky Container (100vh viewport)
    +-- Layer 0: UnifiedHeroCanvas (frames + particles)
    +-- Layer 10: Gradient Overlay (text contrast)
    +-- Layer 20: Content Container
        +-- ContentReveal wrapper
            +-- ProductContent (name, tagline)
            +-- ProductStats (animated reveal)
            +-- ProductCTAs (buttons)
```

**Scroll Runway Calculation:**
- Hero: 192 frames at 300vh = 1.5625vh per frame
- Product: 144 frames at 225vh = 1.5625vh per frame (same scroll-to-frame ratio)

### Design Patterns
- **Composition**: ProductSection composes ProductContent, ProductStats, ProductCTAs
- **Controlled Reveal**: Stats reveal tied to scroll progress via Framer Motion
- **Responsive Fallback**: Static first frame on mobile/reduced-motion via existing hooks
- **Type-First**: All components fully typed with exported interfaces

### Technology Stack
- Next.js 15 (App Router, "use client" components)
- React 19 (hooks, composition)
- TypeScript 5.x (strict mode)
- Framer Motion 12 (scroll animations, transforms)
- Tailwind CSS 4 (responsive utilities)
- Radix UI (button primitives via shadcn/ui)

---

## 6. Deliverables

### Files to Create

| File | Purpose | Est. Lines |
|------|---------|------------|
| `components/sections/ProductSection.tsx` | Main product section with scroll runway | ~120 |
| `components/product/ProductContent.tsx` | Product name and tagline display | ~60 |
| `components/product/ProductStats.tsx` | Stats display with scroll reveal | ~100 |
| `components/product/ProductCTAs.tsx` | Primary and secondary CTA buttons | ~70 |
| `types/product.ts` | Type definitions for product components | ~80 |
| `__tests__/components/ProductSection.test.tsx` | Unit tests for ProductSection | ~80 |
| `__tests__/components/product/ProductContent.test.tsx` | Unit tests for ProductContent | ~50 |
| `__tests__/components/product/ProductStats.test.tsx` | Unit tests for ProductStats | ~60 |
| `__tests__/components/product/ProductCTAs.test.tsx` | Unit tests for ProductCTAs | ~50 |

### Files to Modify

| File | Changes | Est. Lines |
|------|---------|------------|
| `app/page.tsx` | Add ProductSection below HeroSection | ~30 |
| `types/index.ts` | Export product types | ~5 |

---

## 7. Success Criteria

### Functional Requirements
- [ ] Product section renders full-viewport sticky container within 225vh scroll runway
- [ ] Burst frame sequence (144 frames) advances smoothly on scroll down
- [ ] Burst frame sequence reverses smoothly on scroll up
- [ ] Stats reveal with fade + slide animation as scroll progresses (50-80% progress range)
- [ ] Primary CTA ("Join the Community") visible and clickable
- [ ] Secondary CTA ("Learn More") visible and clickable
- [ ] Content overlays readable over dynamic burst background
- [ ] Product section scroll operates independently from hero section
- [ ] No layout shift when frame sequence loads

### Accessibility Requirements
- [ ] `prefers-reduced-motion` shows static first frame only
- [ ] Mobile view (< 768px) shows static first frame with stacked content
- [ ] All interactive elements keyboard accessible
- [ ] Proper ARIA labels on section and interactive elements
- [ ] Color contrast meets WCAG AA for text over gradient overlay

### Testing Requirements
- [ ] Unit tests written for all new components
- [ ] Unit tests passing with > 80% coverage
- [ ] Manual scroll testing completed (smooth advance/reverse)
- [ ] Mobile testing completed (static fallback working)

### Quality Gates
- [ ] All files ASCII-encoded (no Unicode characters in source)
- [ ] Unix LF line endings
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No ESLint warnings (`npm run lint`)
- [ ] Code follows project conventions (cn helper, Tailwind classes)

---

## 8. Implementation Notes

### Key Considerations

**Scroll Runway Height:**
The hero section uses 300vh for 192 frames. To maintain the same scroll-to-frame ratio (smoother animation), the product section should use:
- 144 frames / 192 frames * 300vh = 225vh

**Stats Reveal Timing:**
Stats should reveal mid-animation when the burst is most dynamic:
- Start reveal at 40% scroll progress
- Complete reveal at 70% scroll progress
- Use staggered animation (each stat 100ms apart)

**Content Positioning:**
Unlike hero (centered content), product content may work better with asymmetric positioning:
- Product name/tagline: left-aligned or centered
- Stats: horizontal row on desktop, vertical stack on mobile
- CTAs: prominent placement, likely center or left-aligned

**Button Variants:**
- Primary: Filled button with brand accent color
- Secondary: Ghost/outline button for lower visual weight

### Potential Challenges

- **Stats Animation Timing**: Coordinating reveal with burst animation keyframes
  - *Mitigation*: Use scroll progress percentage, not frame number

- **Content Readability**: Burst animation may be visually busy
  - *Mitigation*: Strong gradient overlay, larger text sizes, text shadow if needed

- **Performance**: Two 144-frame sections loading
  - *Mitigation*: Product section loads after hero is ready; lazy preload

### ASCII Reminder
All output files must use ASCII-only characters (0-127). Use standard quotes (""), apostrophes ('), and hyphens (-). No curly quotes, em-dashes, or Unicode symbols.

---

## 9. Testing Strategy

### Unit Tests

**ProductSection.test.tsx:**
- Renders section element with correct height (225vh)
- Passes containerRef to UnifiedHeroCanvas
- Renders gradient overlay
- Renders content when isRevealed is true
- Hides content when isRevealed is false

**ProductContent.test.tsx:**
- Renders product name and tagline
- Applies custom className
- Uses default content when props not provided

**ProductStats.test.tsx:**
- Renders all stat items
- Applies correct animation delays
- Handles empty stats array gracefully

**ProductCTAs.test.tsx:**
- Renders primary and secondary buttons
- Primary button has correct href/onClick
- Secondary button has correct href/onClick
- Buttons have accessible labels

### Integration Tests
- Product section integrates with page without breaking hero section
- Scroll tracking works independently from hero section

### Manual Testing

| Scenario | Expected Result |
|----------|-----------------|
| Scroll through product section | Frames advance 0-143 smoothly |
| Scroll up in product section | Frames reverse 143-0 smoothly |
| Scroll to 50% product progress | Stats begin revealing |
| Click "Join the Community" | Navigate to target (or log click) |
| View on mobile (< 768px) | Static first frame, stacked content |
| Enable prefers-reduced-motion | Static frame, no animations |

### Edge Cases
- [ ] Product section at top of viewport on page load (starts at frame 0)
- [ ] Rapid scroll through section (no frame skipping artifacts)
- [ ] Scroll bounce at section boundaries
- [ ] Frame loading interrupted (graceful fallback)

---

## 10. Dependencies

### External Libraries
- `framer-motion`: ^12.0.0 (scroll hooks, animations)
- `@radix-ui/react-slot`: (button component primitives)
- `lucide-react`: (icons for CTAs if needed)
- `clsx` + `tailwind-merge`: (cn helper utility)

### Internal Dependencies
- `@/hooks/useFrameSequence` - Frame animation state management
- `@/components/three/UnifiedHeroCanvas` - WebGL frame + effects renderer
- `@/components/loading/ContentReveal` - Staggered content reveal wrapper
- `@/components/ui/button` - shadcn/ui button component
- `@/lib/cn` - Class name utility

### Other Sessions
- **Depends on**:
  - `phase01-session01-frame-animation-core` (useFrameSequence, frame URLs)
  - `phase01-session02-hero-section` (section structure pattern)
  - `phase01-session03-hero-webgl-effects` (UnifiedHeroCanvas)
- **Depended by**:
  - `phase01-session05-parallax-layer-system` (needs both sections complete)
  - `phase01-session06-decorative-elements` (needs parallax system)

---

## 11. Default Content Configuration

For implementation, use these placeholder values (can be customized later):

```typescript
// types/product.ts
export const DEFAULT_PRODUCT_CONTENT = {
  name: "AI Community",
  tagline: "Join 10,000+ builders shaping the future of AI",
} as const;

export const DEFAULT_PRODUCT_STATS: ProductStat[] = [
  { label: "Members", value: "10,000+", icon: "users" },
  { label: "Resources", value: "500+", icon: "book" },
  { label: "Projects", value: "1,200+", icon: "code" },
  { label: "Events", value: "50+", icon: "calendar" },
] as const;

export const DEFAULT_PRODUCT_CTAS = {
  primary: {
    label: "Join the Community",
    href: "#join",
  },
  secondary: {
    label: "Learn More",
    href: "#about",
  },
} as const;
```

---

## Next Steps

Run `/tasks` to generate the implementation task checklist.
