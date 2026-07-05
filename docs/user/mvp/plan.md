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

## Task 2 - Add contrasty topbar to the canvas + persistence

Add to the canvas view a topbar that shows the name,
start_date and end_dates (only if present) of the canvas.
Also, cards, should keep their x and y positions (save on drop/stop dragging) between reloads of the page,
as well as the amount of cards on the canvas. For now,
just save to localStorage.

## Task 3 - Migrate to svelte flow library

Migrate the current canvas implementation to make use of
the free version of svelteflow, while preserving the aesthetic. Make also sure to implement any changes to the data model.
