# Session Specification

**Session ID**: `phase01-session02-hero-section`
**Phase**: 01 - Core Animation
**Status**: Not Started
**Created**: 2025-12-22

---

## 1. Session Overview

This session builds the hero section - the first visual experience users encounter when visiting the portfolio. The hero section showcases a scroll-synchronized portrait frame animation where scrolling down advances through 192 cinematic frames, creating a dramatic reveal of the personal brand. Content overlays (name, title, skills, social links) float above the frame sequence, establishing the professional identity.

The hero section is the flagship feature demonstrating the portfolio's technical sophistication. It integrates the `<FrameSequence>` component from Session 01 with content layout, proving the frame animation system works in a real context. The patterns established here (section scroll isolation, content overlay positioning, loading integration) will be directly reused in Session 04 (Product Section).

This session transforms the project from a technical demo into an actual portfolio landing experience. Success here validates the entire frame animation approach and sets the visual standard for the remaining sections.

---

## 2. Objectives

1. Build `<HeroSection>` component integrating `<FrameSequence>` with 192 hero portrait frames
2. Create content overlay system with proper z-index layering that remains readable over dynamic backgrounds
3. Implement section-isolated scroll tracking (hero scroll progress independent from page scroll)
4. Ensure responsive behavior: full animation on desktop, static frame fallback on mobile

---

## 3. Prerequisites

### Required Sessions
- [x] `phase00-session04-nextjs-bootstrap` - Next.js 16 with React 19 foundation
- [x] `phase00-session05-animation-libraries` - Framer Motion and Zustand configured
- [x] `phase00-session06-scroll-parallax-utilities` - Scroll tracking hooks
- [x] `phase00-session07-loading-system` - Loading overlay and ContentReveal
- [x] `phase01-session01-frame-animation-core` - FrameSequence component and hooks

### Required Tools/Knowledge
- React 19 "use client" directive patterns
- Framer Motion useScroll with element targeting
- Tailwind CSS responsive design (md:, lg: breakpoints)
- CSS z-index stacking contexts

### Environment Requirements
- Docker stack running (MinIO serving frames at localhost:8089)
- Hero frames: 192 WebP files at `/frames-desktop/hero/`
- Mobile frames: 192 WebP files at `/frames-mobile/hero/`
- Node.js 20+ with pnpm

---

## 4. Scope

### In Scope (MVP)
- `<HeroSection>` component with full-viewport layout
- Integration of `<FrameSequence>` with hero sequence ID
- Content overlay components:
  - `<HeroContent>` - Name, title, tagline container
  - `<SkillIndicators>` - Four skill badges (AI/ML, Development, Product, Leadership)
  - `<SocialLinks>` - GitHub, LinkedIn, Twitter/X, Email icons
- Section-based scroll tracking using Framer Motion `useScroll({ target: ref })`
- Z-index layering: frame sequence (base) -> gradient overlay -> content (top)
- Loading integration via `<ContentReveal>` component
- Mobile responsive layout: static first frame, stacked content
- Reduced motion support (inherits from FrameSequence)
- Barrel export for hero components

### Out of Scope (Deferred)
- WebGL accent effects - *Reason: Session 03*
- Parallax decorative elements - *Reason: Sessions 05-06*
- Product section - *Reason: Session 04*
- Final content copy - *Reason: Placeholder text acceptable*
- Scroll indicator/arrow - *Reason: Polish phase*
- Navigation header - *Reason: Phase 02*

---

## 5. Technical Approach

### Architecture

```
app/page.tsx
     |
     v
<HeroSection>
     |
     +-- <FrameSequence sequenceId="hero" />  (z-index: 0)
     |
     +-- <div className="gradient-overlay" />  (z-index: 10)
     |
     +-- <ContentReveal>
           |
           +-- <HeroContent>  (z-index: 20)
                  |
                  +-- Name/Title
                  +-- Tagline
                  +-- <SkillIndicators />
                  +-- <SocialLinks />
```

### Design Patterns
- **Composition over inheritance**: Hero section composed of independent sub-components
- **Section scroll isolation**: useScroll targets section ref, not document
- **Content reveal pattern**: Wrap content in ContentReveal for loading sync
- **Mobile-first responsive**: Default to static, enhance for desktop

### Technology Stack
- React 19 with "use client" directive
- Framer Motion 12 for scroll tracking and reveal animations
- Tailwind CSS 4 for styling
- Lucide React for social icons
- TypeScript 5.x strict mode

---

## 6. Deliverables

### Files to Create
| File | Purpose | Est. Lines |
|------|---------|------------|
| `components/sections/HeroSection.tsx` | Main hero section with layout and scroll ref | ~120 |
| `components/sections/index.ts` | Barrel export for sections | ~5 |
| `components/hero/HeroContent.tsx` | Name, title, tagline content block | ~80 |
| `components/hero/SkillIndicators.tsx` | Four skill badge components | ~70 |
| `components/hero/SocialLinks.tsx` | Social media icon links | ~60 |
| `components/hero/index.ts` | Barrel export for hero components | ~10 |
| `types/hero.ts` | Type definitions for hero components | ~40 |
| `__tests__/components/HeroSection.test.tsx` | Component tests for hero section | ~150 |

### Files to Modify
| File | Changes | Est. Lines Changed |
|------|---------|-------------------|
| `app/page.tsx` | Replace demo content with HeroSection | ~20 |
| `types/index.ts` | Export hero types | ~2 |

---

## 7. Success Criteria

### Functional Requirements
- [ ] Hero section renders at exactly 100vh height
- [ ] Portrait frame sequence advances smoothly on scroll down (0 to 191)
- [ ] Portrait frame sequence reverses smoothly on scroll up (191 to 0)
- [ ] Content overlays visible and readable over all frame states
- [ ] Gradient overlay provides sufficient contrast for text
- [ ] Skill indicators display four skills with icons
- [ ] Social links are clickable and open in new tabs
- [ ] Mobile view (<768px) shows static first frame
- [ ] Mobile content stacks vertically and remains readable
- [ ] `prefers-reduced-motion` shows static frame (inherited)
- [ ] Hero section appears after loading completes via ContentReveal
- [ ] No layout shift when frame sequence initializes
- [ ] Scroll within hero section is smooth (60fps target)

### Testing Requirements
- [ ] Component tests passing for HeroSection
- [ ] Component tests passing for HeroContent, SkillIndicators, SocialLinks
- [ ] Manual scroll testing confirms smooth animation
- [ ] Manual mobile testing confirms static fallback
- [ ] Accessibility: social links have proper aria-labels

### Quality Gates
- [ ] All files ASCII-encoded (no unicode characters in code)
- [ ] Unix LF line endings
- [ ] TypeScript strict mode - zero errors
- [ ] ESLint passing - zero warnings
- [ ] Prettier formatting applied
- [ ] No `any` types in production code

---

## 8. Implementation Notes

### Key Considerations
- **Gradient overlay is critical**: Without proper contrast, text becomes unreadable on bright frames. Use semi-transparent black gradient from bottom.
- **pointer-events management**: Content layer must receive clicks for social links, but not block scroll events on frame sequence below.
- **Section ref for useScroll**: Must target the section element, not window, for isolated scroll progress.
- **ContentReveal wrapper**: Entire hero content should be wrapped to sync with loading system.
- **Viewport height on mobile**: Use `min-h-screen` or CSS `dvh` unit for mobile Safari compatibility.

### Potential Challenges
- **Content positioning on dynamic frames**: Some frames may have busy areas where text is hard to read.
  - *Mitigation*: Position content in consistent areas; use gradient overlay for contrast.
- **Mobile Safari 100vh issues**: The `100vh` unit doesn't account for browser chrome on mobile Safari.
  - *Mitigation*: Use `min-h-[100dvh]` or JavaScript-based height calculation.
- **Z-index stacking context**: Creating new stacking contexts can break expected layering.
  - *Mitigation*: Keep z-index values simple (0, 10, 20); avoid transform on parent elements.

### ASCII Reminder
All output files must use ASCII-only characters (0-127). Avoid unicode in comments, strings, or identifiers. Use text like "AI/ML" not special characters.

---

## 9. Testing Strategy

### Unit Tests
- HeroSection renders without crashing
- HeroSection has correct height (100vh/100dvh)
- FrameSequence receives correct sequenceId prop
- ContentReveal wraps hero content

### Component Tests
- SkillIndicators renders four skill badges
- SocialLinks renders four social icons with correct hrefs
- Social links have aria-labels for accessibility
- HeroContent displays name and title

### Integration Tests
- Mock scroll position and verify FrameSequence receives updates
- Verify ContentReveal integration with loading context

### Manual Testing
- Load page, observe loading overlay, confirm hero reveals
- Scroll slowly through hero section, observe frame advancement
- Scroll up, confirm frame reversal
- Test at 768px breakpoint, confirm mobile layout
- Enable "Reduce motion" in OS, confirm static frame
- Click social links, confirm new tab opens
- Test on real mobile device for Safari 100vh behavior

### Edge Cases
- Very fast scrolling (should not skip frames or cause jank)
- Scroll exactly to section boundaries (0% and 100%)
- Browser resize during scroll (layout should remain stable)
- Network failure for frame images (FrameSequence handles this)

---

## 10. Dependencies

### External Libraries
- `framer-motion`: ^12.0.0 (useScroll with target)
- `lucide-react`: ^0.562.0 (social icons: Github, Linkedin, Twitter, Mail)
- `tailwind-merge`: ^3.4.0 (className merging)

### Internal Dependencies
- `components/animation/FrameSequence` - Frame animation component
- `components/loading/ContentReveal` - Loading sync wrapper
- `hooks/useFrameSequence` - Integration hook (if needed directly)
- `types/animation.ts` - FrameSequenceId type

### Other Sessions
- **Depends on**:
  - Session 01 (Frame Animation Core) - FrameSequence component
  - Phase 00 sessions - Infrastructure and loading system
- **Depended by**:
  - Session 03 (Hero WebGL Effects) - Needs hero structure
  - Session 04 (Product Section) - Reuses section pattern

---

## 11. Content Placeholders

### Name and Title
```
Mosheh Ben Avraham
AI Engineer & Product Leader
```

### Tagline
```
Building the future of AI-powered products
```

### Skills
```
1. AI/ML - Machine Learning & AI Systems
2. Development - Full-Stack Engineering
3. Product - Product Strategy & Leadership
4. Leadership - Team Building & Mentorship
```

### Social Links
```
1. GitHub - https://github.com/moshehbenavraham
2. LinkedIn - https://linkedin.com/in/moshehbenavraham
3. Twitter/X - https://twitter.com/moshehbenavraham
4. Email - mailto:hello@mosheh.dev
```

(Note: These are placeholder URLs - update with actual links)

---

## Next Steps

Run `/tasks` to generate the implementation task checklist.
