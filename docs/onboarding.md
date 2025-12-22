# Onboarding

Zero-to-hero setup for new developers.

## Prerequisites

- [ ] Node.js 20+ installed
- [ ] Docker and Docker Compose installed
- [ ] Git configured

## Setup Steps

### 1. Clone Repository

```bash
git clone <repo-url>
cd modern-resume-site
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
cp .env.example .env.local
```

### 4. Required Environment Variables

| Variable | Description |
|----------|-------------|
| `POSTGRES_PASSWORD` | PostgreSQL password |
| `MINIO_ROOT_USER` | MinIO admin username |
| `MINIO_ROOT_PASSWORD` | MinIO admin password |
| `NEXT_PUBLIC_ASSET_BASE_URL` | Asset server URL (http://localhost:8080/assets) |

### 5. Start Docker Infrastructure

```bash
docker compose up -d
```

Verify containers are running:

```bash
docker compose ps
```

### 6. Start Development Server

```bash
npm run dev
```

### 7. Verify Setup

- [ ] App runs at http://localhost:3000
- [ ] MinIO console accessible at http://localhost:9001
- [ ] Tests pass: `npm test`
- [ ] Linting passes: `npm run lint`

## Common Issues

### Docker containers not starting
Ensure Docker daemon is running. Check logs with `docker compose logs`.

### Port conflicts
Default ports: 3000 (Next.js), 8080 (Nginx), 9000/9001 (MinIO), 5432 (PostgreSQL). Adjust in `docker-compose.yml` if needed.

### Asset loading errors
Verify MinIO buckets exist and contain frame files. Check CORS settings in Nginx config.
