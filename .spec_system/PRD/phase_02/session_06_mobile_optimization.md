# Session 06: Mobile Optimization

**Session ID**: `phase02-session06-mobile-optimization`
**Status**: Not Started
**Estimated Tasks**: ~20-25
**Estimated Duration**: 2-4 hours

---

## Objective

Refine the responsive design and mobile experience across all sections, ensuring touch-friendly interactions, optimized viewport handling, and graceful degradation of advanced features on mobile devices.

---

## Scope

### In Scope (MVP)

- Responsive audit of all sections at 320px, 375px, 768px, 1024px, 1440px
- Touch-optimized interactions (tap targets, swipe gestures if applicable)
- Mobile-specific layout adjustments (stacked content, full-width CTAs)
- Viewport height handling (100vh issues on mobile browsers)
- Mobile keyboard handling for contact form
- Performance optimization for mobile (lazy loading, reduced motion default)
- Mobile navigation menu refinement
- Image srcset/sizes for mobile bandwidth optimization
- Safe area handling for notched devices
- Scroll behavior optimization for mobile

### Out of Scope

- Native app features (PWA, push notifications)
- Offline functionality
- Device-specific customizations beyond responsive breakpoints

---

## Prerequisites

- [ ] Sessions 01-05 complete (all content sections)
- [ ] Mobile-first CSS approach established
- [ ] Mobile frame variants available from Phase 00

---

## Deliverables

1. Mobile-specific CSS refinements across all components
2. `hooks/useViewportHeight.ts` - Safe viewport height calculation
3. Touch interaction enhancements for interactive elements
4. Updated responsive breakpoints if needed
5. Mobile testing report documenting device coverage
6. Performance comparison report (desktop vs mobile)

---

## Success Criteria

- [ ] All sections display correctly at mobile breakpoints
- [ ] No horizontal overflow or layout breaking
- [ ] Touch targets meet minimum 44x44px guideline
- [ ] Contact form usable with mobile keyboard visible
- [ ] 100vh sections account for mobile browser chrome
- [ ] Mobile navigation menu fully functional
- [ ] Images load appropriate sizes for viewport
- [ ] Page weight under target for mobile connections
- [ ] Manual testing passed on iOS Safari and Android Chrome
