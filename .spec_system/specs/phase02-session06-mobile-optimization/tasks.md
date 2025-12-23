# Task Checklist

**Session ID**: `phase02-session06-mobile-optimization`
**Total Tasks**: 26
**Estimated Duration**: 8-10 hours
**Created**: 2025-12-23

---

## Legend

- `[x]` = Completed
- `[ ]` = Pending
- `[P]` = Parallelizable (can run with other [P] tasks)
- `[S0206]` = Session reference (Phase 02, Session 06)
- `TNNN` = Task ID

---

## Progress Summary

| Category | Total | Done | Remaining |
|----------|-------|------|-----------|
| Setup | 3 | 3 | 0 |
| Foundation | 5 | 5 | 0 |
| Implementation | 14 | 14 | 0 |
| Testing | 4 | 4 | 0 |
| **Total** | **26** | **26** | **0** |

---

## Setup (3 tasks)

Initial configuration and environment preparation.

- [x] T001 [S0206] Verify all prerequisite sessions complete and dev server runs
- [x] T002 [S0206] Create `styles/` directory for safe area CSS
- [x] T003 [S0206] Audit existing `useIsMobile` hook for baseline understanding (`hooks/useIsMobile.ts`)

---

## Foundation (5 tasks)

Core viewport hook and CSS infrastructure.

- [x] T004 [S0206] Create `useViewportHeight` hook with visualViewport API support (`hooks/useViewportHeight.ts`)
- [x] T005 [S0206] Add SSR safety and fallback values to viewport hook (`hooks/useViewportHeight.ts`)
- [x] T006 [S0206] Create safe area CSS custom properties file (`styles/safe-area.css`)
- [x] T007 [S0206] Update globals.css with safe area imports and dvh fallbacks (`app/globals.css`)
- [x] T008 [S0206] Export `useViewportHeight` from hooks index (`hooks/index.ts`)

---

## Implementation (14 tasks)

Mobile optimization across all components.

### Full-Height Sections (2 tasks)

- [x] T009 [S0206] [P] Integrate viewport height hook in HeroSection (`components/sections/HeroSection.tsx`)
- [x] T010 [S0206] [P] Integrate viewport height hook in ProductSection (`components/sections/ProductSection.tsx`)

### Navigation Mobile Fixes (2 tasks)

- [x] T011 [S0206] Add safe area top handling to Navbar (`components/navigation/Navbar.tsx`)
- [x] T012 [S0206] Fix MobileDrawer full height with safe areas (`components/navigation/MobileDrawer.tsx`)

### Content Section Mobile Layouts (4 tasks)

- [x] T013 [S0206] [P] Refine AboutSection mobile layout and spacing (`components/sections/AboutSection.tsx`)
- [x] T014 [S0206] [P] Adjust SkillsSection mobile grid breakpoints (`components/sections/SkillsSection.tsx`)
- [x] T015 [S0206] [P] Optimize ProjectsSection mobile card layout (`components/sections/ProjectsSection.tsx`)
- [x] T016 [S0206] [P] Add safe area bottom padding to Footer (`components/sections/Footer.tsx`)

### Contact Form Mobile Handling (2 tasks)

- [x] T017 [S0206] Improve ContactSection keyboard handling (`components/sections/ContactSection.tsx`)
- [x] T018 [S0206] [P] Update ContactForm and ContactFormField for mobile (`components/contact/ContactForm.tsx`, `components/contact/ContactFormField.tsx`)

### Touch Target Sizing (4 tasks)

- [x] T019 [S0206] [P] Enforce 44x44px minimum on Button component (`components/ui/button.tsx`)
- [x] T020 [S0206] [P] Fix SocialLinks touch targets (`components/hero/SocialLinks.tsx`)
- [x] T021 [S0206] [P] Fix FooterNav touch targets (`components/footer/FooterNav.tsx`)
- [x] T022 [S0206] [P] Audit and fix ContactSocialLinks touch targets (`components/contact/ContactSocialLinks.tsx`)

---

## Testing (4 tasks)

Verification and quality assurance.

- [x] T023 [S0206] Write unit tests for `useViewportHeight` hook (`__tests__/hooks/useViewportHeight.test.ts`)
- [x] T024 [S0206] Run full test suite and fix any failures
- [x] T025 [S0206] Manual testing at all breakpoints (320, 375, 768, 1024, 1440px)
- [x] T026 [S0206] Validate ASCII encoding and run lint/type checks on all modified files

---

## Completion Checklist

Before marking session complete:

- [x] All tasks marked `[x]`
- [x] All tests passing
- [x] All files ASCII-encoded
- [x] implementation-notes.md updated
- [x] Ready for `/validate`

---

## Notes

### Parallelization
Tasks marked `[P]` can be worked on simultaneously. Key parallel opportunities:
- T009-T010: Hero and Product sections (independent)
- T013-T016: Content section mobile layouts (independent)
- T018-T022: Touch target fixes (independent components)

### Task Timing
Target ~20-25 minutes per task.

### Dependencies
- T004-T008 must complete before T009-T012 (hook must exist first)
- T006-T007 must complete before T011-T016 (safe area CSS must exist)
- All implementation tasks must complete before T023-T026

### Key Technical Notes
1. **100vh Problem**: Use `100dvh` with `100vh` fallback for mobile Safari compatibility
2. **visualViewport API**: Primary source for accurate viewport height including keyboard state
3. **Safe Area Insets**: Apply `env(safe-area-inset-*)` to navbar, footer, and drawers
4. **Touch Targets**: Minimum 44x44px tap area (use padding if visual size is smaller)

### Breakpoint Reference
- 320px: Small phones (iPhone SE)
- 375px: Standard phones (iPhone 12/13/14)
- 768px: Tablets (iPad portrait)
- 1024px: Large tablets / small laptops
- 1440px: Desktop

---

## Next Steps

Run `/validate` to verify session completeness.
