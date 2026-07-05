import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { addCardToYarn } from '$lib/server/yarns';

export const POST: RequestHandler = async ({ params, platform, request }) => {
	const d1 = platform!.env.DB;
	const { card_id } = await request.json();

	if (!card_id) {
		return json({ error: 'Missing card_id' }, { status: 400 });
	}

	try {
		await addCardToYarn(d1, params.yarnId, card_id);
		return json({ ok: true });
	} catch (e) {
		return json({ error: 'Failed to add card to yarn' }, { status: 500 });
	}
};
