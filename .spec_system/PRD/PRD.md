# Modern Resume Site - Product Requirements Document

## Overview

A premium, single-page personal tech portfolio that combines three distinct motion technologies into one cinematic experience: scroll-synchronized frame animation, parallax layering, and WebGL effects.

The portfolio features two hero sections - one for personal branding with a cinematic portrait sequence, and one showcasing an AI Community product with a dynamic burst animation. Users control the visual narrative by scrolling, which advances or reverses video-like frame sequences while text and UI elements float over the background at varying speeds to create dimensional depth. Strategic WebGL effects add "wow" moments that elevate the experience beyond typical portfolios.

This approach delivers a premium, modern aesthetic that feels alive and interactive from the first scroll, differentiating the portfolio from standard static or autoplay-video sites.

## Goals

1. Create a premium, single-page personal tech portfolio with cinematic motion effects
2. Implement scroll-synchronized frame animation where scroll position controls video playback (scroll down advances, scroll up reverses)
3. Layer parallax effects to create dimensional depth with background, mid-layer, and foreground elements moving at different speeds
4. Add WebGL "wow" effects for hero sections using Three.js and React Three Fiber
5. Showcase both personal brand (portrait hero) and AI Community product (dynamic burst hero) in dedicated sections
6. Achieve 60fps scroll performance across modern browsers
7. Provide accessible fallbacks for users who prefer reduced motion
8. Optimize for mobile with graceful degradation (static frames, disabled parallax/WebGL)

## Non-Goals

- No autoplay video - all motion is scroll-controlled
- No backend authentication or user accounts
- No content management system - content is static/hard-coded
- No e-commerce or payment functionality
- No support for legacy browsers (IE11, older Safari)
- No infinite scroll or pagination - single-page only
- No complex 3D scenes - WebGL used for accent effects only, not full 3D environments

## Users and Use Cases

### Primary Users

- **Potential Employers/Clients**: Tech recruiters, hiring managers, and potential clients viewing the portfolio to evaluate skills and experience
- **AI Community Prospects**: Visitors interested in learning about and potentially joining the AI Community product

### Key Use Cases

1. **Portfolio Discovery**: A recruiter lands on the site and is immediately engaged by the cinematic hero animation, scrolling through to explore skills and projects
2. **Skills Assessment**: A hiring manager reviews the skills section and project cards to evaluate technical capabilities
3. **Community Exploration**: A visitor interested in AI scrolls to the product section, sees the dynamic animation, and clicks the CTA to join the community
4. **Contact Initiation**: A potential client uses the contact form to reach out about collaboration opportunities
5. **Mobile Browsing**: A recruiter quickly reviews the portfolio on mobile during commute, experiencing optimized static content

## Requirements

### MVP Requirements

**Asset Optimization (Blocker - Must Complete First):**
- Optimize hero sequence from 23MB to under 10MB
- Optimize product sequence from 22MB to under 10MB
- Create 720p mobile variants at under 5MB each
- Maintain visual quality at 70-75% WebP encoding
- Upload optimized assets to MinIO before development proceeds

**Scroll-Synchronized Frame Animation:**
- Full-screen WebP image sequences for hero and product sections
- TypeScript utility mapping scroll position to frame index (scrollPercent x totalFrames)
- Opacity switching between frames (not src swapping) for smooth transitions
- Preload first 10 frames immediately, background-load remaining
- Two independent animation zones: hero section (personal) and product section (AI Community)

**Parallax Layering:**
- Background layer: Frame animation (fixed position within section)
- Mid-layer: Decorative elements at 0.3x-0.5x scroll speed via Framer Motion
- Foreground layer: Text and UI at 1x-1.3x scroll speed
- Maximum 5 active parallax layers at any time
- useScroll and useTransform hooks from Framer Motion for smooth interpolation

**WebGL Effects (Three.js / React Three Fiber):**
- Particle systems or shader effects as accent elements in hero sections
- Scroll-triggered WebGL animations that complement frame sequences
- Performance-optimized with automatic quality reduction on lower-end devices
- Graceful fallback to CSS-only effects when WebGL unavailable

**Navigation:**
- Fixed navbar with rounded corners, faint white outline, 70% opacity
- Backdrop blur effect on navbar using Tailwind backdrop-blur
- Section links: About, Skills, Projects, AI Community, Contact
- Dark/light mode toggle via next-themes
- Smooth scroll navigation with Framer Motion

**Loading Experience:**
- Full-screen loading overlay with centered logo and WebGL effect
- Horizontal progress bar with percentage indicator
- Staggered content reveal animation after preload using Framer Motion
- 0.5s ease-out fade transition on dismiss

**Content Sections:**
- Hero section with personal brand (name, title, skill indicators, social links)
- Product section with AI Community feature (product name, stats, CTAs)
- About section with bio and achievements
- Skills section with visual skill cards (AI/ML, Development, Product, Leadership)
- Projects section with 3-6 project cards
- Contact section with form and social links
- Footer with navigation and copyright

**Mobile Optimization:**
- Disable parallax and WebGL below 768px viewport width
- Show static first frame instead of scroll-synchronized animation
- Stack text blocks vertically
- Full-width CTAs
- Touch-optimized interactions

### Deferred Requirements

- AI Community testimonials carousel
- Analytics integration (Google Analytics, Mixpanel)
- Blog/articles section
- Resume/CV download functionality
- Project filtering by technology
- Animated skill progress bars
- Newsletter signup integration
- Multi-language support

## Non-Functional Requirements

- **Performance**: 60fps scroll performance; Core Web Vitals targets: LCP < 2.5s, CLS < 0.1, INP < 200ms; Framer Motion for optimized animations; React Server Components for initial load
- **Security**: HTTPS required for production; no sensitive data stored; CORS headers for asset delivery
- **Reliability**: Graceful degradation if frames fail to load; WebGL fallbacks; error boundaries for component isolation; static fallback content always available
- **Accessibility**: Respect prefers-reduced-motion preference (show static frames, disable parallax/WebGL); maintain text contrast over moving backgrounds; logical reading order for screen readers; keyboard navigation support; Radix UI for accessible primitives
- **Browser Support**: Chrome, Safari, Firefox, Edge (latest 2 versions); no IE11 support
- **Asset Delivery**: CDN-like caching via Nginx; 7-day cache for static assets; CORS headers for cross-origin frame loading
- **Type Safety**: Full TypeScript coverage with strict mode; no any types in production code

## Constraints and Dependencies

- **Docker Stack Required**: Self-hosted MinIO + PostgreSQL + Nginx for asset storage and delivery
- **WebP Format**: All frame sequences must be WebP for optimal compression (25-35% smaller than JPEG)
- **Frame Count**: 192 frames for hero sequence, 144 frames for product sequence
- **Asset Size Reality**: Hero sequence is 23MB, product sequence is 22MB (exceeds 10MB target - optimization needed)
- **Node.js 20+**: Required for Next.js 15 and React 19
- **External Tools**: Google Whisk, Google Flow (Veo 3.1), and EZGIF used for asset generation (already complete)
- **Domain/SSL**: Production deployment requires domain name and SSL certificate

## Pre-Generated Assets

All visual assets have been generated and are located in `docs/media-assets/`.

### Hero Section (Personal Portrait)

| Asset | Path | Description |
|-------|------|-------------|
| First Frame | `Self Image 01 - Facing Up.png` | Portrait looking upward, heroic pose, dual-tone lighting |
| Last Frame | `Self Image 02 - Facing Forward Reduced.png` | Portrait looking at screen, same lighting style |
| Source Video | `Self Video 001.mp4` | Animated transition between frames (Google Flow) |
| Frame Sequence | `hero-frames/` | 192 WebP frames (frame_0001.webp to frame_0192.webp) |

**Hero Sequence Stats:**
- Total frames: 192
- Frame size: ~160-180KB each
- Total size: 23MB
- Naming: `frame_NNNN.webp` (zero-padded 4 digits)

### Product Section (AI Community)

| Asset | Path | Description |
|-------|------|-------------|
| First Frame | `Product Image 01 - AI Community - Start.png` | Static product shot, centered, black background |
| Last Frame | `Product Image 02 - AI Community - Finish.png` | Dynamic burst with AI elements exploding outward |
| Source Video | `Product Video - AI Community.mp4` | Animated transition between frames (Google Flow) |
| Frame Sequence | `product-frames/` | 144 WebP frames (frame_0001.webp to frame_0144.webp) |

**Product Sequence Stats:**
- Total frames: 144
- Frame size: ~78-84KB each
- Total size: 22MB
- Naming: `frame_NNNN.webp` (zero-padded 4 digits)

### Asset Optimization (Required)

Both sequences exceed the 10MB target - optimization is mandatory before development begins.

**Target**: Reduce each sequence to under 10MB while maintaining visual quality.

| Optimization | Action | Expected Reduction |
|--------------|--------|-------------------|
| Quality reduction | Re-encode at 70-75% WebP quality | ~30-40% size reduction |
| Resolution scaling | Create 720p variants for mobile | ~50% size reduction |
| Frame decimation | Reduce to every 2nd frame if needed (96/72 frames) | ~50% size reduction |
| Aggressive preload | Only preload first 10 frames, stream remainder | Faster initial load |

**Acceptance Criteria**:
- Hero sequence: Under 10MB total
- Product sequence: Under 10MB total
- Mobile variants: Under 5MB each
- First frame loads in under 500ms on 4G connection

## Phases

This system delivers the product via phases. Each phase is implemented via multiple 2-4 hour sessions (15-30 tasks each).

| Phase | Name | Sessions | Status |
|-------|------|----------|--------|
| 00 | Foundation | 7 | Complete |
| 01 | Core Animation | 6 | Complete |
| 02 | Content and Polish | 8 | Not Started |

## Phase 00: Foundation

### Objectives

1. **Optimize frame assets** - Reduce hero/product sequences to under 10MB each, create mobile variants
2. Set up Docker stack infrastructure (MinIO + PostgreSQL + Nginx)
3. Upload optimized assets to MinIO and verify CDN delivery via Nginx
4. Initialize Next.js 15 project with TypeScript, Tailwind CSS 4, and App Router
5. Configure Framer Motion, Three.js/R3F, and UI primitives (Radix/shadcn)
6. Establish project structure, ESLint 9 flat config, and Prettier
7. Create core scroll and parallax utility hooks
8. Implement loading screen component with progress tracking

### Sessions (To Be Defined)

Sessions are defined via `/phasebuild` as `session_NN_name.md` stubs under `.spec_system/PRD/phase_00/`.

**Note**: This command does NOT create phase directories or session stubs. Run `/phasebuild` after creating the PRD.

## Phase 01: Core Animation

### Objectives

1. Implement scroll-synchronized frame animation system with TypeScript
2. Build hero section with personal brand content and WebGL accent effects
3. Build product section with AI Community content and dynamic animations
4. Implement parallax layer system using Framer Motion hooks
5. Add mid-layer decorative elements with staggered reveals

### Sessions (To Be Defined)

Sessions are defined via `/phasebuild` as `session_NN_name.md` stubs under `.spec_system/PRD/phase_01/`.

## Phase 02: Content and Polish

### Objectives

1. Complete About, Skills, Projects, and Contact sections with animations
2. Implement fixed navbar with backdrop blur and smooth scroll
3. Mobile optimization and responsive design
4. Accessibility implementation (prefers-reduced-motion, Radix primitives, WCAG 2.1 AA)
5. Performance optimization to meet Core Web Vitals (LCP < 2.5s, CLS < 0.1, INP < 200ms)
6. Comprehensive testing with Playwright E2E and cross-browser verification
7. Production deployment to Vercel

### Sessions (8 Defined)

| Session | Name | Estimated Tasks |
|---------|------|-----------------|
| 01 | Fixed Navbar | ~20-25 |
| 02 | About Section | ~20-25 |
| 03 | Skills Section | ~20-25 |
| 04 | Projects Section | ~20-25 |
| 05 | Contact Section and Footer | ~20-25 |
| 06 | Mobile Optimization | ~20-25 |
| 07 | Accessibility and Performance | ~20-25 |
| 08 | Testing and Deployment | ~20-25 |

Session details in `.spec_system/PRD/phase_02/`.

## Technical Stack

### Core Framework
- **Next.js 15** - App Router, React Server Components, optimized bundling
- **React 19** - Latest React with concurrent features and improved Suspense
- **TypeScript 5.x** - Strict type checking, no implicit any

### Styling
- **Tailwind CSS 4** - Utility-first CSS with new oxide engine
- **Custom fonts via next/font** - Optimized font loading, no layout shift
- **CSS Variables** - Theme tokens for colors, spacing, typography

### Animation
- **Framer Motion 12** - Scroll-triggered animations, layout animations, gesture support
- **Three.js / React Three Fiber** - WebGL effects for hero sections
- **@react-three/drei** - Helper components for R3F (shaders, effects, controls)

### State Management
- **React Context API** - Theme state, simple globals
- **Zustand** - Complex client state if needed (animation state, preload progress)
- **Server state** - Next.js Server Components with fetch caching

### UI Primitives
- **Radix UI** - Accessible, unstyled component primitives
- **shadcn/ui** - Radix + Tailwind pre-styled components (copy-paste)

### Icons and Utilities
- **Lucide React** - Consistent, customizable icon set
- **clsx + tailwind-merge** - Conditional class composition via cn() helper
- **class-variance-authority** - Component variant management

### Dev Tools
- **ESLint 9** - Flat config with Next.js and TypeScript plugins
- **Prettier** - Code formatting with Tailwind plugin
- **PostCSS** - Tailwind dependency, autoprefixer

### Testing
- **Vitest** - Fast unit testing with TypeScript support
- **React Testing Library** - Component testing
- **Playwright** - End-to-end testing, visual regression

### Infrastructure
- **Docker Compose** - Container orchestration for local development stack
- **MinIO** - S3-compatible object storage for WebP frame sequences
- **PostgreSQL** - Database for metadata and future analytics
- **Nginx** - Reverse proxy with caching for CDN-like asset delivery

### Deployment
- **Vercel** - Optimized Next.js hosting with edge functions (primary)
- **Firebase App Hosting** - Alternative deployment option

## Design System

### Typography Philosophy
- **Display Font**: Distinctive, characterful choice (avoid Inter, Roboto, Arial)
- **Body Font**: Refined, readable complement to display font
- **Font Loading**: next/font for zero layout shift

### Color Philosophy
- **Dark mode default**: Black/charcoal backgrounds with high contrast
- **Dominant + Accent**: Bold primary with sharp accent colors
- **CSS Variables**: Full theme token system for consistency

### Motion Philosophy
- **Scroll-driven narrative**: User controls pacing via scroll
- **Staggered reveals**: Page load with orchestrated animation-delay sequences
- **Purposeful micro-interactions**: Hover states and focus indicators that surprise
- **Performance-first**: 60fps target, will-change hints, GPU acceleration

### Spatial Composition
- **Asymmetric layouts**: Break grid conventions intentionally
- **Generous negative space**: Let content breathe
- **Layered depth**: Parallax creates perceived 3D without WebGL overhead
- **Overlap and diagonal flow**: Elements that break expected boundaries

### Visual Details
- **Gradient meshes**: Atmospheric backgrounds, not flat colors
- **Noise textures**: Subtle grain for organic feel
- **Decorative geometry**: Floating shapes, connection lines
- **Custom cursor**: Context-aware cursor states

## Success Criteria

- [x] Hero frame sequence optimized to under 10MB total
- [x] Product frame sequence optimized to under 10MB total
- [x] Mobile variants created at under 5MB each
- [x] Docker stack operational with MinIO serving optimized WebP frames via Nginx cache
- [x] Next.js 15 app running with TypeScript strict mode, zero errors
- [x] Hero section frame animation advancing/reversing smoothly with scroll
- [x] Product section frame animation advancing/reversing smoothly with scroll
- [x] WebGL accent effects rendering in hero sections
- [x] Parallax layers creating visible depth effect (background, mid, foreground)
- [x] Framer Motion scroll animations performing at 60fps
- [ ] Fixed navbar with backdrop blur functioning correctly
- [x] Dark/light mode toggle working with next-themes
- [x] Loading screen displaying progress and revealing content after preload
- [x] Mobile view showing static frames with disabled parallax/WebGL
- [x] prefers-reduced-motion respected (static frames, no parallax, no WebGL)
- [ ] All sections rendering correctly (About, Skills, Projects, Contact, Footer)
- [ ] Core Web Vitals passing (LCP < 2.5s, CLS < 0.1, INP < 200ms)
- [ ] Cross-browser testing passed (Chrome, Safari, Firefox, Edge)
- [x] Vitest unit tests passing with >80% coverage on utilities
- [ ] Playwright E2E tests passing for critical user flows
- [ ] Deployed and accessible on Vercel or Firebase App Hosting

## Risks

- **Large Asset Sizes**: Hero sequence is 23MB (192 frames), product sequence is 22MB (144 frames) - mitigate by re-encoding at 70-75% quality, creating 720p mobile variants, and aggressive lazy loading
- **Mobile Performance**: Frame animation and WebGL may be too heavy for older mobile devices - mitigate by disabling on mobile and showing static frames
- **Browser Compatibility**: WebGL, backdrop-filter, and modern CSS may behave differently across browsers - mitigate by testing early and providing fallbacks
- **Asset Generation Pipeline**: External tools (Whisk, Flow, EZGIF) may change or become unavailable - mitigate by documenting alternatives and storing generated assets
- **Scroll Jank**: Too many parallax layers or WebGL overhead may cause frame drops - mitigate by limiting active layers and profiling with React DevTools
- **Loading Time**: Users may abandon before frames finish loading - mitigate by showing engaging loading screen with WebGL effect and progress indicator
- **Bundle Size**: Three.js adds significant JS payload - mitigate with dynamic imports and tree-shaking

## Assumptions

- User has Docker and Docker Compose installed locally
- User has Node.js 20+ installed
- Portrait and product frame sequences are pre-generated (see Pre-Generated Assets section)
- Personal content (name, bio, projects) will be provided by user during implementation
- Production domain and SSL will be configured separately
- WebGL support is available in target browsers (fallback provided if not)

## Open Questions

1. What is the specific personal branding content (name, title, tagline, bio)?
2. What is the AI Community product name and details (member count, resources, features)?
3. Which social media profiles should be linked (GitHub, LinkedIn, Twitter/X, Email)?
4. What projects should be featured in the portfolio (3-6 items with descriptions)?
5. What is the brand accent color for buttons, highlights, and skill indicators?
6. What domain will be used for production deployment?
7. What display and body fonts should be used? (User preference or designer recommendation)
8. Should WebGL effects be particle-based, shader-based, or geometric?
9. Preferred deployment platform: Vercel (optimized for Next.js) or Firebase App Hosting?

## Resolved Questions

- **Portrait/product images for animation**: RESOLVED - All assets pre-generated in `docs/media-assets/` (see Pre-Generated Assets section)
