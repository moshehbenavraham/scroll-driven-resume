# Architecture

## System Overview

A scroll-synchronized frame animation portfolio with parallax layering. The system combines cinematic video sequences (controlled by scroll position) with multi-layer parallax for dimensional depth.

## Dependency Graph

```
Next.js App (localhost:3000)
    |
    |-- React Components
    |     |-- Loading System (Zustand store)
    |     |-- Three.js Canvas (R3F)
    |     |-- UI Components (shadcn/ui)
    |
    |-- Frame Assets
          |
          v
Nginx Proxy (localhost:8080) -- 7-day cache
          |
          v
MinIO Storage (localhost:9000)
    |-- frames-desktop/hero/
    |-- frames-desktop/product/
    |-- frames-mobile/hero/
    |-- frames-mobile/product/
```

## Components

### Loading System
- **Purpose**: Full-screen overlay with progress tracking during asset preload
- **Tech**: Zustand, Framer Motion
- **Location**: `components/loading/`

### Frame Animation
- **Purpose**: Scroll-synchronized WebP sequence playback
- **Tech**: Custom hooks, Framer Motion useScroll
- **Location**: `hooks/useFrameAnimation.ts`, `hooks/useFramePreload.ts`

### Parallax System
- **Purpose**: Multi-layer depth effect with variable scroll speeds
- **Tech**: Framer Motion useTransform
- **Location**: `hooks/useParallax.ts`, `hooks/useScrollProgress.ts`

### Three.js Canvas
- **Purpose**: WebGL accent effects for hero sections
- **Tech**: React Three Fiber, @react-three/drei
- **Location**: `components/three/`

### UI Components
- **Purpose**: Accessible, themed UI primitives
- **Tech**: shadcn/ui, Radix UI, Tailwind CSS
- **Location**: `components/ui/`

## Tech Stack Rationale

| Technology | Purpose | Why Chosen |
|------------|---------|------------|
| Next.js 15 | Framework | App Router, RSC, optimized bundling |
| React 19 | UI Library | Concurrent features, improved Suspense |
| TypeScript 5 | Type Safety | Strict mode, no implicit any |
| Tailwind CSS 4 | Styling | New oxide engine, utility-first |
| Framer Motion 12 | Animation | Scroll hooks, layout animations |
| Three.js / R3F | WebGL | Hero section accent effects |
| Zustand | State | Lightweight, no boilerplate |
| MinIO | Storage | S3-compatible, self-hosted |
| Nginx | CDN | Caching proxy for assets |

## Data Flow

1. **Initial Load**: Loading overlay displays, Zustand tracks preload progress
2. **Frame Preload**: First 10 frames load immediately, remainder background-loads
3. **Content Reveal**: Loading overlay fades, staggered content animation begins
4. **Scroll Interaction**: Scroll position maps to frame index and parallax offsets
5. **Asset Delivery**: Nginx serves cached frames from MinIO

## Key Decisions

### Frame Switching via Opacity
Instead of swapping `src` attributes, all frames are pre-rendered with opacity 0/1 switching. This prevents flicker and enables smooth 60fps transitions.

### Mobile Degradation
Below 768px viewport: disable parallax, show static first frame, hide WebGL effects.

### Asset Compression
WebP at Q32 (desktop) / Q22 (mobile) meets size targets while maintaining acceptable quality for scroll animation.
