# Session Specification

**Session ID**: `phase02-session01-fixed-navbar`
**Phase**: 02 - Content and Polish
**Status**: Not Started
**Created**: 2025-12-22

---

## 1. Session Overview

This session implements the fixed navigation bar that provides persistent navigation throughout the portfolio experience. The navbar will feature a premium glass-morphism design with backdrop blur, rounded corners, and a subtle white border that complements the cinematic hero sections built in Phase 01.

The navbar serves as the primary navigation infrastructure for Phase 02, enabling smooth scroll navigation to all content sections (About, Skills, Projects, AI Community, Contact) while visually indicating the currently active section. This is critical because all subsequent content sections depend on the navbar for user navigation.

The implementation includes desktop navigation links, a mobile hamburger menu with animated drawer, dark/light mode toggle integration (using the existing ThemeToggle component), and scroll-aware behavior that optionally hides on scroll down and reveals on scroll up. Full keyboard accessibility ensures WCAG 2.1 AA compliance.

---

## 2. Objectives

1. Implement a fixed-position navbar with glass-morphism styling (70% opacity, backdrop blur, rounded corners, white border)
2. Create smooth scroll navigation to page sections using Framer Motion
3. Build active section detection using Intersection Observer API
4. Develop responsive mobile menu with animated hamburger icon and slide-in drawer

---

## 3. Prerequisites

### Required Sessions
- [x] `phase01-session02-hero-section` - Provides section structure and ID targets
- [x] `phase01-session04-product-section` - Provides AI Community section target
- [x] `phase00-session05-animation-libraries` - Framer Motion configured
- [x] `phase00-session04-nextjs-bootstrap` - ThemeToggle component available

### Required Tools/Knowledge
- Framer Motion scroll utilities (`useScroll`, `useMotionValueEvent`)
- Intersection Observer API for section tracking
- Radix UI primitives (NavigationMenu, Dialog for mobile)
- Tailwind backdrop-blur utilities

### Environment Requirements
- Next.js 15 dev server running
- All Phase 01 sections rendering correctly
- Docker stack with assets available (for visual testing)

---

## 4. Scope

### In Scope (MVP)
- Fixed-position navbar component with glass-morphism styling
- Section navigation links: About, Skills, Projects, AI Community, Contact
- Dark/light mode toggle integration (existing ThemeToggle)
- Smooth scroll navigation using Framer Motion `scrollIntoView`
- Active section highlighting based on viewport visibility
- Mobile hamburger menu with animated icon transition
- Mobile drawer with slide-in animation
- Keyboard navigation (Tab, Enter, Escape)
- Scroll-aware visibility (hide on down, show on up) - optional enhancement
- Skip-to-content link for accessibility

### Out of Scope (Deferred)
- User authentication/profile - *Reason: No backend planned*
- Search functionality - *Reason: Single-page content doesn't warrant search*
- Notification badges - *Reason: No notification system*
- Breadcrumbs - *Reason: Single-page navigation doesn't need breadcrumbs*
- Logo/brand mark in navbar - *Reason: Can be added in polish phase if needed*

---

## 5. Technical Approach

### Architecture

```
components/navigation/
  Navbar.tsx           # Main container with fixed positioning
  NavLinks.tsx         # Desktop navigation link list
  NavLink.tsx          # Individual link with active state
  MobileMenu.tsx       # Hamburger button + drawer container
  MobileMenuButton.tsx # Animated hamburger icon
  MobileDrawer.tsx     # Slide-in drawer with links

hooks/
  useActiveSection.ts  # Intersection Observer hook for active tracking
  useScrollDirection.ts # Hook to detect scroll up/down (optional)

types/
  navigation.ts        # TypeScript interfaces
```

The navbar renders in `app/layout.tsx` to persist across all routes. It uses a `<nav>` element with `position: fixed` and sits above all content with a high z-index (50+). The mobile menu uses Radix Dialog for accessibility and focus trapping.

### Design Patterns
- **Compound Components**: Navbar contains NavLinks which contains NavLink items
- **Render Props**: Active state passed to NavLink for styling
- **Custom Hooks**: `useActiveSection` encapsulates Intersection Observer logic
- **Controlled Components**: Mobile menu open state managed in parent

### Technology Stack
- **Framer Motion 12**: Animate presence for menu, smooth scroll
- **Radix UI Dialog**: Mobile drawer with focus trap and escape handling
- **Tailwind CSS 4**: backdrop-blur-md, rounded-2xl, ring utilities
- **Intersection Observer API**: Native browser API for section visibility

---

## 6. Deliverables

### Files to Create
| File | Purpose | Est. Lines |
|------|---------|------------|
| `components/navigation/Navbar.tsx` | Main fixed navbar container | ~80 |
| `components/navigation/NavLinks.tsx` | Desktop link list | ~50 |
| `components/navigation/NavLink.tsx` | Individual link with active styling | ~45 |
| `components/navigation/MobileMenu.tsx` | Mobile menu container | ~60 |
| `components/navigation/MobileMenuButton.tsx` | Animated hamburger icon | ~70 |
| `components/navigation/MobileDrawer.tsx` | Slide-in drawer | ~80 |
| `components/navigation/index.ts` | Barrel export | ~10 |
| `hooks/useActiveSection.ts` | Intersection Observer hook | ~60 |
| `hooks/useScrollDirection.ts` | Scroll direction detection | ~40 |
| `types/navigation.ts` | TypeScript interfaces | ~30 |
| `__tests__/components/navigation/Navbar.test.tsx` | Unit tests | ~100 |
| `__tests__/hooks/useActiveSection.test.ts` | Hook tests | ~80 |

### Files to Modify
| File | Changes | Est. Lines |
|------|---------|------------|
| `app/layout.tsx` | Add Navbar component | ~5 |
| `app/page.tsx` | Add section IDs for navigation targets | ~10 |
| `components/sections/HeroSection.tsx` | Add `id="hero"` attribute | ~2 |
| `components/sections/ProductSection.tsx` | Add `id="ai-community"` attribute | ~2 |
| `hooks/index.ts` | Export new hooks | ~2 |

---

## 7. Success Criteria

### Functional Requirements
- [ ] Navbar remains fixed at viewport top during all scroll positions
- [ ] Backdrop blur effect visible when content scrolls behind navbar
- [ ] All section links scroll smoothly to their targets (200ms duration)
- [ ] Active section correctly highlighted based on viewport visibility
- [ ] Mobile menu opens with hamburger tap/click
- [ ] Mobile drawer slides in from right with overlay backdrop
- [ ] Mobile menu closes on link click, overlay click, or Escape key
- [ ] Dark/light mode toggle works within navbar
- [ ] Skip-to-content link visible on focus (keyboard users)

### Testing Requirements
- [ ] Unit tests for Navbar component rendering
- [ ] Unit tests for NavLink active state logic
- [ ] Unit tests for useActiveSection hook with mocked IntersectionObserver
- [ ] Unit tests for mobile menu open/close behavior
- [ ] Manual testing: scroll through all sections, verify active highlighting
- [ ] Manual testing: mobile viewport, verify hamburger menu functions
- [ ] Manual testing: keyboard-only navigation (Tab, Enter, Escape)

### Quality Gates
- [ ] TypeScript strict mode: zero type errors
- [ ] ESLint: zero warnings or errors
- [ ] All files ASCII-encoded (no Unicode characters outside strings)
- [ ] Unix LF line endings
- [ ] Code follows existing project patterns (cn utility, component structure)
- [ ] Accessibility: WCAG 2.1 AA color contrast (4.5:1 minimum)

---

## 8. Implementation Notes

### Key Considerations

1. **Z-index Management**: Navbar must sit above hero WebGL canvas (z-50+) but below any future modals (z-100+)

2. **Section IDs**: Navigation targets require matching IDs on sections:
   - `#hero` - HeroSection (scroll to top)
   - `#about` - AboutSection (Phase 02 session 02)
   - `#skills` - SkillsSection (Phase 02 session 03)
   - `#projects` - ProjectsSection (Phase 02 session 04)
   - `#ai-community` - ProductSection (already built)
   - `#contact` - ContactSection (Phase 02 session 05)

3. **Intersection Observer Threshold**: Use 0.3-0.5 threshold so section becomes "active" when 30-50% visible, not just 1px

4. **Mobile Breakpoint**: Hide desktop links and show hamburger at `md:` breakpoint (768px)

5. **Backdrop Blur Fallback**: Some older browsers don't support `backdrop-filter`; provide solid background fallback

### Potential Challenges
- **Safari backdrop-filter**: May need `-webkit-backdrop-filter` prefix (Tailwind handles this)
- **Multiple sections visible**: Intersection Observer may fire for multiple sections; use "most visible" or "topmost" logic
- **Scroll during animation**: Prevent new scroll-to calls while previous animation in progress
- **WebGL z-index conflicts**: Hero canvas may render above navbar without proper stacking context

### ASCII Reminder
All output files must use ASCII-only characters (0-127). Avoid em-dashes, smart quotes, or special Unicode. Use standard ASCII apostrophes and quotes.

---

## 9. Testing Strategy

### Unit Tests

**Navbar.test.tsx**:
- Renders without crashing
- Contains all navigation links
- Contains ThemeToggle component
- Has correct ARIA attributes (role="navigation")
- Has skip-to-content link

**NavLink.test.tsx**:
- Renders link text correctly
- Applies active class when isActive=true
- Calls onClick handler
- Has correct href attribute

**useActiveSection.test.ts**:
- Returns null when no sections observed
- Returns correct section ID when section intersects
- Handles multiple intersecting sections (returns topmost)
- Cleans up observers on unmount

**MobileMenu.test.tsx**:
- Opens when button clicked
- Closes when backdrop clicked
- Closes when Escape pressed
- Traps focus within drawer

### Integration Tests
- Full navbar renders in layout
- Clicking link scrolls to correct section
- Active state updates as user scrolls through page

### Manual Testing
1. Desktop: Scroll through entire page, verify active link updates
2. Desktop: Click each nav link, verify smooth scroll to section
3. Desktop: Toggle dark/light mode from navbar
4. Mobile (375px): Tap hamburger, verify drawer opens
5. Mobile: Tap nav link in drawer, verify scroll and drawer close
6. Keyboard: Tab through all links, verify focus visible
7. Keyboard: Enter to activate link, Escape to close mobile menu
8. Reduced motion: Verify no scroll animation with `prefers-reduced-motion`

### Edge Cases
- Very fast scrolling (should not cause active state flickering)
- Refreshing page at mid-scroll position (should detect correct active section)
- Window resize from mobile to desktop (should transition menu states)
- Clicking same link twice (should not cause unnecessary scroll)

---

## 10. Dependencies

### External Libraries
- `framer-motion`: ^12.x (already installed)
- `@radix-ui/react-dialog`: ^1.x (for mobile drawer)
- `@radix-ui/react-navigation-menu`: ^1.x (optional, for desktop menu semantics)
- `next-themes`: ^0.4.x (already installed, for ThemeToggle)

### Internal Dependencies
- `lib/cn.ts` - Class name utility
- `components/ui/theme-toggle.tsx` - Existing theme toggle component
- `hooks/useReducedMotion.ts` - Existing reduced motion hook
- `hooks/useIsMobile.ts` - Existing mobile detection hook

### Other Sessions
- **Depends on**: Phase 01 sessions (hero, product sections for navigation targets)
- **Depended by**: Phase 02 sessions 02-05 (About, Skills, Projects, Contact all need navbar links working)

---

## 11. Component API Reference

### Navbar Props
```typescript
interface NavbarProps {
  className?: string;
  hideOnScroll?: boolean; // Optional scroll-aware hide behavior
}
```

### NavLink Props
```typescript
interface NavLinkProps {
  href: string;          // Target section ID (e.g., "#about")
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}
```

### useActiveSection Hook
```typescript
interface UseActiveSectionOptions {
  sectionIds: string[];   // IDs to observe (e.g., ["hero", "about", "skills"])
  threshold?: number;     // Intersection threshold (default: 0.3)
  rootMargin?: string;    // Root margin (default: "-80px 0px 0px 0px" for navbar height)
}

function useActiveSection(options: UseActiveSectionOptions): string | null;
```

---

## 12. Visual Design Specifications

### Desktop Navbar
- **Position**: Fixed, top: 16px, left/right: 16px (centered with max-width)
- **Max Width**: 1200px, centered with mx-auto
- **Height**: 56px
- **Background**: `bg-background/70` (70% opacity)
- **Backdrop**: `backdrop-blur-md` (12px blur)
- **Border**: `ring-1 ring-white/10` (faint white outline)
- **Border Radius**: `rounded-2xl` (16px)
- **Shadow**: `shadow-lg shadow-black/5` (subtle depth)

### Nav Links
- **Font**: 14px, medium weight
- **Color**: `text-muted-foreground` (inactive), `text-foreground` (active)
- **Active Indicator**: Subtle underline or background highlight
- **Spacing**: 24px gap between links
- **Hover**: `text-foreground` with 150ms transition

### Mobile Menu Button
- **Size**: 40x40px tap target
- **Icon**: 3-line hamburger, animates to X when open
- **Transition**: 200ms ease-out

### Mobile Drawer
- **Width**: 280px (or 80% of viewport, max 320px)
- **Position**: Fixed, right: 0, top: 0, bottom: 0
- **Background**: `bg-background` (solid, no blur for performance)
- **Overlay**: `bg-black/50` with fade animation
- **Animation**: Slide in from right, 200ms ease-out

---

## Next Steps

Run `/tasks` to generate the implementation task checklist.
