# Session 03: Asset Deployment

**Session ID**: `phase00-session03-asset-deployment`
**Status**: Not Started
**Estimated Tasks**: ~15-20
**Estimated Duration**: 2-3 hours

---

## Objective

Upload all optimized frame sequences to MinIO and verify CDN-like delivery through Nginx with proper caching and performance.

---

## Scope

### In Scope (MVP)
- Upload hero frames (desktop + mobile) to MinIO buckets
- Upload product frames (desktop + mobile) to MinIO buckets
- Configure MinIO bucket policies for public read access
- Verify Nginx cache headers are applied correctly
- Test frame loading performance (target: first frame < 500ms on 4G)
- Document asset URLs and access patterns

### Out of Scope
- CDN configuration (CloudFront, Cloudflare)
- Production domain setup
- Asset versioning or cache busting strategies

---

## Prerequisites

- [ ] Session 01 completed (optimized assets available)
- [ ] Session 02 completed (Docker stack running)
- [ ] MinIO CLI (mc) or equivalent upload tool available

---

## Deliverables

1. All optimized frames uploaded to MinIO buckets
2. Bucket policies configured for public read access
3. Asset URL documentation with access patterns
4. Performance test results (loading times)
5. Verification script or checklist for asset delivery

---

## Success Criteria

- [ ] All 192 hero frames accessible via Nginx
- [ ] All 144 product frames accessible via Nginx
- [ ] Mobile variants accessible in separate paths
- [ ] Cache headers verified (7-day cache, proper Content-Type)
- [ ] CORS working for cross-origin requests
- [ ] First frame loads in < 500ms (simulated 4G)
- [ ] No 404 errors when accessing frame sequences
