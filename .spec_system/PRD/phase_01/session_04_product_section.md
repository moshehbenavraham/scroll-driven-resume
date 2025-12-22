# Session 04: Product Section

**Session ID**: `phase01-session04-product-section`
**Status**: Not Started
**Estimated Tasks**: ~20-25
**Estimated Duration**: 3-4 hours

---

## Objective

Build the AI Community product section with scroll-synchronized burst animation frame sequence, product content overlays, stats, and CTAs that showcase the dynamic visual transition.

---

## Scope

### In Scope (MVP)

- Product section component: `<ProductSection>`
- Integration of `<FrameSequence>` with product frames (144 frames)
- Product content overlays:
  - AI Community product name/logo
  - Stats display (member count, resources, features)
  - Primary CTA: "Join the Community"
  - Secondary CTA: "Learn More"
- Full-viewport product section layout
- Frame sequence configuration for product (connect to MinIO URLs)
- Section-based scroll tracking (scroll progress within product section only)
- Dynamic reveal animation for stats as burst animation progresses
- Mobile layout: static first frame, stacked content
- Optional: Reuse WebGL effect pattern from Session 03

### Out of Scope

- Actual AI Community integration/backend
- User authentication for community
- Detailed community member features
- Newsletter signup integration

---

## Prerequisites

- [ ] Session 01 complete (Frame Animation Core)
- [ ] Session 02 complete (Hero Section pattern)
- [ ] Product WebP frames accessible from MinIO
- [ ] Frame sequence component proven working

---

## Deliverables

1. `components/sections/ProductSection.tsx` - Main product section component
2. `components/product/ProductContent.tsx` - Product text and branding
3. `components/product/ProductStats.tsx` - Stats display component
4. `components/product/ProductCTAs.tsx` - Call-to-action buttons
5. Product section responsive styles (Tailwind CSS)
6. Mobile-specific product layout with static fallback
7. Stats reveal animation tied to scroll progress

---

## Success Criteria

- [ ] Product section renders full-viewport height
- [ ] Burst frame sequence advances smoothly on scroll down
- [ ] Burst frame sequence reverses smoothly on scroll up
- [ ] Stats reveal as animation progresses
- [ ] CTAs visible and clickable
- [ ] Content overlays readable over dynamic background
- [ ] Mobile view shows static first frame
- [ ] prefers-reduced-motion shows static frame
- [ ] Section operates independently from hero section scroll
- [ ] No layout shift when frame sequence loads
