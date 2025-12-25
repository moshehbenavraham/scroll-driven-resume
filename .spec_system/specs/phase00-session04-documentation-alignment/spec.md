# Session Specification

**Session ID**: `phase00-session04-documentation-alignment`
**Phase**: 00 - Code Audit Remediation
**Status**: Not Started
**Created**: 2025-12-25

---

## 1. Session Overview

This session updates all project documentation to accurately reflect the current runtime configuration, framework versions, and deployment setup. A comprehensive code audit identified significant drift between documentation and reality, which creates confusion for developers and deployment inconsistencies.

The remediation sessions 01-03 have fixed the underlying code issues (frame preloading, texture loading, configuration consolidation). Now the documentation must be updated to reflect these changes, particularly the environment variable standardization to `NEXT_PUBLIC_ASSET_BASE_URL` completed in Session 03.

Accurate documentation is essential for onboarding, debugging, and deployment. This session ensures that README, architecture docs, and environment guides match the actual project state, eliminating confusion and preventing misconfiguration.

---

## 2. Objectives

1. Update all Next.js version references from 15 to 16 across documentation
2. Ensure environment variable documentation reflects Session 03 standardization
3. Correct `.env` handling documentation (gitignored, not committed)
4. Update Node.js version documentation (22 in Docker, 20+ minimum)

---

## 3. Prerequisites

### Required Sessions
- [x] `phase00-session01-frame-preload-error-handling` - Fixed preload completion logic
- [x] `phase00-session02-texture-loader-refactor` - Eliminated polling, added cleanup
- [x] `phase00-session03-configuration-consolidation` - Standardized to `NEXT_PUBLIC_ASSET_BASE_URL`

### Required Tools/Knowledge
- Markdown editing familiarity
- Understanding of Next.js environment variable conventions
- Knowledge of Docker multi-stage builds

### Environment Requirements
- All existing tests passing (`npm test`)
- Current `package.json` has Next.js 16.1.0 installed

---

## 4. Scope

### In Scope (MVP)
- Update `README.md` Next.js version (15 -> 16)
- Update `docs/ARCHITECTURE.md` Next.js version (15 -> 16)
- Verify `docs/ASSET_URLS.md` aligns with runtime (already correct)
- Verify `docs/environments.md` env var documentation (already correct)
- Fix `.env` handling description in `docs/environments.md` (committed -> gitignored)
- Add Node 22 reference to documentation where relevant
- Scan all markdown files for stale version references
- Verify consistency across all documentation files

### Out of Scope (Deferred)
- Adding new documentation files - *Reason: Scope control*
- Implementing doc generation/validation in CI - *Reason: Future phase*
- API documentation - *Reason: Not applicable*
- Storybook or component documentation - *Reason: Not applicable*

---

## 5. Technical Approach

### Architecture
This is a documentation-only session. No code changes to application logic. All modifications are to markdown files in the repository root and `docs/` directory.

### Design Patterns
- **Single source of truth**: Package.json is authoritative for versions
- **Consistency verification**: Cross-reference all docs against actual configuration

### Technology Stack
- Markdown (documentation format)
- Git (version control for tracking changes)

---

## 6. Deliverables

### Files to Create
| File | Purpose | Est. Lines |
|------|---------|------------|
| None | Documentation-only session | 0 |

### Files to Modify
| File | Changes | Est. Lines Changed |
|------|---------|------------|
| `README.md` | Update Next.js 15 -> 16 in tech stack section | ~2 |
| `docs/ARCHITECTURE.md` | Update Next.js 15 -> 16 in tech stack table | ~2 |
| `docs/environments.md` | Fix `.env` handling description (committed -> gitignored) | ~5 |
| `docs/onboarding.md` | Verify/update version references if present | ~2 |
| `docs/development.md` | Verify/update version references if present | ~2 |
| `docs/deployment.md` | Verify Node version references, Docker info | ~3 |

---

## 7. Success Criteria

### Functional Requirements
- [ ] All docs reference Next.js 16 (not 15)
- [ ] `docs/environments.md` correctly states `.env` is gitignored
- [ ] `docs/environments.md` mentions `.env.example` as the template
- [ ] Node version documented accurately (22 in Docker, 20+ minimum)
- [ ] `docs/ASSET_URLS.md` matches actual URL generation
- [ ] `docs/environments.md` has accurate env var list
- [ ] No stale or conflicting version references in any markdown file

### Testing Requirements
- [ ] Manual verification of all updated files
- [ ] Grep verification: no remaining "Next.js 15" references

### Quality Gates
- [ ] All files ASCII-encoded
- [ ] Unix LF line endings
- [ ] Markdown formatting valid
- [ ] No broken internal links

---

## 8. Implementation Notes

### Key Considerations
- Session 03 standardized on `NEXT_PUBLIC_ASSET_BASE_URL` - docs already use this
- `docs/ASSET_URLS.md` and `docs/environments.md` appear already correct for env vars
- Primary fixes needed: version numbers and `.env` handling description

### Potential Challenges
- **Scattered references**: Version numbers may appear in unexpected places
  - *Mitigation*: Use grep to find all "Next.js 15" and "Next.js15" patterns
- **Indirect references**: Some docs may say "15.x" or similar
  - *Mitigation*: Search for pattern "15" in context of Next.js

### Version Reference Locations (Pre-identified)
1. `README.md:50` - "Next.js 15" in tech stack
2. `README.md:22` - "Next.js 15 App Router" in structure comment
3. `docs/ARCHITECTURE.md:61` - "Next.js 15" in tech stack table

### ASCII Reminder
All output files must use ASCII-only characters (0-127).

---

## 9. Testing Strategy

### Unit Tests
- Not applicable (documentation-only session)

### Integration Tests
- Not applicable (documentation-only session)

### Manual Testing
- Read through each modified file for accuracy
- Verify all version numbers match package.json
- Confirm `.env` handling instructions are correct
- Test any command examples in documentation still work

### Verification Commands
```bash
# Find any remaining Next.js 15 references
grep -r "Next.js 15" --include="*.md" .
grep -r "Next\.js 15" --include="*.md" .

# Verify actual version
grep '"next":' package.json

# Verify .gitignore contains .env
grep "^\.env$" .gitignore
```

---

## 10. Dependencies

### External Libraries
- None (documentation-only session)

### Other Sessions
- **Depends on**: `phase00-session03-configuration-consolidation` (env var standardization)
- **Depended by**: `phase00-session05-test-environment-improvements`

---

## Files to Scan

The following files should be scanned for version/configuration references:

| File | Expected Issues |
|------|-----------------|
| `README.md` | Next.js 15 -> 16, possible project status outdated |
| `docs/ARCHITECTURE.md` | Next.js 15 -> 16 in tech stack |
| `docs/environments.md` | `.env` handling description |
| `docs/ASSET_URLS.md` | Verify accuracy (likely already correct) |
| `docs/onboarding.md` | Check for version references |
| `docs/development.md` | Check for version references |
| `docs/deployment.md` | Check for Node/Docker version references |
| `docs/requirements.md` | Check for version references |

---

## Next Steps

Run `/tasks` to generate the implementation task checklist.
