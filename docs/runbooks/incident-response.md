# Incident Response

## Severity Levels

| Level | Description | Response Time |
|-------|-------------|---------------|
| P0 | Complete outage | Immediate |
| P1 | Major feature broken (animations, asset loading) | < 1 hour |
| P2 | Minor feature broken (decorative effects) | < 4 hours |
| P3 | Cosmetic/minor | Next business day |

## On-Call Contacts

| Role | Contact |
|------|---------|
| Primary | [Owner] |

## Common Incidents

### Asset Loading Failure

**Symptoms**: Frames not displaying, loading stuck

**Resolution**:
1. Check MinIO status: `docker compose ps`
2. Verify Nginx proxy: `curl http://localhost:8080/assets/frames-desktop/hero/frame_0001.webp`
3. Check CORS headers in browser Network tab
4. Restart Docker stack: `docker compose restart`

### Build/Deploy Failure

**Symptoms**: Deployment fails, site down

**Resolution**:
1. Check Vercel build logs
2. Run locally: `npm run build`
3. Check TypeScript: `npm run type-check`
4. Rollback via Vercel dashboard if needed

### WebGL Rendering Issues

**Symptoms**: Black canvas, GPU errors in console

**Resolution**:
1. Check browser WebGL support: `about:gpu` (Chrome)
2. Verify Three.js components in browser DevTools
3. Test with `prefers-reduced-motion` enabled
4. Check for R3F canvas wrapper errors

### Docker Infrastructure Down

**Symptoms**: Asset URLs 404, MinIO console inaccessible

**Resolution**:
1. Check Docker daemon: `docker info`
2. View container logs: `docker compose logs`
3. Restart stack: `docker compose down && docker compose up -d`
4. Verify ports: 8080 (Nginx), 9000/9001 (MinIO), 5432 (PostgreSQL)
