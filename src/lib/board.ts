import type { Board, Card, Yarn } from '$lib/types';

const defaultCards: Card[] = [
	{ id: '1', name: 'Card 1', type: 'DEST', x_pos: 100, y_pos: 100 },
	{ id: '2', name: 'Card 2', type: 'TRANS', x_pos: 350, y_pos: 150 },
	{ id: '3', name: 'Card 3', type: 'ACT', x_pos: 600, y_pos: 200 }
];

function emptyBoard(): Board {
	return {
		id: crypto.randomUUID(),
		name: 'My Trip',
		created_date: new Date().toISOString().split('T')[0],
		cards: defaultCards,
		yarns: []
	};
}

function hydrate(raw: string | null): Board {
	if (!raw) return emptyBoard();
	const b = JSON.parse(raw) as Board;
	b.cards = b.cards.map((c) => ({ ...c, type: c.type ?? 'DEST' }));
	return b;
}

export function loadBoard(): Board {
	if (typeof window === 'undefined') return emptyBoard();
	try {
		return hydrate(localStorage.getItem('board'));
	} catch {
		return emptyBoard();
	}
}

export function saveBoard(board: Board) {
	localStorage.setItem('board', JSON.stringify(board));
}

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

export function createYarn(sourceCard: Card, targetCard: Card, color: string): Yarn {
	const isTransport = sourceCard.type === 'TRANS';
	return {
		id: crypto.randomUUID(),
		color,
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

export function findYarnForCard(board: Board, cardId: string): Yarn | undefined {
	return board.yarns.find(
		(y) => y.linked_cards.some((c) => c.id === cardId) || y.parent_card?.id === cardId
	);
}
