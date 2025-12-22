# NEXT_SESSION.md

## Session Recommendation

**Generated**: 2025-12-22
**Project State**: Phase 01 - Core Animation
**Completed Sessions**: 8

---

## Recommended Next Session

**Session ID**: `phase01-session02-hero-section`
**Session Name**: Hero Section
**Estimated Duration**: 3-4 hours
**Estimated Tasks**: ~20-25

---

## Why This Session Next?

### Prerequisites Met
- [x] Session 01 complete (Frame Animation Core)
- [x] Frame sequence component working (`<FrameSequence>`)
- [x] Hero WebP frames accessible from MinIO (192 frames)
- [x] Loading system from Phase 00 operational

### Dependencies
- **Builds on**: Session 01 (Frame Animation Core) - uses `<FrameSequence>` component
- **Enables**: Session 03 (Hero WebGL Effects), Session 04 (Product Section pattern)

### Project Progression

Session 02 is the logical next step because:

1. **Direct Consumer of Session 01**: The `<FrameSequence>` component built in Session 01 was specifically designed for use in hero and product sections. Session 02 is the first real integration.

2. **Establishes Section Pattern**: The hero section layout, content overlay approach, and scroll-section tracking pattern will be reused in Session 04 (Product Section).

3. **Blocks Session 03**: The Hero WebGL Effects session requires the hero section structure to be in place before adding visual effects.

4. **User-Visible Progress**: This session produces the first major visual feature users will see - the cinematic portrait animation on scroll.

---

## Session Overview

### Objective

Build the hero section with scroll-synchronized portrait frame animation, personal branding content overlays, and responsive layout that showcases the cinematic frame sequence as users scroll.

### Key Deliverables

1. `components/sections/HeroSection.tsx` - Main hero section component
2. `components/hero/HeroContent.tsx` - Text overlays and branding
3. `components/hero/SkillIndicators.tsx` - Skill badge/indicator components
4. `components/hero/SocialLinks.tsx` - Social media link icons
5. Hero section responsive styles (Tailwind CSS)
6. Mobile-specific hero layout with static fallback
7. Integration with loading reveal system

### Scope Summary

- **In Scope (MVP)**: Full-viewport hero layout, frame sequence integration, content overlays (name, title, skills, social links), section-based scroll tracking, mobile static fallback, loading integration
- **Out of Scope**: WebGL effects (Session 03), parallax decoratives (Sessions 05-06), final content copy

---

## Technical Considerations

### Technologies/Patterns
- React 19 with "use client" directive for interactive components
- Framer Motion for content reveal animations
- `<FrameSequence>` component from Session 01
- Tailwind CSS for responsive layout
- Zustand for section state (current section in view)

### Potential Challenges

1. **Z-Index Layering**: Content must float above frame sequence without blocking scroll events. Solution: Proper pointer-events management and z-index stacking.

2. **Content Readability**: Text overlays must remain readable over dynamic frame backgrounds. Solution: Semi-transparent backdrop, text shadows, or gradient overlays.

3. **Scroll Section Isolation**: Hero section scroll progress must be independent. Solution: Use Framer Motion `useScroll` with section ref target.

4. **Loading Integration**: Section must appear after loading completes. Solution: Coordinate with LoadingProvider context.

---

## Alternative Sessions

If this session is blocked:

1. **Session 05: Parallax Layer System** - Could be built independently but would lack content to apply parallax to
2. **Session 04: Product Section** - Technically possible but better to establish pattern in hero first

Neither alternative is recommended - Session 02 has all prerequisites met and is the natural progression.

---

## Next Steps

Run `/sessionspec` to generate the formal specification.
