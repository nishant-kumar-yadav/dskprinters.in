# DSK Printers — Page Redesign Blueprint (v2)

> **For:** Any developer/agent continuing the DSK Printers build.  
> **Priority:** Mobile-first (99% of traffic). Desktop is secondary.  
> **Design System:** Follow `AGENTS.md` strictly — Plus Jakarta Sans, Brand Red `#dc2626`, Brand Blue `#1d4ed8`, white/surface backgrounds.

---

## Overview of Pages to Redesign

| Page | Current State | Problem |
|------|--------------|---------|
| **About** | Two paragraphs + 4 stat cards | Generic, no visual storytelling, no personality |
| **Reviews** | 6 hardcoded cards in a grid | Bland, no social proof impact, no aggregate star banner |
| **Contact** | Form + 5 info cards | Functional but lifeless, no map, no urgency |
| **Footer** | 4-column dark footer | Acceptable but the DSK brand colors in footer logo are wrong (DS=red, K=blue — should be D=blue, S=red, K=blue) |
| **ProductDetail** | Single image + specs table | No image gallery, no "Why Choose" section, related products are basic |

---

## 1. ABOUT PAGE — Full Redesign

### Current: `client/src/pages/About.jsx` (99 lines)

### Design Vision
Transform from a boring text page into a **visual brand story** that builds trust instantly on mobile. Think: IndiaMART supplier profile meets Apple's "About" page.

### Section-by-Section Layout (Mobile)

#### Section 1: Hero Strip
- **Remove** the generic `page-hero` template
- **Replace with** a full-width hero banner:
  - Background: Subtle gradient — `linear-gradient(135deg, #f0f4ff 0%, #fff 50%, #fff5f5 100%)`
  - Left-aligned text with large heading: "India's Trusted **DTF & UV DTF** Manufacturer"
  - Subtext: "Since 2015 • New Delhi • GST Registered"
  - Below: Three inline pills/chips: `✓ 500+ Clients` `✓ 10+ Years` `✓ 85% Response`
  - These pills should use `background: var(--surface); border: 1px solid var(--border);` with a small green check icon

#### Section 2: Our Story (With Side Image)
- Two-column on desktop (text left, image right), single column on mobile (image first, then text)
- **Mobile order matters**: Show the production image first, then the text
- Story should be 3 short paragraphs max — keep it scannable
- End with a "Work With Us" CTA button (`btn btn-primary`)
- The image should be `border-radius: 16px` with a subtle shadow

#### Section 3: Company Facts — Redesigned as "Why DSK Printers?"
**Replace the boring 4-card grid with an interactive feature strip:**

```
┌──────────────────────────────────┐
│  WHY DSK PRINTERS?               │
│                                  │
│  🏭  In-House Production         │
│  Everything made in our Delhi    │
│  factory — no outsourcing        │
│                                  │
│  ────────────────────────────    │
│                                  │
│  📦  100 to 100,000 Pieces       │
│  Same quality checks from        │
│  small orders to bulk runs       │
│                                  │
│  ────────────────────────────    │
│                                  │
│  🧾  GST Registered              │
│  Proper invoicing with GST       │
│  number 07DOZPK8646J1ZV         │
│                                  │
│  ────────────────────────────    │
│                                  │
│  🚚  Pan-India Delivery          │
│  Fast shipping via trusted       │
│  courier partners nationwide     │
│                                  │
│  ────────────────────────────    │
│                                  │
│  ⏱️  85% Response Rate            │
│  Most enquiries answered         │
│  within a few hours              │
│                                  │
│  ────────────────────────────    │
│                                  │
│  🎨  50+ Wash Durability         │
│  Prints tested for long-term     │
│  wash and wear durability        │
└──────────────────────────────────┘
```

- Each item: Icon (emoji or Lucide) + Bold title + 1-line description
- Layout: **Single column list on mobile**, 3-column grid on desktop
- Each item is a `card` with hover lift effect
- Dividers between items on mobile (1px border-bottom)

#### Section 4: Company Numbers Banner
A horizontal scrolling strip on mobile (like a ticker):

```
Est. 2015  |  ₹1.5-5 Cr Turnover  |  20-50 Team  |  500+ Clients
```

- Background: `var(--surface)` or very subtle blue tint
- Numbers in `font-size: 1.8rem; font-weight: 800; color: var(--red)`
- Labels in `font-size: 0.78rem; color: var(--muted); text-transform: uppercase`

#### Section 5: CTA Band
Full-width band at the bottom:
- Background: Brand Red gradient
- White text: "Ready to Start Your Next Order?"
- Two buttons: "Get Quote" (white bg, red text) + "WhatsApp Us" (white outline)
- This band should be reusable — create a `<CTABand />` component

---

## 2. REVIEWS PAGE — Full Redesign

### Current: `client/src/pages/Reviews.jsx` (104 lines)

### Design Vision
Turn this from a generic card grid into a **trust-building social proof machine**. Mobile users should immediately see aggregate ratings and individual testimonials that feel authentic.

### Section-by-Section Layout

#### Section 1: Aggregate Rating Hero
Instead of the bland text hero, show a **prominent rating summary**:

```
┌──────────────────────────────────┐
│          ⭐⭐⭐⭐⭐                │
│                                  │
│        4.8 out of 5              │
│    Based on 500+ customer        │
│    reviews across India          │
│                                  │
│  ┌────────┐ ┌────────┐          │
│  │ 5★ ███ │ │ 4★ ██  │          │
│  │ 3★ █   │ │ 2★     │          │
│  │ 1★     │ │        │          │
│  └────────┘ └────────┘          │
│                                  │
│  Google ★★★★★  IndiaMART ★★★★★  │
└──────────────────────────────────┘
```

- Large `4.8` number with filled gold stars
- A visual bar chart breakdown (5-star: 80%, 4-star: 15%, etc.)
- Below: Small logos/badges for "Google Reviews" and "IndiaMART Verified" (use text badges if no logos)
- Background: White with subtle radial gradient

#### Section 2: Testimonial Cards
**Redesign the review cards** to feel more personal and authentic:

Each card should contain:
- **Avatar circle** at top-left with the customer's initials (first letter of name, background color alternating between brand-red and brand-blue)
- **Name** (bold) and **Company** (muted, below name)
- **Star rating** (inline, filled gold stars)
- **Quote text** (in proper `<blockquote>` with subtle left border accent — `border-left: 3px solid var(--red)`)
- **Date** (optional, e.g., "June 2026" — adds authenticity)

Layout:
- **Mobile**: Single column, full-width cards, stacked vertically
- **Desktop**: 2-column masonry-like grid (cards have varying heights)

#### Section 3: Categories of Praise — Trust Tags
After the testimonials, show a horizontal scrollable row of tags:

```
🔥 Bulk Orders  |  🎨 Color Accuracy  |  🧵 Wash Durable  |  📦 On-Time Delivery  |  💬 Great Support
```

- These are pill-shaped badges (like filter pills)
- Each tag has a small number: "Color Accuracy (12 mentions)"
- Scrollable horizontally on mobile

#### Section 4: CTA Band
Same reusable `<CTABand />` component:
- "Loved by 500+ brands. Your turn."
- Buttons: "Get Quote" + "WhatsApp Us"

---

## 3. CONTACT PAGE — Full Redesign

### Current: `client/src/pages/Contact.jsx` (173 lines)

### Design Vision
The contact page is functional but feels like a template. Make it feel **direct, urgent, and helpful**. The primary goal is to get the user to WhatsApp or call — the form is secondary.

### Section-by-Section Layout

#### Section 1: Hero with Direct Actions
Replace the text hero with a **action-oriented hero**:

```
┌──────────────────────────────────┐
│   Get in Touch                   │
│                                  │
│   We respond within 2 hours      │
│   on business days.              │
│                                  │
│  ┌─────────────┐ ┌────────────┐ │
│  │ 💬 WhatsApp  │ │ 📞 Call Us │ │
│  │  Chat Now    │ │  Now       │ │
│  └─────────────┘ └────────────┘ │
│                                  │
│  ┌─────────────────────────────┐│
│  │ 📧 support@dskprinters.in   ││
│  └─────────────────────────────┘│
└──────────────────────────────────┘
```

- Two large action buttons side-by-side (WhatsApp green, Phone blue)
- Email as a full-width subtle card below them
- These should be big, tappable, mobile-first buttons (min 56px height)
- This replaces the current 5 tiny contact-item cards

#### Section 2: Quick Info Cards (Collapsed)
Move the business hours, location, and GST info into a **compact info strip**:

```
┌────────────────────────────────────┐
│ 📍 New Delhi, India                │
│ 🕐 Mon-Sat, 9:30 AM – 7:00 PM IST │
│ 🧾 GST: 07DOZPK8646J1ZV           │
└────────────────────────────────────┘
```

- Single card, stacked lines, with icons
- Subtle surface background
- No need for separate cards per item — too much whitespace

#### Section 3: Enquiry Form
Keep the existing form but improve its visual design:
- **Card elevation**: Give the form card a stronger shadow and `border-radius: 16px`
- **Section heading**: "Send Your Requirement" stays but add a subheading: "Or fill this form and we'll call you back within 2 hours"
- **Field styling**: Larger input fields (min 50px height), `border-radius: 12px`
- **Submit button**: Full width, brand red, `min-height: 54px`
- **Success state**: Use a lottie-style checkmark animation or the existing `CheckCircle2` icon but make it bigger with a green pulse animation

#### Section 4: Google Map Embed (Optional but recommended)
- Embed a Google Maps iframe showing DSK Printers' location in New Delhi
- Wrap in a `border-radius: 16px; overflow: hidden` container
- Height: 200px on mobile, 300px on desktop
- **Note**: This requires the actual Google Maps address. Use the company's address from `COMPANY.location`

---

## 4. FOOTER — Minor Fixes

### Current: `client/src/components/Footer.jsx` (83 lines) + `footer.css` (127 lines)

### Fixes Required

1. **Brand colors in footer logo are wrong:**
   ```jsx
   // WRONG (current):
   <span className="brand-red">DS</span>
   <span className="brand-blue">K</span>
   
   // CORRECT (should be):
   <span className="brand-blue">D</span>
   <span className="brand-red">S</span>
   <span className="brand-blue">K</span>
   ```

2. **Add `brand-text` class** to the `<strong>` tag (same as navbar fix) for consistent italic styling

3. **Mobile footer columns**: Currently all columns stack. On mobile, consider making "Quick Links" and "Products" columns sit side-by-side (2-column grid within the footer for these two), then the "Business Hours" column below.

4. **Add a "Made with ❤️ in New Delhi" or similar warm touch** to the copyright bar.

---

## 5. PRODUCT DETAIL PAGE — Enhancements

### Current: `client/src/pages/ProductDetail.jsx` (231 lines)

### Enhancements (not a full rewrite)

1. **Image Gallery Preparation**: The product schema already supports a single `image`. When multi-image support is added later, the detail page should show a thumbnail strip below the main image. For now, keep single image but style the image container with `border-radius: 12px; overflow: hidden`.

2. **"Why Choose This Product" section**: After the specs table, add a section with 3-4 bullet points using Lucide icons:
   - `✓ High wash durability (50+ washes)`
   - `✓ Vivid color accuracy`
   - `✓ Available in custom sizes`
   - `✓ Bulk order discounts available`
   These can be pulled from the product's `applications` field or hardcoded as defaults.

3. **Related Products**: The current `grid grid-4` for related products should use `mobile-swipe-list` class to get the horizontal swipe behavior on mobile (same fix as featured products on home).

4. **CTA Band**: Add the reusable `<CTABand />` after related products section.

---

## 6. REUSABLE COMPONENT: `<CTABand />`

Create a new component `client/src/components/CTABand.jsx` with its own CSS:

```
Props:
  - headline (string): Main text, e.g., "Ready to Start Your Next Order?"
  - subtext (string, optional): Secondary text
  - variant ('red' | 'blue'): Background gradient color
```

### Mobile Layout:
```
┌──────────────────────────────────┐
│  Ready to Start Your Next Order? │
│                                  │
│  ┌───────────────┐               │
│  │  Get Quote    │               │
│  └───────────────┘               │
│  ┌───────────────┐               │
│  │  WhatsApp Us  │               │
│  └───────────────┘               │
└──────────────────────────────────┘
```

### CSS:
- Full-width section
- Background: `linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)` for red variant
- Text color: white
- Buttons: White background with red text, or white outline
- Border-radius: 0 (full bleed)
- Padding: `48px 20px`
- Text centered

---

## 7. IMPLEMENTATION ORDER

Execute in this exact order to minimize conflicts:

1. **Create `<CTABand />` component** first (reused by About, Reviews, ProductDetail)
2. **Fix Footer** brand colors (quick, 2-minute fix)
3. **Redesign About page** (new sections, new CSS)
4. **Redesign Reviews page** (aggregate hero, new card design)
5. **Redesign Contact page** (action hero, info strip, form polish)
6. **Enhance ProductDetail** (related products swipe, why-choose section)
7. **Final mobile testing** on 390px and 412px viewports

---

## 8. CSS GUIDELINES FOR IMPLEMENTER

- All new CSS goes into `client/src/pages/pages.css` (for page-specific styles) or component-level `.css` files
- Use existing CSS variables: `var(--red)`, `var(--blue)`, `var(--text)`, `var(--muted)`, `var(--border)`, `var(--surface)`
- Use existing utility classes: `.card`, `.btn`, `.btn-primary`, `.btn-blue`, `.btn-outline`, `.badge`, `.section-eyebrow`, `.section-title`, `.reveal`, `.container`, `.grid`, `.grid-3`, `.grid-4`
- **Touch targets**: All buttons/links minimum `48px x 48px`
- **Animations**: Use `reveal` class for scroll-triggered fade-in, `0.2s ease-out` for hovers
- **Don't forget** `padding-bottom: 76px` on mobile to account for the bottom navigation bar

---

## 9. FILE REFERENCE MAP

| File | Purpose |
|------|---------|
| `client/src/pages/About.jsx` | About page component |
| `client/src/pages/Reviews.jsx` | Reviews page component |
| `client/src/pages/Contact.jsx` | Contact page with form |
| `client/src/pages/ProductDetail.jsx` | Product detail page |
| `client/src/pages/pages.css` | All page-specific CSS |
| `client/src/components/Footer.jsx` | Footer component |
| `client/src/components/footer.css` | Footer styles |
| `client/src/components/Navbar.jsx` | Navbar (already fixed) |
| `client/src/components/navbar.css` | Navbar styles |
| `client/src/api.js` | COMPANY config + API calls |
| `client/src/styles/global.css` | Global CSS variables + grid system |
| `.agents/AGENTS.md` | Design system rules (MUST READ) |
| `HANDOVER.md` | Previous session context |

---

*This blueprint was written by the senior developer. Follow it section by section, in the implementation order specified. Read `AGENTS.md` before writing any code.*
