# NEXT_SESSION.md

## Session Recommendation

**Generated**: 2025-12-22
**Project State**: Phase 01 - Core Animation
**Completed Sessions**: 10 (7 Foundation + 3 Core Animation)

---

## Recommended Next Session

**Session ID**: `phase01-session04-product-section`
**Session Name**: Product Section
**Estimated Duration**: 3-4 hours
**Estimated Tasks**: 20-25

---

## Why This Session Next?

### Prerequisites Met
- [x] Session 01 complete (Frame Animation Core) - `useFrameSequence` hook, `FrameSequence` component
- [x] Session 02 complete (Hero Section pattern) - Full section implementation pattern established
- [x] Product WebP frames accessible from MinIO (144 frames uploaded in Phase 00)
- [x] Frame sequence component proven working in Hero section

### Dependencies
- **Builds on**: Hero Section (Session 02) - Reuses exact same `FrameSequence` component pattern
- **Enables**: Parallax Layer System (Session 05) - Requires both Hero and Product sections complete

### Project Progression

Session 04 is the **only unblocked candidate** in Phase 01:

| Session | Prerequisites | Status |
|---------|---------------|--------|
| Session 04 (Product Section) | Sessions 01, 02 | **All Met** |
| Session 05 (Parallax Layers) | Sessions 02, 04 | Blocked by Session 04 |
| Session 06 (Decorative Elements) | Session 05 | Blocked by Session 05 |

This session mirrors the Hero Section implementation for the AI Community product showcase. The pattern is proven - we apply the same scroll-synchronized frame animation to the product's burst animation sequence (144 frames).

---

## Session Overview

### Objective

Build the AI Community product section with scroll-synchronized burst animation frame sequence, product content overlays, stats, and CTAs that showcase the dynamic visual transition.

### Key Deliverables

1. **ProductSection.tsx** - Main full-viewport product section component
2. **ProductContent.tsx** - AI Community branding and product name
3. **ProductStats.tsx** - Stats display (member count, resources, features)
4. **ProductCTAs.tsx** - "Join the Community" and "Learn More" buttons
5. **Stats reveal animation** - Dynamic reveal tied to scroll progress
6. **Mobile layout** - Static first frame, stacked content below 768px
7. **Optional WebGL reuse** - Apply accent effect pattern from Session 03

### Scope Summary

- **In Scope (MVP)**: Product section layout, frame sequence integration (144 frames), content overlays, stats, CTAs, mobile fallback, scroll-triggered reveals
- **Out of Scope**: Actual AI Community backend, user authentication, newsletter signup

---

## Technical Considerations

### Technologies/Patterns

- **FrameSequence component** - Reuse from Session 01 with product frame URLs
- **Framer Motion** - useScroll, useTransform for stats reveal animations
- **useScrollProgress hook** - Section-based scroll tracking
- **MinIO URLs** - Product frames at `http://localhost:9000/frames/product/`
- **Tailwind CSS** - Responsive layout, mobile-first approach

### Potential Challenges

1. **Section isolation** - Product section scroll progress must be independent from Hero section
2. **Stats reveal timing** - Coordinate reveal animation with burst animation keyframes
3. **Content readability** - Ensure text overlays remain readable as burst animation intensifies
4. **Performance** - Loading second 144-frame sequence while maintaining 60fps

### Implementation Pattern

Follow the Hero Section structure established in Session 02:
```
ProductSection/
├── ProductSection.tsx      (main container)
├── ProductContent.tsx      (branding/name)
├── ProductStats.tsx        (stats display)
└── ProductCTAs.tsx         (action buttons)
```

---

## Alternative Sessions

If this session is blocked:

1. **None available** - Session 04 is the only unblocked candidate. Sessions 05 and 06 both depend on it.

If facing technical blockers:
- Verify MinIO product frames accessible via `curl http://localhost:9000/frames/product/frame_0001.webp`
- Ensure FrameSequence component from Session 01 is working in Hero section
- Check Docker stack is running (`docker compose ps`)

---

## Next Steps

Run `/sessionspec` to generate the formal specification with detailed task breakdown.
