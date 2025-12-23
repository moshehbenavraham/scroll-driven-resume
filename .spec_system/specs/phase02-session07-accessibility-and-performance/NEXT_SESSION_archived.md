# NEXT_SESSION.md

## Session Recommendation

**Generated**: 2025-12-23
**Project State**: Phase 02 - Content and Polish
**Completed Sessions**: 19

---

## Recommended Next Session

**Session ID**: `phase02-session07-accessibility-and-performance`
**Session Name**: Accessibility and Performance
**Estimated Duration**: 2-4 hours
**Estimated Tasks**: ~20-25

---

## Why This Session Next?

### Prerequisites Met
- [x] Session 06 complete (Mobile Optimization) - completed 2025-12-23
- [x] All content sections implemented (About, Skills, Projects, Contact, Footer)
- [x] Testing tools can be configured during session

### Dependencies
- **Builds on**: phase02-session06-mobile-optimization (responsive design, touch targets)
- **Enables**: phase02-session08-testing-and-deployment (requires passing Core Web Vitals and accessibility audit)

### Project Progression
This is the **penultimate session** of the entire project. With all content sections complete and mobile optimization done, the portfolio is feature-complete. Before deployment, we must ensure:

1. **Accessibility compliance** - WCAG 2.1 AA standards for inclusive design
2. **Performance optimization** - Core Web Vitals targets for user experience
3. **Reduced motion support** - Final polish on prefers-reduced-motion throughout

Session 08 (Testing and Deployment) explicitly requires this session's completion, including passing Core Web Vitals and a completed accessibility audit.

---

## Session Overview

### Objective
Ensure WCAG 2.1 AA accessibility compliance across all components, optimize performance to meet Core Web Vitals targets, and implement comprehensive prefers-reduced-motion support throughout the portfolio.

### Key Deliverables
1. Accessibility audit report with findings and fixes (Lighthouse, axe-core)
2. Performance audit report with Core Web Vitals scores
3. `lib/a11y.ts` - Accessibility utility functions
4. Updated components with ARIA improvements
5. Bundle analysis report with optimization recommendations
6. Lighthouse CI configuration for ongoing monitoring

### Scope Summary
- **In Scope (MVP)**: WCAG 2.1 AA compliance, keyboard navigation, screen reader support, focus management, ARIA attributes, color contrast verification, Core Web Vitals optimization (LCP < 2.5s, CLS < 0.1, INP < 200ms), bundle size analysis, critical CSS, lazy loading verification
- **Out of Scope**: WCAG AAA compliance, multiple language support, high contrast mode, custom screen reader announcements

---

## Technical Considerations

### Technologies/Patterns
- **axe-core** - Automated accessibility testing
- **Lighthouse CI** - Performance and accessibility auditing
- **@next/bundle-analyzer** - Bundle size analysis
- **prefers-reduced-motion** - CSS media query and hook refinement
- **Radix UI** - Already provides accessible primitives (verify implementation)

### Potential Challenges
- **Color contrast over animations** - Text readability over moving frame backgrounds
- **Focus management** - Complex scroll-triggered content may trap or lose focus
- **CLS from animations** - Parallax and reveals may cause layout shifts if not properly sized
- **LCP optimization** - Large hero frame sequences may impact largest contentful paint
- **Bundle size** - Three.js/R3F adds significant payload; may need dynamic imports

---

## Success Criteria

- [ ] Lighthouse accessibility score >= 90
- [ ] Zero axe-core critical/serious violations
- [ ] Keyboard navigation works for all interactive elements
- [ ] Focus indicators visible and consistent
- [ ] Color contrast passes WCAG AA (4.5:1 for text)
- [ ] prefers-reduced-motion disables all non-essential motion
- [ ] LCP < 2.5s on mobile and desktop
- [ ] CLS < 0.1 with no layout shifts
- [ ] INP < 200ms for all interactions
- [ ] Bundle size within acceptable limits

---

## Alternative Sessions

If this session is blocked:
1. **None available** - Session 08 (Testing and Deployment) requires this session to be complete
2. **Phase complete** - All other Phase 02 sessions are already complete

This is a **blocking session** - it must be completed before the project can proceed to deployment.

---

## Next Steps

Run `/sessionspec` to generate the formal specification.
