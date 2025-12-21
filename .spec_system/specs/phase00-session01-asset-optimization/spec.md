# Session Specification

**Session ID**: `phase00-session01-asset-optimization`
**Phase**: 00 - Foundation
**Status**: Not Started
**Created**: 2025-12-21

---

## 1. Session Overview

This session tackles the critical blocker for the Modern Resume Site project: optimizing the pre-generated frame sequences to meet storage and performance targets. The hero portrait sequence (192 frames at 1920x1088, totaling 23MB) and product burst sequence (144 frames at 1920x1080, totaling 22MB) both exceed the 10MB target by more than double.

The optimization strategy focuses on WebP quality reduction (70-75%) as the primary approach, followed by resolution scaling to create 720p mobile variants. This preserves the full frame count and animation smoothness while dramatically reducing file sizes. The PRD explicitly marks this as a blocker - no development work on the Next.js application or Docker infrastructure should proceed until assets are optimized and ready for deployment.

Success here enables the entire project pipeline: optimized assets flow into MinIO storage (Session 02-03), which then feeds the scroll-synchronized frame animation system in the Next.js application. Quality and size must be balanced carefully - visible compression artifacts would undermine the "premium, cinematic" experience the portfolio aims to deliver.

---

## 2. Objectives

1. Reduce hero frame sequence from 23MB to under 10MB while maintaining visual quality at 70-75% WebP encoding
2. Reduce product frame sequence from 22MB to under 10MB while maintaining visual quality at 70-75% WebP encoding
3. Create 720p mobile variants for both sequences, each under 5MB total
4. Document optimization results with before/after metrics and quality assessment

---

## 3. Prerequisites

### Required Sessions
- [x] None - this is the first session (designated blocker)

### Required Tools/Knowledge
- [x] `cwebp` CLI v1.3.2 (verified installed)
- [x] ImageMagick v6.9.12 (verified installed)
- [x] Bash scripting for batch processing
- [x] Understanding of WebP quality parameters and lossy compression tradeoffs

### Environment Requirements
- [x] Source frames available at `docs/media-assets/hero-frames/` (192 frames, 23MB)
- [x] Source frames available at `docs/media-assets/product-frames/` (144 frames, 22MB)
- [x] Sufficient disk space for output (~50MB for all variants during processing)

---

## 4. Scope

### In Scope (MVP)
- Re-encode all hero frames (192) at 70-75% WebP quality
- Re-encode all product frames (144) at 70-75% WebP quality
- Resize and encode 720p mobile variants for hero sequence
- Resize and encode 720p mobile variants for product sequence
- Maintain zero-padded naming convention (`frame_NNNN.webp`)
- Create output directory structure for optimized assets
- Generate optimization report with size comparisons
- Visual quality spot-check on key frames (first, middle, last)

### Out of Scope (Deferred)
- Frame decimation (reducing frame count) - *Reason: Only if quality approach fails to meet targets*
- Uploading to MinIO - *Reason: Session 03 handles asset deployment*
- Alternative format conversion (AVIF, JPEG XL) - *Reason: WebP is the target format per PRD*
- Automated quality assessment tooling - *Reason: Manual spot-check sufficient for MVP*

---

## 5. Technical Approach

### Architecture

```
docs/media-assets/
  hero-frames/           # Source: 192 frames, 1920x1088, 23MB
  product-frames/        # Source: 144 frames, 1920x1080, 22MB

docs/media-assets-optimized/
  hero-frames/           # Output: 192 frames, 1920x1088, <10MB (desktop)
  hero-frames-mobile/    # Output: 192 frames, 1280x720,  <5MB  (mobile)
  product-frames/        # Output: 144 frames, 1920x1080, <10MB (desktop)
  product-frames-mobile/ # Output: 144 frames, 1280x720,  <5MB  (mobile)
```

### Design Patterns
- **Batch Processing**: Shell script iterating over frame sequences with progress reporting
- **Non-Destructive**: Original frames preserved, optimized frames in separate directory
- **Incremental Testing**: Test quality on single frame before full batch processing

### Technology Stack
- `cwebp` 1.3.2 - Primary WebP encoder with `-q` quality parameter
- ImageMagick 6.9.12 - Resolution scaling via `convert -resize`
- Bash - Batch processing orchestration with `for` loops and progress output

### Encoding Strategy

| Variant | Resolution | Quality | Target Size | Est. Per-Frame |
|---------|------------|---------|-------------|----------------|
| Hero Desktop | 1920x1088 | 72% | <10MB | ~52KB |
| Hero Mobile | 1280x725 | 72% | <5MB | ~26KB |
| Product Desktop | 1920x1080 | 72% | <10MB | ~69KB |
| Product Mobile | 1280x720 | 72% | <5MB | ~35KB |

---

## 6. Deliverables

### Files to Create
| File | Purpose | Est. Size |
|------|---------|-----------|
| `docs/media-assets-optimized/hero-frames/*.webp` | Desktop hero frames (192) | <10MB total |
| `docs/media-assets-optimized/hero-frames-mobile/*.webp` | Mobile hero frames (192) | <5MB total |
| `docs/media-assets-optimized/product-frames/*.webp` | Desktop product frames (144) | <10MB total |
| `docs/media-assets-optimized/product-frames-mobile/*.webp` | Mobile product frames (144) | <5MB total |
| `scripts/optimize-frames.sh` | Batch optimization script | ~100 lines |
| `docs/OPTIMIZATION_REPORT.md` | Before/after metrics | ~50 lines |

### Files to Modify
| File | Changes | Est. Lines |
|------|---------|------------|
| None | N/A | N/A |

---

## 7. Success Criteria

### Functional Requirements
- [ ] Hero desktop sequence total size < 10MB
- [ ] Hero mobile sequence total size < 5MB
- [ ] Product desktop sequence total size < 10MB
- [ ] Product mobile sequence total size < 5MB
- [ ] All 192 hero frames present in each output directory
- [ ] All 144 product frames present in each output directory
- [ ] Naming convention maintained: `frame_NNNN.webp` (zero-padded 4 digits)

### Quality Requirements
- [ ] No visible banding or blocking artifacts on spot-checked frames
- [ ] Color accuracy maintained (no significant color shift)
- [ ] Key frames pass visual inspection: frame_0001, frame_0096, frame_0192 (hero)
- [ ] Key frames pass visual inspection: frame_0001, frame_0072, frame_0144 (product)

### Quality Gates
- [ ] All output files are valid WebP format (cwebp validates)
- [ ] No zero-byte or corrupted output files
- [ ] Original source frames remain unmodified
- [ ] Optimization report documents all metrics

---

## 8. Implementation Notes

### Key Considerations
- Start with 72% quality as baseline; adjust up (75%) if size permits or down (70%) if needed
- Hero frames have slight non-standard height (1088 vs 1080) - maintain aspect ratio on mobile resize
- Mobile 720p means 1280x720 for product, calculate proportional height (725) for hero
- Process one sequence fully before moving to next to catch issues early

### Potential Challenges
- **Quality degradation**: If 70-75% shows visible artifacts, may need 78-80% and accept larger sizes
- **Processing time**: 672 total output frames; estimate 2-3 seconds per frame = 20-35 minutes total
- **Disk space during processing**: Need ~50MB free for intermediate outputs

### Mitigation Strategies
- Test single frame at multiple quality levels before batch processing
- Run encoding in parallel if needed (4-8 concurrent processes)
- Monitor disk space and clean up incrementally if needed

### ASCII Reminder
All output files must use ASCII-only characters (0-127). This primarily affects the documentation and script files.

---

## 9. Testing Strategy

### Unit Tests
- N/A - shell script, not application code

### Integration Tests
- N/A - no integration with other systems yet

### Manual Testing
- [ ] Open 3 sample frames from each output directory in image viewer
- [ ] Compare side-by-side with source frames for quality assessment
- [ ] Verify frame count matches expected (192 hero, 144 product)
- [ ] Verify total directory sizes meet targets

### Edge Cases
- First frame (may have different compression characteristics)
- Last frame (may have different compression characteristics)
- Highest-motion frames (mid-sequence where most change occurs)
- Frames with fine detail (text, edges, gradients)

---

## 10. Dependencies

### External Libraries
- `cwebp` v1.3.2 (libwebp) - WebP encoding
- ImageMagick v6.9.12 - Image resizing

### Other Sessions
- **Depends on**: None (this is the blocker session)
- **Depended by**:
  - Session 02 (Docker Infrastructure) - needs to know optimized asset structure
  - Session 03 (Asset Deployment) - uploads these optimized assets to MinIO
  - All subsequent sessions - application requires optimized assets

---

## 11. Output Directory Structure

```
docs/media-assets-optimized/
  hero-frames/
    frame_0001.webp
    frame_0002.webp
    ...
    frame_0192.webp
  hero-frames-mobile/
    frame_0001.webp
    frame_0002.webp
    ...
    frame_0192.webp
  product-frames/
    frame_0001.webp
    frame_0002.webp
    ...
    frame_0144.webp
  product-frames-mobile/
    frame_0001.webp
    frame_0002.webp
    ...
    frame_0144.webp
```

---

## Next Steps

Run `/tasks` to generate the implementation task checklist.
