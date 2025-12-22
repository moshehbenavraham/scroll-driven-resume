# Task Checklist

**Session ID**: `phase01-session04-product-section`
**Total Tasks**: 25
**Estimated Duration**: 8-10 hours
**Created**: 2025-12-22

---

## Legend

- `[x]` = Completed
- `[ ]` = Pending
- `[P]` = Parallelizable (can run with other [P] tasks)
- `[S0104]` = Session reference (Phase 01, Session 04)
- `TNNN` = Task ID

---

## Progress Summary

| Category | Total | Done | Remaining |
|----------|-------|------|-----------|
| Setup | 3 | 3 | 0 |
| Foundation | 6 | 6 | 0 |
| Implementation | 11 | 11 | 0 |
| Testing | 5 | 5 | 0 |
| **Total** | **25** | **25** | **0** |

---

## Setup (3 tasks)

Initial configuration and environment preparation.

- [x] T001 [S0104] Verify Docker stack running and product frames accessible at MinIO
- [x] T002 [S0104] Create directory structure `components/product/` for product components
- [x] T003 [S0104] Create directory structure `__tests__/components/product/` for tests

---

## Foundation (6 tasks)

Core type definitions and base structures.

- [x] T004 [S0104] [P] Create ProductStat interface and type definitions (`types/product.ts`)
- [x] T005 [S0104] [P] Create ProductContentConfig and ProductCTAConfig interfaces (`types/product.ts`)
- [x] T006 [S0104] [P] Create ProductSectionProps interface (`types/product.ts`)
- [x] T007 [S0104] Add DEFAULT_PRODUCT_CONTENT constant (`types/product.ts`)
- [x] T008 [S0104] Add DEFAULT_PRODUCT_STATS and DEFAULT_PRODUCT_CTAS constants (`types/product.ts`)
- [x] T009 [S0104] Export product types from barrel file (`types/index.ts`)

---

## Implementation (11 tasks)

Main feature implementation.

- [x] T010 [S0104] Implement ProductContent component - name and tagline display (`components/product/ProductContent.tsx`)
- [x] T011 [S0104] Implement ProductStats component - stat item rendering with icons (`components/product/ProductStats.tsx`)
- [x] T012 [S0104] Add scroll-triggered reveal animation to ProductStats (`components/product/ProductStats.tsx`)
- [x] T013 [S0104] Implement ProductCTAs component - primary and secondary buttons (`components/product/ProductCTAs.tsx`)
- [x] T014 [S0104] Create ProductSection base structure with 225vh scroll runway (`components/sections/ProductSection.tsx`)
- [x] T015 [S0104] Add sticky viewport container to ProductSection (`components/sections/ProductSection.tsx`)
- [x] T016 [S0104] Integrate UnifiedHeroCanvas with sequence="product" (`components/sections/ProductSection.tsx`)
- [x] T017 [S0104] Add gradient overlay for text contrast (`components/sections/ProductSection.tsx`)
- [x] T018 [S0104] Compose ProductContent, ProductStats, ProductCTAs in content layer (`components/sections/ProductSection.tsx`)
- [x] T019 [S0104] Add mobile responsive fallback and prefers-reduced-motion support (`components/sections/ProductSection.tsx`)
- [x] T020 [S0104] Integrate ProductSection into main page below HeroSection (`app/page.tsx`)

---

## Testing (5 tasks)

Verification and quality assurance.

- [x] T021 [S0104] [P] Write unit tests for ProductContent component (`__tests__/components/product/ProductContent.test.tsx`)
- [x] T022 [S0104] [P] Write unit tests for ProductStats component (`__tests__/components/product/ProductStats.test.tsx`)
- [x] T023 [S0104] [P] Write unit tests for ProductCTAs component (`__tests__/components/product/ProductCTAs.test.tsx`)
- [x] T024 [S0104] Write unit tests for ProductSection component (`__tests__/components/ProductSection.test.tsx`)
- [x] T025 [S0104] Run full test suite, lint, type-check, and validate ASCII encoding

---

## Completion Checklist

Before marking session complete:

- [x] All tasks marked `[x]`
- [x] All tests passing (`npm run test`)
- [x] No TypeScript errors (`npm run type-check`)
- [x] No ESLint warnings (`npm run lint`)
- [x] All files ASCII-encoded (no Unicode characters)
- [x] Unix LF line endings
- [ ] Manual scroll testing completed (frames advance/reverse smoothly)
- [ ] Mobile testing completed (static fallback working)
- [x] implementation-notes.md updated
- [ ] Ready for `/validate`

---

## Notes

### Parallelization
- Tasks T004-T006 (type interfaces) can be done in parallel
- Tasks T021-T023 (component unit tests) can be done in parallel

### Task Timing
Target ~20-25 minutes per task.

### Dependencies
- T007-T008 depend on T004-T006 (need interfaces first)
- T010-T013 depend on T009 (need types exported)
- T014-T019 depend on T010-T013 (compose sub-components)
- T020 depends on T019 (ProductSection complete)
- T24 depends on T021-T023 (sub-component tests first)

### Key Implementation Details

**Scroll Runway Calculation:**
- Product: 144 frames at 225vh = 1.5625vh per frame (matches hero ratio)

**Stats Reveal Timing:**
- Start reveal at 40% scroll progress
- Complete reveal at 70% scroll progress
- Stagger each stat by 100ms

**Z-Index Layers:**
- Layer 0: UnifiedHeroCanvas (frames + particles)
- Layer 10: Gradient overlay (text contrast)
- Layer 20: Content container

**Component Pattern:**
Follow HeroSection structure exactly:
- section > sticky container > [canvas, gradient, content]

---

## Next Steps

Run `/validate` to verify session completeness.
