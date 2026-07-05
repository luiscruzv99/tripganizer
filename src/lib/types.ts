export type CardType = 'DEST' | 'TRANS' | 'ACT' | 'STAY';

export interface Card {
	id: string;
	name: string;
	type: CardType;
	description?: string;
	external_link?: string;
	header_img?: string;
	price?: number;
	start_date?: string;
	end_date?: string;
	duration?: string;
	x_pos?: number;
	y_pos?: number;
	deleted?: boolean;
}

export interface Board {
	id: string;
	short_code: string;
	name: string;
	description?: string;
	created_date: string;
	cards: Card[];
	yarns: Yarn[];
	start_date?: string;
	end_date?: string;
}

export interface Yarn {
	id: string;
	color: string;
	free_field?: string;
	parent_card?: Card;
	linked_cards: Card[];
}
