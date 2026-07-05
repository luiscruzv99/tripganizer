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
		updateCardPosition,
		createYarn,
		addYarnToBoard,
		addCardToYarn,
		removeYarnFromBoard,
		findYarnForCard
	} from '$lib/board';
	import type { Card, CardType } from '$lib/types';
	import CardNode from '$lib/components/nodes/CardNode.svelte';
	import YarnEdge from '$lib/components/edges/YarnEdge.svelte';
	import YarnColorPalette from '$lib/components/YarnColorPalette.svelte';

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
		return board.yarns.flatMap((yarn) => {
			const sourceId = yarn.parent_card?.id ?? yarn.linked_cards[0]?.id ?? '';
			return yarn.linked_cards
				.filter((card) => card.id !== sourceId)
				.map((card) => ({
					id: `${yarn.id}-${card.id}`,
					source: sourceId,
					target: card.id,
					type: 'yarn' as const,
					data: { yarn },
					zIndex: 1000
				}));
		});
	}

	let nodes = $state<Node[]>(initNodes());
	let edges = $state<Edge[]>(initEdges());

	let showSelector = $state(false);
	let showModal = $state(false);
	let selectedType = $state<CardType>('DEST');
	let selectedCardId = $state<string | null>(null);
	let showColorPalette = $state(false);
	let pendingConnection = $state<{ source: string; target: string } | null>(null);
	let selectedEdgeId = $state<string | null>(null);

	function syncEdges(): Edge[] {
		return board.yarns.flatMap((yarn) => {
			const sourceId = yarn.parent_card?.id ?? yarn.linked_cards[0]?.id ?? '';
			return yarn.linked_cards
				.filter((card) => card.id !== sourceId)
				.map((card) => ({
					id: `${yarn.id}-${card.id}`,
					source: sourceId,
					target: card.id,
					type: 'yarn' as const,
					data: { yarn },
					zIndex: 1000
				}));
		});
	}

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
		const event = args[0];
		const node = event?.targetNode ?? event?.node ?? event;
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
		const event = args[0];
		const node = event?.targetNode ?? event?.node ?? event;
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

	function findCard(id: string): Card | undefined {
		return board.cards.find((c) => c.id === id);
	}

	function extendExistingYarn(sourceCard: Card, targetCard: Card, yarn: Yarn): boolean {
		const otherCard = sourceCard.id === yarn.parent_card?.id ? targetCard : sourceCard;
		if (yarn.linked_cards.some((c) => c.id === otherCard.id)) return false;
		if (yarn.parent_card?.id === otherCard.id) return false;
		board = addCardToYarn(board, yarn.id, otherCard);
		edges = syncEdges();
		saveBoard(board);
		return true;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function handleConnect(...args: any[]) {
		const conn = args[0];
		edges = edges.filter((e) => e.source !== conn.source || e.target !== conn.target);
		if (!conn?.source || !conn?.target || conn.source === conn.target) return;

		const sourceCard = findCard(conn.source);
		const targetCard = findCard(conn.target);
		if (!sourceCard || !targetCard) return;

		const existingYarn = findYarnForCard(board, conn.source) ?? findYarnForCard(board, conn.target);
		if (existingYarn) {
			extendExistingYarn(sourceCard, targetCard, existingYarn);
			return;
		}

		pendingConnection = { source: conn.source, target: conn.target };
		showColorPalette = true;
	}

	function handleColorSelect(color: string) {
		if (!pendingConnection) return;
		const sourceCard = findCard(pendingConnection.source);
		const targetCard = findCard(pendingConnection.target);
		if (!sourceCard || !targetCard) return;

		const yarn = createYarn(sourceCard, targetCard, color);
		board = addYarnToBoard(board, yarn);
		edges = syncEdges();
		saveBoard(board);
		showColorPalette = false;
		pendingConnection = null;
	}

	function handleColorClose() {
		showColorPalette = false;
		pendingConnection = null;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function handleEdgeClick(...args: any[]) {
		const event = args[0];
		const edge = event?.edge ?? event;
		if (!edge?.id) return;
		selectedEdgeId = selectedEdgeId === edge.id ? null : edge.id;
	}

	function deleteSelectedEdge() {
		if (!selectedEdgeId) return;
		const edge = edges.find((e) => e.id === selectedEdgeId);
		if (!edge) return;
		const yarnId = edge.id.split('-')[0];
		const yarn = board.yarns.find((y) => y.id === yarnId);
		if (!yarn) return;
		board = removeYarnFromBoard(board, yarnId);
		edges = syncEdges();
		selectedEdgeId = null;
		saveBoard(board);
	}

	function isValidConnection(connection: { source: string; target: string }) {
		if (connection.source === connection.target) return false;
		const sourceYarn = findYarnForCard(board, connection.source);
		const targetYarn = findYarnForCard(board, connection.target);
		if (sourceYarn && targetYarn && sourceYarn.id === targetYarn.id) return false;
		return true;
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
		onconnect={handleConnect}
		onedgeclick={handleEdgeClick}
		{isValidConnection}
		connectionMode="loose"
		fitView
	>
		<MiniMap />
	</SvelteFlow>
	{#if selectedCardId}
		<button class="delete-btn" onclick={deleteSelectedCard}>×</button>
	{/if}
	{#if selectedEdgeId}
		<button class="delete-edge-btn" onclick={deleteSelectedEdge}>Cut yarn</button>
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
	{#if showColorPalette}
		<YarnColorPalette onSelect={handleColorSelect} onClose={handleColorClose} />
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

	.delete-edge-btn {
		position: fixed;
		bottom: 136px;
		right: 24px;
		padding: 10px 16px;
		background: #faf8f5;
		border: 2px solid #c44;
		box-shadow: 3px 3px 0px 0px rgba(0, 0, 0, 0.2);
		cursor: pointer;
		font-family: monospace;
		font-size: 11px;
		font-weight: bold;
		color: #c44;
		transition: all 0.1s ease;
		z-index: 10;
	}

	.delete-edge-btn:hover {
		background: #c44;
		color: #faf8f5;
	}

	.delete-edge-btn:active {
		box-shadow: 1px 1px 0px 0px rgba(0, 0, 0, 0.2);
		transform: translate(2px, 2px);
	}
</style>
