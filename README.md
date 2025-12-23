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

Open [http://localhost:3017](http://localhost:3017) to view the site.

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

## Testing

```bash
# Unit tests
npm run test

# E2E tests with Playwright
npm run test:e2e

# E2E tests with UI
npm run test:e2e:ui

# Update visual regression baselines
npm run test:e2e:update
```

## Production Deployment

### Docker Build

The project includes a production-ready Dockerfile for containerized deployment:

```bash
# Build production image
docker build -t modern-resume-site .

# Run locally
docker run -p 3000:3000 modern-resume-site
```

### Coolify Deployment

1. **Connect Repository**: Link your GitHub repository in Coolify dashboard
2. **Build Configuration**:
   - Build Pack: Dockerfile
   - Dockerfile Location: `/Dockerfile`
   - Exposed Port: `3000`
3. **Resource Limits** (recommended):
   - Memory: 1024 MB
   - CPU: 1.0 cores
4. **Health Check**:
   - Path: `/`
   - Port: `3000`
   - Interval: 30s
5. **Domain**: Configure your custom domain with automatic SSL

See [Coolify Documentation](docs/ongoing-roadmap/coolify-as-production-platform.md) for detailed deployment patterns.

### Environment Variables

No environment variables required for production. Optional:

| Variable   | Description      | Default      |
| ---------- | ---------------- | ------------ |
| `NODE_ENV` | Environment mode | `production` |
| `PORT`     | Server port      | `3000`       |

## Project Status

| Phase | Name | Sessions | Status |
|-------|------|----------|--------|
| 00 | Foundation | 7/7 | Complete |
| 01 | Core Animation | 6/6 | Complete |
| 02 | Content and Polish | 7/8 | In Progress |

**Current**: Session 08 - Testing and Deployment

See [PRD](.spec_system/PRD/PRD.md) for detailed roadmap.
