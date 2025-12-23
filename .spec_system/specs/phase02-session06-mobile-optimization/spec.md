# Session Specification

**Session ID**: `phase02-session06-mobile-optimization`
**Phase**: 02 - Content and Polish
**Status**: Not Started
**Created**: 2025-12-23

---

## 1. Session Overview

This session focuses on refining the responsive design and mobile experience across all sections of the portfolio site. With all content sections now implemented (navbar, about, skills, projects, contact, and footer), we need to ensure the site delivers a polished, touch-friendly experience on mobile devices.

The primary challenges involve addressing the well-known 100vh issue on mobile browsers (where the viewport height doesn't account for browser chrome), ensuring all interactive elements meet the 44x44px minimum touch target guidelines, and optimizing the contact form for mobile keyboard interactions. We'll also implement safe area handling for notched devices (iPhone X and later) and refine the mobile navigation experience.

This session is a prerequisite for the accessibility and performance audit (session 07), as mobile-specific issues must be resolved before comprehensive testing can begin. The work builds on the existing `useIsMobile` hook and mobile-first CSS approach established in earlier phases.

---

## 2. Objectives

1. Create a `useViewportHeight` hook that reliably calculates viewport height accounting for mobile browser chrome
2. Audit and fix responsive layouts at all breakpoints (320px, 375px, 768px, 1024px, 1440px)
3. Ensure all interactive elements meet 44x44px minimum touch target size
4. Implement safe area handling for notched devices using CSS `env()` functions

---

## 3. Prerequisites

### Required Sessions
- [x] `phase02-session01-fixed-navbar` - Navbar and mobile menu implemented
- [x] `phase02-session02-about-section` - About section with responsive layout
- [x] `phase02-session03-skills-section` - Skills cards with responsive grid
- [x] `phase02-session04-projects-section` - Projects grid with responsive breakpoints
- [x] `phase02-session05-contact-and-footer` - Contact form and footer implemented

### Required Tools/Knowledge
- Chrome DevTools device emulation
- Understanding of CSS `dvh`, `svh`, `lvh` viewport units
- Knowledge of iOS Safari viewport behavior
- Familiarity with CSS `env(safe-area-inset-*)` functions

### Environment Requirements
- Development server running for testing
- Chrome/Safari with device emulation
- Optional: Physical iOS/Android device for final verification

---

## 4. Scope

### In Scope (MVP)
- `useViewportHeight` hook with dynamic viewport height calculation
- Responsive audit at 320px, 375px, 768px, 1024px, 1440px breakpoints
- Touch target sizing audit and fixes (minimum 44x44px)
- Mobile navigation menu refinements
- Contact form mobile keyboard handling improvements
- Safe area inset handling for notched devices
- Full-width CTA buttons on mobile
- Stacked layouts for mobile viewports
- Scroll behavior optimization for mobile

### Out of Scope (Deferred)
- PWA features - *Reason: Not in MVP requirements*
- Offline functionality - *Reason: Not in MVP requirements*
- Native app features - *Reason: Web-only portfolio*
- Device-specific customizations - *Reason: Generic responsive approach sufficient*
- Swipe gestures - *Reason: Not essential for portfolio navigation*

---

## 5. Technical Approach

### Architecture
The mobile optimization work centers on a new `useViewportHeight` hook that calculates the actual viewport height available on mobile browsers. This hook uses `window.visualViewport` API when available, falling back to `window.innerHeight`. The hook listens to resize and orientation change events to stay current.

For safe area handling, we'll add CSS custom properties that map to `env(safe-area-inset-*)` values, making them easily consumable by Tailwind utilities.

### Design Patterns
- **Observer Pattern**: `useViewportHeight` subscribes to viewport changes
- **Defensive CSS**: Use modern viewport units (`dvh`) with fallbacks (`vh`)
- **Mobile-first**: Ensure base styles work on smallest screens, enhance for larger

### Technology Stack
- React 19 with `useSyncExternalStore` for viewport hook
- Tailwind CSS 4 responsive modifiers
- CSS `env()` for safe areas
- CSS `dvh`/`svh`/`lvh` viewport units

---

## 6. Deliverables

### Files to Create
| File | Purpose | Est. Lines |
|------|---------|------------|
| `hooks/useViewportHeight.ts` | Dynamic viewport height hook | ~80 |
| `styles/safe-area.css` | Safe area CSS custom properties | ~30 |

### Files to Modify
| File | Changes | Est. Lines Changed |
|------|---------|-------------------|
| `app/globals.css` | Add safe area variables and dvh fallbacks | ~30 |
| `components/sections/HeroSection.tsx` | Use viewport height hook | ~10 |
| `components/sections/ProductSection.tsx` | Use viewport height hook | ~10 |
| `components/sections/AboutSection.tsx` | Mobile layout refinements | ~15 |
| `components/sections/SkillsSection.tsx` | Mobile grid adjustments | ~15 |
| `components/sections/ProjectsSection.tsx` | Mobile card layout | ~15 |
| `components/sections/ContactSection.tsx` | Keyboard handling improvements | ~20 |
| `components/sections/Footer.tsx` | Safe area bottom padding | ~10 |
| `components/navigation/Navbar.tsx` | Safe area top handling | ~10 |
| `components/navigation/MobileDrawer.tsx` | Full height with safe areas | ~15 |
| `components/contact/ContactForm.tsx` | Touch target sizing | ~10 |
| `components/contact/ContactFormField.tsx` | Input sizing for mobile | ~10 |
| `components/ui/button.tsx` | Touch target minimum size | ~5 |
| `components/hero/SocialLinks.tsx` | Touch target sizing | ~10 |
| `components/footer/FooterNav.tsx` | Touch target sizing | ~10 |
| `hooks/index.ts` | Export new hook | ~2 |

---

## 7. Success Criteria

### Functional Requirements
- [ ] All sections display correctly at 320px viewport width
- [ ] All sections display correctly at 375px viewport width
- [ ] All sections display correctly at 768px viewport width
- [ ] All sections display correctly at 1024px viewport width
- [ ] All sections display correctly at 1440px viewport width
- [ ] No horizontal overflow at any breakpoint
- [ ] 100vh sections fill exact viewport on mobile Safari
- [ ] Contact form remains usable when mobile keyboard is visible
- [ ] Mobile navigation drawer respects safe areas

### Testing Requirements
- [ ] Manual testing in Chrome DevTools device emulation
- [ ] Manual testing in Safari responsive design mode
- [ ] Verify on physical iOS device if available
- [ ] Verify on physical Android device if available

### Quality Gates
- [ ] All files ASCII-encoded (0-127)
- [ ] Unix LF line endings
- [ ] TypeScript strict mode - zero errors
- [ ] ESLint - zero errors, zero warnings
- [ ] No console errors in browser

---

## 8. Implementation Notes

### Key Considerations
- The `100vh` problem: Mobile Safari's address bar causes `100vh` to be taller than visible viewport. Use `100dvh` with `100vh` fallback.
- `window.visualViewport` API provides accurate viewport dimensions including keyboard state
- Safe area insets must be applied to elements near screen edges (navbar, footer, drawers)
- Touch targets should have at least 44x44px tap area, even if visual size is smaller (use padding)

### Potential Challenges
- **iOS Safari quirks**: Safari has unique viewport behavior; test thoroughly in Safari responsive mode
- **Keyboard appearance**: Contact form needs to scroll/adjust when keyboard appears; use `visualViewport` resize event
- **Notched device testing**: Without physical iPhone, rely on Safari's safe area simulation

### ASCII Reminder
All output files must use ASCII-only characters (0-127). Avoid curly quotes, em dashes, or special Unicode.

---

## 9. Testing Strategy

### Unit Tests
- `useViewportHeight` hook returns valid pixel values
- `useViewportHeight` updates on resize events
- `useViewportHeight` handles SSR (server returns fallback)

### Integration Tests
- Sections render without horizontal overflow at all breakpoints
- Navigation drawer opens and closes correctly on mobile

### Manual Testing
- Test all breakpoints in Chrome DevTools (320, 375, 768, 1024, 1440)
- Test in Safari responsive design mode
- Test orientation change behavior
- Test contact form with virtual keyboard
- Test scroll behavior through all sections
- Verify touch targets are easily tappable

### Edge Cases
- Very small viewport (320px width)
- Landscape orientation on mobile
- Split-screen mode on tablets
- Keyboard appearance on contact form
- Orientation change while scrolling

---

## 10. Dependencies

### External Libraries
- No new libraries required
- Existing: Tailwind CSS 4, Framer Motion 12, React 19

### Other Sessions
- **Depends on**: phase02-session01 through phase02-session05 (all content sections)
- **Depended by**: phase02-session07-accessibility-and-performance

---

## Next Steps

Run `/tasks` to generate the implementation task checklist.
