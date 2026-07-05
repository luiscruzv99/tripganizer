import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getBoard, updateBoard } from '$lib/server/boards';

export const GET: RequestHandler = async ({ params, platform }) => {
	const d1 = platform!.env.DB;
	const board = await getBoard(d1, params.id);
	if (!board) return json({ error: 'Board not found' }, { status: 404 });
	return json(board);
};

export const PATCH: RequestHandler = async ({ params, platform, request }) => {
	const d1 = platform!.env.DB;
	const body = await request.json();
	await updateBoard(d1, params.id, body);
	return json({ ok: true });
};
