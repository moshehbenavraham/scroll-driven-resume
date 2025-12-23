# Session Specification

**Session ID**: `phase02-session05-contact-and-footer`
**Phase**: 02 - Content and Polish
**Status**: Not Started
**Created**: 2025-12-23

---

## 1. Session Overview

This session implements the Contact section and Footer components, completing the portfolio's page structure. The Contact section provides visitors with a functional form to reach out, alongside social media links for alternative contact methods. The Footer anchors the page with navigation links and copyright information.

Following established patterns from previous sections (About, Skills, Projects), the Contact section will use ParallaxContainer for depth effects with decorative floating elements. The form will be built with react-hook-form for state management and Zod for schema validation, consistent with the project's TypeScript-strict approach. A honeypot field provides basic spam prevention without impacting accessibility.

This session is critical for visitor engagement - it transforms the portfolio from a showcase into an actionable contact point. Completing it enables the remaining polish phases (mobile optimization, accessibility, performance, testing/deployment) which require all content sections in place.

---

## 2. Objectives

1. Implement ContactSection with scroll-triggered reveal animations and parallax depth effects
2. Build accessible ContactForm with client-side validation, error states, and form submission handling
3. Create ContactSocialLinks component adapted for contact section styling (leverage existing SocialLinks pattern)
4. Implement Footer with navigation links, copyright, and optional scroll-to-top functionality

---

## 3. Prerequisites

### Required Sessions
- [x] `phase02-session04-projects-section` - Established section layout patterns and card components
- [x] `phase02-session03-skills-section` - Staggered reveal animation patterns
- [x] `phase02-session02-about-section` - ParallaxContainer/Layer integration patterns
- [x] `phase02-session01-fixed-navbar` - Navigation link patterns (reusable for footer)

### Required Tools/Knowledge
- react-hook-form for form state management
- Zod for validation schemas
- Framer Motion for animations (already installed)
- Lucide React for icons (already installed)

### Environment Requirements
- Next.js 15 dev server running
- TypeScript strict mode enabled
- Existing component patterns in place

---

## 4. Scope

### In Scope (MVP)
- ContactSection layout with parallax layers and decorative elements
- ContactForm with name, email, message fields
- Client-side validation with Zod schemas
- Form submission via mailto: link (external service integration deferred)
- Honeypot hidden field for spam prevention
- Success/error state feedback
- ContactSocialLinks component (styled for contact section)
- Footer with nav links (About, Skills, Projects, AI Community, Contact)
- Footer copyright with dynamic year
- Scroll-to-top button with smooth scroll behavior
- Unit tests for form validation utilities
- Accessible form implementation (labels, ARIA, keyboard nav)

### Out of Scope (Deferred)
- Backend form processing - *Reason: Requires server infrastructure*
- Formspree/external service integration - *Reason: Can be added post-MVP*
- Newsletter signup - *Reason: Deferred requirement per PRD*
- Chat widget integration - *Reason: Deferred requirement*
- CAPTCHA - *Reason: Honeypot sufficient for MVP*

---

## 5. Technical Approach

### Architecture
The Contact section follows the established section architecture:
```
ContactSection (container)
  - ParallaxContainer (scroll context)
    - ParallaxLayer[mid] (ContactDecorative - z:5)
    - ParallaxLayer[foreground] (content - z:20)
      - Section header with reveal animation
      - Two-column layout: Form (7cols) | Social (5cols)
      - ContactForm with validation
      - ContactSocialLinks

Footer (separate component)
  - Container with navigation grid
  - FooterNav links
  - Copyright with year
  - ScrollToTop button (fixed position)
```

### Design Patterns
- **Compound components**: ContactForm exposes FormField children for flexibility
- **Controlled form**: react-hook-form manages all form state
- **Schema validation**: Zod schemas define validation rules
- **Staggered reveals**: Framer Motion variants for sequential animation
- **Reusable patterns**: Leverage existing SocialLinks, NavLink patterns

### Technology Stack
- react-hook-form v7.x (form state management)
- @hookform/resolvers (Zod integration)
- zod (already installed - validation schemas)
- framer-motion v12 (animations - already installed)
- lucide-react (icons - already installed)
- Tailwind CSS 4 (styling - already installed)

---

## 6. Deliverables

### Files to Create

| File | Purpose | Est. Lines |
|------|---------|------------|
| `types/contact.ts` | TypeScript interfaces for contact components | ~80 |
| `lib/form-validation.ts` | Zod schemas and validation utilities | ~60 |
| `components/sections/ContactSection.tsx` | Main contact section container | ~100 |
| `components/contact/ContactForm.tsx` | Form with fields and validation | ~180 |
| `components/contact/ContactFormField.tsx` | Reusable form field component | ~70 |
| `components/contact/ContactSocialLinks.tsx` | Social links styled for contact | ~60 |
| `components/contact/ContactDecorative.tsx` | Decorative parallax elements | ~80 |
| `components/contact/index.ts` | Barrel export | ~10 |
| `components/sections/Footer.tsx` | Site footer component | ~120 |
| `components/footer/FooterNav.tsx` | Footer navigation links | ~50 |
| `components/footer/ScrollToTop.tsx` | Scroll-to-top button | ~50 |
| `components/footer/index.ts` | Barrel export | ~10 |
| `__tests__/lib/form-validation.test.ts` | Validation tests | ~100 |
| `__tests__/components/ContactForm.test.tsx` | Form component tests | ~120 |

### Files to Modify

| File | Changes | Est. Lines |
|------|---------|------------|
| `app/page.tsx` | Replace placeholder with ContactSection, add Footer | ~15 |
| `types/index.ts` | Export contact types | ~2 |

---

## 7. Success Criteria

### Functional Requirements
- [ ] Contact form validates name (required, min 2 chars)
- [ ] Contact form validates email (required, valid format)
- [ ] Contact form validates message (required, min 10 chars)
- [ ] Form shows inline error messages on invalid input
- [ ] Form submission triggers mailto: link with form data
- [ ] Success state displays confirmation message
- [ ] Honeypot field prevents basic bot submissions
- [ ] Social links navigate to correct profiles (new tab for external)
- [ ] Footer displays all navigation links
- [ ] Footer copyright shows current year
- [ ] Scroll-to-top button scrolls smoothly to page top
- [ ] Section reveal animations trigger on scroll into view

### Testing Requirements
- [ ] Unit tests for Zod validation schemas (valid/invalid cases)
- [ ] Unit tests for form submission logic
- [ ] Component tests for ContactForm (render, validation, submission)
- [ ] Manual testing of form accessibility with keyboard
- [ ] Manual testing at all breakpoints (320px, 375px, 768px, 1024px, 1440px)

### Quality Gates
- [ ] All files ASCII-encoded (0-127)
- [ ] Unix LF line endings
- [ ] TypeScript strict mode - zero errors
- [ ] ESLint passing - zero warnings
- [ ] Code follows project conventions (cn(), component patterns)
- [ ] All new files have JSDoc comments

---

## 8. Implementation Notes

### Key Considerations
- Reuse existing SocialLinks pattern from hero section (types/hero.ts already has SocialPlatform, SocialLinkConfig)
- Form fields must have proper label associations (htmlFor + id match)
- Honeypot field must be visually hidden but not display:none (screen reader accessible pattern)
- Footer should be outside main content area but inside layout
- Mailto links should encode form data properly (encodeURIComponent)

### Potential Challenges
- **Form accessibility**: Ensure error messages are announced by screen readers using aria-describedby and aria-invalid
- **Mobile keyboard**: Form fields may cause viewport shift when keyboard appears - test thoroughly
- **Honeypot detection**: Some bots detect common honeypot patterns - use non-obvious field name
- **Animation performance**: Keep decorative elements minimal to maintain 60fps

### ASCII Reminder
All output files must use ASCII-only characters (0-127). No curly quotes, em dashes, or special Unicode characters.

---

## 9. Testing Strategy

### Unit Tests
- Zod schema validation: valid inputs pass, invalid inputs fail with correct messages
- Email validation edge cases (with/without subdomains, special chars)
- Name/message length validation boundaries
- Form submission data formatting

### Integration Tests
- ContactForm renders all fields correctly
- Form validation triggers on blur and submit
- Error messages appear and disappear appropriately
- Form submission creates correct mailto: URL

### Manual Testing
- Tab through form fields (focus order correct)
- Submit with empty fields (errors shown)
- Submit with valid data (mailto opens)
- Test on iOS Safari (keyboard handling)
- Test on Android Chrome (keyboard handling)
- Test reduced motion preference (animations disabled)

### Edge Cases
- Very long name/message values (display handling)
- Unicode characters in input (should accept but ASCII in code)
- Form resubmission (reset state handling)
- Rapid form submission (debounce/disable button)

---

## 10. Dependencies

### External Libraries
- react-hook-form: ^7.54.x (to be installed)
- @hookform/resolvers: ^3.9.x (to be installed)
- zod: already installed
- framer-motion: already installed
- lucide-react: already installed

### Other Sessions
- **Depends on**: phase02-session04-projects-section (layout patterns)
- **Depended by**: phase02-session06-mobile-optimization (requires all content sections)

---

## 11. Component Structure

```
components/
  sections/
    ContactSection.tsx    # Main section with parallax
    Footer.tsx            # Site footer
  contact/
    index.ts              # Barrel export
    ContactForm.tsx       # Form with validation
    ContactFormField.tsx  # Reusable field
    ContactSocialLinks.tsx # Social icons for contact
    ContactDecorative.tsx # Floating decorative elements
  footer/
    index.ts              # Barrel export
    FooterNav.tsx         # Navigation links
    ScrollToTop.tsx       # Scroll button
types/
  contact.ts              # Contact type definitions
lib/
  form-validation.ts      # Zod schemas
```

---

## Next Steps

Run `/tasks` to generate the implementation task checklist.
