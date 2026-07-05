# Tripganization app

The following document gives an overview of the tripganization full stack app. It is designed
to give guidance on how to develop for this app to AI coding agents.

## The stack

The stack of this app uses svelte kit, with better auth for authentication, drizzle orm for
interacting with the db, tailwindcss for styling, and eslint for linting.

It is designed to be deployed to a cloudflare workers free instance and to use the cloudflare
d1 provider for the db.

## The aesthetic

The app will have a pastel-cream soft brutalism aesthetic, leaning towards sharp angles and
defined contrasty shadows, light pastel warm tones, and paper and corkboard inspired layout and elements.

## Coding style

The coding style for this app must be minimalistic and simplistic, prefering to use short, understandable
functions, rather than conveluted syntax. All while keeping documentation comments to a minimum, and
leveraging the power of typescript for the typechecking.

## Commiting style

Commits must be authored frequently and must be as atomic as possible. Code must always be developed
in a feature branch separate from the trunk one. Commits must be signed by the ai agent
developing the code and their message must be as short and concise as possible, without a description.

## Documentation

User generated documentation, including workplans and feature requests live on @docs/user/, while
ai generated documentation must be placed inside of @docs/ai/. Documentation must be created after development
of a feature in the corresponding folder (@docs/ai/<branch>/<feature-dd-mm>.md), explaining the changes done
in a verbose manner WITHOUT including code examples.
