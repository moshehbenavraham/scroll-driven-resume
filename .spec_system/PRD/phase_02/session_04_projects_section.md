# Session 04: Projects Section

**Session ID**: `phase02-session04-projects-section`
**Status**: Not Started
**Estimated Tasks**: ~20-25
**Estimated Duration**: 2-4 hours

---

## Objective

Build a projects showcase section displaying 3-6 portfolio projects with cards featuring project images, descriptions, tech stacks, and links, using engaging hover effects and scroll animations.

---

## Scope

### In Scope (MVP)

- Projects section layout with responsive card grid
- Project card component with image, title, description, tech tags
- Hover effects: image zoom, card lift, overlay reveal
- External links to live project and source code (GitHub)
- Tech stack badges/tags using consistent styling
- Scroll-triggered entrance animations
- Featured project highlight (optional larger card)
- Responsive grid: 1 column mobile, 2 tablet, 3 desktop

### Out of Scope

- Project filtering by technology (deferred requirement)
- Project detail modal/page
- Video demos
- GitHub stats integration

---

## Prerequisites

- [ ] Session 03 complete (Skills Section)
- [ ] Card animation patterns established
- [ ] Image optimization strategy defined
- [ ] External link icon component available

---

## Deliverables

1. `components/sections/ProjectsSection.tsx` - Main projects section container
2. `components/projects/ProjectCard.tsx` - Individual project card
3. `components/projects/TechBadge.tsx` - Technology stack badge
4. `components/projects/ProjectLinks.tsx` - Live/source link buttons
5. `types/projects.ts` - TypeScript types for project data
6. Unit tests for project components
7. Sample project data fixture

---

## Success Criteria

- [ ] Projects section displays 3-6 project cards
- [ ] Hover effects animate smoothly (image zoom, card lift)
- [ ] External links open in new tabs with proper rel attributes
- [ ] Tech badges display correctly with consistent styling
- [ ] Grid responds correctly at all breakpoints
- [ ] Scroll animations fire at correct viewport position
- [ ] prefers-reduced-motion disables animations
- [ ] Section accessible via navbar link
- [ ] All tests passing with >80% coverage
