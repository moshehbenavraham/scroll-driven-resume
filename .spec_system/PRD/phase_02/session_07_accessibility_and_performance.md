# Session 07: Accessibility and Performance

**Session ID**: `phase02-session07-accessibility-and-performance`
**Status**: Not Started
**Estimated Tasks**: ~20-25
**Estimated Duration**: 2-4 hours

---

## Objective

Ensure WCAG 2.1 AA accessibility compliance across all components, optimize performance to meet Core Web Vitals targets, and implement comprehensive prefers-reduced-motion support throughout the portfolio.

---

## Scope

### In Scope (MVP)

- Accessibility audit using axe-core or Lighthouse
- WCAG 2.1 AA compliance verification and fixes
- Keyboard navigation testing and fixes
- Screen reader testing (VoiceOver, NVDA)
- Focus management and visible focus indicators
- ARIA attributes audit and improvements
- Color contrast verification (text over backgrounds)
- prefers-reduced-motion comprehensive implementation
- Core Web Vitals optimization (LCP < 2.5s, CLS < 0.1, INP < 200ms)
- Bundle size analysis and optimization
- Image optimization audit
- Critical CSS extraction
- Lazy loading verification

### Out of Scope

- WCAG AAA compliance
- Multiple language support
- High contrast mode
- Custom screen reader announcements beyond standard ARIA

---

## Prerequisites

- [ ] Session 06 complete (Mobile Optimization)
- [ ] All content sections implemented
- [ ] Testing tools configured (axe-core, Lighthouse)

---

## Deliverables

1. Accessibility audit report with findings and fixes
2. Performance audit report with Core Web Vitals scores
3. `lib/a11y.ts` - Accessibility utility functions
4. Updated components with ARIA improvements
5. prefers-reduced-motion hooks and utilities refinement
6. Bundle analysis report with optimization recommendations
7. Lighthouse CI configuration for ongoing monitoring

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
