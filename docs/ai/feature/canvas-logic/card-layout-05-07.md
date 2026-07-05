# Card Layout Restructure (Task 5)

## Overview

Restructured the `CardBody.svelte` component to implement the specified layout rules for all card types on the canvas. Also fixed a bug where card positions were not being persisted between page reloads.

## Changes Made

### File: `src/lib/components/nodes/CardBody.svelte`

The card body was restructured into three distinct sections with a clear vertical flow:

1. **Card Header** - Contains the type icon and card name heading. The background color is determined by card type (blue for destination, orange for transport, green for activity, purple for stay).

2. **Content Section** - Conditionally renders one of two elements:
   - **Banner Image** (`banner-wrap`): When `header_img` is present, renders a full-width image below the heading. The image is cropped to fit via `object-fit: cover` within a fixed 80px height container.
   - **Description** (`desc-wrap`): When no image exists but a description is present, renders the description text. The text is clamped to 4 lines using `-webkit-line-clamp: 4` with ellipsis overflow, preventing any scroll.

3. **Card Footer** - A flex row with `justify-content: space-between` and `margin-top: auto` to pin it to the bottom of the card:
   - **Left side**: Price displayed in bold monospace font
   - **Right side**: Dates and duration stacked vertically with `align-items: flex-end`

A root wrapper `card-inner` with `display: flex; flex-direction: column; height: 100%; padding-bottom: 16px` ensures the footer is pushed to the bottom and avoids being clipped by the receipt (12px) and luggage tag (16px) clip-paths.

### Layout Behavior

- If no image and no description exist, only the header and footer render
- If no price exists, an empty spacer maintains the footer layout
- The footer remains pinned at the bottom of the card regardless of content height

### File: `src/routes/+page.svelte`

Fixed the `onNodeDragStop` and `onNodeClick` event handlers. SvelteFlow passes event arguments as a positional object where the node is at `targetNode`, `node`, or directly as the first argument depending on the event. Changed both handlers to use a flexible fallback pattern (`event?.targetNode ?? event?.node ?? event`) instead of a single destructured shape. This fixed both card position persistence and the selection/deletion feature.

## Verification

- Lint: passed (0 errors)
- Fallow: pre-existing issues only (worker-configuration.d.ts duplications, dev dependencies in prod)
- Visual: created cards for all 4 types (Destination, Transport, Activity, Stay) with name, description, price, dates, and duration. Confirmed correct layout on each: description with 4-line ellipsis, price bottom-left, dates/duration bottom-right, footer pinned to card bottom.
- Persistence: dragged Card 1, reloaded page, confirmed position was preserved.
- Selection: clicked a card, confirmed delete button appeared and node showed active state.
- Deletion: selected hbvnb card, clicked delete, confirmed card marked as deleted in localStorage.
