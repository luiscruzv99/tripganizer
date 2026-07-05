<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import Topbar from '$lib/components/Topbar.svelte';
	import type { Board, Card as CardType } from '$lib/types';

	const defaultBoard: Board = {
		id: crypto.randomUUID(),
		name: 'My Trip',
		created_date: new Date().toISOString().split('T')[0],
		cards: [
			{ id: '1', name: 'Card 1', x_pos: 100, y_pos: 100 },
			{ id: '2', name: 'Card 2', x_pos: 350, y_pos: 150 },
			{ id: '3', name: 'Card 3', x_pos: 600, y_pos: 200 }
		],
		yarns: []
	};

	function loadBoard(): Board {
		if (typeof window === 'undefined') return defaultBoard;
		const raw = localStorage.getItem('board');
		if (!raw) return defaultBoard;
		try {
			return JSON.parse(raw) as Board;
		} catch {
			return defaultBoard;
		}
	}

	let board: Board = $state(loadBoard());

	function saveBoard() {
		localStorage.setItem('board', JSON.stringify(board));
	}

	let canvasEl: HTMLDivElement;

	function handleCardMove(id: string, x: number, y: number) {
		if (!canvasEl) return;
		const canvasRect = canvasEl.getBoundingClientRect();
		board.cards = board.cards.map((c) =>
			c.id === id
				? {
						...c,
						x_pos: x - canvasRect.left + canvasEl.scrollLeft,
						y_pos: y - canvasRect.top + canvasEl.scrollTop
					}
				: c
		);
	}

	function handleCardDrop() {
		saveBoard();
	}

	function addCard() {
		const newCard: CardType = {
			id: crypto.randomUUID(),
			name: `Card ${board.cards.length + 1}`,
			x_pos: Math.random() * 400 + 100,
			y_pos: Math.random() * 300 + 100
		};
		board.cards = [...board.cards, newCard];
		saveBoard();
	}
</script>

<Topbar name={board.name} startDate={board.start_date} endDate={board.end_date} />

<div class="canvas" bind:this={canvasEl}>
	<div class="canvas-inner">
		{#each board.cards as card (card.id)}
			<Card {card} onmove={(x, y) => handleCardMove(card.id, x, y)} ondrop={handleCardDrop} />
		{/each}
	</div>
	<button class="add-btn" onclick={addCard}>+</button>
</div>

<style>
	.canvas {
		width: 100vw;
		height: 100vh;
		padding-top: 48px;
		overflow: auto;
		background: #e8e0d8;
		background-image:
			linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
			linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
		background-size: 40px 40px;
		position: relative;
	}

	.canvas-inner {
		position: relative;
		min-width: 2000px;
		min-height: 2000px;
	}

	.add-btn {
		position: fixed;
		bottom: 24px;
		right: 24px;
		width: 48px;
		height: 48px;
		background: #faf8f5;
		border: 2px solid #1a1a1a;
		box-shadow: 3px 3px 0px 0px rgba(0, 0, 0, 0.2);
		cursor: pointer;
		font-size: 24px;
		font-weight: bold;
		color: #1a1a1a;
		transition: all 0.1s ease;
	}

	.add-btn:active {
		box-shadow: 1px 1px 0px 0px rgba(0, 0, 0, 0.2);
		transform: translate(2px, 2px);
	}
</style>
