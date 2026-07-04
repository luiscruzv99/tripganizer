# Tripganization MVP

The objective of this plan is to prepare the mvp for the app. This is a live doc and will
be updated by the user frequently.

The end goal of the MVP: Serve the user a web canvas that shows draggable cards with information
inside. Changes to the canvas are persisted. New cards can be created and linked to other cards
via yarn lines. All of this must be behind a login screen, with no registry option. For now all users will
share a canvas

## Task 1 - Create the canvas logic
Create the main page of the app, which will be a full screen (finite) svelte canvas, that renders white
cardstock like empty cards, being draggable.