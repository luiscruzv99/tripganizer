import { and, eq } from 'drizzle-orm';
import { getDb } from '$lib/server/db';
import { card as cardTable } from '$lib/server/db/schema';

export async function getCardsByBoard(d1: D1Database, boardId: string) {
	const db = getDb(d1);
	return db.select().from(cardTable).where(eq(cardTable.board_id, boardId));
}

export async function createCard(
	d1: D1Database,
	boardId: string,
	data: {
		name: string;
		type: string;
		description?: string;
		external_link?: string;
		header_img?: string;
		price?: number;
		start_date?: string;
		end_date?: string;
		duration?: string;
		x_pos?: number;
		y_pos?: number;
	}
) {
	const db = getDb(d1);
	const id = crypto.randomUUID();

	await db.insert(cardTable).values({
		id,
		board_id: boardId,
		...data
	});

	return { id, board_id: boardId, deleted: false, ...data };
}

export async function updateCard(
	d1: D1Database,
	boardId: string,
	cardId: string,
	data: {
		name?: string;
		type?: string;
		description?: string;
		external_link?: string;
		header_img?: string;
		price?: number;
		start_date?: string;
		end_date?: string;
		duration?: string;
		x_pos?: number;
		y_pos?: number;
	}
) {
	const db = getDb(d1);
	await db
		.update(cardTable)
		.set(data)
		.where(and(eq(cardTable.id, cardId), eq(cardTable.board_id, boardId)));
}

export async function updateCardPositions(
	d1: D1Database,
	boardId: string,
	positions: { id: string; x_pos: number; y_pos: number }[]
) {
	const db = getDb(d1);
	for (const pos of positions) {
		await db
			.update(cardTable)
			.set({ x_pos: pos.x_pos, y_pos: pos.y_pos })
			.where(and(eq(cardTable.id, pos.id), eq(cardTable.board_id, boardId)));
	}
}

export async function deleteCard(d1: D1Database, boardId: string, cardId: string) {
	const db = getDb(d1);
	await db
		.update(cardTable)
		.set({ deleted: true })
		.where(and(eq(cardTable.id, cardId), eq(cardTable.board_id, boardId)));
}
