# Session 01: Asset Optimization

**Session ID**: `phase00-session01-asset-optimization`
**Status**: Not Started
**Estimated Tasks**: ~20-25
**Estimated Duration**: 2-3 hours

---

## Objective

Optimize hero and product frame sequences to meet size targets (<10MB each) and create mobile variants (<5MB each) while maintaining visual quality.

---

## Scope

### In Scope (MVP)
- Re-encode hero frames (192 WebP) at 70-75% quality
- Re-encode product frames (144 WebP) at 70-75% quality
- Create 720p mobile variants for both sequences
- Verify each sequence is under target size limits
- Maintain zero-padded naming convention (frame_NNNN.webp)
- Test visual quality at reduced encoding

### Out of Scope
- Frame decimation (reducing frame count) - only if quality approach fails
- Uploading to MinIO (Session 03)
- WebP to alternative format conversion

---

## Prerequisites

- [ ] Source frame sequences available in `docs/media-assets/hero-frames/` and `docs/media-assets/product-frames/`
- [ ] ImageMagick or cwebp CLI tools installed for batch processing
- [ ] Sufficient disk space for optimized outputs

---

## Deliverables

1. Optimized hero frame sequence (192 frames) at <10MB total
2. Optimized product frame sequence (144 frames) at <10MB total
3. Mobile hero variant (720p) at <5MB total
4. Mobile product variant (720p) at <5MB total
5. Optimization report documenting final sizes and quality settings

---

## Success Criteria

- [ ] Hero sequence total size < 10MB
- [ ] Product sequence total size < 10MB
- [ ] Mobile hero variant < 5MB
- [ ] Mobile product variant < 5MB
- [ ] Visual quality acceptable at 70-75% encoding (no visible artifacts)
- [ ] All frames maintain consistent naming convention
- [ ] Optimization report created with before/after metrics
