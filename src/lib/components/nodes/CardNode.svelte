<script lang="ts">
	import type { NodeProps } from '@xyflow/svelte';
	import type { Card } from '$lib/types';

	let { data }: NodeProps = $props();
	let card: Card = $derived(data.card as Card);
</script>

<div class="card-node">
	<div class="card-content">
		<div class="card-header">
			<span class="card-name">{card.name}</span>
		</div>
		<div class="card-body">
			{#if card.description}
				<p class="card-description">{card.description}</p>
			{/if}
			{#if card.price}
				<span class="card-price">${card.price}</span>
			{/if}
		</div>
	</div>
</div>

<style>
	.card-node {
		width: 200px;
		height: 280px;
		background: #faf8f5;
		box-shadow:
			4px 4px 0px 0px rgba(0, 0, 0, 0.15),
			2px 2px 0px 0px rgba(0, 0, 0, 0.1);
		border: 1px solid #e8e4df;
		cursor: grab;
		user-select: none;
	}

	.card-node:active {
		cursor: grabbing;
		box-shadow:
			6px 6px 0px 0px rgba(0, 0, 0, 0.2),
			3px 3px 0px 0px rgba(0, 0, 0, 0.12);
	}

	.card-content {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.card-header {
		height: 60px;
		background: #f5f0eb;
		border-bottom: 1px solid #e8e4df;
		display: flex;
		align-items: center;
		padding: 0 12px;
	}

	.card-name {
		font-family: monospace;
		font-size: 12px;
		font-weight: bold;
		color: #1a1a1a;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.card-body {
		flex: 1;
		padding: 12px;
	}

	.card-description {
		font-size: 11px;
		color: #666;
		margin: 0;
	}

	.card-price {
		font-family: monospace;
		font-size: 12px;
		font-weight: bold;
		color: #1a1a1a;
		margin-top: 8px;
		display: block;
	}
</style>
