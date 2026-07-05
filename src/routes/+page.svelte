<script lang="ts">
	import { SvelteFlow, MiniMap, type Node, type Edge } from '@xyflow/svelte';
	import '@xyflow/svelte/dist/style.css';
	import Topbar from '$lib/components/Topbar.svelte';
	import CardNode from '$lib/components/nodes/CardNode.svelte';
	import YarnEdge from '$lib/components/edges/YarnEdge.svelte';
	import type { Board, Card } from '$lib/types';

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

	let nodes = $state.raw<Node[]>(
		board.cards.map((card) => ({
			id: card.id,
			type: 'card',
			position: { x: card.x_pos ?? 0, y: card.y_pos ?? 0 },
			data: { card }
		}))
	);

	let edges = $state.raw<Edge[]>(
		board.yarns.flatMap((yarn) =>
			yarn.linked_cards.map((card) => ({
				id: `${yarn.id}-${card.id}`,
				source: yarn.parent_card?.id ?? '',
				target: card.id,
				type: 'yarn',
				data: { yarn }
			}))
		)
	);

	const nodeTypes = {
		card: CardNode
	};

	const edgeTypes = {
		yarn: YarnEdge
	};

	function onNodeDragStop(event: { node: Node }) {
		const { node } = event;
		board.cards = board.cards.map((card) =>
			card.id === node.id
				? {
						...card,
						x_pos: node.position.x,
						y_pos: node.position.y
					}
				: card
		);
		saveBoard();
	}

	function addCard() {
		const newCard: Card = {
			id: crypto.randomUUID(),
			name: `Card ${board.cards.length + 1}`,
			x_pos: Math.random() * 400 + 100,
			y_pos: Math.random() * 300 + 100
		};
		board.cards = [...board.cards, newCard];
		nodes = [
			...nodes,
			{
				id: newCard.id,
				type: 'card',
				position: { x: newCard.x_pos ?? 0, y: newCard.y_pos ?? 0 },
				data: { card: newCard }
			}
		];
		saveBoard();
	}
</script>

<Topbar name={board.name} startDate={board.start_date} endDate={board.end_date} />

<div class="canvas">
	<SvelteFlow
		bind:nodes
		bind:edges
		{nodeTypes}
		{edgeTypes}
		on:nodedragstop={onNodeDragStop}
		fitView
	>
		<MiniMap />
	</SvelteFlow>
	<button class="add-btn" onclick={addCard}>+</button>
</div>

<style>
	.canvas {
		width: 100vw;
		height: 100vh;
		padding-top: 48px;
		background: #e8e0d8;
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
		z-index: 10;
	}

	.add-btn:active {
		box-shadow: 1px 1px 0px 0px rgba(0, 0, 0, 0.2);
		transform: translate(2px, 2px);
	}
</style>
