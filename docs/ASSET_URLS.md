# Asset URL Reference

This document describes the URL patterns for accessing optimized frame assets through the Nginx caching proxy.

## Base Configuration

| Setting | Value |
|---------|-------|
| Asset Server | http://localhost:8080 |
| Assets Prefix | /assets |
| Image Format | WebP |
| Cache TTL | 7 days (604800 seconds) |

## URL Patterns

### Desktop Frames

**Hero Sequence** (192 frames)
```
http://localhost:8080/assets/frames-desktop/hero/frame_NNNN.webp
```
Where `NNNN` = 0001 to 0192

**Product Sequence** (144 frames)
```
http://localhost:8080/assets/frames-desktop/product/frame_NNNN.webp
```
Where `NNNN` = 0001 to 0144

### Mobile Frames

**Hero Sequence** (192 frames)
```
http://localhost:8080/assets/frames-mobile/hero/frame_NNNN.webp
```
Where `NNNN` = 0001 to 0192

**Product Sequence** (144 frames)
```
http://localhost:8080/assets/frames-mobile/product/frame_NNNN.webp
```
Where `NNNN` = 0001 to 0144

## Frame Counts

| Sequence | Desktop | Mobile | Total |
|----------|---------|--------|-------|
| Hero | 192 | 192 | 384 |
| Product | 144 | 144 | 288 |
| **Total** | **336** | **336** | **672** |

## Response Headers

All frame requests return the following headers:

| Header | Value |
|--------|-------|
| Content-Type | image/webp |
| Cache-Control | public, max-age=604800, immutable |
| X-Cache-Status | MISS (first request) or HIT (cached) |
| Access-Control-Allow-Origin | http://localhost:3000 |

## Example URLs

```bash
# First desktop hero frame
curl -I http://localhost:8080/assets/frames-desktop/hero/frame_0001.webp

# Last desktop hero frame
curl -I http://localhost:8080/assets/frames-desktop/hero/frame_0192.webp

# First mobile product frame
curl -I http://localhost:8080/assets/frames-mobile/product/frame_0001.webp

# Last mobile product frame
curl -I http://localhost:8080/assets/frames-mobile/product/frame_0144.webp
```

## Frontend Integration

### Environment Variables

Add to `.env.local` for Next.js:

```env
NEXT_PUBLIC_ASSET_BASE_URL=http://localhost:8080/assets
```

### TypeScript Constants

```typescript
const ASSET_BASE = process.env.NEXT_PUBLIC_ASSET_BASE_URL;

const FRAME_URLS = {
  desktop: {
    hero: (n: number) => `${ASSET_BASE}/frames-desktop/hero/frame_${String(n).padStart(4, '0')}.webp`,
    product: (n: number) => `${ASSET_BASE}/frames-desktop/product/frame_${String(n).padStart(4, '0')}.webp`,
  },
  mobile: {
    hero: (n: number) => `${ASSET_BASE}/frames-mobile/hero/frame_${String(n).padStart(4, '0')}.webp`,
    product: (n: number) => `${ASSET_BASE}/frames-mobile/product/frame_${String(n).padStart(4, '0')}.webp`,
  },
};

// Usage
const frame = FRAME_URLS.desktop.hero(1);
// => "http://localhost:8080/assets/frames-desktop/hero/frame_0001.webp"
```

### Frame Preloading

```typescript
// Preload first N frames for smooth animation start
async function preloadFrames(urls: string[], count: number): Promise<void> {
  const promises = urls.slice(0, count).map(url => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = url;
    });
  });
  await Promise.all(promises);
}
```

## Storage Architecture

```
MinIO (localhost:9000)
  |-- frames-desktop/
  |     |-- hero/frame_0001.webp ... frame_0192.webp
  |     |-- product/frame_0001.webp ... frame_0144.webp
  |-- frames-mobile/
        |-- hero/frame_0001.webp ... frame_0192.webp
        |-- product/frame_0001.webp ... frame_0144.webp
        |
        v [Nginx proxy_pass + cache]
Nginx (localhost:8080)
  |-- /assets/* -> MinIO with 7-day cache
```

## Troubleshooting

### 404 Not Found
- Verify Docker stack is running: `docker compose ps`
- Check MinIO console: http://localhost:9001
- Verify bucket contents: `mc ls local/frames-desktop/hero/`

### CORS Errors
- Ensure requesting from http://localhost:3000
- Check Nginx CORS configuration in docker/nginx/nginx.conf

### Cache Issues
- Clear Nginx cache: `docker compose restart nginx`
- Check X-Cache-Status header for HIT/MISS status

### Slow Loading
- First requests may be MISS (not cached)
- Subsequent requests should be HIT (cached)
- Target: < 500ms on simulated 4G for ~40KB frames
