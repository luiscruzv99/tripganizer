# The yarn line model

A yarn line connects several cards together, linking them and showing their relationship.
This relationship can mean anything, from similarity to travel time etc.

{
id: uuid!,
color: string!,
free_field: string?,
parent_card: card?
linked_cards: card[]
}
