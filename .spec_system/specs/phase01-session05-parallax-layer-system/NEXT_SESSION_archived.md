# NEXT_SESSION.md

## Session Recommendation

**Generated**: 2025-12-22
**Project State**: Phase 01 - Core Animation
**Completed Sessions**: 11

---

## Recommended Next Session

**Session ID**: `phase01-session05-parallax-layer-system`
**Session Name**: Parallax Layer System
**Estimated Duration**: 2-3 hours
**Estimated Tasks**: 15-20

---

## Why This Session Next?

### Prerequisites Met
- [x] Sessions 02 and 04 complete (Hero and Product sections)
- [x] `useScrollProgress` and parallax utilities from Phase 00 Session 06
- [x] Framer Motion hooks available (configured in Phase 00 Session 05)

### Dependencies
- **Builds on**: Hero Section (Session 02), Product Section (Session 04), Scroll/Parallax Utilities (Phase 00 Session 06)
- **Enables**: Decorative Elements (Session 06) - which explicitly requires parallax system

### Project Progression

Session 05 is the natural next step for three key reasons:

1. **Sequential Dependencies**: Session 06 (Decorative Elements) explicitly lists Session 05 as a prerequisite. The decorative elements need to integrate with the parallax mid-layer at 0.3x-0.5x speed - this layer system doesn't exist yet.

2. **Foundation Complete**: All Phase 00 infrastructure is operational. Hero and Product sections have frame animations and WebGL effects working. The parallax layer system is the remaining architectural piece before adding visual polish.

3. **Depth Before Decoration**: The PRD emphasizes "layered depth" as a core design philosophy. Building the parallax container and layer components now establishes the three-tier depth system (background, mid-layer, foreground) that decorative elements will slot into.

---

## Session Overview

### Objective
Implement the multi-layer parallax system using Framer Motion hooks to create dimensional depth across hero and product sections with background, mid-layer, and foreground elements moving at different scroll speeds.

### Key Deliverables
1. `ParallaxContainer.tsx` - Section wrapper managing parallax layers
2. `ParallaxLayer.tsx` - Individual layer component with configurable speed
3. `useParallaxTransform.ts` - Hook for parallax calculations using Framer Motion
4. Hero section parallax integration (background, mid, foreground layers)
5. Product section parallax integration
6. Performance profiling and 60fps validation

### Scope Summary
- **In Scope (MVP)**: Three-tier layer system (0x background, 0.3-0.5x mid, 1-1.3x foreground), Framer Motion `useScroll`/`useTransform` integration, GPU-accelerated transforms, prefers-reduced-motion support, mobile detection (disable below 768px), max 5 layers per section
- **Out of Scope**: Decorative element design (Session 06), complex 3D z-depth parallax, horizontal parallax, mouse-driven parallax

---

## Technical Considerations

### Technologies/Patterns
- Framer Motion `useScroll()` with container reference
- Framer Motion `useTransform()` for scroll-to-offset mapping
- CSS `translate3d` for GPU-accelerated transforms
- `will-change: transform` hints for compositor optimization
- React context for parallax state sharing within container
- CSS media query `prefers-reduced-motion` detection

### Potential Challenges
1. **Section boundary handling**: Parallax transforms must reset cleanly at section boundaries to avoid "jump" artifacts
2. **Layer stacking order**: Ensuring z-index and pointer-events work correctly across parallax layers
3. **Performance overhead**: Multiple transform calculations per scroll frame - need to batch and optimize
4. **Mobile detection timing**: SSR-safe detection of viewport width for parallax disable logic

### Integration Points
- Existing `useScrollProgress` hook from Phase 00 Session 06
- Hero section component structure (add parallax wrapper)
- Product section component structure (add parallax wrapper)
- Framer Motion already configured in Phase 00 Session 05

---

## Alternative Sessions

If this session is blocked:

1. **Skip to Phase 02 planning** - If parallax is deemed unnecessary, could proceed to Content and Polish phase. Not recommended as PRD explicitly requires parallax depth.
2. **Decorative Elements with static positioning** - Could implement Session 06 decorative elements without parallax motion, then add parallax later. Would require rework.

Neither alternative is recommended. Session 05 has all prerequisites met and is the clear next step.

---

## Next Steps

Run `/sessionspec` to generate the formal specification with detailed task breakdown.
