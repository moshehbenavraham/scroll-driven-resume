# NEXT_SESSION.md

## Session Recommendation

**Generated**: 2025-12-21
**Project State**: Phase 00 - Foundation
**Completed Sessions**: 0

---

## Recommended Next Session

**Session ID**: `phase00-session01-asset-optimization`
**Session Name**: Asset Optimization
**Estimated Duration**: 2-3 hours
**Estimated Tasks**: 20-25

---

## Why This Session Next?

### Prerequisites Met
- [x] Source frame sequences available in `docs/media-assets/`
- [x] No prior sessions required - this is the starting point

### Dependencies
- **Builds on**: Nothing (first session)
- **Enables**: Session 02 (Docker Infrastructure), Session 03 (Asset Deployment), and all subsequent sessions

### Project Progression

This session is **explicitly marked as a blocker** in the PRD:

> "Asset Optimization (Blocker - Must Complete First)"

The PRD states that optimized assets must be uploaded to MinIO **before development proceeds**. The current hero sequence is 23MB (target: <10MB) and the product sequence is 22MB (target: <10MB). No other session can proceed until these assets are optimized because:

1. Session 02 (Docker Infrastructure) prepares buckets for these assets
2. Session 03 (Asset Deployment) uploads the optimized assets
3. Session 04+ cannot configure asset URLs without knowing final optimized structure

---

## Session Overview

### Objective
Optimize hero and product frame sequences to meet size targets (<10MB each) and create mobile variants (<5MB each) while maintaining visual quality.

### Key Deliverables
1. Optimized hero frame sequence (192 frames) at <10MB total
2. Optimized product frame sequence (144 frames) at <10MB total
3. Mobile hero variant (720p) at <5MB total
4. Mobile product variant (720p) at <5MB total
5. Optimization report documenting final sizes and quality settings

### Scope Summary
- **In Scope (MVP)**: Re-encode all frames at 70-75% WebP quality, create 720p mobile variants, verify size targets, maintain naming convention
- **Out of Scope**: Frame decimation (only if quality approach fails), uploading to MinIO (Session 03), format conversion

---

## Technical Considerations

### Technologies/Patterns
- **cwebp CLI** - Google's WebP encoder for batch processing
- **ImageMagick** - Alternative for resizing and format conversion
- **Bash scripting** - Batch processing automation

### Potential Challenges
- **Quality vs Size tradeoff**: 70-75% quality may show visible artifacts on some frames
- **Mobile resolution choice**: 720p may be too aggressive; may need 900p fallback
- **Processing time**: 336 total frames (192 + 144) x 4 variants = 1344 output frames

---

## Alternative Sessions

If this session is blocked:
1. **Session 02 (Docker Infrastructure)** - Could be started in parallel if assets exist but optimization is in progress; however, this breaks the recommended sequential flow
2. **Session 04 (Next.js Bootstrap)** - Pure project setup with no asset dependencies; could start if you want to establish codebase structure first

**Note**: Both alternatives are suboptimal. Session 01 is the designated blocker and should be completed first for proper project progression.

---

## Next Steps

Run `/sessionspec` to generate the formal specification.
