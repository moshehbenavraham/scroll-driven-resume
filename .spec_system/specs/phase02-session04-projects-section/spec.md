# Session Specification

**Session ID**: `phase02-session04-projects-section`
**Phase**: 02 - Content and Polish
**Status**: Not Started
**Created**: 2025-12-23

---

## 1. Session Overview

This session builds the Projects Section, a showcase of 3-6 portfolio projects displayed in responsive card layouts with engaging hover effects and scroll-triggered animations. The Projects Section is a critical portfolio element that demonstrates technical capabilities through real-world work examples.

The implementation follows established patterns from the Skills Section, reusing the card-based UI architecture (staggered reveals, hover effects, responsive grids) while introducing project-specific features: thumbnail images, tech stack badges, and external links to live demos and source code. This consistency ensures a cohesive design language across sections.

The section integrates with the existing parallax system for visual depth and respects the prefers-reduced-motion preference for accessibility. Upon completion, the main content sections (Hero, About, Skills, Projects) will be complete, leaving only Contact/Footer for page content.

---

## 2. Objectives

1. Build a responsive projects grid section displaying 3-6 portfolio projects with scroll-triggered entrance animations
2. Create reusable ProjectCard component with image thumbnail, title, description, tech badges, and external links
3. Implement hover effects (card lift, image zoom, overlay reveal) maintaining 60fps performance
4. Ensure accessibility compliance including prefers-reduced-motion support and proper link attributes

---

## 3. Prerequisites

### Required Sessions
- [x] `phase02-session03-skills-section` - Provides card animation patterns, grid layouts, staggered reveals
- [x] `phase02-session02-about-section` - Establishes content section structure and parallax integration
- [x] `phase01-session06-decorative-elements` - Decorative element patterns for visual enhancement

### Required Tools/Knowledge
- Framer Motion animation variants and useInView hook
- Next.js Image component for optimized thumbnails
- Tailwind CSS responsive grid utilities
- TypeScript strict typing patterns

### Environment Requirements
- Node.js 20+ with Next.js 15 dev server
- MinIO running for placeholder images (or use Next.js placeholder)
- Existing component architecture in place

---

## 4. Scope

### In Scope (MVP)
- ProjectsSection container with responsive grid layout (1/2/3 columns)
- ProjectCard component with image, title, description, tech badges, external links
- TechBadge component for technology stack display
- ProjectLinks component for live demo and GitHub source buttons
- Project data type definitions and sample fixture data
- Scroll-triggered staggered entrance animations
- Hover effects: card lift (-translate-y), image scale, overlay reveal
- External links with proper security attributes (rel="noopener noreferrer")
- prefers-reduced-motion support (instant reveal, no transforms)
- Unit tests for all new components

### Out of Scope (Deferred)
- Project filtering by technology - *Reason: Deferred requirement per PRD*
- Project detail modal/page - *Reason: Single-page portfolio design*
- Video demos in cards - *Reason: Performance and complexity concerns*
- GitHub stats integration (stars, forks) - *Reason: Requires API integration*
- Featured/larger card variant - *Reason: Can be added post-MVP if needed*

---

## 5. Technical Approach

### Architecture

The section follows the established component hierarchy:

```
ProjectsSection (container)
  ParallaxContainer
    ParallaxLayer (decorative, z-5)
      ProjectsDecorative
    ParallaxLayer (content, z-20)
      Heading + Description
      Grid
        ProjectCard (x3-6)
          ProjectImage
          ProjectContent
            Title
            Description
            TechBadge (x3-5)
            ProjectLinks
```

### Design Patterns

- **Composition Pattern**: Small, focused components (TechBadge, ProjectLinks) composed into ProjectCard
- **Variant Pattern**: Animation variants for entrance/hover states with reduced motion alternatives
- **Container/Content Pattern**: ProjectsSection handles layout, ProjectCard handles individual item rendering
- **Data-Driven Rendering**: Project data defined in types with fixture, mapped to cards

### Technology Stack

- **Framer Motion 12**: useInView, motion components, animation variants
- **Next.js 15 Image**: Optimized thumbnail loading with placeholder blur
- **Tailwind CSS 4**: Responsive grid, hover states, transitions
- **Lucide React**: ExternalLink and Github icons
- **TypeScript 5.x**: Strict types for project data structure

---

## 6. Deliverables

### Files to Create

| File | Purpose | Est. Lines |
|------|---------|------------|
| `types/projects.ts` | Project data types and fixture | ~80 |
| `components/projects/index.ts` | Barrel export | ~10 |
| `components/projects/ProjectCard.tsx` | Individual project card | ~120 |
| `components/projects/TechBadge.tsx` | Technology stack badge | ~40 |
| `components/projects/ProjectLinks.tsx` | External link buttons | ~60 |
| `components/projects/ProjectImage.tsx` | Image with hover zoom | ~50 |
| `components/projects/ProjectsDecorative.tsx` | Decorative parallax elements | ~80 |
| `components/sections/ProjectsSection.tsx` | Main section container | ~130 |
| `__tests__/components/projects/ProjectCard.test.tsx` | ProjectCard tests | ~80 |
| `__tests__/components/projects/TechBadge.test.tsx` | TechBadge tests | ~40 |
| `__tests__/components/projects/ProjectLinks.test.tsx` | ProjectLinks tests | ~50 |
| `__tests__/components/sections/ProjectsSection.test.tsx` | Section tests | ~60 |

### Files to Modify

| File | Changes | Est. Lines |
|------|---------|------------|
| `app/page.tsx` | Add ProjectsSection to page | ~5 |
| `types/index.ts` | Export project types | ~2 |

---

## 7. Success Criteria

### Functional Requirements
- [ ] Projects section displays 3-6 project cards in responsive grid
- [ ] Each card shows: thumbnail image, title, description, 3-5 tech badges, links
- [ ] Card hover effect: lifts up (-translate-y-2) with shadow enhancement
- [ ] Image hover effect: scales up (scale-105) within container bounds
- [ ] External links open in new tabs with rel="noopener noreferrer"
- [ ] Grid responds: 1 column (mobile) -> 2 columns (tablet) -> 3 columns (desktop)
- [ ] Scroll animation triggers when section enters viewport (30% visible)
- [ ] Cards animate with staggered delay (0.1s between cards)

### Testing Requirements
- [ ] Unit tests written for ProjectCard, TechBadge, ProjectLinks, ProjectsSection
- [ ] All tests passing with >80% coverage on new components
- [ ] Manual testing: hover effects smooth at 60fps
- [ ] Manual testing: responsive grid transitions correctly
- [ ] Manual testing: prefers-reduced-motion shows instant content

### Quality Gates
- [ ] TypeScript strict mode: zero errors
- [ ] ESLint: zero errors, zero warnings
- [ ] All files ASCII-encoded (0-127 characters only)
- [ ] Unix LF line endings
- [ ] Code follows project conventions (cn(), useReducedMotion, variants pattern)

---

## 8. Implementation Notes

### Key Considerations

1. **Image Optimization**: Use Next.js Image with proper width/height to prevent CLS. Consider 16:9 or 4:3 aspect ratio for consistency.

2. **Hover Effect Performance**: Use CSS transforms (translate, scale) which are GPU-accelerated. Avoid animating width/height.

3. **Overflow Hidden for Image Zoom**: Image container must have `overflow-hidden rounded-*` to clip the scaled image.

4. **Link Security**: All external links must have `target="_blank"` and `rel="noopener noreferrer"` to prevent security vulnerabilities.

5. **Staggered Animation Timing**: Use the same 0.1s delay pattern from SkillsSection for consistency.

### Potential Challenges

- **Image Loading States**: Next.js Image placeholder blur may need base64 data or use placeholder="empty" for external URLs
- **Tech Badge Overflow**: Long technology names may need truncation or multi-line handling
- **Grid Alignment**: Cards with varying description lengths need `h-full` and flex layout for consistent heights

### ASCII Reminder

All output files must use ASCII-only characters (0-127). Avoid smart quotes, em-dashes, or special Unicode characters in code and comments.

---

## 9. Testing Strategy

### Unit Tests

- **ProjectCard**: Renders title, description, tech badges, links; respects isRevealed prop
- **TechBadge**: Renders technology name with correct styling
- **ProjectLinks**: Renders live/source links with correct href and rel attributes
- **ProjectsSection**: Renders heading and grid of cards; handles empty projects array

### Integration Tests

- Section integrates correctly with ParallaxContainer
- Cards animate in view (mock useInView)

### Manual Testing

1. Scroll to Projects section - verify staggered card entrance
2. Hover over card - verify lift effect and shadow
3. Hover over image - verify zoom effect within bounds
4. Click live demo link - verify opens in new tab
5. Click GitHub link - verify opens in new tab
6. Resize viewport - verify grid column transitions (1->2->3)
7. Enable prefers-reduced-motion - verify instant reveal, no transforms

### Edge Cases

- Project with no live demo link (only source)
- Project with very long title/description (truncation)
- Project with many tech badges (wrap handling)
- Empty projects array (graceful fallback or section hidden)

---

## 10. Dependencies

### External Libraries

- `framer-motion`: ^12.x (already installed)
- `lucide-react`: ^0.460.x (already installed)
- `next/image`: Built-in (Next.js 15)
- `@testing-library/react`: ^16.x (already installed)
- `vitest`: ^2.x (already installed)

### Other Sessions

- **Depends on**:
  - `phase02-session03-skills-section` (card patterns, grid layout)
  - `phase02-session02-about-section` (section structure)
  - `phase01-session05-parallax-layer-system` (parallax integration)

- **Depended by**:
  - `phase02-session05-contact-and-footer` (completes main content)
  - `phase02-session06-mobile-optimization` (will optimize this section)

---

## Next Steps

Run `/tasks` to generate the implementation task checklist.
