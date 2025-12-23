# NEXT_SESSION.md

## Session Recommendation

**Generated**: 2025-12-21
**Project State**: Phase 00 - Foundation
**Completed Sessions**: 1 of 7

---

## Recommended Next Session

**Session ID**: `phase00-session02-docker-infrastructure`
**Session Name**: Docker Infrastructure
**Estimated Duration**: 2-3 hours
**Estimated Tasks**: 20-25

---

## Why This Session Next?

### Prerequisites Met
- [x] Docker and Docker Compose installed (system dependency)
- [x] Session 01 completed (optimized assets ready in `assets/optimized/`)
- [x] Ports 9000, 9001, 5432, 80/8080 available (local development)

### Dependencies
- **Builds on**: Session 01 (Asset Optimization) - uses the optimized WebP frames
- **Enables**: Session 03 (Asset Deployment) - requires Docker stack to upload assets

### Project Progression
Docker Infrastructure is the **critical path blocker** for all subsequent development. The MinIO + Nginx stack provides the CDN-like asset delivery that the frame animation system depends on. Without this infrastructure:
- Session 03 (Asset Deployment) cannot upload frames
- Sessions 04-07 cannot test frame loading from storage
- No development can proceed with realistic asset delivery

This is pure infrastructure work with no creative decisions - ideal for focused, methodical implementation.

---

## Session Overview

### Objective
Set up the self-hosted Docker stack with MinIO (S3-compatible storage), PostgreSQL (database), and Nginx (reverse proxy with caching) for local development and asset delivery.

### Key Deliverables
1. `docker-compose.yml` with MinIO, PostgreSQL, Nginx services configured
2. `nginx/nginx.conf` with caching and CORS configuration
3. `.env.example` with documented environment variables
4. MinIO bucket structure (`hero-frames/`, `product-frames/`, mobile variants)
5. Health check verification and service documentation

### Scope Summary
- **In Scope (MVP)**: Docker Compose setup, MinIO configuration, PostgreSQL initialization, Nginx reverse proxy with caching, CORS headers, environment variables
- **Out of Scope**: Asset upload (Session 03), production SSL/TLS, Kubernetes/cloud deployment

---

## Technical Considerations

### Technologies/Patterns
- **Docker Compose** - Multi-container orchestration
- **MinIO** - S3-compatible object storage (ports 9000/9001)
- **PostgreSQL** - Relational database for metadata (port 5432)
- **Nginx** - Reverse proxy with static asset caching (port 80/8080)

### Potential Challenges
- **Port conflicts**: Common ports (80, 5432) may be in use by other services
- **MinIO bucket policies**: Must configure public read access for frame delivery
- **CORS configuration**: Must allow cross-origin requests from localhost:3017 (Next.js dev server)
- **Cache header tuning**: Balance between freshness and performance (7-day cache target)

---

## Alternative Sessions

If this session is blocked (e.g., Docker unavailable):

1. **Session 04: Next.js Bootstrap** - Could scaffold the Next.js app without asset infrastructure, but would need mock assets
2. **Session 05: Animation Libraries** - Could configure Framer Motion/Three.js in isolation

**Note**: These alternatives create technical debt and are not recommended. Docker infrastructure is foundational.

---

## Next Steps

Run `/sessionspec` to generate the formal specification with detailed task breakdown.
