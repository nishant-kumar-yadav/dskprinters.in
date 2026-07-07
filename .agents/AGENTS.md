# DSK Printers Workspace Rules & Guidelines

This document contains rules and styling patterns that all agents working on this codebase must strictly adhere to. The objective is to build a stunning, premium, state-of-the-art web interface for `dskprinters.in`.

> [!IMPORTANT]
> **MOBILE-FIRST DEVELOPMENT IS CRITICAL**: 99% of DSK Printers' customers access the site via mobile devices. The mobile layout, touch targets, carousel interactions, page load speed, and visual appeal on small screens must be prioritized above the desktop layout. Desktop is secondary.

---

## 🎨 Design System: "Clean Premium Brand Accent"

To reflect the "Red & Blue" logo in a premium, modern way, the entire UI should use a clean, light base with high-contrast bold brand accents.

### 1. Colors
- **Main Background**: `#ffffff` (Pure white for content readability)
- **Surface Background**: `#f8fafc` (Light slate for sections, alternate strips, and table headers)
- **Brand Red**: `#dc2626` (Proper deep brand red for primary CTA actions like "Get Quote")
- **Brand Blue**: `#1d4ed8` (Vibrant royal blue for links, highlights, and secondary elements)
- **Text Primary**: `#0f172a` (Deep slate navy for high-contrast heading and body readability)
- **Text Muted**: `#64748b` (Slate 400 for descriptions, secondary specs, and labels)
- **Border**: `#e2e8f0` (Very subtle clean light gray for borders and separators)

### 2. Typography
- **Headings & Body**: `font-family: 'Plus Jakarta Sans', sans-serif;`
  - Headings: Bold/ExtraBold (`font-weight: 700` or `800`) with letter-spacing `-0.02em`.
  - Body: Regular (`font-weight: 400` or `500`) with letter-spacing `-0.01em`.

### 3. Premium Card & Elevation Design
Cards should feel structural, clean, and elevated:
- **Card Background**: `#ffffff`
- **Card Border**: `1px solid #e2e8f0`
- **Card Shadow**: `0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03)`
- **Hover State**: Cards scale slightly (`transform: translateY(-2px)`) and cast a deep soft shadow (`box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08)`).

---

## 🔄 Animations & Transitions

- **Page Transitions**: Soft slide-up and fade (`transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)`).
- **Hover States**: Hover transitions must use `0.2s` or `0.25s` duration with `ease-out` or `cubic-bezier`.
- **Button Feedback**: Tactile click/press scaling (`transform: scale(0.97)`) on action.

---

## 📱 Mobile UI/UX Constraints (Primary Focus)

- **Touch Targets**: All buttons, links, and form fields must have a minimum touch target size of `48px x 48px` to ensure easy mobile interaction.
- **Fixed Bottom Nav**: Ensure page has bottom padding (`padding-bottom: 76px`) on mobile screen widths so the bottom navigation doesn't overlap content.
- **Scrollbars & Swiping**: Hide default scrollbars for horizontal carousels; use intuitive touch-swiping with clear page/swipe indicator dots.
- **Form Layouts**: Keep form fields single-column on mobile with large, easy-to-tap inputs. Never require pinching to zoom.
- **Performance**: Optimize images, minimize CSS paint times, and defer heavy scripts to maintain lightning-fast loading on mobile cellular networks.
