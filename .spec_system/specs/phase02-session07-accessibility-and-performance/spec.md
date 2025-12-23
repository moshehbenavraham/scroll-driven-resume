# Session Specification

**Session ID**: `phase02-session07-accessibility-and-performance`
**Phase**: 02 - Content and Polish
**Status**: Not Started
**Created**: 2025-12-23

---

## 1. Session Overview

This session focuses on ensuring the Modern Resume Site meets WCAG 2.1 AA accessibility standards and Core Web Vitals performance targets. With all content sections complete (Hero, Product, About, Skills, Projects, Contact, Footer) and mobile optimization done, the portfolio is feature-complete. This session transforms it into a production-ready application that is accessible to all users and performs optimally.

The accessibility audit will examine keyboard navigation, screen reader compatibility, focus management, color contrast, and ARIA implementation across all 7 content sections, the navbar, and interactive elements. Performance optimization will target LCP < 2.5s, CLS < 0.1, and INP < 200ms by analyzing bundle size (particularly Three.js), lazy loading, critical CSS, and asset delivery.

This is a critical session that directly blocks deployment. Session 08 (Testing and Deployment) explicitly requires passing Core Web Vitals and a completed accessibility audit before proceeding.

---

## 2. Objectives

1. Achieve Lighthouse accessibility score >= 90 with zero axe-core critical/serious violations
2. Ensure full keyboard navigation and visible focus indicators for all interactive elements
3. Meet Core Web Vitals targets: LCP < 2.5s, CLS < 0.1, INP < 200ms on both mobile and desktop
4. Verify comprehensive prefers-reduced-motion support disables all non-essential animations

---

## 3. Prerequisites

### Required Sessions
- [x] `phase02-session06-mobile-optimization` - Responsive design, touch targets, viewport handling
- [x] `phase02-session05-contact-and-footer` - Contact form with validation, footer navigation
- [x] `phase02-session04-projects-section` - Project cards with links
- [x] `phase02-session03-skills-section` - Skill cards with staggered animations
- [x] `phase02-session02-about-section` - Bio and achievements with scroll animations
- [x] `phase02-session01-fixed-navbar` - Navigation with backdrop blur

### Required Tools/Knowledge
- Lighthouse CLI or Chrome DevTools Lighthouse
- axe-core or axe DevTools browser extension
- Screen reader (VoiceOver on macOS, NVDA on Windows)
- @next/bundle-analyzer for bundle analysis

### Environment Requirements
- Node.js 20+ with pnpm/npm
- Chrome, Firefox, Safari for testing
- Development server running on port 3017

---

## 4. Scope

### In Scope (MVP)
- Accessibility audit using Lighthouse and axe-core
- Keyboard navigation testing and fixes for all sections
- Screen reader testing with VoiceOver/NVDA
- Focus management and visible focus indicators
- ARIA attributes audit and improvements
- Color contrast verification (4.5:1 for text, 3:1 for large text)
- prefers-reduced-motion comprehensive verification
- Core Web Vitals measurement and optimization
- Bundle size analysis with @next/bundle-analyzer
- Lazy loading verification for images and WebGL
- Critical CSS extraction if needed

### Out of Scope (Deferred)
- WCAG AAA compliance - *Reason: AA is sufficient for MVP*
- Multiple language support - *Reason: Deferred requirement*
- High contrast mode - *Reason: Not required for AA compliance*
- Custom screen reader announcements - *Reason: Standard ARIA sufficient*
- Lighthouse CI GitHub Actions - *Reason: Session 08 scope*

---

## 5. Technical Approach

### Architecture

The accessibility and performance work follows a systematic audit-fix-verify approach:

1. **Audit Phase**: Run automated tools (Lighthouse, axe-core) to identify issues
2. **Analysis Phase**: Categorize issues by severity and component location
3. **Fix Phase**: Address issues systematically, starting with critical/serious
4. **Verify Phase**: Re-run audits to confirm fixes, manual testing for edge cases

### Design Patterns
- **Skip Links**: Hidden link to main content for keyboard users
- **Focus Trap**: Modal/dialog focus management (MobileDrawer)
- **Roving TabIndex**: For keyboard navigation in skill cards, project cards
- **Live Regions**: For form validation feedback (ContactForm)
- **Semantic HTML**: Proper heading hierarchy, landmark regions

### Technology Stack
- **axe-core 4.x** - Automated accessibility testing library
- **Lighthouse 12.x** - Performance and accessibility auditing
- **@next/bundle-analyzer** - Webpack bundle visualization
- **Radix UI** - Already provides accessible primitives (verify usage)
- **next/dynamic** - Dynamic imports for code splitting

---

## 6. Deliverables

### Files to Create
| File | Purpose | Est. Lines |
|------|---------|------------|
| `lib/a11y.ts` | Accessibility utility functions (skip link, focus trap, announcer) | ~80 |
| `components/a11y/SkipLink.tsx` | Skip to main content link component | ~25 |
| `components/a11y/VisuallyHidden.tsx` | Screen reader only text wrapper | ~15 |
| `docs/accessibility-audit.md` | Audit findings and remediation report | ~150 |
| `docs/performance-audit.md` | Core Web Vitals report with recommendations | ~100 |

### Files to Modify
| File | Changes | Est. Lines |
|------|---------|------------|
| `app/layout.tsx` | Add SkipLink, lang attribute, main landmark | ~10 |
| `app/page.tsx` | Add id="main-content" for skip link target | ~5 |
| `components/navigation/Navbar.tsx` | ARIA attributes, focus management | ~15 |
| `components/navigation/MobileDrawer.tsx` | Focus trap, ARIA for dialog | ~20 |
| `components/navigation/NavLink.tsx` | aria-current for active link | ~5 |
| `components/contact/ContactForm.tsx` | aria-describedby for errors, live region | ~15 |
| `components/contact/ContactFormField.tsx` | aria-invalid, aria-describedby | ~10 |
| `components/sections/HeroSection.tsx` | aria-hidden for decorative elements | ~5 |
| `components/sections/ProductSection.tsx` | aria-hidden for decorative elements | ~5 |
| `components/sections/AboutSection.tsx` | Heading hierarchy, landmark | ~10 |
| `components/sections/SkillsSection.tsx` | Heading hierarchy, card accessibility | ~10 |
| `components/sections/ProjectsSection.tsx` | Card accessibility, link purpose | ~15 |
| `components/sections/ContactSection.tsx` | Form landmark, heading | ~5 |
| `components/sections/Footer.tsx` | Nav landmark, link accessibility | ~10 |
| `components/hero/SocialLinks.tsx` | Accessible names for icon links | ~10 |
| `components/projects/ProjectLinks.tsx` | Accessible names for icon links | ~10 |
| `components/ui/theme-toggle.tsx` | Accessible label, keyboard support | ~10 |
| `hooks/useReducedMotion.ts` | Verify SSR compatibility | ~5 |
| `next.config.ts` | Bundle analyzer configuration | ~10 |
| `package.json` | Add @next/bundle-analyzer, axe-core | ~5 |

---

## 7. Success Criteria

### Functional Requirements
- [ ] Skip link appears on Tab and navigates to main content
- [ ] All interactive elements reachable via keyboard (Tab/Shift+Tab)
- [ ] Focus indicators visible on all focusable elements
- [ ] Form errors announced to screen readers
- [ ] Modal (MobileDrawer) traps focus and returns on close
- [ ] Images have appropriate alt text or are marked decorative
- [ ] Links have descriptive accessible names
- [ ] Headings follow logical hierarchy (h1 -> h2 -> h3)
- [ ] prefers-reduced-motion disables parallax, WebGL, and scroll animations

### Testing Requirements
- [ ] Lighthouse accessibility score >= 90
- [ ] Zero axe-core critical or serious violations
- [ ] Keyboard-only navigation test completed
- [ ] Screen reader test completed (VoiceOver or NVDA)
- [ ] Core Web Vitals passing in Lighthouse

### Quality Gates
- [ ] All files ASCII-encoded (0-127 characters only)
- [ ] Unix LF line endings
- [ ] Code follows project ESLint/Prettier conventions
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] All existing tests pass (`npm run test`)

---

## 8. Implementation Notes

### Key Considerations
- **Focus visibility**: Tailwind's `focus-visible:` utilities should be used for keyboard-only focus rings
- **Color contrast**: Text over animated backgrounds (hero frames) needs verification
- **Dynamic content**: Skill cards and project cards with staggered reveals must not cause accessibility issues
- **Form validation**: react-hook-form integration with aria attributes

### Potential Challenges
- **LCP with frame sequences**: Large hero images may impact LCP; verify preloading strategy
- **CLS from animations**: Parallax and reveal animations must reserve space to prevent shifts
- **Three.js bundle size**: ~500KB+ for Three.js; verify dynamic import is working
- **Focus trap in MobileDrawer**: Radix Dialog should handle this, verify implementation
- **WebGL fallback keyboard access**: Ensure fallback content is accessible

### ASCII Reminder
All output files must use ASCII-only characters (0-127). No smart quotes, em dashes, or special Unicode characters.

---

## 9. Testing Strategy

### Unit Tests
- `lib/a11y.ts` utility functions (focus trap, announcer)
- `useReducedMotion` hook SSR behavior

### Integration Tests
- Skip link navigation flow
- Form validation with screen reader announcements
- Theme toggle accessibility

### Manual Testing
- Full keyboard navigation walkthrough (Tab through entire page)
- Screen reader walkthrough (VoiceOver on macOS Safari)
- Lighthouse audit in Chrome DevTools
- axe DevTools scan of each section
- prefers-reduced-motion toggle in browser settings

### Edge Cases
- Focus when MobileDrawer opens/closes
- Focus when theme toggle changes
- Form error announcement timing
- Decorative elements not announced
- Icon-only links have accessible names

---

## 10. Dependencies

### External Libraries
- `@next/bundle-analyzer`: ^15.x (dev dependency for bundle analysis)
- `axe-core`: ^4.x (dev dependency for automated a11y testing)

### Internal Dependencies
- `hooks/useReducedMotion.ts` - Already exists, verify implementation
- `@radix-ui/react-dialog` - Used by MobileDrawer, provides focus trap
- `next-themes` - Theme toggle, verify accessibility

### Other Sessions
- **Depends on**: All Phase 02 sessions 01-06 (complete)
- **Depended by**: `phase02-session08-testing-and-deployment` (requires passing a11y and performance)

---

## 11. Component Audit Checklist

### Navigation Components
| Component | Keyboard | Focus | ARIA | Screen Reader |
|-----------|----------|-------|------|---------------|
| Navbar.tsx | [ ] | [ ] | [ ] | [ ] |
| NavLink.tsx | [ ] | [ ] | [ ] | [ ] |
| NavLinks.tsx | [ ] | [ ] | [ ] | [ ] |
| MobileMenuButton.tsx | [ ] | [ ] | [ ] | [ ] |
| MobileMenu.tsx | [ ] | [ ] | [ ] | [ ] |
| MobileDrawer.tsx | [ ] | [ ] | [ ] | [ ] |

### Section Components
| Component | Keyboard | Focus | ARIA | Screen Reader |
|-----------|----------|-------|------|---------------|
| HeroSection.tsx | [ ] | [ ] | [ ] | [ ] |
| ProductSection.tsx | [ ] | [ ] | [ ] | [ ] |
| AboutSection.tsx | [ ] | [ ] | [ ] | [ ] |
| SkillsSection.tsx | [ ] | [ ] | [ ] | [ ] |
| ProjectsSection.tsx | [ ] | [ ] | [ ] | [ ] |
| ContactSection.tsx | [ ] | [ ] | [ ] | [ ] |
| Footer.tsx | [ ] | [ ] | [ ] | [ ] |

### Interactive Components
| Component | Keyboard | Focus | ARIA | Screen Reader |
|-----------|----------|-------|------|---------------|
| theme-toggle.tsx | [ ] | [ ] | [ ] | [ ] |
| SocialLinks.tsx | [ ] | [ ] | [ ] | [ ] |
| ContactForm.tsx | [ ] | [ ] | [ ] | [ ] |
| ContactFormField.tsx | [ ] | [ ] | [ ] | [ ] |
| ProjectCard.tsx | [ ] | [ ] | [ ] | [ ] |
| ProjectLinks.tsx | [ ] | [ ] | [ ] | [ ] |
| SkillCard.tsx | [ ] | [ ] | [ ] | [ ] |

---

## 12. Core Web Vitals Targets

| Metric | Target | Measurement Tool |
|--------|--------|------------------|
| LCP (Largest Contentful Paint) | < 2.5s | Lighthouse, WebPageTest |
| CLS (Cumulative Layout Shift) | < 0.1 | Lighthouse, Chrome DevTools |
| INP (Interaction to Next Paint) | < 200ms | Chrome DevTools, web-vitals |

### Optimization Strategies
1. **LCP**: Verify hero frame preloading, optimize critical rendering path
2. **CLS**: Ensure all images have explicit dimensions, reserve space for animations
3. **INP**: Verify event handlers are not blocking, minimize main thread work

---

## Next Steps

Run `/tasks` to generate the implementation task checklist.
