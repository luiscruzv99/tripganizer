import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createBoard } from '$lib/server/boards';

export const POST: RequestHandler = async ({ platform, request }) => {
	const d1 = platform!.env.DB;
	const body = await request.json();
	const name = body.name || 'My Trip';
	const board = await createBoard(d1, name);
	return json(board, { status: 201 });
};
