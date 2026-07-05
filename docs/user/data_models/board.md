# The board object

The main object of the app, it contains everything within it.

{
id: uuid!,
short_code: string!,
name: string!,
description: string?,
created_date: date!,
cards: card[]!,
yarns: yarn[]!,
start_date: date?,
end_date: date?
}
