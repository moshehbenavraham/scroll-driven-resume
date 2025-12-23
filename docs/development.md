# Development Guide

## Local Environment

### Required Tools

- Node.js 20+
- Docker and Docker Compose
- npm 10+

### Port Mappings

| Service | Port | URL |
|---------|------|-----|
| Next.js | 3017 | http://localhost:3017 |
| Nginx (assets) | 8089 | http://localhost:8089 |
| MinIO API | 9000 | http://localhost:9000 |
| MinIO Console | 9001 | http://localhost:9001 |
| PostgreSQL | 5442 | localhost:5442 |

## Dev Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Production build |
| `npm run lint` | ESLint check |
| `npm run lint:fix` | ESLint auto-fix |
| `npm run type-check` | TypeScript check |
| `npm run format` | Prettier format |
| `npm run format:check` | Prettier check |
| `npm test` | Run Vitest |
| `npm run test:watch` | Vitest watch mode |
| `npm run test:coverage` | Vitest with coverage |

## Development Workflow

1. Start Docker stack: `docker compose up -d`
2. Start dev server: `npm run dev`
3. Make changes
4. Run checks: `npm run lint && npm run type-check`
5. Run tests: `npm test`
6. Commit with conventional commit message

## Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage
```

Coverage reports are generated in `coverage/` directory.

## Debugging

### Frame animation not working
1. Check MinIO console for frame files
2. Verify asset URLs in browser Network tab
3. Check browser console for CORS errors

### WebGL/Three.js issues
1. Verify WebGL support: `about:gpu` in Chrome
2. Check R3F canvas wrapper for errors
3. Disable hardware acceleration to isolate GPU issues

### Build errors
1. Run `npm run type-check` for TypeScript issues
2. Check ESLint: `npm run lint`
3. Clear Next.js cache: `rm -rf .next`
