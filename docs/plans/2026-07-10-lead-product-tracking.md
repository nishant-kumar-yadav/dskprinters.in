# Lead Product Context & Source Tracking Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ensure every lead submitted through the "Get Quote" flow carries a clear product identifier and source context so the DSK admin team knows exactly which product the buyer is interested in and where they came from.

**Architecture:** The product name already flows through `openQuote({ product: name })` from product-level triggers (ProductDetail, ProductCard), but several CTA triggers (Home hero, CTA bands, bottom nav, navbar) send no product context at all. Additionally, the `source` enum on the backend is too narrow (only 3 values) and doesn't match the 10+ distinct sources the frontend sends. We'll fix the data pipeline end-to-end and enhance the admin Leads view to prominently display product + source.

**Tech Stack:** React (QuoteModal context), Express/Mongoose (Lead model), admin CSS

---

## Current State Analysis

| Trigger Location | Passes `product`? | `source` value sent | Backend accepts it? |
|---|---|---|---|
| `ProductDetail.jsx` (Get Quote btn) | ✅ `product.name` | `product_detail` | ❌ Not in enum |
| `ProductDetail.jsx` (Bulk pricing) | ✅ `product.name` | `bulk_pricing` | ❌ Not in enum |
| `ProductDetail.jsx` (Mobile sticky) | ✅ `product.name` | `mobile_sticky_bar` | ❌ Not in enum |
| `ProductCard.jsx` (card button) | ✅ `product.name` | `product_card` | ❌ Not in enum |
| `Home.jsx` (Hero carousel) | ❌ No product | `hero_carousel_<slug>` | ❌ Not in enum |
| `Home.jsx` (CTA band) | ❌ No product | `home_cta_band` | ❌ Not in enum |
| `Products.jsx` (CTA band) | ❌ No product | `products_cta_band` | ❌ Not in enum |
| `CTABand.jsx` | ❌ No product | `cta_band` | ❌ Not in enum |
| `MobileBottomNav.jsx` | ❌ No product | `bottom_nav` | ❌ Not in enum |
| `SearchResults.jsx` | ❌ No product | `search_page_cta` | ❌ Not in enum |
| `SeoLandingPage.jsx` | ❌ No product | *(none)* | Falls back to `contact_form` |

**Key Problems:**
1. The backend `source` enum only allows `['quote_modal', 'contact_form', 'navbar_cta']` — every other source silently falls back to `contact_form`, losing tracking data.
2. Hero carousel triggers don't pass the product/category name the user is looking at.
3. The admin Leads table shows "Source" but it's always `contact_form` for most leads due to the enum mismatch.

---

### Task 1: Expand Backend Source Enum

**Files:**
- Modify: `server/models/Lead.js:8-11`
- Modify: `server/routes/leads.js:39`

### Task 2: Pass Product Context from Hero Carousel

**Files:**
- Modify: `client/src/pages/Home.jsx:203`

### Task 3: Update Admin Leads Table Source Display

**Files:**
- Modify: `client/src/admin/LeadsPanel.jsx` (SOURCE_LABELS)

### Task 4: Make Product Column Prominent in Leads Table

**Files:**
- Modify: `client/src/admin/LeadsPanel.jsx` (table display)

### Task 5: Show Product Context in Quote Modal Step 2

**Files:**
- Modify: `client/src/components/QuoteModal.jsx` (Step 2 component)
- Modify: `client/src/components/quote-modal.css`

---

## Execution Priority

| Priority | Task | Impact |
|---|---|---|
| 🔴 Critical | Task 1 (Backend enum) | Without this, all source data is lost silently |
| 🔴 Critical | Task 2 (Hero product context) | Hero is the #1 CTA, must carry product info |
| 🟡 Important | Task 3 (Admin labels) | Better admin UX for lead management |
| 🟢 Nice-to-have | Task 4 (Prominent product column) | Visual polish |
| 🟢 Nice-to-have | Task 5 (Pre-filled badge UX) | Premium feel in the wizard |
