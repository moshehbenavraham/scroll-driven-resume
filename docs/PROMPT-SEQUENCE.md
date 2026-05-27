# Prompt Sequence: Rebuilding scroll-driven-resume from Scratch

> **14 progressive prompts** to recreate this project. Each builds on the previous -- don't skip ahead.

---

## Prompt 1: Project Scaffolding

> Create a new Next.js 16 project with the App Router, React 19, TypeScript 5 (strict mode), and Tailwind CSS 4. Use `src`-less layout (app/, components/, hooks/, lib/, types/, stores/ at root). Set up path aliases (`@/` prefix for components, lib, hooks, types, stores) in tsconfig.json. Configure `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`, and `noFallthroughCasesInSwitch`. Set up ESLint 9 flat config (`eslint.config.mjs`) with Next.js Core Web Vitals + TypeScript rules: `no-explicit-any: error`, `no-unused-vars: error`, `consistent-type-imports: error`, `react/jsx-no-leaked-render: error`, `react/self-closing-comp: error`, `no-console: warn` (allow warn/error), `eqeqeq: error`, `curly: error`, `--max-warnings=0`. Add Prettier (`prettier.config.mjs`) with the `prettier-plugin-tailwindcss` plugin (double quotes, semicolons, 2-space tabs, 80 print width, trailing comma ES5, LF line endings). Add `.prettierignore`. Set dev server on port 3017 with Turbopack. Install `next-themes`, `framer-motion` 12, `zustand` 5, `lucide-react`, `zod`, `react-hook-form` with `@hookform/resolvers`. Add shadcn/ui with the "default" style using Radix primitives (`@radix-ui/react-dialog`, `@radix-ui/react-slot`), `class-variance-authority`, `clsx`, `tailwind-merge`, and `tailwindcss-animate`. Create a `components.json` with RSC support, `iconLibrary: "lucide"`, neutral base color, and CSS variables enabled. Set `output: "standalone"` in `next.config.ts` with `reactStrictMode: true`, `poweredByHeader: false`, and `optimizePackageImports` for clsx and tailwind-merge. Add `@next/bundle-analyzer` as a dev dependency. Create a `postcss.config.mjs` with `@tailwindcss/postcss`.

---

## Prompt 2: Design System & Theming

> Set up a CSS variable-based theme system in `app/globals.css`. Import `tailwindcss` and a `styles/safe-area.css` file. Define HSL color tokens in `:root` (light mode) and `.dark` (dark mode) for: background, foreground, card, card-foreground, popover, popover-foreground, primary, primary-foreground, secondary, secondary-foreground, muted, muted-foreground, accent, accent-foreground, destructive, destructive-foreground, border, input, ring, and `--radius: 0.5rem`. Add a `@theme inline` block mapping all CSS variables to Tailwind color utilities (`--color-background`, `--color-foreground`, etc.) plus font tokens (`--font-sans` for Inter, `--font-display` for Space Grotesk, `--font-mono` for monospace) and radius variants (`--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`). Add base styles: border color default, body with font-smoothing and antialiasing, webkit scrollbar styling (10px, muted track, muted-foreground thumb), `:focus-visible` with 2px ring outline, `::selection` with primary overlay, and a `.hide-scrollbar` utility. Create `app/fonts.ts` exporting Inter and Space_Grotesk from `next/font/google` with CSS variables `--font-inter` and `--font-display`, plus a combined `fontVariables` string. Create `lib/cn.ts` with a `cn()` utility combining clsx + tailwind-merge. Create `lib/utils.ts` with `getAssetUrl`, `formatNumber`, `clamp`, `lerp`, and `mapRange` utilities. Configure `tailwind.config.ts` with: darkMode "class", content paths, extended colors mapping all CSS variables, borderRadius from `--radius`, fontFamily (sans, mono, display), keyframe animations (fadeIn, fadeUp, scaleIn) with corresponding animation utilities (fade-in, fade-up, scale-in, spin-slow), and the `tailwindcss-animate` plugin. Build shadcn/ui-style Button (with variants via CVA), Card (Card, CardHeader, CardTitle, CardContent, CardFooter), and a ThemeToggle component using `next-themes`. Create a `ThemeProvider` wrapper component in `components/providers/theme-provider.tsx` using `next-themes` with `attribute: "class"`, `defaultTheme: "system"`, `enableSystem: true`.

---

## Prompt 3: Layout, Navigation & Accessibility

> Build the root layout (`app/layout.tsx`) with `fontVariables` applied to the body, HTML `lang="en"` with `suppressHydrationWarning`, metadata (title template `%s | Portfolio`, description, keywords for portfolio/developer/creative/animation/next.js/react, viewport config with theme-color variants for light/dark), and ThemeProvider wrapping the page. Add a `SkipLink` component in `components/a11y/SkipLink.tsx` and a `VisuallyHidden` component in `components/a11y/VisuallyHidden.tsx`. Create a sticky Navbar (`components/navigation/Navbar.tsx`) with glass-morphism styling, scroll-aware hide behavior (hide on scroll down, show on scroll up), containing: a logo, desktop NavLinks, a ThemeToggle, and a MobileMenu. Break navigation into sub-components: `NavLink.tsx` (individual link with active state), `NavLinks.tsx` (desktop link list), `MobileMenu.tsx` (container), `MobileMenuButton.tsx` (hamburger toggle), `MobileDrawer.tsx` (slide-out drawer). Navigation links: Home, About, Skills, Projects, AI Community, Contact. Implement smooth scroll-to-section behavior on nav click. Build a `useActiveSection` hook (`hooks/useActiveSection.ts`) using IntersectionObserver with configurable threshold (default 0.3) and rootMargin (`-80px 0px 0px 0px` for navbar height) that returns the topmost visible section ID. Build a `useScrollDirection` hook (`hooks/useScrollDirection.ts`) using requestAnimationFrame debouncing with configurable threshold that returns `"up" | "down" | null`. Create `lib/a11y.ts` with utilities: `getFocusableElements`, `createFocusTrap` (with cleanup), `createAnnouncer` (screen reader live region), and `focusMainContent` (skip-link handler). Add barrel `index.ts` exports for the navigation directory. Wire SkipLink and Navbar into the root layout. Add ARIA labels, focus ring styles (2px ring), and keyboard navigation support throughout.

---

## Prompt 4: Type System & Data Constants

> Create a comprehensive TypeScript type system in `types/` with barrel `index.ts`. Create these files with their interfaces, props types, and `DEFAULT_*` constants:
>
> - **`animation.ts`** -- `ScrollDirection`, `ScrollOffset` with `DEFAULT_SCROLL_OFFSET`, `UseScrollProgressOptions/Return`, `UseFrameAnimationOptions/Return`, `UseParallaxOptions/Return`, `UseFramePreloadOptions/Return` with callback types, `CalculateFrameIndexParams`, `CalculateParallaxOffsetParams`, `NormalizeProgressParams`, `FrameSequenceConfig`, `FRAME_SEQUENCES` (hero: 192 frames, product: 144 frames), `PARALLAX_SPEEDS` presets (background: 0.3, midground: 0.5, default: 0.5, foreground: 1.0, fast: 1.3), `FrameQuality` (desktop/mobile), `FrameSequenceId` (hero/product), URL param types (`GetFrameUrlParams`, `GenerateFrameUrlsParams`, `FrameUrlConfig`), `FrameSequenceProps`, `FrameImageProps`, `UseFrameSequenceOptions/Return`, `FRAME_COUNTS`, `MOBILE_BREAKPOINT` (768), `FRAME_VIRTUALIZATION_RANGE` (2), canvas renderer types (`UseImageCacheOptions/Return`, `UseCanvasRendererOptions/Return`, `CanvasFrameRendererProps`, `DrawDimensions`), and re-exports from parallax types
> - **`hero.ts`** -- `SocialPlatform` (github/linkedin/twitter/email), `SocialLinkConfig`, `SocialLinksProps`, `SkillCategory` (ai/development/product/leadership), `SkillConfig`, `SkillIndicatorsProps`, `HeroContentProps` (name/title/tagline/children), `HeroSectionProps` (with onLoadComplete/onLoadProgress callbacks), `DEFAULT_HERO_CONTENT` (name, title, tagline), `DEFAULT_SKILLS` (4 categories with labels and descriptions), `DEFAULT_SOCIAL_LINKS` (4 links: GitHub, LinkedIn, Twitter, Email)
> - **`about.ts`** -- `AchievementIcon` (calendar/folder/code/users), `AchievementConfig` (id/icon/value/suffix/label), `AchievementCardProps`, `AchievementsProps`, `BioProps` (heading/paragraphs/isRevealed), `AboutDecorativeProps`, `AboutSectionProps`, `DEFAULT_BIO_CONTENT` (heading + 3 paragraphs), `DEFAULT_ACHIEVEMENTS` (4 counters: 10+ years, 50+ projects, 20+ technologies, 1000+ community), `IconMap` type
> - **`skills.ts`** -- `SkillCategoryIcon` (brain/code/layers/users), `SkillCategoryConfig` (id/icon/title/skills array), `SkillCardProps`, `SkillItemProps`, `SkillsDecorativeProps`, `SkillsSectionProps`, `DEFAULT_SKILL_CATEGORIES` (4 categories: AI/ML, Development, Product, Leadership -- each with 6 skills), `SkillIconMap` type
> - **`projects.ts`** -- `Project` (id/title/description/thumbnail/technologies/liveUrl/sourceUrl), `ProjectCardProps`, `TechBadgeProps`, `ProjectLinksProps`, `ProjectImageProps`, `ProjectsDecorativeProps`, `ProjectsSectionProps`, `DEFAULT_PROJECTS` (5 projects: AI Analytics Platform, E-Commerce Mobile App, DevOps Automation Toolkit, NLP Customer Support Bot, Real-Time Data Visualization -- with .webp thumbnails in `/images/projects/`, tech stacks, and live/source URLs)
> - **`product.ts`** -- `ProductStatIcon`, `ProductStat` (label/value/icon), `ProductStatsProps`, `ProductContentConfig`/`ProductContentProps`, `ProductCTAConfig`, `ProductCTAsConfig`/`ProductCTAsProps`, `ProductSectionProps` (with onLoadComplete/onLoadProgress), `DEFAULT_PRODUCT_CONTENT` (name: "AI Community", tagline), `DEFAULT_PRODUCT_STATS` (4 stats: Members, Resources, Projects, Events), `DEFAULT_PRODUCT_CTAS` (primary: "Join the Community", secondary: "Learn More")
> - **`contact.ts`** -- `ContactFormFieldName` (name/email/message/honeypot), `ContactFormData` (with honeypot), `FormSubmitState`, `ContactFormFieldConfig`, `ContactFormFieldProps`, `ContactFormProps`, `ContactSocialLinksProps`, `ContactDecorativeProps`, `ContactSectionProps`, `FooterNavLink`/`FooterNavProps`, `ScrollToTopProps`, `FooterProps`, `CONTACT_FORM_FIELDS` (3 fields), `DEFAULT_FOOTER_LINKS` (4 links), `CONTACT_EMAIL`
> - **`navigation.ts`** -- `NavLinkConfig`, `NavLinkProps`, `NavLinksProps`, `MobileMenuButtonProps`, `MobileDrawerProps`, `MobileMenuProps`, `NavbarProps` (with hideOnScroll), `UseActiveSectionOptions`, `ScrollDirection`, `UseScrollDirectionOptions`, `NAV_LINKS` (6 links: Home, About, Skills, Projects, AI Community, Contact), `SECTION_IDS`
> - **`parallax.ts`** -- `ParallaxLayerType` (background/mid/foreground), `ParallaxSpeedConfig`, `PARALLAX_SPEED_CONFIG`, `PARALLAX_LAYER_SPEEDS`, `MAX_PARALLAX_LAYERS` (5), `ParallaxContextValue` (containerRef/scrollProgress/isEnabled/prefersReducedMotion/isMobile/registerLayer/layerCount), `DEFAULT_PARALLAX_CONTEXT`, `ParallaxContainerProps`, `ParallaxLayerProps` (speed/layer/zIndex/pointerEvents), `UseParallaxTransformOptions/Return`, `UseIsMobileOptions`, `ParallaxTransformParams`, `ParallaxOffsetCalculator`
> - **`decorative.ts`** -- `DecorativeShapeVariant` (circle/triangle/hexagon/diamond), `DecorativeShapeSize` (sm/md/lg), `DECORATIVE_SHAPE_SIZES`, `DecorativeShapeColor`, `DecorativePosition`, `DECORATIVE_Z_INDEX`, `ShapeSVGProps`, `FloatingShapeProps` (variant/position/size/color/opacity/blur/speed/delay), `ConnectionLineProps` (start/end/color/thickness/opacity/animated/delay), `GradientStop`, `GradientMeshProps` (stops/type/angle/opacity/blendMode), `NoiseOverlayProps` (intensity/blendMode/animated), `DecorativeElementConfig`, `DecorativeElementsProps` (staggered/staggerDelay/scrollProgress/showOnMobile), `UseDecorativeParallaxOptions/Return`, `DECORATIVE_COLORS`, `DEFAULT_GRADIENT_STOPS`
> - **`scroller.ts`** -- `HorizontalCardScrollerProps` (children/className/cardClassName/ariaLabel), `ScrollerButtonProps` (direction/onClick/disabled), `UseHorizontalScrollReturn` (scrollContainerRef/canScrollLeft/canScrollRight/scrollLeft/scrollRight/handleKeyDown)
> - **`webgl.ts`** -- `GPUTier` (high/medium/low/unsupported), `WebGLSupport` (webgl1/2/maxTextureSize/maxVertexUniforms/vendor/renderer), `QualitySettings` (particleCount/enableShaders/opacityMultiplier/enableGlow/targetFPS), `WebGLCapabilities` (isEnabled/tier/quality/support/disableReason), `WebGLDisableReason` (no-webgl/mobile-viewport/reduced-motion/low-performance/context-lost), `WebGLEffectType`, `BaseEffectProps`, `ParticleFieldProps`, `GlowAuraProps`, `HeroWebGLEffectProps`, `WebGLFallbackProps`, `DEFAULT_QUALITY_SETTINGS` (high: 500 particles/60fps, medium: 250/45fps, low: 100/30fps, unsupported: 0/0fps), `UnifiedHeroCanvasProps`, `FramePlaneProps`

---

## Prompt 5: State Management & Loading System

> Set up Zustand 5 with two stores in `stores/`:
>
> **`loading-store.ts`** -- state: `isLoading` (default true), `isComplete`, `progress` (0-100), `error: string | null`. Actions: `setProgress` (clamped 0-100), `setComplete` (sets isLoading=false, progress=100), `setError` (sets error, stops loading), `reset`. Add Zustand devtools middleware.
>
> **`animation-store.ts`** -- state: `isLoading` (default true), `loadProgress` (0-100), `loadMessage`, `prefersReducedMotion`, `animationsEnabled` (default true), legacy fields (`currentFrame`, `totalFrames`, `isPlaying`), and a `sequences` Record keyed by `FrameSequenceId` with per-sequence state (`currentFrame`, `totalFrames`, `isActive`, `loadProgress`, `isLoaded`, `direction`). Initialize sequences with hero (192 frames) and product (144 frames). Actions: `setLoading`, `setLoadProgress` (clamped, with optional message), `setPrefersReducedMotion` (also toggles animationsEnabled), `setAnimationsEnabled`, legacy setters, `reset`, and per-sequence actions: `setSequenceFrame`, `setSequenceActive`, `setSequenceLoadProgress`, `setSequenceLoaded`, `setSequenceDirection`, `getSequence`.
>
> Add barrel `stores/index.ts` re-exporting both stores and their types.
>
> Build loading components in `components/loading/`:
> - **LoadingScreen.tsx** -- full-viewport overlay with progress bar and animated logo, Framer Motion exit animation, accepts `isLoading`/`progress`/`onExitComplete` props
> - **LoadingLogo.tsx** -- animated logo during load
> - **LoadingProgress.tsx** -- progress bar visualization
> - **LoadingProvider.tsx** -- provider component for loading context
> - **ContentReveal.tsx** -- wrapper that fades in children after loading completes
>
> Add barrel `index.ts`. Wire the loading state into `app/page.tsx` as a client component that manages `isLoading`, `loadProgress`, and `isContentRevealed` state, rendering LoadingScreen followed by all sections sequentially.

---

## Prompt 6: Scroll Animation Hooks

> Using Framer Motion 12's `useScroll`, `useTransform`, `useMotionValueEvent`, and `useInView`, build these custom hooks in `hooks/`:
>
> - **`useScrollProgress`** -- accepts `target` ref and `offset` (default: `["start end", "end start"]`), returns `{ progress: MotionValue<number>, isInView: boolean }` where progress is 0-1
> - **`useFrameAnimation`** -- accepts `target` ref, `totalFrames`, and `offset`, returns `{ frameIndex: MotionValue<number>, progress: MotionValue<number>, direction: ScrollDirection, isActive: boolean }`. Maps scroll progress to frame index 0-(totalFrames-1)
> - **`useParallax`** -- accepts `target` ref, `speed` (0.3-1.3, default 0.5), and `offset`, returns `{ y, x, opacity }` as MotionValues with parallax offset transforms
> - **`useParallaxTransform`** -- accepts `speed`, `scrollProgress` MotionValue, and `enabled` flag, returns `{ y: MotionValue, style }` with GPU-accelerated translate3d via `willChange: "transform"`
> - **`useScrollDirection`** -- accepts optional `threshold` (default 10) and `initialDirection`, uses requestAnimationFrame debouncing, returns `"up" | "down" | null`
> - **`useViewportHeight`** -- uses `useSyncExternalStore` with `visualViewport` API (fallback to `innerHeight`), SSR default 800px. Export three variants: `useViewportHeight()` returning number, `useViewportHeightCSS()` returning string, `useViewportHeightValues()` returning `{ height, css, style }`
> - **`useReducedMotion`** -- uses `useSyncExternalStore` with `"(prefers-reduced-motion: reduce)"` media query, SSR returns false
> - **`useIsMobile`** -- uses `useSyncExternalStore` with viewport width < 768px check, SSR returns false
> - **`useHorizontalScroll`** -- returns `{ scrollContainerRef, canScrollLeft, canScrollRight, scrollLeft, scrollRight, handleKeyDown }` for horizontal card scrollers with arrow key navigation, smooth/instant scrolling based on reduced motion, ResizeObserver for dynamic content, debounced scroll events
> - **`useCanvasRenderer`** -- accepts `canvasRef`, `currentFrame`, `getImage` function, `enabled` flag. Renders frames to 2D canvas with object-fit cover calculation, requestAnimationFrame for tear-free rendering, skips unchanged frames. Returns `{ lastDrawnFrame }`
>
> Add barrel `hooks/index.ts` exporting all hooks.

---

## Prompt 7: Frame Preloading & Caching Pipeline

> Build the frame asset pipeline:
>
> 1. **`lib/frame-utils.ts`** -- configuration: `ASSET_BASE_URL` from `NEXT_PUBLIC_ASSET_BASE_URL` env var (default `http://localhost:8089/assets`), `CACHE_VERSION: "v3"`, `BUCKET_NAMES: { desktop: "frames-desktop", mobile: "frames-mobile" }`, `MOBILE_WIDTH_THRESHOLD: 768`. Export functions: `getFrameUrl({ sequence, index, quality })` generating URLs like `{ASSET_BASE_URL}/frames-{quality}/{sequence}/frame_0001.webp?v3` (1-based, zero-padded to 4 digits), `generateFrameUrls({ sequence, totalFrames, quality })` returning 0-indexed array with 1-based frame numbers, `generateFrameUrlRange`, `getOptimalQuality(viewportWidth?)` returning "desktop" or "mobile", `isMobileDevice()`, `createMobileMediaQuery()`, `getVirtualizedRange(currentFrame, totalFrames, range)`, `isFrameInRange`, `frameIndexToNumber` (0-based to 1-based), `frameNumberToIndex` (1-based to 0-based).
>
> 2. **`hooks/useImageCache`** -- Map-based cache of frame index to HTMLImageElement. Accepts `{ frameUrls, enabled }`, returns `{ getImage(index), isImageLoaded(index), loadedCount, totalCount }`. Uses ref-based Map, works with browser cache from preloader.
>
> 3. **`hooks/useFramePreload`** (~620 lines) -- loads priority frames first (default 10), then remaining via `requestIdleCallback` in background. Accepts `{ frames, priorityCount, onProgress, onComplete, onError }`. Returns `{ isLoading, isComplete, progress, loadedCount, totalCount, startPreload() }`. Features: exponential backoff retry (MAX_RETRIES=3, delays 1s/2s/4s), MAX_CONCURRENT_RETRIES=3, OVERALL_TIMEOUT=30s, 80% success threshold for early completion, CORS headers (`crossOrigin: "anonymous"`), comprehensive ref-based cleanup on unmount, per-frame retry tracking.
>
> 4. **`hooks/useFrameSequence`** -- integration hook combining `useFrameAnimation` + `useFramePreload` + animation store. Accepts `{ sequence, containerRef, priorityCount, offset, onProgress, onComplete }`. Returns `{ currentFrame, frameUrls, isLoading, isReady, loadProgress, direction, isActive, prefersReducedMotion, isMobile, startPreload }`. Generates frame URLs based on device quality, syncs state with animation store sequences.
>
> 5. **`hooks/useTextureLoader`** (~420 lines) -- Three.js texture management with LRU eviction. Accepts `{ frameUrls, priorityCount, maxCachedTextures, enabled }`. Returns `{ getTexture(frameIndex), isTextureReady(frameIndex), loadedCount, totalCount, preloadNearby(currentFrame) }`. Features: MAX_TEXTURE_POOL_SIZE=50, maintains browser image cache separately from GPU texture pool, failed entries marked terminal (no retry), preloads nearby frames (NEARBY_FRAME_RANGE=5), concurrent load deduplication, `requestIdleCallback` for background loading, SRGBColorSpace textures.
>
> 6. **`hooks/useUnifiedFrameAnimation`** -- combines `useFrameAnimation` + `useFramePreload` + `useTextureLoader` + animation store for GPU-accelerated rendering. Accepts `{ sequence, containerRef, priorityCount, callbacks }`. Returns `{ currentTexture: THREE.Texture | null, currentFrame, frameUrls, direction, isActive, isReady, loadProgress, isMobile, prefersReducedMotion, startPreload, preloadNearby }`.
>
> Also create **`lib/scroll-utils.ts`** with pure functions: `calculateFrameIndex(progress, totalFrames)`, `calculateParallaxOffset(scrollY, speed, height)`, `normalizeProgress(scrollY, sectionTop, height, viewportHeight)`, `getScrollDirection(prevY, currentY)`, `isSectionInView(sectionTop, height, scrollY, vpHeight)`, `generateFrameUrls(basePath, frameCount, extension)`, `calculateFadeOpacity(progress, fadeInEnd, fadeOutStart)`.
>
> Wire loading progress to the Zustand animation store's per-sequence state.

---

## Prompt 8: Hero Section with Parallax

> Build the HeroSection (`components/sections/HeroSection.tsx`) as a 300vh scroll runway. Create a sticky inner container at 100vh. Add:
>
> - **HeroContent** (`components/hero/HeroContent.tsx`) -- name, animated title, tagline with Framer Motion entrance animations. Accepts children for composing SkillIndicators and SocialLinks inside.
> - **SkillIndicators** (`components/hero/SkillIndicators.tsx`) -- animated skill indicator badges (AI/ML, Development, Product, Leadership) using Framer Motion
> - **SocialLinks** (`components/hero/SocialLinks.tsx`) -- social icon links (GitHub, LinkedIn, Twitter, Email) using Lucide icons, with defaults from `DEFAULT_SOCIAL_LINKS`
>
> Build the parallax system in `components/parallax/`:
> - **ParallaxContext.tsx** -- React Context providing `ParallaxContextValue` (containerRef, scrollProgress, isEnabled, prefersReducedMotion, isMobile, layer registration)
> - **ParallaxContainer.tsx** -- context provider wrapping children with scroll tracking, max 5 layers, respects reduced motion and mobile
> - **ParallaxLayer.tsx** -- individual parallax layer using `useParallaxTransform`, configurable speed or named layer type, z-index and pointer-events control
>
> Build decorative elements in `components/decorative/`:
> - **DecorativeElements.tsx** -- container with Framer Motion stagger animations, configurable stagger delay, scroll-aware, hidden on mobile by default
> - **FloatingShape.tsx** -- animated geometric shapes with configurable variant/position/size/color/opacity/blur/speed/delay
> - **shapes/** directory with SVG primitives: `Circle.tsx`, `Triangle.tsx`, `Hexagon.tsx`, `Diamond.tsx` (each an SVG shape with size/fill/stroke/opacity props), plus barrel `index.ts`
> - **GradientMesh.tsx** -- animated gradient backgrounds with configurable stops, type (radial/linear/conic), angle, opacity, blend mode
> - **NoiseOverlay.tsx** -- subtle noise texture overlay with configurable intensity and blend mode
> - **ConnectionLine.tsx** -- SVG connection lines between decorative elements with start/end positions, animation, and scroll awareness
>
> Add barrel `index.ts` for hero/, parallax/, and decorative/ directories. Use Framer Motion variants for entrance animations triggered by content reveal.

---

## Prompt 9: WebGL Rendering with Three.js

> Add Three.js (`three` ^0.170), `@react-three/fiber` ^9, and `@react-three/drei` ^10. Build:
>
> 1. **`hooks/useWebGLCapabilities`** (~330 lines) -- detects WebGL support, GPU vendor/model via `WEBGL_debug_renderer_info`, max texture size, and classifies into tiers: high (NVIDIA RTX, AMD RX 5+, Apple M1+, Mali-G7+), medium (mid-range), low (Intel HD, Mali-T6, Adreno 3-4), unsupported. Returns `{ isEnabled, tier, quality: QualitySettings, support: WebGLSupport, disableReason }`. Disable reasons: "no-webgl", "mobile-viewport" (< 768px), "reduced-motion", "low-performance". Integrates `useReducedMotion`.
>
> 2. Three.js components in `components/three/`:
>    - **`UnifiedHeroCanvas.tsx`** -- React Three Fiber canvas component using `useUnifiedFrameAnimation` for scroll-synchronized GPU-accelerated frame display with particle effects. Accepts `{ sequence, containerRef, effectType, onLoadComplete, onLoadProgress, disabled }`.
>    - **`HeroWebGLEffect.tsx`** -- WebGL effect wrapper that detects capabilities and renders appropriate effect type or fallback
>    - **`scene.tsx`** -- Three.js scene setup
>    - **`canvas-wrapper.tsx`** -- Canvas element wrapper
>    - **`effects/FramePlane.tsx`** (z:-2) -- full-viewport mesh displaying current frame texture with object-fit cover UV math, configurable render order and z-position
>    - **`effects/ParticleField.tsx`** (z:0) -- 100-500 additive-blend floating particles with seeded random positions and scroll-synchronized drift, configurable color/size/spread/speed
>    - **`effects/GlowAura.tsx`** (z:-1) -- pulsing gradient behind the frame with configurable inner/outer colors, radius, pulse intensity
>    - **`effects/index.ts`** -- barrel export
>    - **`fallbacks/WebGLFallback.tsx`** -- static fallback for unsupported browsers, shows reason
>    - **`index.ts`** -- barrel export
>
> 3. **`components/animation/CanvasFrameRenderer.tsx`** -- 2D canvas fallback for non-WebGL devices using `useImageCache` + `useCanvasRenderer`. Also `FrameImage.tsx` (individual frame wrapper) and `FrameSequence.tsx` (scroll-synchronized frame animation container using `useFrameSequence`, canvas rendering, reduced-motion/mobile fallback). Add barrel `index.ts`.
>
> Disable WebGL entirely on mobile (< 768px viewport).

---

## Prompt 10: Content Sections

> Build the remaining page sections and their sub-components. For each section, create a `*Decorative.tsx` component with section-specific decorative elements:
>
> - **AboutSection** (`components/sections/AboutSection.tsx`) -- asymmetric two-column layout with reveal animation. Sub-components in `components/about/`: `Bio.tsx` (heading + paragraphs with staggered reveal, uses `DEFAULT_BIO_CONTENT`), `AchievementCard.tsx` (individual card with animated number counter, Lucide icon, suffix, and label), `Achievements.tsx` (grid container for achievement cards, uses `DEFAULT_ACHIEVEMENTS`), `AboutDecorative.tsx`. Add barrel `index.ts`.
>
> - **SkillsSection** (`components/sections/SkillsSection.tsx`) -- uses HorizontalCardScroller for horizontal scrolling. Sub-components in `components/skills/`: `SkillCard.tsx` (category card with Lucide icon, title, and skill list with Framer Motion animations), `SkillItem.tsx` (individual skill display), `SkillsDecorative.tsx`. Uses `DEFAULT_SKILL_CATEGORIES`. Add barrel `index.ts`.
>
> - **ProjectsSection** (`components/sections/ProjectsSection.tsx`) -- uses HorizontalCardScroller. Sub-components in `components/projects/`: `ProjectCard.tsx` (card with thumbnail, description, tech badges, and links with hover lift effects), `ProjectImage.tsx` (thumbnail with .webp images from `/images/projects/`), `ProjectLinks.tsx` (live demo + source code links with Lucide icons), `TechBadge.tsx` (technology tag/badge), `ProjectsDecorative.tsx`. Uses `DEFAULT_PROJECTS`. Add barrel `index.ts`.
>
> - **ProductSection** (`components/sections/ProductSection.tsx`) -- similar to Hero with 144-frame scroll animation. Sub-components in `components/product/`: `ProductContent.tsx` (product name and tagline), `ProductStats.tsx` (4 stat cards with icons), `ProductCTAs.tsx` (primary + secondary CTA buttons). Uses `DEFAULT_PRODUCT_CONTENT`, `DEFAULT_PRODUCT_STATS`, `DEFAULT_PRODUCT_CTAS`. Has its own UnifiedHeroCanvas instance with sequence="product".
>
> - **ContactSection** (`components/sections/ContactSection.tsx`) -- two-column layout. Sub-components in `components/contact/`: `ContactForm.tsx` (react-hook-form with Zod validation via `@hookform/resolvers`, honeypot spam prevention), `ContactFormField.tsx` (individual form field with label/input/error), `ContactSocialLinks.tsx` (social media links in contact context), `ContactDecorative.tsx`. Add barrel `index.ts`.
>
> - **Footer** (`components/sections/Footer.tsx`) -- copyright and links. Sub-components in `components/footer/`: `FooterNav.tsx` (navigation links using `DEFAULT_FOOTER_LINKS`), `ScrollToTop.tsx` (smooth scroll-to-top button with Framer Motion appearance, configurable scroll threshold). Add barrel `index.ts`.
>
> Build the HorizontalCardScroller system in `components/scroller/`: `HorizontalCardScroller.tsx` (arrow nav buttons, drag scroll, snap points, keyboard navigation via `useHorizontalScroll`, ARIA labels), `ScrollerButton.tsx` (left/right nav buttons with disabled state). Add barrel `index.ts`.
>
> Create **`lib/form-validation.ts`** with Zod-based validation: constants (NAME_MIN=2, NAME_MAX=100, MESSAGE_MIN=10, MESSAGE_MAX=5000, EMAIL_MAX=254), `contactFormSchema` (Zod object with name/email/message/honeypot), validation functions (`isValidEmail`, `validateName`, `validateMessage`, `validateContactForm`), `formatMailtoLink`, `isSpamSubmission`.
>
> Add project thumbnail images to `public/images/projects/` (5 .webp files: ai-platform, ecommerce-app, devops-toolkit, nlp-chatbot, data-viz).
>
> Compose all sections sequentially in `app/page.tsx`: LoadingScreen, then HeroSection (with load tracking callbacks), AboutSection, SkillsSection, ProjectsSection, ProductSection, ContactSection, Footer. Add barrel `index.ts` for `components/sections/`.

---

## Prompt 11: Unit Testing Suite

> Set up Vitest 4 with jsdom, `@testing-library/react`, `@testing-library/dom`, `@testing-library/jest-dom`, `@testing-library/user-event`, `@vitest/coverage-v8`, `@vitejs/plugin-react`, and `jsdom` as dev dependencies. Configure `vitest.config.ts` with: test environment jsdom, globals enabled, setup file `__tests__/setup.ts`, include pattern `__tests__/**/*.test.{ts,tsx}`, exclude node_modules and .next. Add Three.js singleton prevention via path alias (`three` -> `node_modules/three`), and include Three.js packages in web optimizer. Configure coverage provider v8 with text/json/html reporters and per-file thresholds (90%+ lines/functions/statements, 80%+ branches for scroll-utils).
>
> Create `__tests__/setup.ts` mocking: Three.js "Multiple instances" console warning suppression, full `CanvasRenderingContext2D` mock (~40 stub methods), WebGL context returning null (preserves fallback behavior), `matchMedia` mock for CSS media queries, `ResizeObserver` mock, `IntersectionObserver` mock with proper interface, `requestAnimationFrame`/`cancelAnimationFrame` mocks (via setTimeout), `requestIdleCallback`/`cancelIdleCallback` mocks.
>
> Write ~590+ unit tests across `__tests__/` mirroring the source tree (44 test files):
>
> **Hook tests** (14 files): `useScrollProgress`, `useReducedMotion`, `useFrameAnimation`, `useParallax`, `useFrameSequence`, `useActiveSection`, `useParallaxTransform`, `useImageCache`, `useWebGLCapabilities`, `useCanvasRenderer`, `useIsMobile`, `useFramePreload`, `useTextureLoader`, `useViewportHeight`.
>
> **Component tests** (26 files): hero/ (HeroContent, SkillIndicators, SocialLinks), product/ (ProductStats, ProductContent, ProductCTAs), skills/ (SkillItem, SkillCard), about/ (AchievementCard, Bio), projects/ (TechBadge, ProjectCard, ProjectLinks), navigation/ (Navbar), contact/ (ContactForm), sections/ (ProjectsSection), parallax/ (ParallaxLayer), plus top-level: HeroWebGLEffect, CanvasFrameRenderer, HeroSection, FrameSequence, ProductSection, AboutSection, SkillsSection.
>
> **Decorative tests** (2 files): FloatingShape, shapes (Circle/Triangle/Hexagon/Diamond).
>
> **Library tests** (3 files): scroll-utils, form-validation, frame-utils.
>
> **Store tests** (1 file): loading-store.
>
> Test rendering, props, interactions, accessibility attributes, responsive behavior, and edge cases. Mock heavy dependencies (framer-motion, Three.js, FrameSequence).

---

## Prompt 12: E2E Testing Suite

> Set up Playwright (`@playwright/test`, `@axe-core/playwright`, `axe-core`) with Chromium, Firefox, and mobile viewports (Pixel 5, iPhone 12). Configure `playwright.config.ts`: test directory `e2e/`, base URL `http://localhost:3017`, fully parallel locally (single worker on CI), global timeout 120s, expect timeout 30s, visual comparison with 1% max diff pixel ratio and animations disabled, HTML reporter (never auto-open) + list reporter, trace/screenshot/video on first retry or failure, default viewport 1280x720, auto-start dev server on port 3017 with 120s startup timeout, output to `test-results/`, snapshots to `e2e/__snapshots__/`.
>
> Create `e2e/fixtures/test-fixtures.ts` exporting: `SELECTORS` object (section selectors), `VIEWPORTS` object, extended `test`/`expect` from Playwright, helper functions (`waitForPageLoad`, `scrollToSection`, `isInViewport`, `getNavLinks`, `runAccessibilityScan` with axe-core, `disableAnimations`, `setReducedMotion`).
>
> Write E2E tests (5 spec files):
> - **`home.spec.ts`** (~11 tests) -- page loads, loading screen, all sections visible, document structure, no console errors
> - **`navigation.spec.ts`** (~100+ tests) -- navbar rendering, nav links scroll to sections, active state updates, smooth scroll, mobile navigation (hamburger menu, drawer)
> - **`contact-form.spec.ts`** (~13 tests) -- form elements visible, field validation errors, accessibility attributes, successful submission, error handling
> - **`accessibility.spec.ts`** (~100+ tests) -- axe-core automated scans, keyboard navigation, reduced motion support, color contrast, document structure, heading hierarchy, landmark regions
> - **`visual.spec.ts`** (~180+ tests) -- desktop viewport screenshots (7 sections), mobile viewport screenshots (6 sections + mobile menu), tablet viewport screenshots, responsive breakpoint testing across 6 viewports

---

## Prompt 13: Docker & Infrastructure

> Create a multi-stage Dockerfile:
> - **Stage 1 (deps):** `node:22-alpine`, install libc6-compat, `npm ci`
> - **Stage 2 (builder):** copy source, `NEXT_TELEMETRY_DISABLED=1`, `next build` with standalone output
> - **Stage 3 (runner):** `NODE_ENV=production`, copy public + `.next/standalone` + `.next/static`, non-root user (nextjs:nodejs, UID/GID 1001), expose port 3000, health check (`wget --no-verbose --tries=1 --spider http://localhost:3000` every 30s, 10s timeout), `node server.js` entrypoint
>
> Create `.dockerignore` to exclude node_modules, .next, .git, etc.
>
> Create `docker-compose.yml` with three services on a `resume-network` bridge:
> - **MinIO** (`minio/minio:latest`) -- S3-compatible storage on ports 9000 (API) / 9001 (Console), health check via `mc ready local`, persistent volume `minio_data`
> - **PostgreSQL 16** (`postgres:16-alpine`) -- port 5442, health check via `pg_isready`, persistent volume `postgres_data`, init script from `docker/postgres/init.sql`
> - **Nginx 1.25** (`nginx:1.25-alpine`) -- port 8089, reverse proxy to MinIO with 7-day cache headers, CORS for localhost:3017, gzip compression, security headers (X-Frame-Options, X-Content-Type-Options, X-XSS-Protection). Config from `docker/nginx/nginx.conf` and `docker/nginx/conf.d/default.conf`. Cache volume `nginx_cache`. Depends on MinIO (healthy).
>
> Create infrastructure configs:
> - `docker/nginx/nginx.conf` -- worker processes auto, 1024 connections, tcp_nopush/nodelay, gzip level 6 with 16x8k buffers min 256 bytes, proxy cache 10m zone / 1g max / 7-day inactive
> - `docker/nginx/conf.d/default.conf` -- `/assets/` location proxying to MinIO with 604800s cache, CORS headers
> - `docker/postgres/init.sql` -- `assets` schema with `frames` table (frame metadata) and `buckets` table, indices
> - `docker/minio/policies/public-read.json` -- public read bucket policy
>
> Create `scripts/` directory with utility scripts: `deploy-local-clean.sh`, `docker-health-check.sh`, `generate_video.py` (with Python `requirements.txt`), `optimize-frames.sh`, `upload-to-minio.sh`, `verify-assets.sh`.
>
> Create `.env.example` with sections: MinIO (root user/password, API/console ports), PostgreSQL (user/password/db/port), Nginx (port), Application (NEXTJS_DEV_URL, CACHE_MAX_AGE), Next.js Public (NEXT_PUBLIC_ASSET_BASE_URL), Coolify Deploy (API token/URL, GitHub repo/branch, app name/domain).
>
> Create `vercel.json`: framework nextjs, build/install commands, output .next, region iad1, security headers on all routes (X-Content-Type-Options: nosniff, X-Frame-Options: DENY, X-XSS-Protection: 1; mode=block, Referrer-Policy: strict-origin-when-cross-origin), 1-year immutable cache on `/assets/*` and `/_next/static/*`.

---

## Prompt 14: Documentation & Project Management

> Create comprehensive docs:
>
> - `README.md` -- project overview, tech stack, quick start, deployment options
> - `CONTRIBUTING.md` -- contribution guidelines, commit conventions, PR process
> - `docs/ARCHITECTURE.md` -- system diagram, data flow, component hierarchy, dependency graph, tech rationale
> - `docs/development.md` -- local setup, Docker commands, coding standards
> - `docs/deployment.md` -- Vercel, Docker, Coolify deployment instructions
> - `docs/onboarding.md` -- new developer guide
> - `docs/environments.md` -- environment configuration across dev/staging/production
> - `docs/requirements.md` -- functional and non-functional requirements
> - `docs/ASSET_URLS.md` -- asset URL configuration and CDN setup
> - `docs/OPTIMIZATION_REPORT.md` -- performance optimization notes
> - `docs/accessibility-audit.md` -- WCAG compliance report
> - `docs/performance-audit.md` -- Lighthouse scores, optimization notes
> - `docs/adr/0000-template.md` -- ADR template for future architecture decisions
> - `docs/runbooks/incident-response.md` -- operational procedures for incident handling
> - `docs/ongoing-roadmap/` -- road map documents: `code-audit.md`, `coolify-as-production-platform.md`, `current-fixes.md`
>
> Initialize the Apex Spec system (`.spec_system/`) with:
> - `state.json` for project state tracking
> - `PRD/PRD.md` master product requirements document
> - `PRD/phase_00/PRD_phase_00.md` phase specification with session definitions (6 sessions: frame preload error handling, texture loader refactor, configuration consolidation, documentation alignment, test environment improvements, code quality polish)
> - Session spec directories under `specs/` with spec.md, tasks.md, and implementation tracking
>
> Create 4 demo components (`components/demo/`): `motion-demo.tsx` (Framer Motion showcase), `three-demo.tsx` (Three.js WebGL showcase), `store-demo.tsx` (Zustand demonstration), `ui-demo.tsx` (UI component showcase). Create demo pages under `app/demo/` for frames, loading, scroll, and a main demo page.

---

## Important Notes

### Frame Assets Are External

The scroll animation requires **192 WebP hero frames** and **144 WebP product frames** (1920x1080 for desktop, 750x1334 for mobile). These are served from MinIO via Nginx -- without them, the animation shows fallback colors. You'll need to:

1. Record or source video clips for hero and product sequences
2. Extract frames as WebP files named `frame_0001.webp` through `frame_0192.webp` (hero) or `frame_0144.webp` (product)
3. Upload to MinIO buckets (`frames-desktop/hero/`, `frames-mobile/hero/`, `frames-desktop/product/`, `frames-mobile/product/`)
4. Utility scripts in `scripts/` help with frame optimization and upload

### Build Order Matters

Each prompt builds on the previous. The dependency graph is:

```
Prompt 1 (scaffold)
  -> Prompt 2 (design system)
    -> Prompt 3 (layout/nav/a11y)
    -> Prompt 4 (types/data)
      -> Prompt 5 (state/loading)
      -> Prompt 6 (scroll hooks)
        -> Prompt 7 (frame pipeline)
          -> Prompt 8 (hero section + parallax + decoratives)
          -> Prompt 9 (WebGL)
      -> Prompt 10 (content sections)
  -> Prompt 11 (unit tests)
  -> Prompt 12 (E2E tests)
  -> Prompt 13 (infrastructure)
  -> Prompt 14 (documentation + demos)
```

### Scale

The final project contains:

| Category | Count |
|----------|-------|
| Component files | ~90 (plus ~15 barrel index.ts files) |
| Custom hooks | 17 (plus barrel index.ts) |
| Type definition files | 12 (plus barrel index.ts) |
| Zustand stores | 2 |
| Library/utility files | 6 |
| Unit test files | 44 |
| Unit test cases | 590+ |
| E2E spec files | 5 |
| E2E test cases | 400+ |
| Documentation files | 16+ |
| Infrastructure configs | 8+ |
| Utility scripts | 6 |
| Demo components | 4 |
| Demo pages | 4 |

Each prompt generates substantial code -- expect to iterate and refine within each step.

### Personalization

All resume content lives in `DEFAULT_*` constants inside `types/*.ts`. To personalize:

1. Edit the constants in `types/hero.ts` (name, title, tagline, social links), `types/about.ts` (bio, achievements), `types/skills.ts` (categories and skills), `types/projects.ts` (portfolio projects), `types/product.ts` (product content, stats, CTAs)
2. Replace project thumbnails in `public/images/projects/`
3. Update social links in `types/hero.ts` `DEFAULT_SOCIAL_LINKS`
4. Swap frame assets for your own video sequences
5. Update `CONTACT_EMAIL` in `types/contact.ts`
