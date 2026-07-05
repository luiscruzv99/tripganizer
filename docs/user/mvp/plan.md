# Tripganization MVP

The objective of this plan is to prepare the mvp for the app. This is a live doc and will
be updated by the user frequently.

The end goal of the MVP: Serve the user a web canvas that shows draggable cards with information
inside. Changes to the canvas are persisted. New cards can be created and linked to other cards
via yarn lines.

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

## Task 4 - Card creation

The create card option should show a selector to choose which
type of card should be created, once clicked, the front should
show a modal form to fill all the fields of the card, except
for the id, the type, and the x and y positions. When the form
is submitted, the card gets created and rendered in the canvas,
as well as persisted. Name, header image, price, start and end
dates, as well as the duration must be rendered inside the card
in the canvas whenever filled. Each type of card should have a
distinct visual identity that follows the aesthetic.
