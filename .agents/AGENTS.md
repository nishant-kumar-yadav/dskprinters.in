# DSK Printers Workspace Rules & Guidelines

This document contains rules and styling patterns that all agents working on this codebase must strictly adhere to. The objective is to build a stunning, premium, state-of-the-art web interface for `dskprinters.in`.

> [!IMPORTANT]
> **MOBILE-FIRST DEVELOPMENT IS CRITICAL**: 99% of DSK Printers' customers access the site via mobile devices. The mobile layout, touch targets, carousel interactions, page load speed, and visual appeal on small screens must be prioritized above the desktop layout. Desktop is secondary.

---

## 🎨 Design System: "Deep Space Neon"

To reflect the "Red & Neon Blue" logo in a premium, modern way, the entire UI should use a dark mode base with vibrant glowing accents.

### 1. Colors
- **Main Background**: `#080810` (Midnight Black/Violet)
- **Surface Background**: `#0f0f1c` (Dark Slate Card/Section background)
- **Brand Red (Neon)**: `#ff2e5d` (Vibrant hot-neon pinkish red)
- **Brand Blue (Neon)**: `#00f0ff` (Cyan / Electric neon blue)
- **Text Primary**: `#f1f5f9` (Slate 100)
- **Text Muted**: `#94a3b8` (Slate 400)
- **Border**: `rgba(255, 255, 255, 0.06)`

### 2. Typography
- **Headings**: `font-family: 'Outfit', sans-serif;` with letter-spacing `-0.03em`.
- **Body**: `font-family: 'Inter', sans-serif;` with letter-spacing `-0.01em`.

### 3. Glassmorphism & Card Design
All elements (cards, headers, dialogs) should feel like floating glass plates:
- **Card Background**: `rgba(15, 15, 28, 0.65)`
- **Card Backdrop Filter**: `blur(16px)`
- **Card Border**: `1px solid rgba(255, 255, 255, 0.07)`
- **Hover state**: Light up the border using a subtle linear gradient (Neon Red → Neon Blue) or add a soft glowing drop-shadow (`box-shadow: 0 0 25px rgba(0, 240, 255, 0.15)`).

---

## 🔄 Animations & Transitions

- **Page Transitions**: Soft slide-up and fade (`transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)`).
- **Hover states**: Transition duration must be `0.2s` or `0.25s` with `ease-out` or `cubic-bezier`.
- **Glow Effects**: Soft hover glow on CTA buttons and key interaction badges.

---

## 📱 Mobile UI/UX Constraints (Primary Focus)

- **Touch Targets**: All buttons, links, and form fields must have a minimum touch target size of `48px x 48px` to ensure easy mobile interaction.
- **Fixed Bottom Nav**: Ensure page has bottom padding (`padding-bottom: 76px`) on mobile screen widths so the bottom navigation doesn't overlap content.
- **Scrollbars & Swiping**: Hide default scrollbars for horizontal carousels; use intuitive touch-swiping with clear page/swipe indicator dots.
- **Form Layouts**: Keep form fields single-column on mobile with large, easy-to-tap inputs. Never require pinching to zoom.
- **Performance**: Optimize images, minimize CSS paint times, and defer heavy scripts to maintain lightning-fast loading on mobile cellular networks.
