<script lang="ts">
	import type { NodeProps } from '@xyflow/svelte';
	import type { Card } from '$lib/types';
	import CardBody from './CardBody.svelte';
	import PinHandle from './PinHandle.svelte';

	let { data }: NodeProps = $props();
	let card: Card = $derived(data.card as Card);
	let selected: boolean = $derived(data.selected as boolean);
</script>

{#if card.type === 'DEST'}
	<div class="card-node" class:selected>
		<PinHandle />
		<div class="card-shape postcard">
			<div class="postcard-stamp">
				<div class="stamp-inner"></div>
			</div>
			<div class="card-content">
				<CardBody {card} />
			</div>
		</div>
	</div>
{:else if card.type === 'TRANS'}
	<div class="card-node" class:selected>
		<PinHandle />
		<div class="card-shape boarding-pass">
			<div class="bp-stub">
				<span class="stub-label">BOARDING PASS</span>
			</div>
			<div class="bp-tear">
				<div class="tear-notch"></div>
				<div class="tear-notch"></div>
				<div class="tear-notch"></div>
				<div class="tear-notch"></div>
				<div class="tear-notch"></div>
				<div class="tear-notch"></div>
				<div class="tear-notch"></div>
				<div class="tear-notch"></div>
				<div class="tear-notch"></div>
				<div class="tear-notch"></div>
				<div class="tear-notch"></div>
				<div class="tear-notch"></div>
			</div>
			<div class="card-content">
				<CardBody {card} />
			</div>
		</div>
	</div>
{:else if card.type === 'ACT'}
	<div class="card-node" class:selected>
		<PinHandle />
		<div class="card-shape receipt">
			<div class="receipt-notch"></div>
			<div class="card-content">
				<CardBody {card} />
			</div>
		</div>
	</div>
{:else}
	<div class="card-node" class:selected>
		<PinHandle />
		<div class="card-shape luggage-tag">
			<div class="tag-hole">
				<div class="tag-string"></div>
			</div>
			<div class="card-content">
				<CardBody {card} />
			</div>
		</div>
	</div>
{/if}

<style>
	.card-node {
		position: relative;
		filter: drop-shadow(3px 4px 0px rgba(0, 0, 0, 0.35));
		cursor: grab;
		user-select: none;
	}

	.card-node:active {
		cursor: grabbing;
		filter: drop-shadow(4px 6px 0px rgba(0, 0, 0, 0.4));
	}

	.card-node.selected {
		filter: drop-shadow(0px 0px 2px rgba(26, 26, 26, 0.8))
			drop-shadow(3px 4px 0px rgba(0, 0, 0, 0.35));
	}

	.card-shape {
		width: 200px;
		background: #faf8f5;
		outline: 2px solid #b8b0a6;
		outline-offset: -2px;
	}

	.card-content {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	/* Postcard */
	.postcard {
		height: 280px;
		clip-path: polygon(
			0 0,
			100% 0,
			100% calc(100% - 8px),
			calc(100% - 4px) 100%,
			4px 100%,
			0 calc(100% - 8px)
		);
	}

	.postcard-stamp {
		position: absolute;
		top: 6px;
		right: 6px;
		width: 32px;
		height: 38px;
		border: 1.5px dashed #ccc;
		z-index: 1;
	}

	.stamp-inner {
		position: absolute;
		inset: 4px;
		border: 1px solid #ddd;
	}

	/* Boarding Pass */
	.boarding-pass {
		width: 280px;
		height: 180px;
		display: flex;
		flex-direction: row;
	}

	.boarding-pass .card-content {
		flex: 1;
	}

	.bp-stub {
		width: 56px;
		background: #f5f0eb;
		border-right: 1px solid #e8e4df;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.stub-label {
		font-family: monospace;
		font-size: 7px;
		font-weight: bold;
		color: #aaa;
		writing-mode: vertical-rl;
		text-orientation: mixed;
		letter-spacing: 1px;
	}

	.bp-tear {
		width: 12px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 6px 0;
		flex-shrink: 0;
	}

	.tear-notch {
		width: 12px;
		height: 6px;
		background: #e8e0d8;
		border-radius: 0 6px 6px 0;
	}

	/* Receipt */
	.receipt {
		position: relative;
		height: 280px;
		clip-path: polygon(0 0, 100% 0, 100% calc(100% - 12px), 0 calc(100% - 12px));
	}

	.receipt::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 12px;
		background: linear-gradient(
			135deg,
			#faf8f5 33.33%,
			transparent 33.33%,
			transparent 66.67%,
			#faf8f5 66.67%
		);
		background-size: 12px 12px;
	}

	.receipt-notch {
		position: absolute;
		top: -1px;
		left: 50%;
		transform: translateX(-50%);
		width: 30px;
		height: 10px;
		background: #e8e0d8;
		border-left: 1px solid #e8e4df;
		border-right: 1px solid #e8e4df;
		border-bottom: 1px solid #e8e4df;
		z-index: 1;
	}

	/* Luggage Tag */
	.luggage-tag {
		height: 300px;
		clip-path: polygon(
			20px 0,
			calc(100% - 20px) 0,
			100% 20px,
			100% calc(100% - 16px),
			calc(100% - 8px) calc(100% - 4px),
			calc(100% - 16px) calc(100% - 8px),
			calc(100% - 24px) calc(100% - 12px),
			calc(100% - 32px) calc(100% - 14px),
			50% calc(100% - 16px),
			32px calc(100% - 14px),
			24px calc(100% - 12px),
			16px calc(100% - 8px),
			8px calc(100% - 4px),
			0 calc(100% - 16px),
			0 20px
		);
	}

	.tag-hole {
		position: absolute;
		top: 8px;
		left: 50%;
		transform: translateX(-50%);
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: #e8e0d8;
		border: 1.5px solid #ccc;
		z-index: 1;
	}

	.tag-string {
		position: absolute;
		top: -10px;
		left: 50%;
		transform: translateX(-50%);
		width: 2px;
		height: 12px;
		background: #aaa;
	}
</style>
