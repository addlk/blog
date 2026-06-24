# Pixel Style Redesign — Design Spec

## Overview

Redesign the entire blog UI (public + admin) with a distinctive 8-bit pixel art aesthetic. Dark background, warm amber accents, pixel borders throughout, retro CRT CRT effects, and playful micro-interactions.

## Design Token System

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-bg` | `#0f0f23` | Page background |
| `--color-surface` | `#1a1a3e` | Card/container backgrounds |
| `--color-surface-hover` | `#252555` | Hover state |
| `--color-border` | `#2a2a5e` | Pixel borders |
| `--color-primary` | `#ffb347` | Amber — primary accent, headings |
| `--color-secondary` | `#4ade80` | Green — success, secondary accent |
| `--color-accent` | `#f472b6` | Pink — special badges, signatures |
| `--color-tag` | `#22d3ee` | Cyan — tag labels |
| `--color-text` | `#e2e8f0` | Primary text |
| `--color-text-dim` | `#7c7caa` | Muted/secondary text |
| `--color-danger` | `#ef4444` | Delete/danger actions |

### Typography

- **Display**: `Press Start 2P` (Google Fonts) — site title, hero headings (English). Falls back to `Courier New` for Chinese.
- **Body**: `Courier New`, monospace — articles, navigation, cards
- **Labels**: `Courier New`, monospace — small labels, tags, meta
- **Do NOT use system sans-serif anywhere**.

### Shadows & Borders

- **Zero border-radius everywhere**. All corners are sharp.
- **Pixel border**: `box-shadow: 4px 0 0 0 var(--color-border), -4px 0 0 0 var(--color-border), 0 4px 0 0 var(--color-border), 0 -4px 0 0 var(--color-border);`
- **Press effect**: On hover, shrink shadow to 2px offset: `box-shadow: 2px 2px 0 0 var(--color-border); transform: translate(2px, 2px);`
- **Transition**: Use `steps(3)` for pixel-like motion (not smooth `ease`).

### Animation Style

- All animations use `steps(N)` timing (e.g. `steps(3)`, `steps(4)`) — never `ease` or `linear`
- Blinking cursor: `step-end`
- Loading spinner: 4-frame block rotation
- Card entrance: staggered spring with `cubic-bezier(1,0,0.2,1)`

## Page-by-Page Changes

### Global

- Add `@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap')` in `global.css`
- Dark background `#0f0f23` on `body`
- All text changes to monospace stack
- Add CRT overlay: fixed position scan lines + vignette

### Public Layout

**App.vue** — Keep existing admin/public route switching. No structural change.

**AppHeader.vue**
- Replace blue "B" logo with pixel avatar (CSS-drawn 8x8 pixel face)
- Logo text becomes amber with pixel text shadow
- Nav buttons: pixel border, press effect on hover, amber active state
- All text to `Courier New`
- Remove blur background, use solid dark surface

**AppSidebar.vue**
- Flat pixel-bordered widgets, no border-radius
- Widget title: `Press Start 2P` font, pink color, pixel bottom border
- Category items: 3D press on hover
- Tags: pixel-bordered tag badges

**ArticleCard.vue**
- Pixel border, no border-radius
- Press effect on hover (2px shadow shift)
- Card badge: amber background, pixel border
- Tag colors: cyan
- Entrance animation on page load
- Scan line sweep on hover (CSS `::after`)

**Home.vue**
- Replace "最新文章" with pixel-style hero section (as shown in concept)
- Blinking cursor on tagline
- Page header: `Press Start 2P` font

**ArticleDetail.vue**
- Article container: pixel border, dark surface
- Content typography: monospace, specific styles for h1-h6, blockquote, pre, code, img, tables
- All in pixel language: solid borders, no radius
- Back link styled as pixel button

**CategoryList.vue & TagList.vue & CategoryArticles.vue & TagArticles.vue**
- Pixel card styling consistent with ArticleCard
- Category/Tag items with pixel border and press effect

### Admin Layout

**admin/Layout.vue**
- Sidebar: dark surface `#1a1a3e`, amber active items, pixel borders
- Logo: pixel avatar + amber text
- Clean navigation with press effects
- Remove gradient backgrounds, use solid colors

**admin/Login.vue**
- Dark background, pixel-border login card
- Input fields with pixel borders, monospace font
- Button with pixel press effect
- Remove gradient background, use solid amber

**admin/Dashboard.vue**
- Stat cards: pixel border, solid surface, monospace numbers
- Icon backgrounds: solid color boxes, no gradient
- Data table: monospace text, pixel borders on header

**admin/Articles.vue**
- Table: monospace text, pixel border on header
- Status toggle: pixel badges (green for published, amber for draft)
- Action buttons: pixel style with press effect
- Empty state: monospace text

**admin/ArticleEdit.vue**
- Editor toolbar: pixel buttons with press effect
- Title input: large monospace, amber bottom border on focus
- Content textarea: monospace, pixel border
- Sidebar cards: pixel border, monospace labels

**admin/Categories.vue & admin/Tags.vue**
- Add form: pixel bordered inputs
- Table: monospace, pixel styled
- Action buttons: pixel press effect

## Interactive Elements to Preserve

- Card entrance animation (staggered slide-in)
- Button press effect (all clickable elements)
- Loading spinner (4-block pixel spinner)
- Toast notifications (for save/publish/delete actions)
- Scroll progress bar (bottom pixel blocks)
- Blinking cursor (hero/tagline)
- Mascot pixel cat (bottom-left corner) — optional, could add later

## Not Included (Design Decisions)

- No star background (performance concern in production)
- No particle trails (decorative, not functional)
- No CRT scan lines on admin pages (readability)
- No Konami Code (fun but unnecessary in production)
