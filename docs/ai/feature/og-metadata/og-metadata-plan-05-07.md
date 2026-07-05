# OG Metadata Auto-Fill — Implementation Plan

## Goal

When a user pastes a URL into the "External link" field of the card creation form, a button appears that fetches the page's Open Graph metadata (title, description, image) and auto-fills the corresponding card fields (name, description, header_img). The user can review and override the values before submitting.

## Background

Websites embed `<meta>` tags following the Open Graph protocol so social media platforms can generate rich link previews. The relevant tags are:

- `og:title` — page title
- `og:description` — short description
- `og:image` — preview image URL

These live in the `<head>` of the HTML as:
```html
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:image" content="..." />
```

Some sites also use `twitter:title`, `twitter:description`, `twitter:image` as fallbacks.

## Architecture

The app is a SvelteKit project deployed to Cloudflare Workers. The browser cannot fetch arbitrary URLs due to CORS, so a **Cloudflare Worker API route** will act as a proxy: it receives a URL, fetches the HTML, parses the OG tags, and returns them as JSON.

```
Browser                    SvelteKit Server (CF Worker)         Target Website
  │                              │                                    │
  │  POST /api/og?url=...        │                                    │
  │ ─────────────────────────>   │                                    │
  │                              │   GET url (server-side, no CORS)   │
  │                              │ ─────────────────────────────────> │
  │                              │   <─ HTML with <meta> tags         │
  │                              │ <───────────────────────────────── │
  │                              │                                    │
  │                              │   Parse og:title, og:description,  │
  │                              │   og:image from HTML                │
  │                              │                                    │
  │  { title, description, image }                                     │
  │ <─────────────────────────   │                                    │
  │                              │                                    │
  │  Auto-fill form fields       │                                    │
```

## Implementation Steps

### Step 1 — Create the API route

**File:** `src/routes/api/og/+server.ts`

This is a SvelteKit server endpoint (runs as a CF Worker). It:

1. Accepts `GET /api/og?url=<encoded-url>` with a JSON response.
2. Validates the `url` parameter — must be a valid HTTP/HTTPS URL.
3. Fetches the target URL using `fetch()` with a 5-second timeout and a browser-like `User-Agent` header (some sites block non-browser user agents).
4. Reads the response as text (only the first ~50KB to avoid downloading huge pages).
5. Parses the HTML to extract `<meta>` tags.
6. Returns a JSON object: `{ title, description, image }`. Any field may be `null` if not found.

**Parsing approach:** Use regex to find `<meta>` tags with `property` or `name` attributes matching OG and Twitter Card patterns. No external HTML parser library needed — regex is sufficient for this narrow use case on well-formed `<head>` sections.

Priority order for each field:
- `title`: `og:title` → `twitter:title` → `<title>` tag → `null`
- `description`: `og:description` → `twitter:description` → `<meta name="description">` → `null`
- `image`: `og:image` → `twitter:image` → `null`

For `image`, resolve relative URLs to absolute using the fetched URL's origin.

**Error handling:**
- Invalid or missing `url` param → 400 `{ error: "Invalid URL" }`
- Fetch timeout or network error → 502 `{ error: "Could not fetch URL" }`
- No OG tags found → 200 `{ title: null, description: null, image: null }` (not an error)

**Rate limiting consideration:** For MVP, no rate limiting. The worker is called only when the user explicitly clicks a button. If abuse becomes an issue, add a simple counter per IP using D1 or KV later.

### Step 2 — Add a fetch utility function

**File:** `src/lib/og.ts`

A client-side helper that calls the API route:

```ts
export interface OgMetadata {
    title: string | null;
    description: string | null;
    image: string | null;
}

export async function fetchOgMetadata(url: string): Promise<OgMetadata> {
    const res = await fetch(`/api/og?url=${encodeURIComponent(url)}`);
    if (!res.ok) throw new Error('Failed to fetch metadata');
    return res.json();
}
```

This keeps the API call logic in one place, reusable if needed elsewhere (e.g., editing cards).

### Step 3 — Update the CardFormModal

**File:** `src/lib/components/CardFormModal.svelte`

Changes:

1. **Add state variables:**
   - `let fetchingOg = $state(false)` — loading indicator
   - `let ogError = $state<string | null>(null)` — error message

2. **Add a "Fetch" button** next to the External link input:
   - Only visible when `externalLink` is a valid URL (starts with `http://` or `https://`).
   - Shows a spinner or "Fetching..." text while `fetchingOg` is true.
   - On click, calls `fetchOgMetadata(externalLink)`.

3. **On successful fetch**, populate fields:
   - If `og.title` is non-null and `name` is empty, set `name = og.title`.
   - If `og.description` is non-null and `description` is empty, set `description = og.description`.
   - If `og.image` is non-null, store it (see step 4).
   - Show a brief confirmation message like "Metadata fetched" that fades after 2 seconds.

4. **If fields already have values**, do not overwrite. Instead, show a small note: "Fields already filled — clear them first to auto-fill from link."

5. **Error state:** If fetch fails, show the error message in a small red text below the link input. Clear it when the user edits the link field.

6. **Add `header_img` to the form submission:**
   - Add a hidden state variable `let headerImg = $state('')`.
   - When OG image is fetched, set `headerImg = og.image`.
   - Include `header_img: headerImg || undefined` in the `onSubmit` call.

### Step 4 — Visual changes to the link field area

The External link field area becomes a small cluster:

```
┌─────────────────────────────────────┐
│ EXTERNAL LINK                       │
│ ┌───────────────────────┐ ┌───────┐ │
│ │ https://example.com   │ │ Fetch │ │
│ └───────────────────────┘ └───────┘ │
│ ✓ Metadata fetched                  │
└─────────────────────────────────────┘
```

- The "Fetch" button uses the same brutalist styling as other buttons (monospace, 2px border, box-shadow).
- While fetching, the button shows "..." and is disabled.
- The confirmation/error text appears below in a small monospace font.

### Step 5 — Handle image display in the form

After the OG image is fetched, show a small preview thumbnail below the link field so the user can confirm it looks right:

```
┌─────────────────────────────────────┐
│ HEADER IMAGE PREVIEW                │
│ ┌─────────────────────────────────┐ │
│ │         [thumbnail]             │ │
│ └─────────────────────────────────┘ │
│ ✕ Remove image                      │
└─────────────────────────────────────┘
```

- Show only if `headerImg` is set.
- The thumbnail uses `object-fit: cover` in a fixed-height container (60px).
- A "Remove image" link clears `headerImg` so the card renders without a header image.

### Step 6 — Tests

**Manual verification via Playwright:**
1. Open the create card modal.
2. Paste a URL with OG tags (e.g., `https://github.com`) into the External link field.
3. Click "Fetch".
4. Verify name, description, and header image preview populate.
5. Submit the card.
6. Verify the card renders on the canvas with the fetched image as the banner and the description below the name.

**Edge cases to test:**
- URL with no OG tags → fields stay empty, no error.
- Invalid URL → "Fetch" button doesn't appear.
- Network error → error message shown.
- Fields already filled → warning shown, no overwrite.
- Remove image → card renders without banner.

### Step 7 — Documentation

After implementation, write a feature doc at `docs/ai/feature/og-metadata/og-feature-dd-mm.md` explaining the changes.

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/routes/api/og/+server.ts` | Create | OG metadata proxy endpoint |
| `src/lib/og.ts` | Create | Client-side fetch utility |
| `src/lib/components/CardFormModal.svelte` | Modify | Add Fetch button, auto-fill logic, image preview |

## Dependencies

None. No external libraries needed. Uses native `fetch()` on both server and client, and regex for HTML parsing.

## Risk Notes

- Some sites require JavaScript rendering to produce OG tags (SPA sites). The worker fetches raw HTML, so these won't have OG tags. This is acceptable — the user can always fill fields manually.
- Some sites block non-browser user agents. The worker should send a reasonable `User-Agent` string.
- The `og:image` URL might be relative or use a different protocol. The parser should resolve it to an absolute HTTPS URL.
- Image URLs from external sites may become unavailable over time. For a future iteration, the worker could proxy and cache images via CF Images or KV.
