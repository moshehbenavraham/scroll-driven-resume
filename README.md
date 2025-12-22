# Modern Resume Site

A premium, single-page personal tech portfolio combining scroll-synchronized frame animation with parallax layering for a cinematic user experience.

## Quick Start

```bash
# Start Docker infrastructure (MinIO + PostgreSQL + Nginx)
docker compose up -d

# Install dependencies and run development server
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Repository Structure

```
.
├── app/                  # Next.js 15 App Router pages
├── components/           # React components
│   ├── animation/        # Frame animation (Canvas renderer)
│   ├── decorative/       # CSS/SVG decorative elements
│   ├── hero/             # Hero section components
│   ├── loading/          # Loading overlay system
│   ├── parallax/         # Parallax layer components
│   ├── product/          # Product section components
│   ├── sections/         # Page section layouts
│   ├── three/            # React Three Fiber (WebGL)
│   └── ui/               # shadcn/ui components
├── hooks/                # Custom React hooks (scroll, animation, parallax)
├── lib/                  # Utility functions
├── docker/               # Docker configuration (MinIO, Nginx)
├── docs/                 # Project documentation
│   └── media-assets/     # Source video frames
└── .spec_system/         # Apex Spec project management
```

## Documentation

- [Onboarding](docs/onboarding.md) - Setup guide for new developers
- [Development Guide](docs/development.md) - Local development workflow
- [Architecture](docs/ARCHITECTURE.md) - System design and tech stack
- [Contributing](CONTRIBUTING.md) - Branch conventions and PR process

## Tech Stack

- **Next.js 15** - React framework with App Router
- **React 19** - UI library with concurrent features
- **TypeScript 5** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **Framer Motion 12** - Scroll-triggered animations
- **Three.js / React Three Fiber** - WebGL effects
- **Zustand** - Client state management
- **shadcn/ui** - Accessible UI primitives

## Project Status

Phase 00 (Foundation) and Phase 01 (Core Animation) complete. Phase 02 (Content and Polish) pending.

See [PRD](.spec_system/PRD/PRD.md) for detailed roadmap.
