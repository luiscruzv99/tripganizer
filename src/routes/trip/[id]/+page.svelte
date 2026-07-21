<script lang="ts">
	import { SvelteFlow, MiniMap, type Node, type Edge } from '@xyflow/svelte';
	import '@xyflow/svelte/dist/style.css';
	import { setContext } from 'svelte';
	import Topbar from '$lib/components/Topbar.svelte';
	import CardTypeSelector from '$lib/components/CardTypeSelector.svelte';
	import CardFormModal from '$lib/components/CardFormModal.svelte';
	import EditBoardModal from '$lib/components/EditBoardModal.svelte';
	import ShareModal from '$lib/components/ShareModal.svelte';
	import CardDetailsModal from '$lib/components/CardDetailsModal.svelte';
	import {
		saveBoard,
		createCard,
		addCardToBoard,
		deleteCardFromBoard,
		updateCard,
		updateCardPosition,
		createYarn,
		addYarnToBoard,
		addCardToYarn,
		removeYarnFromBoard,
		findYarnForCard
	} from '$lib/board';
	import {
		fetchBoard,
		createBoardApi,
		createCardApi,
		updateCardApi,
		deleteCardApi,
		createYarnApi,
		deleteYarnApi,
		addCardToYarnApi,
		syncPositionsApi,
		updateBoardApi
	} from '$lib/api';
	import type { Card, CardType, Board } from '$lib/types';
	import CardNode from '$lib/components/nodes/CardNode.svelte';
	import YarnEdge from '$lib/components/edges/YarnEdge.svelte';
	import YarnColorPalette from '$lib/components/YarnColorPalette.svelte';
	import ConnectionMenu from '$lib/components/ConnectionMenu.svelte';
	import type { Yarn } from '$lib/types';

	let { data, params } = $props();

	const nodeTypes = { card: CardNode };
	const edgeTypes = { yarn: YarnEdge };

	const expandHandlers = $state<Map<string, () => void>>(new Map());
	setContext('expandHandlers', expandHandlers);

	let suppressNodeClick = false;

	let board = $state<Board>({
		id: data.board.id,
		short_code: data.board.short_code,
		name: data.board.name,
		description: data.board.description,
		created_date: data.board.created_date,
		start_date: data.board.start_date,
		end_date: data.board.end_date,
		cards: [],
		yarns: []
	});
	let boardId = $state<string | null>(params.id);
	let dirty = $state(false);

	function initNodes(): Node[] {
		return board.cards
			.filter((c) => !c.deleted)
			.map((c) => {
				expandHandlers.set(c.id, () => {
					suppressNodeClick = true;
					selectedCardId = c.id;
					showDetailsModal = true;
					setTimeout(() => (suppressNodeClick = false), 0);
				});
				return {
					id: c.id,
					type: 'card' as const,
					position: { x: c.x_pos ?? 0, y: c.y_pos ?? 0 },
					data: {
						card: c,
						selected: false
					}
				};
			});
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

	let nodes = $state.raw<Node[]>(initNodes());
	let edges = $state.raw<Edge[]>(initEdges());

	let showSelector = $state(false);
	let showModal = $state(false);
	let selectedType = $state<CardType>('DEST');
	let selectedCardId = $state<string | null>(null);
	let showColorPalette = $state(false);
	let showConnectionMenu = $state(false);
	let pendingConnection = $state<{ source: string; target: string } | null>(null);
	let existingYarnsForPending = $state<Yarn[]>([]);
	let selectedEdgeId = $state<string | null>(null);
	let showShareModal = $state(false);
	let showEditModal = $state(false);
	let showDetailsModal = $state(false);
	let editingCard = $state<Card | null>(null);

	let ogImage = '/og-default.svg';

	async function loadFromServer(id: string) {
		try {
			const serverBoard = await fetchBoard(id);
			board = {
				id: serverBoard.id,
				short_code: serverBoard.short_code,
				name: serverBoard.name,
				description: serverBoard.description ?? undefined,
				created_date: serverBoard.created_date,
				cards: (serverBoard.cards ?? []).map((c, i) => ({
					id: c.id,
					name: c.name,
					type: c.type as CardType,
					description: c.description ?? undefined,
					external_link: c.external_link ?? undefined,
					header_img: c.header_img ?? undefined,
					price: c.price ?? undefined,
					start_date: c.start_date ?? undefined,
					end_date: c.end_date ?? undefined,
					duration: c.duration ?? undefined,
					x_pos: c.x_pos ?? 100 + i * 200,
					y_pos: c.y_pos ?? 100 + i * 100,
					deleted: c.deleted ?? false
				})),
				yarns: (serverBoard.yarns ?? []).map((y) => ({
					id: y.id,
					color: y.color,
					free_field: y.free_field ?? undefined,
					parent_card: y.parent_card_id
						? ((serverBoard.cards ?? []).find((c) => c.id === y.parent_card_id) ?? undefined)
						: undefined,
					linked_cards: (y.linked_cards ?? []).map((lc) => ({
						id: lc.id,
						name: lc.name,
						type: lc.type as CardType,
						description: lc.description ?? undefined,
						external_link: lc.external_link ?? undefined,
						header_img: lc.header_img ?? undefined,
						price: lc.price ?? undefined,
						start_date: lc.start_date ?? undefined,
						end_date: lc.end_date ?? undefined,
						duration: lc.duration ?? undefined,
						x_pos: lc.x_pos ?? undefined,
						y_pos: lc.y_pos ?? undefined,
						deleted: lc.deleted ?? false
					})),
					start_date: serverBoard.start_date ?? undefined,
					end_date: serverBoard.end_date ?? undefined
				})),
				start_date: serverBoard.start_date ?? undefined,
				end_date: serverBoard.end_date ?? undefined
			};
			nodes = initNodes();
			edges = initEdges();
			saveBoard(board);
		} catch {
			// offline fallback
		}
	}

	async function handleEditSubmit(data: Partial<Board>) {
		if (!boardId) return;
		try {
			await updateBoardApi(boardId, data);
			board = { ...board, ...data };
			saveBoard(board);
			showEditModal = false;
		} catch {
			// handle error
		}
	}

	function onShare() {
		showShareModal = true;
	}

	function onEdit() {
		showEditModal = true;
	}

	function syncEdges(): Edge[] {
		return board.yarns.flatMap((yarn) => {
			const seq = [
				...(yarn.parent_card ? [yarn.parent_card] : []),
				...yarn.linked_cards.filter((c) => c.id !== yarn.parent_card?.id)
			];

			const edges: Edge[] = [];
			for (let i = 0; i < seq.length - 1; i++) {
				const source = seq[i];
				const target = seq[i + 1];
				edges.push({
					id: `${yarn.id}|${source.id}|${target.id}`,
					source: source.id,
					target: target.id,
					type: 'yarn' as const,
					data: { yarn },
					zIndex: 1000
				});
			}
			return edges;
		});
	}

	function syncNode(card: Card, selected: boolean): Node {
		expandHandlers.set(card.id, () => {
			suppressNodeClick = true;
			selectedCardId = card.id;
			showDetailsModal = true;
			setTimeout(() => (suppressNodeClick = false), 0);
		});
		return {
			id: card.id,
			type: 'card',
			position: { x: card.x_pos ?? 0, y: card.y_pos ?? 0 },
			data: {
				card,
				selected
			}
		};
	}

	function onNodeClick(...args: any[]) {
		if (suppressNodeClick) return;
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

	function onNodeDragStop(...args: any[]) {
		const event = args[0];
		const node = event?.targetNode ?? event?.node ?? event;
		if (!node?.id) return;
		board = updateCardPosition(board, node.id, node.position.x, node.position.y);
		saveBoard(board);
		dirty = true;
	}

	function deleteSelectedCard() {
		if (!selectedCardId) return;
		const id = selectedCardId;
		board = deleteCardFromBoard(board, id);
		nodes = nodes.filter((n) => n.id !== id);
		selectedCardId = null;
		saveBoard(board);
		if (boardId) deleteCardApi(boardId, id).catch(() => {});
	}

	async function handleCardSubmit(data: Omit<Card, 'id' | 'x_pos' | 'y_pos'>) {
		const card = createCard(data);
		board = addCardToBoard(board, card);
		nodes = [...nodes, syncNode(card, false)];
		saveBoard(board);
		showModal = false;

		if (boardId) {
			try {
				const created = await createCardApi(boardId, card);
				board = {
					...board,
					cards: board.cards.map((c) => (c.id === card.id ? { ...c, id: created.id } : c))
				};
				nodes = nodes.map((n) =>
					n.id === card.id
						? {
								...n,
								id: created.id,
								data: { ...n.data, card: { ...n.data.card, id: created.id } }
							}
						: n
				);
				saveBoard(board);
			} catch {
				// offline fallback
			}
		} else {
			try {
				const newBoard = await createBoardApi(board.name);
				boardId = newBoard.id;
				localStorage.setItem('boardId', newBoard.id);
				const created = await createCardApi(newBoard.id, card);
				board = board.cards.map((c) => (c.id === card.id ? { ...c, id: created.id } : c));
				nodes = nodes.map((n) =>
					n.id === card.id
						? {
								...n,
								id: created.id,
								data: { ...n.data, card: { ...n.data.card, id: created.id } }
							}
						: n
				);
				saveBoard(board);
			} catch {
				// offline fallback
			}
		}
	}

	function findCard(id: string): Card | undefined {
		return board.cards.find((c) => c.id === id);
	}

	function handleEditCardSubmit(data: Omit<Card, 'id' | 'x_pos' | 'y_pos'> & { id?: string }) {
		if (!data.id) return;
		const patch = { ...data, id: undefined };
		board = updateCard(board, data.id, patch);
		nodes = nodes.map((n) =>
			n.id === data.id ? { ...n, data: { ...n.data, card: { ...n.data.card, ...patch } } } : n
		);
		saveBoard(board);
		showModal = false;
		editingCard = null;
		if (boardId) updateCardApi(boardId, data.id, patch).catch(() => {});
	}

	function extendExistingYarn(sourceCard: Card, targetCard: Card, yarn: Yarn): boolean {
		const otherCard = sourceCard.id === yarn.parent_card?.id ? targetCard : sourceCard;
		if (yarn.linked_cards.some((c) => c.id === otherCard.id)) return false;
		if (yarn.parent_card?.id === otherCard.id) return false;
		board = addCardToYarn(board, yarn.id, otherCard);
		edges = syncEdges();
		saveBoard(board);
		if (boardId) addCardToYarnApi(boardId, yarn.id, otherCard.id).catch(() => {});
		return true;
	}

	function handleConnect(...args: any[]) {
		const conn = args[0];
		edges = edges.filter((e) => e.source !== conn.source || e.target !== conn.target);
		if (!conn?.source || !conn?.target || conn.source === conn.target) return;

		const sourceCard = findCard(conn.source);
		const targetCard = findCard(conn.target);
		if (!sourceCard || !targetCard) return;

		pendingConnection = { source: conn.source, target: conn.target };

		const sourceYarn = findYarnForCard(board, conn.source);
		const targetYarn = findYarnForCard(board, conn.target);
		const yarns: Yarn[] = [];
		if (sourceYarn) yarns.push(sourceYarn);
		if (targetYarn && (!sourceYarn || targetYarn.id !== sourceYarn.id)) yarns.push(targetYarn);

		if (yarns.length > 0) {
			existingYarnsForPending = yarns;
			showConnectionMenu = true;
		} else {
			showColorPalette = true;
		}
	}

	function handleExtendYarn(yarnId: string) {
		if (!pendingConnection) return;
		const sourceCard = findCard(pendingConnection.source);
		const targetCard = findCard(pendingConnection.target);
		if (!sourceCard || !targetCard) return;

		const yarn = board.yarns.find((y) => y.id === yarnId);
		if (!yarn) return;

		extendExistingYarn(sourceCard, targetCard, yarn);
		showConnectionMenu = false;
		pendingConnection = null;
		existingYarnsForPending = [];
	}

	function handleNewYarnFromMenu() {
		showConnectionMenu = false;
		showColorPalette = true;
	}

	function handleConnectionMenuClose() {
		showConnectionMenu = false;
		pendingConnection = null;
		existingYarnsForPending = [];
	}

	async function handleColorSelect(color: string, label: string|undefined) {
		if (!pendingConnection) return;
		const sourceCard = findCard(pendingConnection.source);
		const targetCard = findCard(pendingConnection.target);
		if (!sourceCard || !targetCard) return;

		const yarn = createYarn(sourceCard, targetCard, color, label);
		board = addYarnToBoard(board, yarn);
		edges = syncEdges();
		saveBoard(board);
		showColorPalette = false;
		pendingConnection = null;

		if (boardId) {
			try {
				const created = await createYarnApi(boardId, {
					color,
					parent_card_id: yarn.parent_card?.id,
					linked_card_ids: yarn.linked_cards.map((c) => c.id)
				});
				board = {
					...board,
					yarns: board.yarns.map((y) => (y.id === yarn.id ? { ...y, id: created.id } : y))
				};
				edges = syncEdges();
				saveBoard(board);
			} catch {
				// offline fallback
			}
		}
	}

	function handleColorClose() {
		showColorPalette = false;
		pendingConnection = null;
	}

	function handleEdgeClick(...args: any[]) {
		const event = args[0];
		const edge = event?.edge ?? event;
		if (!edge?.id) return;
		console.log('Edge clicked:', edge.id);
		const next = selectedEdgeId === edge.id ? null : edge.id;
		selectedEdgeId = next;
	}

	function deleteSelectedEdge() {
		if (!selectedEdgeId) {
			console.log('No edge selected');
			return;
		}
		const edge = edges.find((e) => e.id === selectedEdgeId);
		if (!edge) {
			console.log('Edge not found in edges array');
			return;
		}
		const yarnId = edge.id.split('|')[0];
		console.log('Deleting yarn:', yarnId);
		const yarn = board.yarns.find((y) => y.id === yarnId);
		if (!yarn) {
			console.log('Yarn not found in board');
			return;
		}
		board = removeYarnFromBoard(board, yarnId);
		edges = syncEdges();
		selectedEdgeId = null;
		saveBoard(board);
		if (boardId)
			deleteYarnApi(boardId, yarnId).catch((e) => console.error('API delete failed:', e));
	}

	function isValidConnection(connection: { source: string; target: string }) {
		if (connection.source === connection.target) return false;
		const sourceYarn = findYarnForCard(board, connection.source);
		const targetYarn = findYarnForCard(board, connection.target);
		if (sourceYarn && targetYarn && sourceYarn.id === targetYarn.id) return false;
		return true;
	}

	let syncInterval: ReturnType<typeof setInterval> | undefined;

	function startSync() {
		syncInterval = setInterval(() => {
			if (!dirty || !boardId) return;
			const positions = board.cards
				.filter((c) => !c.deleted)
				.map((c) => ({ id: c.id, x_pos: c.x_pos ?? 0, y_pos: c.y_pos ?? 0 }));
			syncPositionsApi(boardId, positions).then(() => {
				dirty = false;
			});
		}, 90_000);
	}

	function syncOnClose() {
		if (!dirty || !boardId) return;
		const positions = board.cards
			.filter((c) => !c.deleted)
			.map((c) => ({ id: c.id, x_pos: c.x_pos ?? 0, y_pos: c.y_pos ?? 0 }));
		navigator.sendBeacon(
			`/api/boards/${boardId}/sync`,
			new Blob([JSON.stringify({ cards: positions })], { type: 'application/json' })
		);
	}

	$effect(() => {
		if (boardId) loadFromServer(boardId);
		startSync();
		return () => clearInterval(syncInterval);
	});
</script>

<svelte:window onbeforeunload={syncOnClose} />

<svelte:head>
	<title>{board.name}</title>
	<meta property="og:title" content={board.name} />
	<meta
		property="og:description"
		content={board.description ?? 'A trip organized with Tripganization'}
	/>
	<meta property="og:image" content={ogImage} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={board.name} />
	<meta
		name="twitter:description"
		content={board.description ?? 'A trip organized with Tripganization'}
	/>
	<meta name="twitter:image" content={ogImage} />
</svelte:head>

<Topbar
	name={board.name}
	startDate={board.start_date}
	endDate={board.end_date}
	{onEdit}
	{onShare}
/>

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
		<MiniMap position="bottom-left" />
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
			card={editingCard ?? undefined}
			onSubmit={editingCard ? handleEditCardSubmit : handleCardSubmit}
			onClose={() => {
				showModal = false;
				editingCard = null;
			}}
		/>
	{/if}
	{#if showConnectionMenu}
		<ConnectionMenu
			existingYarns={existingYarnsForPending}
			onExtend={handleExtendYarn}
			onNewYarn={handleNewYarnFromMenu}
			onClose={handleConnectionMenuClose}
		/>
	{/if}
	{#if showColorPalette}
		<YarnColorPalette onSelect={handleColorSelect} onClose={handleColorClose} />
	{/if}
	{#if showShareModal}
		<ShareModal shortCode={board.short_code} onClose={() => (showShareModal = false)} />
	{/if}
	{#if showEditModal}
		<EditBoardModal {board} onSubmit={handleEditSubmit} onClose={() => (showEditModal = false)} />
	{/if}
	{#if showDetailsModal}
		<CardDetailsModal
			card={findCard(selectedCardId!)!}
			onEdit={() => {
				editingCard = findCard(selectedCardId!)!;
				selectedType = editingCard.type;
				showDetailsModal = false;
				showModal = true;
			}}
			onClose={() => (showDetailsModal = false)}
		/>
	{/if}
</div>

<style>
	.canvas {
		width: 100vw;
		height: 100vh;
		padding-top: calc(48px + env(safe-area-inset-top, 0px));
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
		box-shadow: 3px 3px 0px 0px rgba(0, 0, 0, 0.7);
		cursor: pointer;
		font-size: 24px;
		font-weight: bold;
		color: #1a1a1a;
		transition: all 0.1s ease;
		z-index: 10;
	}

	.add-btn:active {
		box-shadow: 1px 1px 0px 0px rgba(0, 0, 0, 0.7);
		transform: translate(2px, 2px);
	}

	.add-btn:hover{
		transform: translate(-5px, -5px);
		box-shadow: 8px 8px 0px 0px rgba(0, 0, 0, 0.7);
	}

	.delete-btn {
		position: fixed;
		bottom: 80px;
		right: 24px;
		width: 48px;
		height: 48px;
		background: #faf8f5;
		border: 2px solid #c44;
		box-shadow: 3px 3px 0px 0px rgba(0, 0, 0, 0.7);
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
		transform: translate(-5px, -5px);
		box-shadow: 8px 8px 0px 0px rgba(0, 0, 0, 0.7);
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
		box-shadow: 3px 3px 0px 0px rgba(0, 0, 0, 0.7);
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
		transform: translate(-5px, -5px);
		box-shadow: 8px 8px 0px 0px rgba(0, 0, 0, 0.7);
	}

	.delete-edge-btn:active {
		box-shadow: 1px 1px 0px 0px rgba(0, 0, 0, 0.2);
		transform: translate(2px, 2px);
	}

	@media (max-width: 480px) {
		.add-btn {
			bottom: 16px;
			right: 16px;
			width: 44px;
			height: 44px;
			font-size: 22px;
		}

		.delete-btn {
			bottom: 68px;
			right: 16px;
			width: 44px;
			height: 44px;
		}

		.delete-edge-btn {
			bottom: 120px;
			right: 16px;
			padding: 8px 12px;
			font-size: 10px;
		}
	}
</style>
