# The card object

A card on a board, can be of 4 types: Destination, Transport, Activity and Stay.

All of the types share the same attributes

{
id: uuid!,
name: string!,
description: string?,
external_link: string?,
header_img: string?,
price: decimal?,
start_date: date?,
end_date: date?,
duration: timedelta?,
x_pos: decimal?,
y_pos: decimal?
}
