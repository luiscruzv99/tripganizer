import type { Board, Card, Yarn } from '$lib/types';

async function api<T>(url: string, options?: RequestInit): Promise<T> {
	const res = await fetch(url, {
		headers: { 'Content-Type': 'application/json' },
		...options
	});
	if (!res.ok) throw new Error(`API error: ${res.status}`);
	return res.json();
}

export async function fetchBoard(id: string): Promise<Board> {
	return api<Board>(`/api/boards/${id}`);
}

export async function createBoardApi(data: {
	name: string;
	description?: string;
	start_date?: string;
	end_date?: string;
}): Promise<Board> {
	return api<Board>('/api/boards', {
		method: 'POST',
		body: JSON.stringify(data)
	});
}

export async function createCardApi(boardId: string, data: Omit<Card, 'id'>): Promise<Card> {
	return api<Card>(`/api/boards/${boardId}/cards`, {
		method: 'POST',
		body: JSON.stringify(data)
	});
}

export async function updateCardApi(
	boardId: string,
	cardId: string,
	patch: Partial<Card>
): Promise<void> {
	await api(`/api/boards/${boardId}/cards/${cardId}`, {
		method: 'PATCH',
		body: JSON.stringify(patch)
	});
}

export async function deleteCardApi(boardId: string, cardId: string): Promise<void> {
	await api(`/api/boards/${boardId}/cards/${cardId}`, { method: 'DELETE' });
}

export async function createYarnApi(
	boardId: string,
	data: { color: string; free_field?: string; parent_card_id?: string; linked_card_ids: string[] }
): Promise<Yarn> {
	return api<Yarn>(`/api/boards/${boardId}/yarns`, {
		method: 'POST',
		body: JSON.stringify(data)
	});
}

export async function deleteYarnApi(boardId: string, yarnId: string): Promise<void> {
	await api(`/api/boards/${boardId}/yarns/${yarnId}`, { method: 'DELETE' });
}

export async function addCardToYarnApi(
	boardId: string,
	yarnId: string,
	cardId: string
): Promise<void> {
	await api(`/api/boards/${boardId}/yarns/${yarnId}/cards`, {
		method: 'POST',
		body: JSON.stringify({ card_id: cardId })
	});
}

export async function removeCardFromYarnApi(
	boardId: string,
	yarnId: string,
	cardId: string
): Promise<void> {
	await api(`/api/boards/${boardId}/yarns/${yarnId}/cards/${cardId}`, { method: 'DELETE' });
}

export async function syncPositionsApi(
	boardId: string,
	cards: { id: string; x_pos: number; y_pos: number }[]
): Promise<void> {
	await api(`/api/boards/${boardId}/sync`, {
		method: 'POST',
		body: JSON.stringify({ cards })
	});
}

export async function updateBoardApi(
	boardId: string,
	data: { name?: string; description?: string; start_date?: string; end_date?: string }
): Promise<void> {
	await api(`/api/boards/${boardId}`, {
		method: 'PATCH',
		body: JSON.stringify(data)
	});
}
