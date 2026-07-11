# Image Optimization Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix the broken images and implement a bulletproof image optimization pipeline that takes Lighthouse Performance from 37 → 85+

**Architecture:** Images come from two sources: (1) static files in `client/public/images/` used by seed data and hardcoded hero slides, and (2) future admin-uploaded images. We will optimize static images at build time using a Vite plugin, and create a utility function for dynamic images. No runtime conversion, no deleting originals until the pipeline is proven.

**Tech Stack:** Vite + vite-plugin-image-optimizer (build-time), WebP with PNG fallback, CSS `image-rendering`, `loading="lazy"` + `fetchpriority="high"` for LCP images.

---

## Root Cause Analysis

The score dropped from 66 → 37 because of a **cascading failure**:

1. I deleted all `.png` originals and only kept `.webp` files
2. The MongoDB database had product records pointing to `.png` paths (from before the seed)
3. The `placeholder.jpg` fallback file **doesn't even exist** in `client/public/`
4. The hero carousel loads images from the DB API → DB still had `.png` paths → 404 → falls back to `placeholder.jpg` → also 404 → **blank white box**
5. Multiple `onError` handlers try to load `placeholder.jpg` which also 404s → causes repeated network failures
6. Browser is making dozens of failed requests → performance tanks

### Image Flow Map

```
seedData.js (IMG function) → MongoDB → API /api/products → React components
                                                              ↓
                                                         <img src={product.image}>
                                                              ↓
                                                    /images/cat-uv-dtf.webp  ← FILE EXISTS ✅
                                                    /images/cat-uv-dtf.png   ← FILE DELETED ❌
                                                    /placeholder.jpg         ← NEVER EXISTED ❌
```

**Two problems to solve:**
- **P1 (Critical):** DB records may still point to `.png`. Seed was re-run but hero items come from DB `showInHero` flag — if no products have `showInHero=true`, fallback `heroSlides` array (line 52-85 in Home.jsx) was already fixed to `.webp`. But the `onError` fallback to `/placeholder.jpg` is broken everywhere.
- **P2 (Performance):** Even with `.webp` files, the hero carousel image is the LCP element and has no `fetchpriority="high"`, no explicit `width`/`height` (causes CLS), and no preload hint.

---

## Task 1: Create a Real Placeholder Image

**Files:**
- Create: `client/public/placeholder.webp`

**Step 1:** Generate a minimal branded placeholder using sharp.

**Step 2:** Update ALL `placeholder.jpg` references to `placeholder.webp` across the codebase.

**Files to modify:**
- `client/src/components/ProductCard.jsx` (lines 13, 17)
- `client/src/pages/Home.jsx` (lines 109, 119, 166, 244, 248)
- `client/src/pages/About.jsx` (line 84)
- `client/src/pages/ProductDetail.jsx` (lines 90, 93, 159, 628)
- `client/src/pages/Products.jsx` (line 42)
- `client/src/pages/SearchResults.jsx` (line 279)
- `client/src/components/SearchModal.jsx` (line 322)

**Step 3: Verify** — Open browser, no 404s in network tab for placeholder images.

---

## Task 2: Verify DB Image Paths Match Filesystem

**Step 1:** Run a quick check script to see what paths are in MongoDB right now.

**Step 2:** If any paths end in `.png`, re-run the seed: `pnpm --filter dsk-server seed`

**Step 3: Verify** — All DB image paths end in `.webp` and all those files exist in `client/public/images/`.

---

## Task 3: Fix LCP — Hero Carousel Image Performance

The hero carousel image is the **Largest Contentful Paint** element.

**Files:**
- Modify: `client/src/pages/Home.jsx` (lines 160-168)
- Modify: `client/src/pages/pages.css` (hero image styles)

**Step 1:** Add `fetchpriority="high"` and explicit dimensions to the hero image.

```jsx
<img
  key={activeSlide}
  src={currentSlide.image}
  alt={currentSlide.title}
  className="hero-carousel-image fade-in"
  width={800}
  height={800}
  fetchPriority={activeSlide === 0 ? "high" : "auto"}
  loading={activeSlide === 0 ? "eager" : "lazy"}
  onError={(e) => {
    e.currentTarget.src = '/placeholder.webp'
  }}
/>
```

**Step 2:** Add `<link rel="preload">` for the first hero slide image in the `<Helmet>`.

**Step 3:** Ensure the hero image container has fixed aspect ratio in CSS to prevent CLS.

**Step 4: Verify** — Run Lighthouse. LCP should drop from 7.9s to under 2.5s.

---

## Task 4: Add Dimensions to All Below-Fold Images

**Files:**
- Modify: `client/src/components/ProductCard.jsx`
- Modify: `client/src/pages/Products.jsx`

**Step 1:** Add `width` and `height` attributes to prevent layout shift.

**Step 2: Verify** — CLS remains 0, no layout jumps when scrolling.

---

## Task 5: Add Vite Build-Time Compression (Production Only)

This optimizes the final deployed bundle without touching source files.

**Files:**
- Modify: `client/vite.config.js`
- Modify: `client/package.json` (add dev dependency)

**Step 1:** Install: `pnpm --filter dsk-client add -D vite-plugin-image-optimizer`

**Step 2:** Add the plugin to `vite.config.js` with quality settings for png/jpeg/webp.

**Step 3: Verify** — Run `pnpm --filter dsk-client build` and check `dist/images/` sizes.

---

## Task 6: Reduce Render-Blocking Resources

Lighthouse flagged "Render-blocking requests — Est savings of 600ms". This is the Google Fonts CSS.

**Files:**
- Modify: `client/src/styles/global.css` (line 1)
- Modify: `client/index.html`

**Step 1:** Move the Google Fonts `@import` from CSS to a `<link>` tag in `index.html` with preconnect and async loading.

**Step 2:** Remove the `@import` from `global.css` line 1.

**Step 3: Verify** — "Render-blocking requests" warning should disappear from Lighthouse.

---

## Verification Checklist

After all tasks are complete, run these checks:

- [ ] No 404 errors in browser Network tab
- [ ] All images load on Home, Products, ProductDetail, About, Contact pages
- [ ] Hero carousel shows images and auto-rotates
- [ ] Lighthouse Performance score >= 85
- [ ] Lighthouse LCP < 2.5s
- [ ] Lighthouse CLS = 0
- [ ] `pnpm --filter dsk-client build` succeeds without errors

---

## Risk Assessment

| Risk | Mitigation |
|---|---|
| Plugin install fails | Tasks 1-4 work without any new dependencies |
| WebP not supported on old browsers | WebP has 97% browser support; `onError` fallback exists |
| Admin-uploaded images still PNG | Future: add server-side sharp conversion on upload |
| Build time increases | `vite-plugin-image-optimizer` only runs on `build`, not `dev` |
