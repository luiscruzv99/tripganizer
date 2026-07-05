# Canvas Logic Feature

## Overview

Implemented the main canvas page with draggable card functionality for the tripganization MVP.

## Changes

### New Files

- `src/lib/actions/drag.ts`: A Svelte action that adds mouse-based drag behavior to any element. It tracks position state internally and calls an optional `onmove` callback when the element is dragged. The action properly cleans up event listeners on destroy.

- `src/lib/components/Card.svelte`: A card component styled with the app's pastel-cream brutalism aesthetic. Cards are positioned absolutely, have a cardstock-like appearance with subtle shadows, and use the draggable action for movement. The component accepts `x`, `y` coordinates and an `onmove` callback.

- `src/routes/+page.svelte`: The main canvas page that manages a list of cards with their positions. It renders a 2000x2000 pixel scrollable canvas with a subtle grid pattern background. Cards can be added via a fixed button in the bottom-right corner. Card positions are tracked in component state and updated when cards are dragged.

## Technical Details

- Cards use absolute positioning within a large canvas container
- Drag behavior is implemented as a reusable Svelte action
- The canvas has a paper-like grid background using CSS linear gradients
- Card styling follows the brutalism aesthetic with defined shadows and sharp corners
- All positions are tracked as pixel coordinates

## Dependencies

No new dependencies were added. Uses native Svelte 5 runes and DOM APIs.
