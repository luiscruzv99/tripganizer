import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { addCardToYarn, removeCardFromYarn } from '$lib/server/yarns';

export const POST: RequestHandler = async ({ params, platform, request }) => {
	const d1 = platform!.env.DB;
	const body = await request.json();
	await addCardToYarn(d1, params.yarnId, body.card_id);
	return json({ ok: true }, { status: 201 });
};

export const DELETE: RequestHandler = async ({ params, platform }) => {
	const d1 = platform!.env.DB;
	await removeCardFromYarn(d1, params.yarnId, params.cardId);
	return json({ ok: true });
};
