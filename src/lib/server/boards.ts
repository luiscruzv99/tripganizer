import { eq } from 'drizzle-orm';
import { getDb } from '$lib/server/db';
import {
	board as boardTable,
	card as cardTable,
	yarn as yarnTable,
	yarnCard
} from '$lib/server/db/schema';

function generateShortCode(): string {
	const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
	let code = '';
	for (let i = 0; i < 6; i++) {
		code += chars[Math.floor(Math.random() * chars.length)];
	}
	return code;
}

export async function createBoard(
	d1: D1Database,
	data: { name: string; description?: string; start_date?: string; end_date?: string }
) {
	const db = getDb(d1);
	const id = crypto.randomUUID();
	const shortCode = generateShortCode();
	const createdDate = new Date().toISOString().split('T')[0];

	await db.insert(boardTable).values({
		id,
		short_code: shortCode,
		...data,
		created_date: createdDate
	});

	return { id, short_code: shortCode, ...data, created_date: createdDate };
}

export async function getBoard(d1: D1Database, id: string) {
	const db = getDb(d1);

	const rows = await db
		.select({
			board: boardTable,
			card: cardTable,
			yarn: yarnTable
		})
		.from(boardTable)
		.leftJoin(cardTable, eq(cardTable.board_id, boardTable.id))
		.leftJoin(yarnTable, eq(yarnTable.board_id, boardTable.id))
		.where(eq(boardTable.id, id));

	if (rows.length === 0) return null;

	const b = rows[0].board;
	const cardsMap = new Map<string, typeof cardTable.$inferSelect>();
	const yarnsMap = new Map<
		string,
		typeof yarnTable.$inferSelect & { linked_cards: (typeof cardTable.$inferSelect)[] }
	>();

	for (const row of rows) {
		if (row.card && !cardsMap.has(row.card.id)) {
			cardsMap.set(row.card.id, row.card);
		}
		if (row.yarn && !yarnsMap.has(row.yarn.id)) {
			yarnsMap.set(row.yarn.id, { ...row.yarn, linked_cards: [] });
		}
	}

	// Fetch yarn-card links
	const yarnIds = [...yarnsMap.keys()];
	if (yarnIds.length > 0) {
		const allLinks = await db.select().from(yarnCard);
		for (const link of allLinks) {
			if (yarnIds.includes(link.yarn_id) && cardsMap.has(link.card_id)) {
				yarnsMap.get(link.yarn_id)!.linked_cards.push(cardsMap.get(link.card_id)!);
			}
		}
	}

	return {
		...b,
		cards: [...cardsMap.values()],
		yarns: [...yarnsMap.values()]
	};
}

export async function getBoardByShortCode(d1: D1Database, shortCode: string) {
	const db = getDb(d1);
	const rows = await db.select().from(boardTable).where(eq(boardTable.short_code, shortCode));
	return rows[0] ?? null;
}

export async function updateBoard(
	d1: D1Database,
	id: string,
	data: { name?: string; description?: string; start_date?: string; end_date?: string }
) {
	const db = getDb(d1);
	await db.update(boardTable).set(data).where(eq(boardTable.id, id));
}
