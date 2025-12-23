# Session Specification

**Session ID**: `phase00-session03-asset-deployment`
**Phase**: 00 - Foundation
**Status**: Not Started
**Created**: 2025-12-21

---

## 1. Session Overview

This session connects the optimized frame assets from Session 01 to the Docker infrastructure from Session 02 by uploading all frames to MinIO object storage and verifying CDN-like delivery through the Nginx caching proxy.

The portfolio's scroll-synchronized animation requires fast, reliable access to 672 WebP frame images (336 desktop + 336 mobile variants across hero and product sequences). MinIO provides S3-compatible object storage while Nginx adds a caching layer with 7-day TTL, CORS headers for cross-origin loading, and proper Content-Type headers for WebP images.

Completing this session establishes the complete asset delivery pipeline, enabling Session 04 (Next.js Bootstrap) to configure environment variables with known asset URLs and begin frontend development with actual frame data.

---

## 2. Objectives

1. Upload all 672 optimized frame images to MinIO with organized bucket structure
2. Configure MinIO bucket policies for anonymous public read access
3. Verify Nginx cache headers, CORS, and Content-Type are correctly applied
4. Test frame loading performance (target: first frame < 500ms on simulated 4G)
5. Document asset URL patterns for frontend consumption

---

## 3. Prerequisites

### Required Sessions
- [x] `phase00-session01-asset-optimization` - Provides optimized frames in `docs/media-assets-optimized/`
- [x] `phase00-session02-docker-infrastructure` - Provides MinIO + Nginx stack via Docker Compose

### Required Tools/Knowledge
- MinIO CLI (`mc`) for bucket management and file uploads
- `curl` for HTTP header verification
- Basic understanding of S3-compatible object storage

### Environment Requirements
- Docker and Docker Compose installed and running
- Docker stack started: `docker compose up -d`
- Ports available: 9000 (MinIO API), 9001 (MinIO Console), 8080 (Nginx)

---

## 4. Scope

### In Scope (MVP)
- Create MinIO buckets for desktop and mobile frame variants
- Upload hero frames (192 desktop + 192 mobile = 384 files)
- Upload product frames (144 desktop + 144 mobile = 288 files)
- Configure anonymous read policy on all buckets
- Verify Nginx proxy caching is working (X-Cache-Status header)
- Verify CORS headers allow localhost:3017 origin
- Verify Content-Type: image/webp on all frame responses
- Test first-frame load time on throttled connection
- Create asset URL documentation

### Out of Scope (Deferred)
- CDN configuration (CloudFront, Cloudflare) - *Reason: Production deployment scope*
- Production domain setup - *Reason: Not needed for local development*
- Cache busting/versioning strategies - *Reason: Static assets, no updates expected*
- HTTPS configuration - *Reason: Local development uses HTTP*
- Frame preloading logic - *Reason: Frontend implementation scope (Session 04+)*

---

## 5. Technical Approach

### Architecture

```
docs/media-assets-optimized/
  |-- hero-frames/*.webp (192 files, 7.42MB)
  |-- hero-frames-mobile/*.webp (192 files, 3.74MB)
  |-- product-frames/*.webp (144 files, 9.63MB)
  |-- product-frames-mobile/*.webp (144 files, 4.73MB)
        |
        v [mc cp --recursive]
MinIO (localhost:9000)
  |-- frames-desktop/
  |     |-- hero/frame_0001.webp ... frame_0192.webp
  |     |-- product/frame_0001.webp ... frame_0144.webp
  |-- frames-mobile/
        |-- hero/frame_0001.webp ... frame_0192.webp
        |-- product/frame_0001.webp ... frame_0144.webp
        |
        v [proxy_pass + cache]
Nginx (localhost:8089)
  |-- /assets/frames-desktop/hero/frame_0001.webp
  |-- /assets/frames-mobile/product/frame_0144.webp
        |
        v [fetch]
Next.js (localhost:3017) [Session 04+]
```

### Design Patterns
- **Bucket-per-device**: Separate `frames-desktop` and `frames-mobile` buckets for clean URL patterns
- **Subfolder-per-sequence**: `hero/` and `product/` subfolders within each bucket
- **Anonymous read policy**: Public access without authentication for performance

### Technology Stack
- MinIO CLI (`mc`) for uploads and policy configuration
- Nginx 1.25 with proxy_cache for CDN-like caching
- curl/httpie for verification
- Chrome DevTools for throttled performance testing

---

## 6. Deliverables

### Files to Create
| File | Purpose | Est. Lines |
|------|---------|------------|
| `scripts/upload-to-minio.sh` | Batch upload script with progress | ~80 |
| `scripts/verify-assets.sh` | Verification script for headers/access | ~60 |
| `docs/ASSET_URLS.md` | URL patterns and usage documentation | ~50 |

### Files to Modify
| File | Changes | Est. Lines |
|------|---------|------------|
| None | N/A - infrastructure already configured | 0 |

### MinIO Configuration
| Item | Details |
|------|---------|
| Bucket: `frames-desktop` | Contains hero/ and product/ subfolders |
| Bucket: `frames-mobile` | Contains hero/ and product/ subfolders |
| Policy | Anonymous download (public read) |
| Total files | 672 WebP images |
| Total size | ~25.52MB |

---

## 7. Success Criteria

### Functional Requirements
- [ ] All 192 hero desktop frames accessible at `/assets/frames-desktop/hero/frame_NNNN.webp`
- [ ] All 192 hero mobile frames accessible at `/assets/frames-mobile/hero/frame_NNNN.webp`
- [ ] All 144 product desktop frames accessible at `/assets/frames-desktop/product/frame_NNNN.webp`
- [ ] All 144 product mobile frames accessible at `/assets/frames-mobile/product/frame_NNNN.webp`
- [ ] No 404 errors when accessing any frame (verified by script)
- [ ] First frame loads in < 500ms on simulated 4G (1.5 Mbps)

### Header Requirements
- [ ] `Content-Type: image/webp` on all frame responses
- [ ] `Cache-Control: public, max-age=604800, immutable` present
- [ ] `X-Cache-Status` header present (MISS on first request, HIT on subsequent)
- [ ] `Access-Control-Allow-Origin: http://localhost:3017` present

### Testing Requirements
- [ ] Verification script runs without errors
- [ ] Manual spot-check of 4 frames (first/last of each sequence)

### Quality Gates
- [ ] All scripts use ASCII-only characters (0-127)
- [ ] Unix LF line endings in all created files
- [ ] Scripts are executable and documented

---

## 8. Implementation Notes

### Key Considerations
- MinIO credentials from `.env`: `MINIO_ROOT_USER=minioadmin`, `MINIO_ROOT_PASSWORD=minioadmin123`
- Upload script should show progress for 672 files
- Verification should test representative samples, not all 672 files

### Bucket Policy JSON
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {"AWS": ["*"]},
      "Action": ["s3:GetObject"],
      "Resource": ["arn:aws:s3:::frames-desktop/*", "arn:aws:s3:::frames-mobile/*"]
    }
  ]
}
```

### Potential Challenges
- **Large file count**: 672 files may take several minutes to upload; use `mc cp --recursive` with parallelism
- **Port conflicts**: Ensure ports 9000, 9001, 8080 are not in use by other services
- **Docker networking**: Container-to-container communication uses service names (`minio:9000`), not localhost

### ASCII Reminder
All output files must use ASCII-only characters (0-127). No smart quotes, em-dashes, or non-ASCII symbols in scripts.

---

## 9. Testing Strategy

### Unit Tests
- N/A (shell scripts, not application code)

### Integration Tests
- Verification script tests MinIO -> Nginx -> Client pipeline

### Manual Testing
1. Open MinIO Console at `http://localhost:9001`
2. Verify buckets `frames-desktop` and `frames-mobile` exist with correct file counts
3. Load `http://localhost:8089/assets/frames-desktop/hero/frame_0001.webp` in browser
4. Verify image displays correctly
5. Refresh and check Network tab for `X-Cache-Status: HIT`

### Edge Cases
- First frame vs middle frame vs last frame
- Desktop vs mobile variant URLs
- Cache MISS vs HIT behavior
- Parallel requests to same frame

### Performance Testing
1. Open Chrome DevTools > Network > Throttling > Slow 3G or custom 1.5 Mbps
2. Clear cache and navigate to first frame URL
3. Measure load time (target: < 500ms for ~40KB frame)

---

## 10. Dependencies

### External Tools
- MinIO CLI (`mc`): Install via `brew install minio/stable/mc` or download from minio.io
- curl: Standard on Linux/macOS
- Docker Compose v2+

### Other Sessions
- **Depends on**:
  - `phase00-session01-asset-optimization` (optimized frames)
  - `phase00-session02-docker-infrastructure` (Docker stack)
- **Depended by**:
  - `phase00-session04-nextjs-bootstrap` (needs asset URLs for environment config)
  - All future sessions requiring frame assets

---

## 11. URL Reference

### Asset URL Patterns
```
Base URL: http://localhost:8089

Desktop Hero:    /assets/frames-desktop/hero/frame_NNNN.webp
Desktop Product: /assets/frames-desktop/product/frame_NNNN.webp
Mobile Hero:     /assets/frames-mobile/hero/frame_NNNN.webp
Mobile Product:  /assets/frames-mobile/product/frame_NNNN.webp

Where NNNN = 0001 to 0192 (hero) or 0001 to 0144 (product)
```

### Example URLs
```
http://localhost:8089/assets/frames-desktop/hero/frame_0001.webp
http://localhost:8089/assets/frames-desktop/hero/frame_0192.webp
http://localhost:8089/assets/frames-desktop/product/frame_0001.webp
http://localhost:8089/assets/frames-desktop/product/frame_0144.webp
http://localhost:8089/assets/frames-mobile/hero/frame_0096.webp
http://localhost:8089/assets/frames-mobile/product/frame_0072.webp
```

---

## Next Steps

Run `/tasks` to generate the implementation task checklist.
