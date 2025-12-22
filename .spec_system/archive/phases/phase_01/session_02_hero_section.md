# Session 02: Hero Section

**Session ID**: `phase01-session02-hero-section`
**Status**: Not Started
**Estimated Tasks**: ~20-25
**Estimated Duration**: 3-4 hours

---

## Objective

Build the hero section with scroll-synchronized portrait frame animation, personal branding content overlays, and responsive layout that showcases the cinematic frame sequence as users scroll.

---

## Scope

### In Scope (MVP)

- Hero section component: `<HeroSection>`
- Integration of `<FrameSequence>` with hero portrait frames (192 frames)
- Personal branding content overlays:
  - Name and title
  - Skill indicators (AI/ML, Development, Product, Leadership)
  - Social links (GitHub, LinkedIn, Twitter/X, Email)
  - Tagline/intro text
- Full-viewport hero layout with proper z-index layering
- Frame sequence configuration for hero (connect to MinIO URLs)
- Section-based scroll tracking (scroll progress within hero section only)
- Mobile layout: static first frame, stacked content
- Loading integration: show frame sequence after loading completes

### Out of Scope

- WebGL accent effects (Session 03)
- Parallax decorative elements (Sessions 05-06)
- Product section (Session 04)
- Final content copy (placeholder content acceptable)

---

## Prerequisites

- [ ] Session 01 complete (Frame Animation Core)
- [ ] Frame sequence component working
- [ ] Hero WebP frames accessible from MinIO
- [ ] Loading system from Phase 00 operational

---

## Deliverables

1. `components/sections/HeroSection.tsx` - Main hero section component
2. `components/hero/HeroContent.tsx` - Text overlays and branding
3. `components/hero/SkillIndicators.tsx` - Skill badge/indicator components
4. `components/hero/SocialLinks.tsx` - Social media link icons
5. Hero section responsive styles (Tailwind CSS)
6. Mobile-specific hero layout with static fallback
7. Integration with loading reveal system

---

## Success Criteria

- [ ] Hero section renders full-viewport height
- [ ] Portrait frame sequence advances smoothly on scroll down
- [ ] Portrait frame sequence reverses smoothly on scroll up
- [ ] Content overlays visible and readable over frame animation
- [ ] Skill indicators display correctly
- [ ] Social links functional and accessible
- [ ] Mobile view shows static first frame
- [ ] prefers-reduced-motion shows static frame
- [ ] Hero section integrates with loading reveal animation
- [ ] No layout shift when frame sequence loads
