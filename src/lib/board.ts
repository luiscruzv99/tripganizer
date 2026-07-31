import type { Board, Card, Yarn } from '$lib/types';

export function createCard(data: Omit<Card, 'id' | 'x_pos' | 'y_pos'>): Card {
	return {
		...data,
		id: crypto.randomUUID(),
		x_pos: Math.random() * 400 + 100,
		y_pos: Math.random() * 300 + 100
	};
}

export function addCardToBoard(board: Board, card: Card): Board {
	return { ...board, cards: [...board.cards, card] };
}

export function deleteCardFromBoard(board: Board, id: string): Board {
	return {
		...board,
		cards: board.cards.map((c) => (c.id === id ? { ...c, deleted: true } : c))
	};
}

export function updateCard(board: Board, id: string, patch: Partial<Card>): Board {
	return {
		...board,
		cards: board.cards.map((c) => (c.id === id ? { ...c, ...patch } : c))
	};
}

export function updateCardPosition(board: Board, id: string, x: number, y: number): Board {
	return {
		...board,
		cards: board.cards.map((c) => (c.id === id ? { ...c, x_pos: x, y_pos: y } : c))
	};
}

export function createYarn(sourceCard: Card, targetCard: Card, color: string, label: string|undefined): Yarn {
	const isTransport = sourceCard.type === 'TRANS';
	return {
		id: crypto.randomUUID(),
		color,
		free_field: label,
		parent_card: isTransport ? sourceCard : undefined,
		linked_cards: isTransport ? [targetCard] : [sourceCard, targetCard]
	};
}

export function addYarnToBoard(board: Board, yarn: Yarn): Board {
	return { ...board, yarns: [...board.yarns, yarn] };
}

export function addCardToYarn(board: Board, yarnId: string, card: Card): Board {
	return {
		...board,
		yarns: board.yarns.map((y) => {
			if (y.id !== yarnId) return y;
			if (y.parent_card?.id === card.id || y.linked_cards.some((c) => c.id === card.id)) return y;
			return { ...y, linked_cards: [...y.linked_cards, card] };
		})
	};
}

export function removeYarnFromBoard(board: Board, yarnId: string): Board {
	return { ...board, yarns: board.yarns.filter((y) => y.id !== yarnId) };
}

export function findYarnForCard(board: Board, cardId: string): Yarn[]{
	return board.yarns.filter(
		(y) => 
			y.linked_cards.some((c) => c.id === cardId) 
			|| y.parent_card?.id === cardId
	);
}

export function checkDuplicateYarns(arr1: Yarn[], arr2: Yarn[]): boolean{
	const set1 = new Set(arr1.map(e => e.id));
	return arr2.some(e => set1.has(e.id));
}
