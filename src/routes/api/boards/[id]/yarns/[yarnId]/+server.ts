import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { deleteYarn } from '$lib/server/yarns';

export const DELETE: RequestHandler = async ({ params, platform }) => {
	const d1 = platform!.env.DB;
	await deleteYarn(d1, params.yarnId);
	return json({ ok: true });
};
