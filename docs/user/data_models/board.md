# The board object

The main object of the app, it contains everything within it.

{
    id: uuid!,
    name: string!,
    description: string?,
    created_date: date!,
    cards: card[]!
    yarns: yarn[]!
}