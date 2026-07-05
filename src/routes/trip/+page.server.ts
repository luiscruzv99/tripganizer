import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getBoardByShortCode } from '$lib/server/boards';

export const load: PageServerLoad = async ({ url, platform }) => {
	const shortCode = url.searchParams.get('view');
	if (!shortCode) throw redirect(302, '/');

	const d1 = platform!.env.DB;
	const board = await getBoardByShortCode(d1, shortCode);
	if (!board) throw redirect(302, '/');

	throw redirect(302, `/trip/${board.id}`);
};
