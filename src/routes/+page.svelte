<script lang="ts">
	import { SvelteFlow, MiniMap, type Node, type Edge } from '@xyflow/svelte';
	import '@xyflow/svelte/dist/style.css';
	import Topbar from '$lib/components/Topbar.svelte';
	import CardTypeSelector from '$lib/components/CardTypeSelector.svelte';
	import CardFormModal from '$lib/components/CardFormModal.svelte';
	import {
		loadBoard,
		saveBoard,
		createCard,
		addCardToBoard,
		deleteCardFromBoard,
		updateCardPosition
	} from '$lib/board';
	import type { Card, CardType } from '$lib/types';
	import CardNode from '$lib/components/nodes/CardNode.svelte';
	import YarnEdge from '$lib/components/edges/YarnEdge.svelte';

	const nodeTypes = { card: CardNode };
	const edgeTypes = { yarn: YarnEdge };

	let board = $state(loadBoard());

	function initNodes(): Node[] {
		return board.cards
			.filter((c) => !c.deleted)
			.map((c) => ({
				id: c.id,
				type: 'card' as const,
				position: { x: c.x_pos ?? 0, y: c.y_pos ?? 0 },
				data: { card: c, selected: false }
			}));
	}

	function initEdges(): Edge[] {
		return board.yarns.flatMap((yarn) =>
			yarn.linked_cards.map((card) => ({
				id: `${yarn.id}-${card.id}`,
				source: yarn.parent_card?.id ?? '',
				target: card.id,
				type: 'yarn' as const,
				data: { yarn }
			}))
		);
	}

	let nodes = $state<Node[]>(initNodes());
	let edges = $state.raw<Edge[]>(initEdges());

	let showSelector = $state(false);
	let showModal = $state(false);
	let selectedType = $state<CardType>('DEST');
	let selectedCardId = $state<string | null>(null);

	function syncNode(card: Card, selected: boolean): Node {
		return {
			id: card.id,
			type: 'card',
			position: { x: card.x_pos ?? 0, y: card.y_pos ?? 0 },
			data: { card, selected }
		};
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function onNodeClick(...args: any[]) {
		const node = (args[0]?.node ?? args[0]) as Node;
		if (!node?.id) return;
		const next = selectedCardId === node.id ? null : node.id;
		selectedCardId = next;
		nodes = nodes.map((n) => ({
			...n,
			data: { ...n.data, selected: n.id === next }
		}));
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function onNodeDragStop(...args: any[]) {
		const node = (args[0]?.node ?? args[0]) as Node;
		if (!node?.id) return;
		board = updateCardPosition(board, node.id, node.position.x, node.position.y);
		saveBoard(board);
	}

	function deleteSelectedCard() {
		if (!selectedCardId) return;
		const id = selectedCardId;
		board = deleteCardFromBoard(board, id);
		nodes = nodes.filter((n) => n.id !== id);
		selectedCardId = null;
		saveBoard(board);
	}

	function handleCardSubmit(data: Omit<Card, 'id' | 'x_pos' | 'y_pos'>) {
		const card = createCard(data);
		board = addCardToBoard(board, card);
		nodes = [...nodes, syncNode(card, false)];
		saveBoard(board);
		showModal = false;
	}
</script>

<Topbar name={board.name} startDate={board.start_date} endDate={board.end_date} />

<div class="canvas">
	<SvelteFlow
		bind:nodes
		bind:edges
		{nodeTypes}
		{edgeTypes}
		onnodedragstop={onNodeDragStop}
		onnodeclick={onNodeClick}
		fitView
	>
		<MiniMap />
	</SvelteFlow>
	{#if selectedCardId}
		<button class="delete-btn" onclick={deleteSelectedCard}>×</button>
	{/if}
	<button class="add-btn" onclick={() => (showSelector = !showSelector)}>+</button>
	{#if showSelector}
		<CardTypeSelector
			onSelect={(type) => {
				selectedType = type;
				showSelector = false;
				showModal = true;
			}}
			onClose={() => (showSelector = false)}
		/>
	{/if}
	{#if showModal}
		<CardFormModal
			cardType={selectedType}
			onSubmit={handleCardSubmit}
			onClose={() => (showModal = false)}
		/>
	{/if}
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

	.delete-btn {
		position: fixed;
		bottom: 80px;
		right: 24px;
		width: 48px;
		height: 48px;
		background: #faf8f5;
		border: 2px solid #c44;
		box-shadow: 3px 3px 0px 0px rgba(0, 0, 0, 0.2);
		cursor: pointer;
		font-size: 20px;
		font-weight: bold;
		color: #c44;
		transition: all 0.1s ease;
		z-index: 10;
	}

	.delete-btn:hover {
		background: #c44;
		color: #faf8f5;
	}

	.delete-btn:active {
		box-shadow: 1px 1px 0px 0px rgba(0, 0, 0, 0.2);
		transform: translate(2px, 2px);
	}
</style>
