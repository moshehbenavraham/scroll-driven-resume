# Task Checklist

**Session ID**: `phase00-session03-asset-deployment`
**Total Tasks**: 22
**Estimated Duration**: 7-9 hours
**Created**: 2025-12-21

---

## Legend

- `[x]` = Completed
- `[ ]` = Pending
- `[P]` = Parallelizable (can run with other [P] tasks)
- `[S0003]` = Session reference (Phase 00, Session 03)
- `TNNN` = Task ID

---

## Progress Summary

| Category | Total | Done | Remaining |
|----------|-------|------|-----------|
| Setup | 4 | 4 | 0 |
| Foundation | 5 | 5 | 0 |
| Implementation | 9 | 9 | 0 |
| Testing | 4 | 4 | 0 |
| **Total** | **22** | **22** | **0** |

---

## Setup (4 tasks)

Initial configuration and environment preparation.

- [x] T001 [S0003] Verify Docker stack is running (docker compose ps)
- [x] T002 [S0003] Verify optimized frame assets exist in `docs/media-assets-optimized/`
- [x] T003 [S0003] Install or verify MinIO CLI (mc) is available
- [x] T004 [S0003] Ensure scripts directory exists (`scripts/`)

---

## Foundation (5 tasks)

Core MinIO configuration and bucket setup.

- [x] T005 [S0003] Configure mc alias for local MinIO (`scripts/upload-to-minio.sh`)
- [x] T006 [S0003] [P] Create `frames-desktop` bucket in MinIO
- [x] T007 [S0003] [P] Create `frames-mobile` bucket in MinIO
- [x] T008 [S0003] [P] Set anonymous read policy on `frames-desktop` bucket
- [x] T009 [S0003] [P] Set anonymous read policy on `frames-mobile` bucket

---

## Implementation (9 tasks)

Script development and asset deployment.

- [x] T010 [S0003] Create upload-to-minio.sh script structure (`scripts/upload-to-minio.sh`)
- [x] T011 [S0003] Add hero desktop frame upload logic (192 files to frames-desktop/hero/)
- [x] T012 [S0003] Add hero mobile frame upload logic (192 files to frames-mobile/hero/)
- [x] T013 [S0003] Add product desktop frame upload logic (144 files to frames-desktop/product/)
- [x] T014 [S0003] Add product mobile frame upload logic (144 files to frames-mobile/product/)
- [x] T015 [S0003] Execute upload script and upload all 672 frames to MinIO
- [x] T016 [S0003] Create verify-assets.sh script (`scripts/verify-assets.sh`)
- [x] T017 [S0003] Add header verification: Content-Type, Cache-Control, CORS, X-Cache-Status
- [x] T018 [S0003] Create ASSET_URLS.md documentation (`docs/ASSET_URLS.md`)

---

## Testing (4 tasks)

Verification and quality assurance.

- [x] T019 [S0003] Run verify-assets.sh and confirm all checks pass
- [x] T020 [S0003] Manual spot-check: load 4 sample frames in browser (first/last of each sequence)
- [x] T021 [S0003] Validate ASCII encoding on all created files (scripts + docs)
- [x] T022 [S0003] Performance test: verify first frame load < 500ms on throttled 4G

---

## Completion Checklist

Before marking session complete:

- [x] All tasks marked `[x]`
- [x] All 672 frames accessible via Nginx proxy
- [x] Verification script passes without errors
- [x] All files ASCII-encoded with Unix LF line endings
- [x] implementation-notes.md updated
- [x] Ready for `/validate`

---

## Notes

### Parallelization
Tasks T006-T009 can be run in parallel as bucket creation and policy setup are independent operations.

### Task Timing
Target ~20-25 minutes per task. Upload task (T015) may take longer due to 672 file transfers.

### Dependencies
- T005 must complete before T006-T009 (need mc alias configured)
- T010-T014 must complete before T015 (script must be ready before execution)
- T015 must complete before T016-T022 (need assets deployed for verification)

### MinIO Credentials
```
MINIO_ROOT_USER: minioadmin
MINIO_ROOT_PASSWORD: minioadmin123
API Endpoint: http://localhost:9000
Console: http://localhost:9001
```

### Expected URL Patterns
```
Desktop Hero:    http://localhost:8080/assets/frames-desktop/hero/frame_NNNN.webp
Desktop Product: http://localhost:8080/assets/frames-desktop/product/frame_NNNN.webp
Mobile Hero:     http://localhost:8080/assets/frames-mobile/hero/frame_NNNN.webp
Mobile Product:  http://localhost:8080/assets/frames-mobile/product/frame_NNNN.webp
```

---

## Next Steps

Run `/implement` to begin AI-led implementation.
