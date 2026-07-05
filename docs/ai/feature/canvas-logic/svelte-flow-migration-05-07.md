# Svelte Flow Migration

## Overview

Migrated the tripganization canvas from a custom implementation to the Svelte Flow library. This provides built-in zoom, pan, minimap, and better performance for node-based UIs while preserving the existing aesthetic.

## Changes

### New Dependencies

- `@xyflow/svelte`: Node-based UI library for Svelte

### New Files

- `src/lib/components/nodes/CardNode.svelte`: Custom Svelte Flow node component for cards. Preserves the cardstock-like appearance with shadows and monospace typography. Includes handle components for future edge connections.

- `src/lib/components/edges/YarnEdge.svelte`: Custom Svelte Flow edge component for yarn lines. Renders bezier paths with custom colors and optional labels from the yarn's free_field property.

### Modified Files

- `src/lib/types.ts`: Cleaned up exports, removed unused type definitions.

- `src/routes/+page.svelte`: Replaced custom canvas implementation with SvelteFlow component. Converts board cards to nodes and yarns to edges. Uses `$state.raw` for performance. Handles node drag events to persist positions to localStorage.

- `vite.config.ts`: Added `optimizeDeps.include` for `@xyflow/svelte` and `@xyflow/system` to fix ES module directory import resolution issues.

### Removed Files

- `src/lib/components/Card.svelte`: Replaced by CardNode.svelte

- `src/lib/actions/drag.ts`: No longer needed, Svelte Flow handles drag behavior

## Technical Details

- Board state remains the source of truth, converted to Svelte Flow nodes/edges
- Node positions are synced back to board on drag stop
- MiniMap component included for navigation
- Plain beige background (#e8e0d8) without grid pattern
- Edge creation deferred to future implementation
- Free positioning (no snap-to-grid)
- Vite config requires `optimizeDeps.include` for Svelte Flow to resolve ES module directory imports correctly

## Decisions

- **MiniMap**: Included in MVP for navigation overview
- **Edge creation**: Deferred, depends on factors not yet implemented
- **Snap to grid**: Disabled, free positioning only

## Aesthetic Preservation

Card styling maintains the pastel-cream brutalism aesthetic:

- Background: #faf8f5 (paper-like)
- Shadows: 4px 4px and 2px 2px for depth
- Border: #e8e4df subtle divider
- Header: #f5f0eb slightly darker
- Typography: monospace, 12px, bold

## Next Steps

- Implement edge creation mechanism
- Add yarn line color picker
- Consider adding card content editing
