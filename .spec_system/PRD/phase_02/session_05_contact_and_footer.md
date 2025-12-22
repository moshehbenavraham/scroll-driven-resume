# Session 05: Contact Section and Footer

**Session ID**: `phase02-session05-contact-and-footer`
**Status**: Not Started
**Estimated Tasks**: ~20-25
**Estimated Duration**: 2-4 hours

---

## Objective

Implement the contact section with a functional form and social links, plus a site footer with navigation and copyright, completing the page structure for visitor engagement and professional contact.

---

## Scope

### In Scope (MVP)

- Contact section layout with form and social links
- Contact form with fields: name, email, message
- Client-side form validation using Radix Form or react-hook-form
- Form submission handling (mailto link or external service like Formspree)
- Honeypot field for basic spam prevention
- Social link icons (GitHub, LinkedIn, Twitter/X, Email)
- Success/error states for form submission
- Footer component with site navigation links
- Copyright notice with current year
- Scroll-to-top button (optional)

### Out of Scope

- Backend form processing
- Newsletter signup (deferred requirement)
- Chat widget integration
- CAPTCHA integration

---

## Prerequisites

- [ ] Session 04 complete (Projects Section)
- [ ] Radix UI form primitives available
- [ ] Icon components for social platforms
- [ ] Animation patterns established

---

## Deliverables

1. `components/sections/ContactSection.tsx` - Main contact section container
2. `components/contact/ContactForm.tsx` - Contact form with validation
3. `components/contact/SocialLinks.tsx` - Social media link icons
4. `components/sections/Footer.tsx` - Site footer component
5. `lib/form-validation.ts` - Form validation utilities
6. Unit tests for form validation and components
7. Accessibility tests for form fields

---

## Success Criteria

- [ ] Contact form validates all required fields
- [ ] Form submission triggers appropriate action (mailto or service)
- [ ] Success/error states display correctly
- [ ] Social links navigate to correct profiles
- [ ] Footer displays navigation and copyright
- [ ] Form is accessible (labels, ARIA, keyboard navigation)
- [ ] Responsive layout at all breakpoints
- [ ] Honeypot prevents basic bot submissions
- [ ] All tests passing with >80% coverage
