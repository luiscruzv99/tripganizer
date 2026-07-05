# OG Metadata and Board Improvements

## OG Metadata Auto-Fill
Implemented a system to automatically populate card details when an external link is provided. This includes a new server-side API route that acts as a proxy to fetch and parse Open Graph and Twitter Card metadata from external websites. The frontend was updated to include a fetch button and a preview of the fetched header image.

## Card Visual Fixes
Resolved overflow issues in the card component. The title now correctly displays ellipses when it exceeds the card width, and the banner image is center-cropped using object-fit and specific container constraints to prevent it from overflowing the card boundaries.

## User Experience Enhancements
Added a floating external link icon to cards that have an associated URL, allowing users to quickly navigate to the source. Updated the trip view page to dynamically set the browser tab title to the name of the trip and added OG metadata to the page for better sharing previews. The project favicon was also updated to a plane emoji.

## Performance and Stability
Optimized Svelte Flow performance by switching nodes and edges to use raw state, reducing proxy overhead. Fixed a critical bug where the board state was being corrupted during card and yarn creation.

## Yarn Logic Improvements
Corrected the yarn topology from a star pattern to a chain pattern, ensuring that edges are created sequentially and respect the node of origin. Fixed a bug in the "Cut yarn" functionality where UUIDs were being split incorrectly, and implemented the missing API endpoint for adding cards to existing yarns.
