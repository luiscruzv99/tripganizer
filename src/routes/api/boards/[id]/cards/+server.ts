import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createCard } from '$lib/server/cards';

export const POST: RequestHandler = async ({ params, platform, request }) => {
	const d1 = platform!.env.DB;
	const body = await request.json();
	const card = await createCard(d1, params.id, body);
	return json(card, { status: 201 });
};
