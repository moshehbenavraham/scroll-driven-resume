# Environments

## Environment Overview

| Environment | URL | Purpose |
|-------------|-----|---------|
| Development | http://localhost:3000 | Local development |
| Production | TBD | Live site |

## Configuration Differences

| Config | Development | Production |
|--------|-------------|------------|
| Asset URL | http://localhost:8080/assets | CDN URL |
| Debug mode | Enabled | Disabled |
| Source maps | Enabled | Disabled |
| Minification | Disabled | Enabled |

## Environment Variables

### Required in All Environments

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_ASSET_BASE_URL` | Base URL for frame assets |

### Development Only

| Variable | Default | Description |
|----------|---------|-------------|
| `POSTGRES_PASSWORD` | (set in .env) | PostgreSQL password |
| `MINIO_ROOT_USER` | minioadmin | MinIO admin username |
| `MINIO_ROOT_PASSWORD` | (set in .env) | MinIO admin password |

### Production Only

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_ASSET_BASE_URL` | Production CDN URL |

## File Structure

```
.env              # Base config (committed, no secrets)
.env.local        # Local overrides (not committed)
.env.example      # Template with all variables
```

## Docker Services

| Service | Dev Port | Purpose |
|---------|----------|---------|
| postgres | 5432 | Metadata database |
| minio | 9000/9001 | Object storage for frames |
| nginx | 8080 | Caching proxy |
