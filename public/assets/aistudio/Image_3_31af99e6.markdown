---
name: Market Terminal UI
colors:
  surface: '#faf9ff'
  surface-dim: '#d7d9e6'
  surface-bright: '#faf9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3ff'
  surface-container: '#ebedfa'
  surface-container-high: '#e5e8f4'
  surface-container-highest: '#e0e2ee'
  on-surface: '#181b24'
  on-surface-variant: '#434656'
  inverse-surface: '#2d303a'
  inverse-on-surface: '#eef0fd'
  outline: '#737687'
  outline-variant: '#c3c5d8'
  surface-tint: '#004ee8'
  primary: '#0049db'
  on-primary: '#ffffff'
  primary-container: '#2962ff'
  on-primary-container: '#f7f5ff'
  inverse-primary: '#b6c4ff'
  secondary: '#5a5e6b'
  on-secondary: '#ffffff'
  secondary-container: '#dfe2f2'
  on-secondary-container: '#606471'
  tertiary: '#9e3500'
  on-tertiary: '#ffffff'
  tertiary-container: '#c74500'
  on-tertiary-container: '#fff4f1'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b6c4ff'
  on-primary-fixed: '#001550'
  on-primary-fixed-variant: '#003ab3'
  secondary-fixed: '#dfe2f2'
  secondary-fixed-dim: '#c3c6d5'
  on-secondary-fixed: '#171b26'
  on-secondary-fixed-variant: '#434653'
  tertiary-fixed: '#ffdbcf'
  tertiary-fixed-dim: '#ffb59a'
  on-tertiary-fixed: '#380d00'
  on-tertiary-fixed-variant: '#802a00'
  background: '#faf9ff'
  on-background: '#181b24'
  surface-variant: '#e0e2ee'
  bullish-green: '#089981'
  bearish-red: '#F23645'
  surface-canvas: '#FFFFFF'
  surface-subtle: '#F0F3FA'
  surface-hover: '#E0E3EB'
  border-subtle: '#E0E3EB'
  border-strong: '#D1D4DC'
typography:
  display-hero:
    fontFamily: Plus Jakarta Sans
    fontSize: 56px
    fontWeight: '800'
    lineHeight: 64px
    letterSpacing: -0.03em
  display-hero-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  data-mono-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 20px
  data-mono-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
  label-nav:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-tag:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  caption:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 14px
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 2rem
  margin-desktop: 3rem
  space-2xs: 0.125rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-base: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
  space-3xl: 4rem
---

## Brand & Style

The design system establishes a high-density, analytical, and professional fintech workspace tailored for active traders, financial analysts, and retail investors. The aesthetic prioritizes absolute precision, zero-latency cognitive scanning, and immediate legibility under high information loads.

Combining modern digital product clarity with financial terminal precision, the visual language balances pure canvas surfaces with razor-sharp data structures. Functional minimalism is the dominant philosophy: visual noise is aggressively stripped away, elevation relies on subtle surface tints rather than dramatic shadows, and chromatic accents are strictly reserved for state changes, market sentiment indicators, and primary points of interaction.

## Colors

The chromatic architecture is anchored by functional utility and financial conventions:
- **Primary (`#2962FF`):** A high-energy cobalt blue reserved for active interaction anchors, selected tabs, focus indicators, and key conversion paths.
- **Secondary (`#131722`):** An intense obsidian deep tone used for primary typography, dominant badges, and structural icons.
- **Market Dynamics:** Strict adherence to international financial signaling via `bullish-green` (`#089981`) for positive deltas, gains, and buy indicators; and `bearish-red` (`#F23645`) for negative deltas, losses, and sell indicators.
- **Neutral Framework:** `#787B86` governs secondary metrics, metadata labels, and inactive controls. Structural containers employ tinted whites and muted grays (`#F0F3FA` and `#E0E3EB`) to delineate content boundaries without relying on high-contrast lines.

## Typography

Typography combines authoritative display headers with ultra-structured analytical body copy.

- **Headlines:** Set in `Plus Jakarta Sans` with tight tracking to provide contemporary polish and visual gravity for titles, indices, and asset names.
- **Body & Data Sets:** Set in `Inter` with OpenType tabular figures (`tnum`) enabled by default across all numerical roles. This ensures ticker rates, percentages, bid/ask values, and volumes align vertically without jitter during real-time data streaming.

## Layout & Spacing

The layout model uses an adaptable 12-column grid designed for modular financial dashboards:
- **Desktop (1280px+):** 12 columns with 24px gutters and 48px outer margins. Supports multi-pane layouts: a primary market chart/table (8 cols) paired with order books or context lists (4 cols).
- **Tablet (768px - 1279px):** 8 columns with 16px gutters and 32px margins. Secondary widgets collapse below the primary stream.
- **Mobile (< 768px):** 4 columns with 12px gutters and 16px margins. Navigational tags and market filters convert to horizontal scrolling ribbons with smooth inertia.

Component spacing follows a compact 4px baseline rhythm. High-density zones (data grids, quote rows) strictly employ `space-xs` and `space-sm` internal padding to maximize vertical viewport capacity.

## Elevation & Depth

Visual hierarchy avoids heavy drop shadows, favoring clean tonal separation and hairline perimeter boundaries:
- **Base Canvas:** Pure white (`#FFFFFF`) provides high contrast for textual analysis.
- **Subtle Layering:** Secondary zones, pill chips, and search containers use flat fills of `surface-subtle` (`#F0F3FA`).
- **Dividers & Hairlines:** 1px solid borders (`#E0E3EB`) partition columns, table headers, and tab rows.
- **Active Floats:** Dropdown menus, modal tooltips, and autocomplete search palettes employ a diffuse ambient shadow: `0 4px 16px -2px rgba(19, 23, 34, 0.08), 0 1px 3px 0 rgba(19, 23, 34, 0.04)`.

## Shapes

The design system incorporates a dual shape philosophy:
- **Interactive Controls & Category Navigators:** Utilize full pill styling (`rounded-full` / Level 3), producing ergonomic targets for category toggles, quick search boxes, and market status tags.
- **Structural Data Containers:** Panels, financial charts, and modal bodies use a calibrated 8px–12px radius, preserving efficient tabular real estate while harmonizing with rounded pills.

## Components

### Buttons
- **Primary:** Filled `#131722` with `#FFFFFF` text for top actions (e.g., "Get started"), or `#2962FF` for primary trading execution. Fully rounded pill geometry (`rounded-full`), `h-10`, `px-5`. Hover transitions to 90% opacity.
- **Subtle / Secondary:** `#F0F3FA` background with `#131722` text. Hover shifts to `#E0E3EB`.
- **Ghost:** Transparent background with `#787B86` text, transitioning to `#131722` text on hover.

### Filter Chips & Segment Controls
- Horizontally scrollable pill tabs.
- **Active:** Solid `#787B86` or `#131722` background with `#FFFFFF` text.
- **Inactive:** Transparent or `#F0F3FA` background with `#787B86` text. Hover: `#131722` text.

### Search Bar with Shortcut Cue
- Capsule shape (`rounded-full`), height 38px, filled with `#F0F3FA`.
- Accompanied by a left-aligned magnifying glass icon (`#787B86`) and an inline right-aligned shortcut badge (e.g., `Ctrl+K`) in a 1px border pill.

### Market Badges & Status Indicators
- **Index Circle Badges:** 28px circles with centered numerical/ticker tags (e.g., red circle for S&P 500, blue for Nasdaq 100).
- **Price Delta Badges:** Filled with 10% opacity tint of bullish green or bearish red, with solid `#089981` or `#F23645` text and arrow indicators (`+2.45%`, `-0.82%`).

### Data Tables & Quote Rows
- Headers set in `caption` with uppercase tracking, colored `#787B86`.
- Border-bottom 1px `#E0E3EB`. Row height 44px with hover state `#F0F3FA`.
- Numerical columns aligned right using tabular figures (`Inter`). Symbol and asset metadata aligned left.

### Form Inputs & Selectors
- Flat `#F0F3FA` surface or white with 1px `#E0E3EB` boundary, transitioning to a 2px `#2962FF` focus ring.