# Session 02: Docker Infrastructure

**Session ID**: `phase00-session02-docker-infrastructure`
**Status**: Not Started
**Estimated Tasks**: ~20-25
**Estimated Duration**: 2-3 hours

---

## Objective

Set up the self-hosted Docker stack with MinIO (S3-compatible storage), PostgreSQL (database), and Nginx (reverse proxy with caching) for local development and asset delivery.

---

## Scope

### In Scope (MVP)
- Create docker-compose.yml with MinIO, PostgreSQL, Nginx services
- Configure MinIO with appropriate bucket structure for frame sequences
- Configure PostgreSQL with initial database schema
- Configure Nginx as reverse proxy with caching headers
- Set up CORS headers for cross-origin asset loading
- Create .env.example with required environment variables
- Verify stack starts and services are healthy

### Out of Scope
- Uploading assets to MinIO (Session 03)
- Production SSL/TLS configuration
- Kubernetes or cloud deployment

---

## Prerequisites

- [ ] Docker and Docker Compose installed
- [ ] Ports 9000 (MinIO), 9001 (MinIO Console), 5432 (PostgreSQL), 80/8080 (Nginx) available
- [ ] Session 01 completed (optimized assets ready)

---

## Deliverables

1. `docker-compose.yml` with all services configured
2. `nginx/nginx.conf` with caching and CORS configuration
3. `.env.example` with documented environment variables
4. MinIO bucket structure (`hero-frames/`, `product-frames/`, `hero-frames-mobile/`, `product-frames-mobile/`)
5. PostgreSQL initial schema (if needed for metadata)
6. Health check scripts or documentation

---

## Success Criteria

- [ ] `docker-compose up -d` starts all services without errors
- [ ] MinIO accessible at localhost:9000/9001 with console login
- [ ] PostgreSQL accessible and accepting connections
- [ ] Nginx responding and forwarding requests correctly
- [ ] CORS headers configured for local development
- [ ] Cache headers set for static asset delivery (7-day cache)
- [ ] All services restart cleanly after `docker-compose down && up`
