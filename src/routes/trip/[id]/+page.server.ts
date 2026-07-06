import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getBoard } from '$lib/server/boards';

export const load: PageServerLoad = async ({ params, platform }) => {
	const d1 = platform!.env.DB;
	const board = await getBoard(d1, params.id);
	if (!board) error(404, 'Trip not found');

	return {
		board: {
			id: board.id,
			short_code: board.short_code,
			name: board.name,
			description: board.description ?? undefined,
			created_date: board.created_date,
			start_date: board.start_date ?? undefined,
			end_date: board.end_date ?? undefined
		}
	};
};
