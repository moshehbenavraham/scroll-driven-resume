# Session Specification

**Session ID**: `phase00-session02-docker-infrastructure`
**Phase**: 00 - Foundation
**Status**: Not Started
**Created**: 2025-12-21

---

## 1. Session Overview

This session establishes the self-hosted infrastructure stack required for asset delivery in the Modern Resume Site. The stack consists of three Docker containers: MinIO for S3-compatible object storage (where optimized WebP frame sequences will be stored), PostgreSQL for metadata and future analytics, and Nginx as a reverse proxy with aggressive caching to simulate CDN-like performance.

The infrastructure is a critical path dependency for all subsequent development. Without this stack, Session 03 cannot upload the optimized assets from Session 01, and Sessions 04-07 cannot test frame loading with realistic network conditions. By containerizing the infrastructure, we ensure reproducible environments across development machines and a clear path to production deployment.

This is pure infrastructure work with well-defined success criteria and no creative decisions. The Docker Compose configuration will be version-controlled, making the entire stack reproducible with a single `docker-compose up -d` command.

---

## 2. Objectives

1. Create a Docker Compose configuration that orchestrates MinIO, PostgreSQL, and Nginx as a unified development stack
2. Configure MinIO with bucket structure ready for frame sequence storage (hero/product, desktop/mobile variants)
3. Configure Nginx as a reverse proxy with 7-day cache headers and CORS support for cross-origin frame loading
4. Establish environment variable patterns and documentation for secure credential management

---

## 3. Prerequisites

### Required Sessions
- [x] `phase00-session01-asset-optimization` - Provides optimized WebP frames ready for upload in Session 03

### Required Tools/Knowledge
- Docker Desktop or Docker Engine (20.10+)
- Docker Compose V2 (included with Docker Desktop)
- Basic understanding of reverse proxy configuration
- Familiarity with S3-compatible storage concepts

### Environment Requirements
- Available ports: 9000 (MinIO API), 9001 (MinIO Console), 5432 (PostgreSQL), 8080 (Nginx)
- Minimum 2GB free RAM for container overhead
- Minimum 5GB free disk space for volumes

---

## 4. Scope

### In Scope (MVP)
- Docker Compose file with all three services (MinIO, PostgreSQL, Nginx)
- MinIO configuration with health checks and console access
- PostgreSQL initialization with basic schema for metadata
- Nginx reverse proxy configuration with:
  - Caching headers (7-day max-age for static assets)
  - CORS headers for localhost:3000 (Next.js dev server)
  - Gzip compression for text-based responses
  - Proxy pass to MinIO for asset requests
- Environment variable template with documentation
- Service health verification and startup validation

### Out of Scope (Deferred)
- Asset upload to MinIO - *Reason: Session 03 responsibility*
- Production SSL/TLS certificates - *Reason: Production deployment phase*
- Kubernetes manifests - *Reason: Not needed for local development*
- MinIO replication or clustering - *Reason: Single-node sufficient for development*
- Database migrations tooling - *Reason: Schema is minimal, manual for now*

---

## 5. Technical Approach

### Architecture

```
+------------------+     +------------------+     +------------------+
|                  |     |                  |     |                  |
|   Next.js App    |---->|      Nginx       |---->|      MinIO       |
|  (localhost:3000)|     |  (localhost:8080)|     | (localhost:9000) |
|                  |     |                  |     |                  |
+------------------+     +------------------+     +------------------+
                                                          |
                         +------------------+             |
                         |                  |             |
                         |   PostgreSQL     |<------------+
                         | (localhost:5432) |   (metadata)
                         |                  |
                         +------------------+
```

The Next.js application (future sessions) will request assets from Nginx. Nginx serves as a caching reverse proxy, fetching from MinIO on cache miss and serving cached responses on hit. PostgreSQL stores metadata about assets (frame counts, sizes, checksums) for validation.

### Design Patterns
- **Reverse Proxy Pattern**: Nginx fronts MinIO to add caching, CORS, and rate limiting
- **Environment Variables**: All secrets and configuration externalized to `.env`
- **Health Checks**: Docker health checks ensure dependent services wait for readiness
- **Named Volumes**: Persistent storage for MinIO data and PostgreSQL databases

### Technology Stack
- **Docker Compose**: v3.8 syntax with depends_on and healthcheck support
- **MinIO**: RELEASE.2024-01-01T00-00-00Z or latest stable
- **PostgreSQL**: 16-alpine (lightweight, current LTS)
- **Nginx**: 1.25-alpine (HTTP/2, modern TLS if needed later)

---

## 6. Deliverables

### Files to Create

| File | Purpose | Est. Lines |
|------|---------|------------|
| `docker-compose.yml` | Main orchestration file with all services | ~80 |
| `docker/nginx/nginx.conf` | Nginx configuration with caching and CORS | ~60 |
| `docker/nginx/conf.d/default.conf` | Server block configuration | ~50 |
| `docker/postgres/init.sql` | Initial database schema for metadata | ~30 |
| `docker/minio/policies/public-read.json` | Bucket policy for public read access | ~15 |
| `.env.example` | Environment variable template with documentation | ~25 |
| `scripts/docker-health-check.sh` | Health verification script | ~40 |

### Files to Modify

| File | Changes | Est. Lines |
|------|---------|------------|
| `.gitignore` | Add `.env`, Docker volumes, and temp files | ~10 |

---

## 7. Success Criteria

### Functional Requirements
- [ ] `docker-compose up -d` starts all services without errors
- [ ] MinIO API accessible at http://localhost:9000
- [ ] MinIO Console accessible at http://localhost:9001 with admin login
- [ ] PostgreSQL accepts connections on localhost:5432
- [ ] Nginx responds on http://localhost:8080
- [ ] Nginx proxies requests to MinIO correctly (test with curl)
- [ ] CORS headers present for requests from localhost:3000
- [ ] Cache-Control header set to `max-age=604800` (7 days) for asset responses
- [ ] All services survive `docker-compose down && docker-compose up -d`

### Testing Requirements
- [ ] Health check script passes all validations
- [ ] Manual curl tests verify CORS and caching headers
- [ ] MinIO Console bucket creation verified

### Quality Gates
- [ ] All configuration files use ASCII-only characters (0-127)
- [ ] Unix LF line endings in all files
- [ ] No hardcoded secrets in version-controlled files
- [ ] Environment variables documented in .env.example

---

## 8. Implementation Notes

### Key Considerations
- Use port 8080 for Nginx instead of 80 to avoid permission issues on Linux
- MinIO requires minimum credentials length (8+ characters for access key, 8+ for secret)
- PostgreSQL init.sql only runs on first volume initialization
- Nginx upstream must use Docker service name (`minio`) not localhost

### Potential Challenges
- **Port 5432 conflict**: PostgreSQL port may be used by local installation - use `POSTGRES_PORT` env var
- **Volume permissions**: MinIO may have permission issues on Linux - document `chown` if needed
- **DNS resolution**: Docker internal DNS requires service names match docker-compose service keys
- **Health check timing**: PostgreSQL may need longer startup time - use appropriate intervals

### ASCII Reminder
All output files must use ASCII-only characters (0-127). No Unicode quotes, dashes, or special characters in configuration files.

---

## 9. Testing Strategy

### Unit Tests
- N/A for infrastructure session (no application code)

### Integration Tests
- Health check script validates all service connectivity
- Curl commands test Nginx proxy behavior

### Manual Testing
1. Start stack with `docker-compose up -d`
2. Open MinIO Console at http://localhost:9001
3. Login with credentials from .env
4. Create a test bucket manually
5. Verify Nginx proxy at http://localhost:8080/minio/health/live
6. Test CORS with browser dev tools or curl
7. Verify cache headers with `curl -I`

### Edge Cases
- Stack restart after unclean shutdown (verify data persistence)
- Missing .env file (graceful error message)
- Port already in use (clear error messaging)

---

## 10. Dependencies

### External Libraries
- **Docker**: 20.10+ with Compose V2
- **MinIO**: minio/minio:latest
- **PostgreSQL**: postgres:16-alpine
- **Nginx**: nginx:1.25-alpine

### Other Sessions
- **Depends on**: `phase00-session01-asset-optimization` (assets ready for Session 03)
- **Depended by**: `phase00-session03-asset-deployment` (requires running stack to upload assets)

---

## 11. File Structure Preview

After this session, the project will have:

```
modern-resume-site/
├── docker-compose.yml
├── .env.example
├── .env                    # (gitignored, user creates from example)
├── .gitignore              # (updated)
├── docker/
│   ├── nginx/
│   │   ├── nginx.conf
│   │   └── conf.d/
│   │       └── default.conf
│   ├── postgres/
│   │   └── init.sql
│   └── minio/
│       └── policies/
│           └── public-read.json
├── scripts/
│   └── docker-health-check.sh
└── assets/
    └── optimized/          # (from Session 01)
```

---

## Next Steps

Run `/tasks` to generate the implementation task checklist.
