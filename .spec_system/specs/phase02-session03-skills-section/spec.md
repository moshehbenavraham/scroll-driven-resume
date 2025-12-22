# Session Specification

**Session ID**: `phase02-session03-skills-section`
**Phase**: 02 - Content and Polish
**Status**: Not Started
**Created**: 2025-12-22

---

## 1. Session Overview

This session implements the Skills section of the portfolio, showcasing technical expertise across four distinct domains: AI/ML, Development, Product, and Leadership. The section follows directly after the About section in the page flow, providing visitors with a visual overview of the portfolio owner's capabilities through categorized skill cards.

The Skills section uses the same scroll-triggered animation patterns established in the About section, with staggered card reveals that create a cascading entrance effect. Each skill category is presented as a card with an icon, title, and list of individual skills, providing quick visual parsing of technical competencies.

This implementation directly informs the Projects section (Session 04), as the card-based UI patterns and hover effects developed here will be reused and extended for project cards. Maintaining consistency in animation timing, card styling, and responsive grid behavior ensures a cohesive user experience throughout the portfolio.

---

## 2. Objectives

1. Create a responsive Skills section with 4 categorized skill cards that follow established design patterns
2. Implement scroll-triggered staggered reveal animations using Framer Motion `useInView` and `staggerChildren`
3. Build reusable SkillCard and SkillItem components with hover effects and accessibility support
4. Ensure prefers-reduced-motion is respected by disabling animations for users who prefer reduced motion
5. Achieve >80% test coverage for all skills components

---

## 3. Prerequisites

### Required Sessions
- [x] `phase02-session02-about-section` - Provides scroll-triggered animation patterns, section layout structure, and card component patterns
- [x] `phase01-session06-decorative-elements` - Provides decorative element integration patterns
- [x] `phase00-session05-animation-libraries` - Provides Framer Motion configuration and hooks

### Required Tools/Knowledge
- Framer Motion `useInView`, `motion.div`, and `staggerChildren` animation patterns
- Lucide React icon library usage
- Tailwind CSS responsive grid utilities
- TypeScript strict typing patterns from `types/about.ts`

### Environment Requirements
- Next.js 15 development server running
- All dependencies installed via `npm install`
- Docker stack not required (no asset changes)

---

## 4. Scope

### In Scope (MVP)
- Skills section container with parallax integration (following AboutSection pattern)
- Four skill category cards: AI/ML, Development, Product, Leadership
- SkillCard component with icon, title, and skill list
- SkillItem component for individual skills within cards
- Scroll-triggered staggered reveal (cards animate in sequence)
- Subtle hover effects (card lift, border highlight)
- Responsive grid: 1 column (mobile), 2 columns (tablet), 4 columns (desktop)
- Section heading with reveal animation
- TypeScript types for skill data structures
- Unit tests with >80% coverage
- Integration with navbar anchor link (`#skills`)

### Out of Scope (Deferred)
- Interactive skill filtering - *Reason: Deferred requirement per PRD*
- Animated progress bars - *Reason: Deferred requirement per PRD*
- Skill endorsements/certifications - *Reason: Deferred requirement per PRD*
- Detailed skill descriptions/modals - *Reason: MVP scope constraint*
- Proficiency percentage indicators - *Reason: Visual complexity, keep MVP simple*

---

## 5. Technical Approach

### Architecture

The Skills section follows the established AboutSection architecture:

```
SkillsSection (container)
  |-- ParallaxContainer (depth context)
  |     |-- ParallaxLayer (decorative, z-index: 5)
  |     |     |-- SkillsDecorative (optional subtle elements)
  |     |-- ParallaxLayer (content, z-index: 20)
  |           |-- Section heading
  |           |-- Skills grid
  |                 |-- SkillCard (AI/ML)
  |                 |-- SkillCard (Development)
  |                 |-- SkillCard (Product)
  |                 |-- SkillCard (Leadership)
```

### Design Patterns

- **Container/Presentational**: SkillsSection manages state; SkillCard is presentational
- **Compound Components**: SkillCard contains SkillItem children
- **Variant Pattern**: Animation variants for hidden/visible states (following AchievementCard)
- **Composition**: ParallaxContainer/ParallaxLayer for depth effects
- **Data-Driven UI**: Skills defined in types file with default content

### Technology Stack

- **React 19** with client components (`"use client"`)
- **Framer Motion 12** for animations (`useInView`, `motion.div`, `staggerChildren`)
- **Lucide React** for category icons
- **Tailwind CSS 4** for styling and responsive grid
- **TypeScript 5.x** with strict mode for type safety

### Animation Strategy

```typescript
// Container variants for staggered children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Card variants matching AchievementCard pattern
const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
};
```

---

## 6. Deliverables

### Files to Create

| File | Purpose | Est. Lines |
|------|---------|------------|
| `components/sections/SkillsSection.tsx` | Main skills section container with parallax | ~90 |
| `components/skills/SkillCard.tsx` | Individual skill category card with animations | ~120 |
| `components/skills/SkillItem.tsx` | Single skill item within card | ~45 |
| `components/skills/SkillsDecorative.tsx` | Optional decorative elements for section | ~60 |
| `components/skills/index.ts` | Barrel export for skills components | ~10 |
| `types/skills.ts` | TypeScript types and default skill data | ~120 |
| `__tests__/components/skills/SkillCard.test.tsx` | Unit tests for SkillCard | ~100 |
| `__tests__/components/skills/SkillItem.test.tsx` | Unit tests for SkillItem | ~60 |
| `__tests__/components/SkillsSection.test.tsx` | Integration tests for SkillsSection | ~80 |

### Files to Modify

| File | Changes | Est. Lines |
|------|---------|------------|
| `app/page.tsx` | Add SkillsSection component after AboutSection | ~5 |
| `components/navigation/NavLinks.tsx` | Verify Skills link exists (likely already present) | ~0 |

---

## 7. Success Criteria

### Functional Requirements
- [ ] Skills section renders 4 categorized skill cards
- [ ] Each card displays: icon, category title, list of skills
- [ ] Staggered reveal animation triggers when section enters viewport
- [ ] Cards animate in sequence (0.1s delay between each)
- [ ] Hover effects provide visual feedback (card lift, border change)
- [ ] Grid responds correctly: 1 col (mobile) -> 2 col (tablet) -> 4 col (desktop)
- [ ] Section accessible via navbar #skills anchor link
- [ ] Smooth scroll to section works correctly

### Accessibility Requirements
- [ ] prefers-reduced-motion disables all animations (instant reveal)
- [ ] Icons have `aria-hidden="true"` attribute
- [ ] Section has `aria-label="Skills section"` attribute
- [ ] Heading hierarchy is correct (h2 for section title)
- [ ] Focus states visible on interactive elements
- [ ] Color contrast meets WCAG 2.1 AA standards

### Testing Requirements
- [ ] Unit tests written for SkillCard component
- [ ] Unit tests written for SkillItem component
- [ ] Integration test for SkillsSection render
- [ ] Reduced motion behavior tested
- [ ] All tests passing with >80% coverage

### Quality Gates
- [ ] TypeScript strict mode - zero errors
- [ ] ESLint - zero errors, zero warnings
- [ ] Prettier - code formatted correctly
- [ ] All files ASCII-encoded (0-127 characters only)
- [ ] Unix LF line endings throughout
- [ ] No console.log statements in production code

---

## 8. Implementation Notes

### Key Considerations

1. **Follow AboutSection patterns exactly**: The AboutSection provides the template for section structure, parallax integration, and animation patterns. Do not deviate.

2. **Skill data structure**: Keep it simple - category name, icon, and array of skill strings. No proficiency levels in MVP.

3. **Icon selection**: Use Lucide icons that clearly represent each category:
   - AI/ML: `Brain` or `Cpu`
   - Development: `Code` or `Terminal`
   - Product: `Package` or `Layers`
   - Leadership: `Users` or `Award`

4. **Hover effects**: Subtle is key - slight y-translation (-4px), border color change, and background opacity shift. Match AchievementCard.tsx hover pattern.

5. **Grid breakpoints**: Use Tailwind's responsive prefixes:
   - `grid-cols-1` (default/mobile)
   - `sm:grid-cols-2` (>=640px)
   - `lg:grid-cols-4` (>=1024px)

### Potential Challenges

- **Stagger timing**: If stagger is too fast, cards blend together; too slow feels sluggish. Start with 0.1s and adjust based on visual testing.

- **Card height consistency**: Different skill counts per category may cause uneven card heights. Use `items-stretch` on grid and consistent padding.

- **Icon visual weight**: Some Lucide icons are heavier than others. Test multiple options to ensure visual balance across all 4 cards.

- **Mobile scroll performance**: With 4 cards animating, ensure mobile devices maintain 60fps. Test on real devices.

### ASCII Reminder

All output files must use ASCII-only characters (0-127). This means:
- No smart quotes (" " ' ') - use straight quotes (" ')
- No em dashes (--) - use regular dashes (-)
- No special symbols outside standard ASCII
- Comments and strings in English only

---

## 9. Testing Strategy

### Unit Tests

**SkillCard.test.tsx**:
- Renders card with icon, title, and skill items
- Applies correct animation variants
- Respects isRevealed prop
- Handles custom className
- Renders correct icon for category

**SkillItem.test.tsx**:
- Renders skill text correctly
- Applies hover styles class
- Handles long skill text gracefully

### Integration Tests

**SkillsSection.test.tsx**:
- Renders all 4 skill categories
- Section has correct id="skills" attribute
- ParallaxContainer/Layer structure correct
- Responsive grid classes applied
- aria-label present on section

### Reduced Motion Tests

- Cards render immediately when prefers-reduced-motion is true
- No animation variants applied in reduced motion mode
- All content still visible and accessible

### Manual Testing Checklist

- [ ] Scroll to Skills section and verify staggered reveal
- [ ] Test hover effects on each card
- [ ] Resize browser and verify responsive grid
- [ ] Enable reduced motion in OS and verify instant reveal
- [ ] Click Skills nav link and verify smooth scroll
- [ ] Test on mobile device (real or emulator)

### Edge Cases

- Empty skill array should render card without skill items
- Very long skill names should truncate or wrap gracefully
- Rapid scroll up/down should not break animation state

---

## 10. Dependencies

### External Libraries

| Library | Version | Purpose |
|---------|---------|---------|
| framer-motion | ^12.x | Scroll-triggered animations |
| lucide-react | ^0.x | Category icons |
| @radix-ui/react-* | ^1.x | Accessible primitives (if needed) |

### Internal Dependencies

- `@/lib/cn` - Class name utility
- `@/hooks/useReducedMotion` - Motion preference detection
- `@/components/parallax` - ParallaxContainer, ParallaxLayer

### Other Sessions

- **Depends on**: `phase02-session02-about-section` (animation patterns, section structure)
- **Depended by**: `phase02-session04-projects-section` (card patterns, hover effects)

---

## 11. Reference Implementations

### AboutSection Pattern Reference

```typescript
// components/sections/AboutSection.tsx - Follow this structure exactly
export function AboutSection({ className, isRevealed = true }: AboutSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(contentRef, { once: true, amount: 0.3 });
  const shouldReveal = isRevealed && isInView;

  return (
    <section id="about" ref={sectionRef} ...>
      <ParallaxContainer containerRef={sectionRef}>
        <ParallaxLayer layer="mid" zIndex={5} pointerEvents={false}>
          {/* Decorative elements */}
        </ParallaxLayer>
        <ParallaxLayer layer="foreground" zIndex={20}>
          {/* Content with shouldReveal prop */}
        </ParallaxLayer>
      </ParallaxContainer>
    </section>
  );
}
```

### AchievementCard Animation Pattern Reference

```typescript
// Animation variants - Use this pattern for SkillCard
const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const reducedMotionVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0 } },
};
```

---

## Next Steps

Run `/tasks` to generate the implementation task checklist.
