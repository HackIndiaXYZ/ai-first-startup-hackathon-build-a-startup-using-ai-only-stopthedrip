---
name: StopTheDrip
colors:
  surface: '#101417'
  surface-dim: '#101417'
  surface-bright: '#363a3d'
  surface-container-lowest: '#0b0f12'
  surface-container-low: '#181c1f'
  surface-container: '#1c2023'
  surface-container-high: '#262a2e'
  surface-container-highest: '#313539'
  on-surface: '#e0e3e7'
  on-surface-variant: '#d4c4af'
  inverse-surface: '#e0e3e7'
  inverse-on-surface: '#2d3134'
  outline: '#9d8f7c'
  outline-variant: '#504535'
  surface-tint: '#fabc4c'
  primary: '#ffc664'
  on-primary: '#432c00'
  primary-container: '#e5a93b'
  on-primary-container: '#5e4000'
  inverse-primary: '#7e5700'
  secondary: '#c0c7ce'
  on-secondary: '#2a3137'
  secondary-container: '#434a50'
  on-secondary-container: '#b2b9c0'
  tertiary: '#c1d0e7'
  on-tertiary: '#233143'
  tertiary-container: '#a6b5ca'
  on-tertiary-container: '#384759'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdeac'
  primary-fixed-dim: '#fabc4c'
  on-primary-fixed: '#281900'
  on-primary-fixed-variant: '#604100'
  secondary-fixed: '#dce3ea'
  secondary-fixed-dim: '#c0c7ce'
  on-secondary-fixed: '#151c21'
  on-secondary-fixed-variant: '#41484d'
  tertiary-fixed: '#d4e4fa'
  tertiary-fixed-dim: '#b9c8de'
  on-tertiary-fixed: '#0d1c2d'
  on-tertiary-fixed-variant: '#39485a'
  background: '#101417'
  on-background: '#e0e3e7'
  surface-variant: '#313539'
typography:
  headline-xl:
    fontFamily: newsreader
    fontSize: 40px
    fontWeight: '500'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: newsreader
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: newsreader
    fontSize: 24px
    fontWeight: '400'
    lineHeight: 32px
  headline-sm:
    fontFamily: newsreader
    fontSize: 20px
    fontWeight: '400'
    lineHeight: 28px
  body-lg:
    fontFamily: inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-md:
    fontFamily: inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter-desktop: 32px
  gutter-tablet: 24px
  gutter-mobile: 16px
  margin-desktop: 48px
  margin-tablet: 32px
  margin-mobile: 16px
  space-1: 4px
  space-2: 8px
  space-3: 12px
  space-4: 16px
  space-6: 24px
  space-8: 32px
  space-12: 48px
  space-16: 64px
---

## Brand & Style

StopTheDrip is engineered for high-net-worth individuals and meticulous operators who demand absolute financial clarity. The design system rejects the sterile, corporate blue of traditional banking in favor of a moody, analytical aesthetic. It combines the rigorous authority of financial journalism with the precision of a developer tool. 

The emotional response is one of calm control, high awareness, and acute focus. By utilizing deep, absorbing dark tones punctuated by high-intensity amber focal points, the interface deliberately draws the eye toward critical insights—specifically, highlighting hidden financial leaks. 

We embrace a **Modern Dark Minimalist** style: heavy contrast, zero decorative fluff, expansive negative space, and disciplined typographic hierarchy. Surfaces are strictly functional, letting the data do the talking.

## Colors

The color palette is anchored by a deep obsidian slate background (`#121619`) that reduces eye strain during deep financial audits. Surface cards sit slightly elevated on dark charcoal (`#1B2227`). 

The primary accent is a luminous warm amber/ochre (`#E5A93B`), strategically reserved for the "leak reveal"—key metrics, active warnings, and critical calls to action that require immediate user intervention. Warm alabaster (`#F4F4F5`) commands the highest visual hierarchy for primary data and numbers, while muted slate (`#94A3B8`) handles secondary metadata, timestamps, and inactive states with quiet dignity.

## Typography

The typographic system creates an intentional tension between literary authority and utilitarian precision. Headlines utilize **Newsreader**, bringing an editorial, intellectual gravitas to financial storytelling and major monetary totals. 

Body data, tables, and interface controls rely on **Inter**, ensuring that dense numerical matrices, transaction logs, and tabular data remain obsessively legible across any device. 

For mobile viewports, headlines larger than 32px automatically scale down to prevent awkward wrapping; ensure `headline-xl` collapses to 32px on screens under 640px.

## Layout & Spacing

StopTheDrip employs a strict **Fixed Grid** layout model with fluid column adaptations, optimized for dense financial dashboards and analytical tooling. The grid operates on a 12-column structure on desktop, scaling down to 8 columns on tablet and 4 columns on mobile.

Spacing follows a disciplined 4px base rhythm, favoring tight, purposeful groupings for related financial data points and generous outer padding to prevent cognitive overload. Cards and data widgets maintain consistent internal padding of 24px (`space-6`) to establish a calm, unhurried reading environment.

## Elevation & Depth

Depth is conveyed through **Low-contrast outlines** combined with subtle **Tonal layers**. Because the UI lives in a deep obsidian state, physical drop shadows are largely ineffective and muddy the interface. 

Instead, hierarchy is established through surface color stepping—moving from the obsidian background (`#121619`) to dark charcoal surface cards (`#1B2227`), accented by razor-thin, low-opacity borders (`rgba(148, 163, 184, 0.12)`). Interactive states elevate via a slight lightening of the background surface rather than directional shadows.

## Shapes

The shape language is strictly **Soft** (`roundedness` level 1), utilizing subtle 0.25rem corner radii for standard inputs and buttons, and 0.5rem (`rounded-lg`) for container cards. 

Completely sharp edges feel overly harsh against dark backgrounds, while heavily rounded or pill-like elements undermine the serious, enterprise-grade nature of financial auditing. Corners must remain crisp, restrained, and deliberate.

## Components

### Buttons
- **Primary:** Solid amber (`#E5A93B`) background with deep obsidian text (`#121619`). Use strictly for primary "Leak Reveal" actions or critical state confirmations.
- **Secondary:** Dark charcoal (`#1B2227`) surface with warm alabaster text and a thin muted slate border.
- **Ghost:** Transparent background with muted slate text, shifting to warm alabaster on hover.

### Chips & Badges
- Built with a subtle 10% opacity amber background and solid amber text for warning states; neutral slate backgrounds (`#1B2227`) with muted text for standard metadata tags.

### Lists & Tables
- Dense, tabular data rows separated by 1px rules using `rgba(148, 163, 184, 0.08)`. Numbers must always be right-aligned using tabular figures in Inter for flawless vertical scanning.

### Input Fields
- Dark charcoal fill (`#1B2227`), 1px muted slate border, shifting to luminous amber on focus. Placeholder text uses muted slate (`#94A3B8`).

### Cards
- Surface containers utilizing the dark charcoal tone (`#1B2227`), structured with generous internal padding and quiet, precise borders to segment different accounts or leak vectors.

### Specialized Components
- **Leak Ticker:** A high-contrast inline readout using Newsreader for figures and amber accents to display real-time capital loss metrics.
- **Audit Timeline:** A vertical stepper tracking financial checks, marked by minimal glowing amber nodes.