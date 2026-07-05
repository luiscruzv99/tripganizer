import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createYarn } from '$lib/server/yarns';

export const POST: RequestHandler = async ({ params, platform, request }) => {
	const d1 = platform!.env.DB;
	const body = await request.json();
	const yarn = await createYarn(d1, params.id, body);
	return json(yarn, { status: 201 });
};
