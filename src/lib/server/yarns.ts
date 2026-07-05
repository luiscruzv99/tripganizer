import { and, eq } from 'drizzle-orm';
import { getDb } from '$lib/server/db';
import { yarn as yarnTable, yarnCard } from '$lib/server/db/schema';

export async function getYarnsByBoard(d1: D1Database, boardId: string) {
	const db = getDb(d1);
	return db.select().from(yarnTable).where(eq(yarnTable.board_id, boardId));
}

export async function createYarn(
	d1: D1Database,
	boardId: string,
	data: {
		color: string;
		free_field?: string;
		parent_card_id?: string;
		linked_card_ids: string[];
	}
) {
	const db = getDb(d1);
	const id = crypto.randomUUID();

	await db.insert(yarnTable).values({
		id,
		board_id: boardId,
		color: data.color,
		free_field: data.free_field,
		parent_card_id: data.parent_card_id
	});

	if (data.linked_card_ids.length > 0) {
		await db
			.insert(yarnCard)
			.values(data.linked_card_ids.map((cardId) => ({ yarn_id: id, card_id: cardId })));
	}

	return {
		id,
		board_id: boardId,
		color: data.color,
		free_field: data.free_field,
		parent_card_id: data.parent_card_id,
		linked_cards: data.linked_card_ids
	};
}

export async function addCardToYarn(d1: D1Database, yarnId: string, cardId: string) {
	const db = getDb(d1);
	await db.insert(yarnCard).values({ yarn_id: yarnId, card_id: cardId });
}

export async function removeCardFromYarn(d1: D1Database, yarnId: string, cardId: string) {
	const db = getDb(d1);
	await db.delete(yarnCard).where(and(eq(yarnCard.yarn_id, yarnId), eq(yarnCard.card_id, cardId)));
}

export async function deleteYarn(d1: D1Database, yarnId: string) {
	const db = getDb(d1);
	await db.delete(yarnTable).where(eq(yarnTable.id, yarnId));
}
