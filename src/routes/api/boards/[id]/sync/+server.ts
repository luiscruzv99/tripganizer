import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { updateCardPositions } from '$lib/server/cards';

export const POST: RequestHandler = async ({ params, platform, request }) => {
	const d1 = platform!.env.DB;
	const body = await request.json();
	await updateCardPositions(d1, params.id, body.cards);
	return json({ ok: true });
};
