# Session Specification

**Session ID**: `phase01-session01-frame-animation-core`
**Phase**: 01 - Core Animation
**Status**: Not Started
**Created**: 2025-12-22

---

## 1. Session Overview

This session builds the scroll-synchronized frame animation system - the core technical differentiator of this portfolio. The system maps scroll position to video frame indices, creating a cinematic experience where users control playback by scrolling. Scroll down advances the frame sequence; scroll up reverses it.

Phase 00 established substantial foundational infrastructure: hooks for scroll progress tracking (`useScrollProgress`), frame-to-scroll mapping (`useFrameAnimation`), priority-based preloading (`useFramePreload`), Zustand state management, and utility functions for frame calculations. This session focuses on **integration and component building** - creating the `<FrameSequence>` React component that renders frames with opacity-based switching, extending the URL generation for MinIO quality variants, and comprehensive testing.

The deliverables from this session enable all subsequent Phase 01 work. Sessions 02 (Hero Section) and 04 (Product Section) will use `<FrameSequence>` as their core visual element. The component must be performant (60fps), accessible (respects prefers-reduced-motion), and responsive (mobile fallback to static frames).

---

## 2. Objectives

1. Build the `<FrameSequence>` component with opacity-based frame switching that maintains 60fps during scroll
2. Create MinIO URL generator supporting desktop/mobile quality variants with proper CDN paths
3. Integrate existing hooks into a unified `useFrameSequence` hook for simplified component usage
4. Achieve >80% test coverage on frame animation utilities and components

---

## 3. Prerequisites

### Required Sessions
- [x] `phase00-session01-asset-optimization` - WebP frames optimized and ready
- [x] `phase00-session02-docker-infrastructure` - MinIO configured for asset serving
- [x] `phase00-session03-asset-deployment` - 672 frames deployed to MinIO
- [x] `phase00-session04-nextjs-bootstrap` - Next.js 15 with TypeScript strict mode
- [x] `phase00-session05-animation-libraries` - Framer Motion, Zustand configured
- [x] `phase00-session06-scroll-parallax-utilities` - Core hooks implemented
- [x] `phase00-session07-loading-system` - Loading overlay ready

### Required Tools/Knowledge
- TypeScript strict mode patterns
- Framer Motion useScroll/useTransform hooks
- React Server Components vs Client Components
- Image preloading strategies

### Environment Requirements
- Docker stack running (MinIO serving frames at localhost:9000)
- Node.js 20+ with pnpm
- Hero frames: 192 WebP files in MinIO bucket
- Product frames: 144 WebP files in MinIO bucket

---

## 4. Scope

### In Scope (MVP)
- `<FrameSequence>` component with stacked frames and opacity switching
- MinIO URL generator: `getFrameUrl(sequence, index, quality)`
- Integration hook: `useFrameSequence(config)` combining animation + preload
- Frame virtualization for memory efficiency (render visible frame + neighbors)
- Reduced motion support (static first frame)
- Mobile detection with static fallback
- Vitest unit tests for utilities
- Integration test with scroll simulation
- Demo page verifying complete system

### Out of Scope (Deferred)
- Hero section layout and content - *Reason: Session 02*
- Product section layout and content - *Reason: Session 04*
- WebGL accent effects - *Reason: Session 03*
- Parallax decorative layers - *Reason: Sessions 05-06*
- Canvas-based rendering - *Reason: Evaluate later if opacity approach has issues*
- Playwright E2E tests - *Reason: Phase 02*

---

## 5. Technical Approach

### Architecture

```
FrameSequence Component
         |
    uses useFrameSequence hook
         |
    +---------+---------+
    |                   |
useFrameAnimation   useFramePreload
    |                   |
    v                   v
scrollYProgress    Image preloader
    |                   |
    +--------+----------+
             |
      animation-store (Zustand)
             |
      Frame rendering (opacity switching)
```

### Design Patterns
- **Opacity stacking**: All frames loaded as positioned images; only active frame has `opacity: 1`
- **Frame virtualization**: Only render current frame +/- 2 neighbors to limit DOM nodes
- **Priority preloading**: First 10 frames load immediately; background streaming for rest
- **Responsive quality**: Detect viewport width; use mobile assets below 768px

### Technology Stack
- React 19 with "use client" directive
- Framer Motion 12 for scroll synchronization
- Zustand for global animation state
- TypeScript 5.x strict mode
- Vitest for testing

---

## 6. Deliverables

### Files to Create
| File | Purpose | Est. Lines |
|------|---------|------------|
| `components/animation/FrameSequence.tsx` | Main frame rendering component with opacity switching | ~180 |
| `components/animation/FrameImage.tsx` | Individual frame image with lazy loading | ~60 |
| `components/animation/index.ts` | Barrel export | ~5 |
| `lib/frame-utils.ts` | MinIO URL generator with quality variants | ~80 |
| `hooks/useFrameSequence.ts` | Integration hook combining animation + preload | ~100 |
| `app/demo/frames/page.tsx` | Demo page for frame animation testing | ~120 |
| `__tests__/lib/frame-utils.test.ts` | Unit tests for frame utilities | ~100 |
| `__tests__/hooks/useFrameSequence.test.ts` | Hook integration tests | ~150 |
| `__tests__/components/FrameSequence.test.tsx` | Component tests | ~120 |

### Files to Modify
| File | Changes | Est. Lines Changed |
|------|---------|-------------------|
| `types/animation.ts` | Add FrameSequence component props types | ~40 |
| `stores/animation-store.ts` | Add sequence-specific state (hero/product) | ~30 |
| `hooks/index.ts` | Export useFrameSequence | ~2 |
| `lib/scroll-utils.ts` | Minor refinements if needed | ~10 |

---

## 7. Success Criteria

### Functional Requirements
- [ ] `<FrameSequence>` renders 192 hero frames correctly
- [ ] `<FrameSequence>` renders 144 product frames correctly
- [ ] Scroll down advances frame index (0 to N-1)
- [ ] Scroll up reverses frame index (N-1 to 0)
- [ ] Frame switching achieves 60fps during normal scroll
- [ ] First 10 frames preload within 2 seconds on 4G simulation
- [ ] Background frames stream without blocking UI
- [ ] `prefers-reduced-motion: reduce` shows static first frame
- [ ] Mobile viewport (<768px) shows static first frame
- [ ] Animation state syncs to Zustand store

### Testing Requirements
- [ ] Unit tests passing for frame-utils.ts (>90% coverage)
- [ ] Unit tests passing for useFrameSequence hook
- [ ] Component tests passing for FrameSequence
- [ ] Manual scroll testing on demo page
- [ ] Overall >80% test coverage for new code

### Quality Gates
- [ ] All files ASCII-encoded (no unicode characters in code)
- [ ] Unix LF line endings
- [ ] TypeScript strict mode - zero errors
- [ ] ESLint passing - zero warnings
- [ ] Prettier formatting applied
- [ ] No `any` types in production code

---

## 8. Implementation Notes

### Key Considerations
- **Frame virtualization is critical**: Rendering 192 `<img>` elements simultaneously will cause memory issues; virtualize to ~5 visible frames
- **Use `will-change: opacity`**: Hint to browser for GPU acceleration on frame elements
- **Avoid layout thrashing**: All frames must be absolutely positioned within container; no reflows on switch
- **SSR safety**: Hook must handle server-side rendering (no window/document access)
- **MinIO URL structure**: Base URL is `http://localhost:9000/resume-assets/hero-frames/` (or nginx proxy)

### Potential Challenges
- **Memory pressure on mobile**: 192 full-res images may exceed mobile memory limits
  - *Mitigation*: Show static frame on mobile; no frame sequence
- **Opacity switching flicker**: Improper z-index or timing may cause visual glitches
  - *Mitigation*: Pre-render neighboring frames; use CSS transitions
- **Scroll jank with many DOM nodes**: Too many images in DOM kills performance
  - *Mitigation*: Frame virtualization - only current +/- 2 frames in DOM

### ASCII Reminder
All output files must use ASCII-only characters (0-127). Avoid unicode in comments, strings, or identifiers.

---

## 9. Testing Strategy

### Unit Tests
- `getFrameUrl()` returns correct MinIO URLs for all quality/sequence combinations
- `scrollPercentToFrame()` edge cases (0%, 50%, 100%, out of bounds)
- Frame count calculations for hero (192) and product (144)

### Integration Tests
- `useFrameSequence` hook returns correct frame index as mock scroll changes
- Preload callbacks fire at correct thresholds
- Store updates when frame changes

### Manual Testing
- Load demo page, scroll through hero section
- Verify smooth frame advancement (no jumps or flicker)
- Verify scroll reversal works correctly
- Test with Chrome DevTools "Slow 4G" network throttling
- Test with "Reduce motion" preference enabled
- Test at 768px viewport width (mobile breakpoint)

### Edge Cases
- Rapid scroll direction changes (should not cause frame skipping)
- Scroll to exact boundaries (0% and 100%)
- Frame sequence with zero frames (should not crash)
- Network failure during preload (graceful degradation)
- Section not in view (animation should be inactive)

---

## 10. Dependencies

### External Libraries
- `framer-motion`: ^12.0.0 (useScroll, useTransform, useMotionValueEvent)
- `zustand`: ^5.0.0 (animation state management)
- `vitest`: ^2.0.0 (testing)
- `@testing-library/react`: ^16.0.0 (component testing)

### Other Sessions
- **Depends on**: Phase 00 sessions (all complete)
- **Depended by**:
  - Session 02 (Hero Section) - uses FrameSequence for portrait animation
  - Session 04 (Product Section) - uses FrameSequence for burst animation
  - Sessions 03, 05, 06 - indirect dependency through hero/product sections

---

## 11. MinIO Asset Configuration

### URL Structure
```
Desktop (1080p):
http://localhost:9000/resume-assets/hero-frames/frame_0001.webp
http://localhost:9000/resume-assets/product-frames/frame_0001.webp

Mobile (720p):
http://localhost:9000/resume-assets/hero-frames-mobile/frame_0001.webp
http://localhost:9000/resume-assets/product-frames-mobile/frame_0001.webp
```

### Nginx Proxy (Production)
```
/assets/hero-frames/frame_0001.webp -> MinIO hero-frames bucket
/assets/product-frames/frame_0001.webp -> MinIO product-frames bucket
```

### Frame Counts
- Hero sequence: 192 frames (frame_0001.webp to frame_0192.webp)
- Product sequence: 144 frames (frame_0001.webp to frame_0144.webp)

---

## Next Steps

Run `/tasks` to generate the implementation task checklist.
