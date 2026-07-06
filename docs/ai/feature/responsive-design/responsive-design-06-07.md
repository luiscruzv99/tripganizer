# Responsive Design, OG Metadata, and Tab Titles

## Overview

This feature makes the frontend responsive across mobile, tablet, and desktop viewports. It also fixes social media link previews (OG metadata) by implementing server-side rendering for trip pages, and adds proper page titles to all routes.

## Problem

The original implementation had several issues:

- All components used fixed pixel widths with no media queries, causing horizontal overflow on mobile devices
- OG metadata tags were set client-side via `<svelte:head>` in the trip page, but social media crawlers do not execute JavaScript, so they never saw the trip-specific title, description, or image
- The landing page had no `<title>` tag, so it showed the raw URL in browser tabs and social shares
- A debug overlay (red background with "Force Close" button) was left in the trip page code
- The hardcoded OG image URL pointed to a non-existent domain

## Changes

### Server-Side Rendering for Trip Pages

A new server load function was added at `src/routes/trip/[id]/+page.server.ts`. This fetches the board data from D1 on the server before the page renders, making the trip name and description available in the initial HTML response. Social media crawlers now receive the correct OG meta tags in the server-rendered HTML.

The trip page component was updated to accept `data` from the server load function and initialize the board state with server data rather than loading from localStorage first. The `loadBoard` import was removed since it is no longer needed on initial render.

### OG Metadata

OG meta tags were added to each page individually rather than in the root layout. This prevents child pages from having their tags overridden by layout-level defaults. Each page now sets its own `og:title`, `og:description`, `og:image`, and Twitter card meta tags.

A placeholder SVG image was created at `static/og-default.svg` to serve as the default OG image for pages without a custom image.

### Responsive Design

Media queries were added to components at the 480px breakpoint:

- **Landing page**: Title uses `clamp()` for fluid typography, button has a minimum 44px touch target, padding prevents edge-to-edge content
- **New trip form**: Form card uses `width: 100%; max-width: 400px` instead of fixed width, date fields stack vertically on narrow screens
- **Topbar**: Name truncates with ellipsis, date range hides on mobile, padding reduces, safe area inset respected for notch devices
- **Canvas FABs**: Add, delete, and cut-yarn buttons reposition closer together on mobile
- **Modals** (CardForm, EditBoard, Share, CardDetails): All use `width: calc(100vw - 32px)` with a `max-width` to prevent overflow on mobile
- **YarnColorPalette and ConnectionMenu**: Swatch containers use `flex-wrap` so color options wrap to multiple rows on narrow screens

### Cleanup

The debug modal overlay (a red translucent div with "Force Close" button) was removed from the trip page. This was leftover debugging code that displayed on top of the actual card details modal.

## Files Modified

- `src/routes/trip/[id]/+page.server.ts` — new server load function for SSR
- `src/routes/trip/[id]/+page.svelte` — accept server data, fix OG tags, remove debug overlay, responsive FABs, remove unused import
- `src/routes/+page.svelte` — responsive landing, title, OG tags
- `src/routes/new-trip/+page.svelte` — responsive form, title, OG tags
- `src/lib/components/Topbar.svelte` — responsive topbar with truncation and mobile breakpoint
- `src/lib/components/CardFormModal.svelte` — mobile-responsive width
- `src/lib/components/EditBoardModal.svelte` — mobile-responsive width with max-height
- `src/lib/components/ShareModal.svelte` — mobile-responsive width
- `src/lib/components/CardDetailsModal.svelte` — mobile-responsive width
- `src/lib/components/YarnColorPalette.svelte` — flex-wrap for swatches
- `src/lib/components/ConnectionMenu.svelte` — flex-wrap for options
- `static/og-default.svg` — new placeholder OG image
