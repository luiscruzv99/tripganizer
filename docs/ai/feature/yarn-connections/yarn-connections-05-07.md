# Yarn Connections Feature

## Overview

Implemented yarn connections for the tripganization MVP canvas. Yarn connections allow users to visually link cards together using colored bezier edges, representing relationships between travel elements.

## Changes Made

### New Files

**`src/lib/components/nodes/PinHandle.svelte`**

Custom SvelteFlow Handle component styled as a brass corkboard pushpin. Uses `type="source"` and `Position.Top` to create a draggable connection point at the top-center of each card. Features radial gradient styling with hover and connecting animations.

**`src/lib/components/YarnColorPalette.svelte`**

Modal popup component displaying 8 predefined pastel yarn colors (terracotta, sage, sand, ink, peach, sky, mauve, stone). Appears centered on screen when a new yarn connection is initiated. Each color is a circular swatch button with hover effects.

### Modified Files

**`src/lib/board.ts`**

Added yarn CRUD functions:

- `createYarn(sourceCard, targetCard, color)` — Creates a Yarn object. If source is a Transport card, it becomes `parent_card`; otherwise both cards go into `linked_cards`
- `addYarnToBoard(board, yarn)` — Appends a yarn to the board
- `addCardToYarn(board, yarnId, card)` — Extends an existing yarn with a new card (prevents duplicates)
- `removeYarnFromBoard(board, yarnId)` — Removes a yarn by ID
- `findYarnForCard(board, cardId)` — Finds the first yarn containing a given card

**`src/lib/components/nodes/CardNode.svelte`**

Imported and rendered `PinHandle` inside all four card type shapes (DEST, TRANS, ACT, STAY). The pin handle is positioned at the top of each card shape.

**`src/routes/+page.svelte`**

Added connection handling logic:

- `handleConnect` — SvelteFlow `onconnect` callback. If either card is already in a yarn, extends that yarn. Otherwise shows the color palette for new yarn creation
- `extendExistingYarn` — Adds a card to an existing yarn if not already present
- `findCard` — Helper to look up a card by ID
- `handleColorSelect` — Creates a new yarn with the selected color and persists
- `handleEdgeClick` — Selects edges for deletion
- `deleteSelectedEdge` — Removes a yarn and its edges
- `isValidConnection` — Prevents self-connections and duplicate yarn links
- `syncEdges` — Rebuilds SvelteFlow edges from board yarns

Added SvelteFlow props: `onconnect`, `onedgeclick`, `isValidConnection`, `connectionMode="loose"`

Added UI: color palette modal, edge delete button ("Cut yarn")

## Architecture Decisions

**Transport parent semantics:** When a Transport card initiates a yarn, it becomes the `parent_card` per the data model spec. Non-Transport connections use `linked_cards` only with no parent.

**Yarn extension:** Dragging from a card already in a yarn to a new card extends that yarn automatically (no color palette needed).

**Validation:** Self-connections and duplicate yarn links are prevented via `isValidConnection`.

**Color palette:** 8 predefined pastel colors chosen to match the app's brutalist aesthetic. Colors are distinct enough to differentiate yarns visually.

## Verification

- Lint: passed (eslint + prettier)
- Typecheck: passed (svelte-check errors are pre-existing in .svelte-kit output)
- Fallow: maintainability 95.5 (good), 0% dead code, 0% duplication in source code
- Visual: Playwright MCP confirmed pins visible on all 4 card types, canvas renders correctly
