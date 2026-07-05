import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { updateCard, deleteCard } from '$lib/server/cards';

export const PATCH: RequestHandler = async ({ params, platform, request }) => {
	const d1 = platform!.env.DB;
	const body = await request.json();
	await updateCard(d1, params.id, params.cardId, body);
	return json({ ok: true });
};

export const DELETE: RequestHandler = async ({ params, platform }) => {
	const d1 = platform!.env.DB;
	await deleteCard(d1, params.id, params.cardId);
	return json({ ok: true });
};
