# Current Fixes

## 2026-02-02: Section Overlap Fixes (IN PROGRESS)

### Problem
Section headers and content from later sections visually overlap into previous sections during scroll:

**Skills → Projects overlap** (see `between_skills-projects.png`):
- "Projects" heading and subtitle appear over the Skills cards (Product, Leadership)
- Projects title renders mid-way through Skills content

**Projects → AI Community overlap** (see `between_projects-ai_community.png`):
- "AI Community" heading and "Join 10,000+ builders..." text covers Project cards
- Project descriptions and tech tags partially hidden under AI Community header

### Root Cause
The parallax Y-transform pushes section headers **upward** into previous sections:
- `ParallaxLayer` uses `absolute inset-0` with Y transforms (±90px)
- Content doesn't contribute to section height (absolute positioning)
- No buffer zone between sections to accommodate transform offset

```
[Skills Section]     ← Content at bottom gets covered
     ↑
   -90px transform   ← Next section header pushed UP
     |
[Projects Section]   ← Title appears too early during scroll
```

### Attempted Fixes

**1. `overflow-hidden` on sections** ❌
- Prevented overlap but clipped content when Skills cards exceeded viewport height
- Reverted

**2. `isolate` for stacking context** ❌
- Made overlap worse
- Reverted

**3. Z-index stacking (current state)** ⚠️
- Added increasing z-index to each section (Hero:1 → Contact:6)
- Changed semi-transparent backgrounds to solid `bg-background`
- Did not visibly fix the issue

### Current State
Z-index approach is applied but not working as expected. Files modified:
- `components/sections/HeroSection.tsx` (z-index: 1)
- `components/sections/AboutSection.tsx` (z-index: 2)
- `components/sections/SkillsSection.tsx` (z-index: 3)
- `components/sections/ProjectsSection.tsx` (z-index: 4)
- `components/sections/ProductSection.tsx` (z-index: 5)
- `components/sections/ContactSection.tsx` (z-index: 6)

### Next Steps to Investigate
1. The parallax system architecture may need restructuring
2. Consider removing parallax from mid-content sections (About, Skills, Projects)
3. Or use JavaScript to dynamically set section heights based on content

---

## 2026-02-02: Local Development Environment Fixes

### Issue 1: MinIO 403 Forbidden Errors

**Symptoms:**
```
GET http://localhost:9000/resume-assets/frames-desktop/product/frame_0001.webp?v3 403 (Forbidden)
GET http://localhost:9000/resume-assets/frames-desktop/hero/frame_0002.webp?v3 403 (Forbidden)
```

**Root Cause:**
- `NEXT_PUBLIC_ASSET_BASE_URL` was set to `http://localhost:9000/resume-assets`
- The `resume-assets` bucket does not exist in MinIO
- Actual MinIO buckets are `frames-desktop` and `frames-mobile`
- Direct MinIO access (port 9000) bypasses nginx's CORS headers

**Fix:**
Updated `.env` and `.env.local`:
```diff
- NEXT_PUBLIC_ASSET_BASE_URL=http://localhost:9000/resume-assets
+ NEXT_PUBLIC_ASSET_BASE_URL=http://localhost:8089/assets
```

**Files Changed:**
- `.env` (line 47)
- `.env.local` (line 5)

---

### Issue 2: Project Images 400 Bad Request

**Symptoms:**
```
GET http://localhost:3017/_next/image?url=%2Fimages%2Fprojects%2Fai-platform.webp&w=1080&q=75 400 (Bad Request)
GET http://localhost:3017/_next/image?url=%2Fimages%2Fprojects%2Fecommerce-app.webp&w=1080&q=75 400 (Bad Request)
```

**Root Cause:**
- Project thumbnail images referenced in `types/projects.ts` did not exist
- Next.js Image Optimization returns 400 when source image is missing

**Fix:**
Created placeholder gradient images using ImageMagick:
```bash
cd public/images/projects
convert -size 640x360 gradient:'#1a1a2e'-'#4a1a6b' -quality 80 ai-platform.webp
convert -size 640x360 gradient:'#1a2e1a'-'#1a6b4a' -quality 80 ecommerce-app.webp
convert -size 640x360 gradient:'#2e1a1a'-'#6b4a1a' -quality 80 devops-toolkit.webp
convert -size 640x360 gradient:'#1a1a2e'-'#1a4a6b' -quality 80 nlp-chatbot.webp
convert -size 640x360 gradient:'#2e2e1a'-'#6b1a6b' -quality 80 data-viz.webp
```

**Files Created:**
- `public/images/projects/ai-platform.webp`
- `public/images/projects/ecommerce-app.webp`
- `public/images/projects/devops-toolkit.webp`
- `public/images/projects/nlp-chatbot.webp`
- `public/images/projects/data-viz.webp`

---

### Issue 3: next.config.ts remotePatterns Update

**Context:**
The image optimization configuration had a pattern for `/resume-assets/**` which doesn't match actual bucket structure.

**Fix:**
Added proper patterns for actual MinIO buckets while preserving legacy pattern:

```typescript
remotePatterns: [
  {
    // Primary: Nginx proxy with caching and CORS
    protocol: "http",
    hostname: "localhost",
    port: "8089",
    pathname: "/assets/**",
  },
  {
    // Legacy: MinIO with resume-assets prefix (if bucket created)
    protocol: "http",
    hostname: "localhost",
    port: "9000",
    pathname: "/resume-assets/**",
  },
  {
    // Fallback: Direct MinIO bucket access (frames-desktop bucket)
    protocol: "http",
    hostname: "localhost",
    port: "9000",
    pathname: "/frames-desktop/**",
  },
  {
    // Fallback: Direct MinIO bucket access (frames-mobile bucket)
    protocol: "http",
    hostname: "localhost",
    port: "9000",
    pathname: "/frames-mobile/**",
  },
],
```

**Files Changed:**
- `next.config.ts`

---

### Non-Critical Warnings (No Action Required)

1. **React DevTools message** - Browser suggestion to install dev tools extension
2. **[HMR] connected** - Normal Hot Module Replacement status
3. **Scroll container position warning** - Framer Motion development warning; sections already have proper positioning (`position: relative`)

---

### Verification

After applying fixes, restart the dev server:
```bash
./scripts/deploy-local-clean.sh
```

Verify MinIO connectivity:
```bash
# Check buckets exist
mc ls local/

# Verify frame access via nginx
curl -s -o /dev/null -w "%{http_code}" "http://localhost:8089/assets/frames-desktop/hero/frame_0001.webp"
# Expected: 200
```
