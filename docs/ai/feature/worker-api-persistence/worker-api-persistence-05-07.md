# Worker API and Persistence

## Overview

Implemented backend CRUD APIs for boards, cards, and yarns using Cloudflare D1 with Drizzle ORM, and wired the frontend to use these APIs for server-side persistence while keeping localStorage as a fallback.

## Database Schema

Four domain tables were created in D1 alongside the existing better-auth tables:

- **board** — Core entity with `id` (uuid), `short_code` (unique 6-char slug), `name`, `description`, `created_date`, `start_date`, `end_date`.
- **card** — Belongs to a board via `board_id` foreign key. Contains all card fields including `type` (DEST/TRANS/ACT/STAY), `x_pos`, `y_pos`, `deleted` (soft delete), and optional metadata fields.
- **yarn** — Belongs to a board via `board_id`. Has `color`, optional `free_field`, and optional `parent_card_id` (for transport-parented yarns).
- **yarn_card** — Junction table linking yarns to their associated cards with `yarn_id` and `card_id` foreign keys with cascade deletes.

## Server CRUD Modules

Three focused modules in `src/lib/server/`:

- **boards.ts** — `createBoard()` generates uuid and 6-char short code, `getBoard()` performs a three-way join across board/card/yarn tables and resolves yarn-card links from the junction table, `getBoardByShortCode()` for slug-based lookup, `updateBoard()` for metadata edits.
- **cards.ts** — `createCard()`, `updateCard()`, `updateCardPositions()` (batch), `deleteCard()` (soft delete). All operations are scoped to a board via compound WHERE clauses.
- **yarns.ts** — `createYarn()` inserts into yarn table and batch-inserts junction records, `addCardToYarn()`, `removeCardFromYarn()`, `deleteYarn()`.

## API Routes

RESTful endpoints under `src/routes/api/`:

| Route                                            | Methods       | Purpose                             |
| ------------------------------------------------ | ------------- | ----------------------------------- |
| `/api/boards`                                    | POST          | Create new board                    |
| `/api/boards/[id]`                               | GET, PATCH    | Fetch full board or update metadata |
| `/api/boards/[id]/cards`                         | POST          | Create card in board                |
| `/api/boards/[id]/cards/[cardId]`                | PATCH, DELETE | Update or soft-delete card          |
| `/api/boards/[id]/yarns`                         | POST          | Create yarn in board                |
| `/api/boards/[id]/yarns/[yarnId]`                | DELETE        | Delete yarn                         |
| `/api/boards/[id]/yarns/[yarnId]/cards`          | POST          | Add card to yarn                    |
| `/api/boards/[id]/yarns/[yarnId]/cards/[cardId]` | DELETE        | Remove card from yarn               |
| `/api/boards/[id]/sync`                          | POST          | Bulk sync card positions            |

The GET `/api/boards/[id]` endpoint hydrates the full board: metadata, all cards, and all yarns with their linked cards resolved through the junction table.

## Frontend API Client

`src/lib/api.ts` provides typed fetch wrappers for all API routes. Each function handles JSON serialization, error checking, and returns typed responses.

## Frontend Wiring

`src/routes/+page.svelte` was updated to:

1. On first card creation, create a board on the server and store the `boardId` in both state and localStorage.
2. All card and yarn mutations (create, delete, connect) fire API calls after local state updates, providing optimistic UI with server persistence.
3. A 90-second periodic sync interval sends all card positions to the batch sync endpoint when the board has been modified.
4. On tab close, `navigator.sendBeacon()` fires a final position sync.
5. On page load, the board is fetched from D1 if a `boardId` exists in localStorage or the URL contains a `?board=` parameter.

## Migration Note

The `db:push` drizzle-kit command requires the `CLOUDFLARE_D1_TOKEN` environment variable for the d1-http driver. A runtime migration endpoint was used as a workaround to ensure tables were created in the correct D1 instance bound to the worker.

## Files Changed

- `src/lib/server/db/schema.ts` — Replaced placeholder `task` table with board, card, yarn, yarn_card tables
- `src/lib/server/boards.ts` — New board CRUD module
- `src/lib/server/cards.ts` — New card CRUD module
- `src/lib/server/yarns.ts` — New yarn CRUD module
- `src/lib/api.ts` — New frontend API client
- `src/routes/api/boards/+server.ts` — Board creation endpoint
- `src/routes/api/boards/[id]/+server.ts` — Board fetch/update endpoint
- `src/routes/api/boards/[id]/cards/+server.ts` — Card creation endpoint
- `src/routes/api/boards/[id]/cards/[cardId]/+server.ts` — Card update/delete endpoint
- `src/routes/api/boards/[id]/yarns/+server.ts` — Yarn creation endpoint
- `src/routes/api/boards/[id]/yarns/[yarnId]/+server.ts` — Yarn deletion endpoint
- `src/routes/api/boards/[id]/yarns/[yarnId]/cards/+server.ts` — Add card to yarn endpoint
- `src/routes/api/boards/[id]/yarns/[yarnId]/cards/[cardId]/+server.ts` — Remove card from yarn endpoint
- `src/routes/api/boards/[id]/sync/+server.ts` — Batch position sync endpoint
- `src/routes/+page.svelte` — Wired to API with periodic sync and unload sync
- `src/lib/server/db/auth.schema.ts` — Generated better-auth schema
