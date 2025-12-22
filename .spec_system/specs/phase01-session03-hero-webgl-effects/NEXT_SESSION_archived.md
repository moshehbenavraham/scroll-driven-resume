# NEXT_SESSION.md

## Session Recommendation

**Generated**: 2025-12-22
**Project State**: Phase 01 - Core Animation
**Completed Sessions**: 9

---

## Recommended Next Session

**Session ID**: `phase01-session03-hero-webgl-effects`
**Session Name**: Hero WebGL Effects
**Estimated Duration**: 2-3 hours
**Estimated Tasks**: 15-20

---

## Why This Session Next?

### Prerequisites Met
- [x] Session 02 (Hero Section) - Complete
- [x] React Three Fiber and @react-three/drei configured (Phase 00)
- [x] Hero section structure in place
- [x] Canvas wrapper from Phase 00 available

### Dependencies
- **Builds on**: phase01-session02-hero-section (Hero Section)
- **Enables**: phase01-session04-product-section (can reuse WebGL patterns)

### Project Progression

Session 03 is the logical next step because:

1. **Complete Before Moving On**: The Hero section is the portfolio's first impression. Adding WebGL effects finishes it as a polished, premium component before starting the Product section.

2. **Pattern Establishment**: This session creates reusable WebGL component patterns (`<HeroWebGLEffect>`, `useWebGLCapabilities`) that Session 04 notes it can optionally reuse for the Product section.

3. **Incremental Delivery**: Completing the Hero section end-to-end creates tangible, demonstrable progress - visitors immediately see the full "wow" experience on landing.

4. **Lower Risk**: At 15-20 tasks (vs Session 04's 20-25), this is a more focused scope with clearer boundaries.

5. **Foundation Before Features**: WebGL capability detection and performance monitoring established here will benefit all future WebGL work.

---

## Session Overview

### Objective
Add WebGL accent effects to the hero section using React Three Fiber, creating particle systems or shader effects that complement the frame animation and add "wow" factor without overwhelming the core experience.

### Key Deliverables
1. `components/three/HeroWebGLEffect.tsx` - Main WebGL effect component
2. `components/three/effects/ParticleField.tsx` - Particle system effect
3. `components/three/effects/GlowAura.tsx` - Shader-based glow effect
4. `hooks/useWebGLCapabilities.ts` - GPU detection and adaptive quality
5. CSS fallback styles for non-WebGL browsers
6. Performance profiling documentation

### Scope Summary
- **In Scope (MVP)**: WebGL effect component, scroll-triggered animations, particle/shader effects, performance optimization, CSS fallbacks, reduced-motion support
- **Out of Scope**: Product section effects, complex 3D scenes, post-processing, user interaction with WebGL

---

## Technical Considerations

### Technologies/Patterns
- React Three Fiber for declarative WebGL
- @react-three/drei for helper components (shaders, effects)
- Custom hooks for GPU capability detection
- Framer Motion integration for scroll synchronization
- CSS fallbacks using gradients and subtle animations

### Potential Challenges
1. **Performance Balance**: WebGL effects must enhance without causing frame drops - requires careful FPS monitoring and adaptive quality
2. **WebGL Context Management**: Ensure no memory leaks when components unmount
3. **Browser Compatibility**: WebGL support varies - need robust capability detection
4. **Visual Harmony**: Effects must complement, not compete with, the frame animation
5. **Mobile Detection**: Must reliably detect and disable on mobile/low-end devices

### Effect Options to Explore
- Particle system floating around portrait (ambient, ethereal)
- Subtle glow/aura shader effect (energy, premium feel)
- Geometric accent shapes (modern, tech aesthetic)

---

## Alternative Sessions

If this session is blocked:

1. **phase01-session04-product-section** - Build the AI Community section with burst animation. All prerequisites met. Larger scope (20-25 tasks) but creates the second major visual piece.

2. **Investigate WebGL issues first** - If WebGL dependencies are problematic, resolve with a focused investigation before attempting the full session.

---

## Success Criteria

- [ ] WebGL effect renders in hero section
- [ ] Effect responds to scroll position
- [ ] 60fps maintained with WebGL active on modern devices
- [ ] Effect auto-disables on lower-end devices
- [ ] CSS fallback displays when WebGL unavailable
- [ ] prefers-reduced-motion disables WebGL effect
- [ ] Effect complements frame animation without distraction
- [ ] No memory leaks from WebGL context
- [ ] Mobile devices show CSS fallback only

---

## Next Steps

Run `/sessionspec` to generate the formal specification with detailed task breakdown.
