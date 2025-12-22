# Session Specification

**Session ID**: `phase02-session02-about-section`
**Phase**: 02 - Content and Polish
**Status**: Not Started
**Created**: 2025-12-22

---

## 1. Session Overview

The About Section introduces the portfolio owner to visitors who have scrolled past the cinematic hero animation. This is the first traditional content section and establishes the component patterns that will be reused in Skills, Projects, and Contact sections.

The section features an asymmetric layout with personal bio content, achievement highlight cards (years of experience, projects completed, etc.), and scroll-triggered reveal animations. It integrates with the existing parallax layer system from Phase 01 and includes section-specific decorative elements that maintain visual continuity with the hero section.

This session is critical for establishing the "content section" architecture: how text-heavy sections integrate with the animation system, how to balance visual polish with readability, and how to create engaging scroll-driven reveals without overwhelming the user. Patterns established here will directly inform Sessions 03-05.

---

## 2. Objectives

1. Build a responsive About section with asymmetric layout that feels premium and modern
2. Implement scroll-triggered reveal animations that respect `prefers-reduced-motion`
3. Create reusable achievement card components with animated counters
4. Integrate decorative elements that complement the hero section aesthetic
5. Achieve >80% test coverage on all new components

---

## 3. Prerequisites

### Required Sessions
- [x] `phase02-session01-fixed-navbar` - Provides smooth scroll navigation and section targeting
- [x] `phase01-session05-parallax-layer-system` - Provides ParallaxContainer, ParallaxLayer, ParallaxContext
- [x] `phase01-session06-decorative-elements` - Provides FloatingShape, ConnectionLine, GradientMesh, NoiseOverlay
- [x] `phase00-session06-scroll-parallax-utilities` - Provides useScrollProgress, useParallax, useParallaxTransform hooks

### Required Tools/Knowledge
- Framer Motion scroll animations (useScroll, useInView, motion variants)
- Tailwind CSS responsive design (breakpoint utilities)
- React composition patterns (compound components)
- TypeScript strict mode patterns

### Environment Requirements
- Node.js 20+ with Next.js 15 dev server running
- Docker stack optional (not required for this session)
- Vitest test runner configured

---

## 4. Scope

### In Scope (MVP)
- About section container with `id="about"` for navbar smooth scroll
- Asymmetric two-column layout (content + visual)
- Bio paragraph component with staggered text reveal animation
- Achievement cards grid (4 items: years experience, projects, technologies, community members)
- Scroll-triggered entrance animations using Framer Motion `useInView`
- Section-specific decorative elements (shapes, lines, gradient mesh)
- Responsive breakpoints: mobile (1 column), tablet (2 column), desktop (asymmetric 2 column)
- `prefers-reduced-motion` compliance (instant reveal, no animations)
- Unit tests for all components with >80% coverage
- Replace placeholder in `app/page.tsx` with actual AboutSection component

### Out of Scope (Deferred)
- Interactive timeline - *Reason: Adds complexity without MVP value*
- Detailed work history - *Reason: Out of scope per session definition*
- Testimonials carousel - *Reason: Listed as deferred in PRD*
- Video introduction - *Reason: Out of scope per session definition*
- Profile image with parallax effect - *Reason: Optional enhancement for polish phase*
- Storybook stories - *Reason: Not critical path, can add later*

---

## 5. Technical Approach

### Architecture

The About section follows the established section pattern from HeroSection/ProductSection:

```
AboutSection (container)
+-- ParallaxContainer (scroll context)
    +-- ParallaxLayer[background] (decorative)
    |   +-- AboutDecorative (shapes, gradients, noise)
    +-- ParallaxLayer[foreground] (content)
        +-- Bio (heading + paragraphs with reveal)
        +-- Achievements (grid of achievement cards)
```

Unlike HeroSection (300vh scroll runway), AboutSection uses standard height with `useInView` for trigger-based animations.

### Design Patterns
- **Compound Components**: Bio and Achievements are standalone but composable within AboutSection
- **Render Props/Children Pattern**: AboutDecorative accepts children for flexible element composition
- **Custom Hooks**: `useScrollReveal` wraps useInView with standardized animation variants
- **Type-Safe Props**: All components use TypeScript interfaces from `types/about.ts`

### Technology Stack
- **Framer Motion 12**: `useInView`, `motion.div`, `variants`, `staggerChildren`
- **Tailwind CSS 4**: Grid layouts, responsive utilities, prose styling
- **Lucide React**: Icons for achievement cards
- **Existing hooks**: `useReducedMotion`, `useIsMobile`
- **Existing components**: `ParallaxContainer`, `ParallaxLayer`, decorative elements

---

## 6. Deliverables

### Files to Create
| File | Purpose | Est. Lines |
|------|---------|------------|
| `components/sections/AboutSection.tsx` | Main section container with parallax integration | ~120 |
| `components/about/Bio.tsx` | Bio heading and paragraphs with reveal animation | ~80 |
| `components/about/Achievements.tsx` | Achievement cards grid container | ~70 |
| `components/about/AchievementCard.tsx` | Individual achievement card with counter animation | ~90 |
| `components/about/AboutDecorative.tsx` | Section-specific decorative elements | ~80 |
| `components/about/index.ts` | Barrel export file | ~10 |
| `types/about.ts` | TypeScript interfaces for about section | ~50 |
| `__tests__/components/AboutSection.test.tsx` | Integration tests for AboutSection | ~100 |
| `__tests__/components/about/Bio.test.tsx` | Unit tests for Bio component | ~60 |
| `__tests__/components/about/AchievementCard.test.tsx` | Unit tests for AchievementCard | ~80 |

### Files to Modify
| File | Changes | Est. Lines Changed |
|------|---------|-------------------|
| `app/page.tsx` | Replace About placeholder with AboutSection component | ~15 |
| `types/index.ts` | Add export for about types | ~2 |
| `components/about/index.ts` | Create if not exists | ~5 |

---

## 7. Success Criteria

### Functional Requirements
- [ ] About section renders with bio heading, paragraphs, and achievements
- [ ] Section has `id="about"` and navbar smooth scroll works
- [ ] Scroll-triggered animations fire when section enters viewport (50% threshold)
- [ ] Bio text reveals with staggered word/line animation
- [ ] Achievement cards animate with counter effect (0 -> target value)
- [ ] Responsive layout: 1 column on mobile, 2 columns on tablet/desktop
- [ ] Decorative elements visible on desktop, hidden on mobile
- [ ] `prefers-reduced-motion: reduce` shows static content immediately

### Testing Requirements
- [ ] Unit tests written for Bio, AchievementCard, AboutDecorative
- [ ] Integration test for AboutSection with mocked dependencies
- [ ] All tests passing with zero warnings
- [ ] >80% code coverage on new components

### Quality Gates
- [ ] All files ASCII-encoded (no unicode in source)
- [ ] Unix LF line endings
- [ ] ESLint passes with zero errors/warnings
- [ ] TypeScript strict mode passes
- [ ] No `any` types in production code
- [ ] Consistent with existing code patterns (HeroSection, ProductSection)

---

## 8. Implementation Notes

### Key Considerations

1. **Content Placeholder**: Use realistic placeholder content for bio and achievements. User will replace later:
   - Bio: 2-3 paragraphs about the portfolio owner
   - Achievements: Years experience (10+), Projects (50+), Technologies (20+), Community (1000+)

2. **Animation Timing**: Use staggered delays that feel natural:
   - Container fade: 0.4s duration
   - Children stagger: 0.1s between items
   - Counter animation: 1.5s duration with easeOut

3. **Z-Index Layering**: Match HeroSection pattern:
   - Decorative elements: z-index 5
   - Content: z-index 20

4. **Section Height**: Unlike hero (300vh), About section uses natural content height with generous padding:
   - Min-height: 100vh on desktop, auto on mobile
   - Padding: py-24 lg:py-32

### Potential Challenges

- **Counter Animation Performance**: Animating numbers can cause layout thrash
  - *Mitigation*: Use `tabular-nums` font feature, transform-only animations

- **Text Reveal Jank**: Word-by-word reveals can be choppy
  - *Mitigation*: Use line-by-line reveal instead, GPU-accelerated opacity/transform

- **Mobile Scroll Performance**: Too many scroll listeners
  - *Mitigation*: Use single `useInView` per component, not per element

### ASCII Reminder
All output files must use ASCII-only characters (0-127). Avoid curly quotes, em-dashes, and special characters in string literals.

---

## 9. Testing Strategy

### Unit Tests

**Bio.tsx**:
- Renders heading and paragraphs
- Applies custom className
- Respects isRevealed prop
- Handles empty content gracefully

**AchievementCard.tsx**:
- Renders icon, value, and label
- Formats large numbers correctly
- Counter animates from 0 to target
- Static when reduced motion preferred

**AboutDecorative.tsx**:
- Renders decorative elements
- Hidden on mobile (useIsMobile)
- Respects reduced motion

### Integration Tests

**AboutSection.tsx**:
- Renders without crashing
- Has correct aria-label
- Contains Bio and Achievements
- Has id="about" for navigation
- Applies parallax layers correctly
- Handles isRevealed prop

### Manual Testing
- [ ] Scroll down from hero - About section reveals smoothly
- [ ] Click "About" in navbar - Smooth scrolls to section
- [ ] Resize browser - Layout responds at breakpoints
- [ ] Enable reduced motion - Animations disabled
- [ ] Test on mobile device - Decoratives hidden, single column

### Edge Cases
- Very long bio text (truncation or overflow handling)
- Achievement values of 0 (should still display)
- Rapid scroll past section (animation should still complete)
- Browser back/forward with scroll position

---

## 10. Dependencies

### External Libraries
- `framer-motion`: ^12.0.0 (already installed)
- `lucide-react`: ^0.400.0 (already installed)
- `clsx`: ^2.0.0 (already installed)

### Internal Dependencies
- `@/components/parallax` - ParallaxContainer, ParallaxLayer
- `@/components/decorative` - FloatingShape, GradientMesh, NoiseOverlay
- `@/components/loading/ContentReveal` - Reveal animation wrapper
- `@/hooks/useReducedMotion` - Motion preference detection
- `@/hooks/useIsMobile` - Mobile viewport detection
- `@/lib/cn` - Class name utility

### Other Sessions
- **Depends on**: phase02-session01-fixed-navbar, phase01-session05-parallax-layer-system, phase01-session06-decorative-elements
- **Depended by**: phase02-session03-skills-section (uses similar patterns)

---

## Next Steps

Run `/tasks` to generate the implementation task checklist.
