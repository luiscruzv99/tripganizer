<script lang="ts">
	import { getContext } from 'svelte';
	import type { NodeProps } from '@xyflow/svelte';
	import type { Card } from '$lib/types';
	import CardBody from './CardBody.svelte';
	import PinHandle from './PinHandle.svelte';

	let { data }: NodeProps = $props();
	let card: Card = $derived(data.card as Card);
	let selected: boolean = $derived(data.selected as boolean);

	const expandHandlers = getContext<Map<string, () => void>>('expandHandlers');
	function handleExpand() {
		expandHandlers.get(card.id)?.();
	}
</script>

{#if card.type === 'DEST'}
	<div class="card-node" class:selected>
		<PinHandle />
		<div class="card-shape postcard">
			<div class="postcard-stamp">
				<div class="stamp-inner"></div>
			</div>
			<div class="card-content">
				<CardBody {card} onExpand={handleExpand} />
			</div>
			<div class="postcard-address">
				<div class="address-line"></div>
				<div class="address-line"></div>
				<div class="address-line"></div>
				<div class="address-line"></div>
				<div class="address-line"></div>
				<div class="address-line"></div>
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
				<CardBody {card} onExpand={handleExpand} />
			</div>
		</div>
	</div>
{:else if card.type === 'ACT'}
	<div class="card-node" class:selected>
		<PinHandle />
		<div class="card-shape receipt">
			<div class="card-content">
				<CardBody {card} onExpand={handleExpand} />
			</div>
		</div>
	</div>
{:else}
	<div class="card-node" class:selected>
		<PinHandle />
		<div class="card-shape luggage-tag">
			<div class="card-content">
				<CardBody {card} onExpand={handleExpand} />
			</div>
		</div>
	</div>
{/if}

<style>
	.card-node {
		position: relative;
		filter: drop-shadow(5px 5px 0px rgba(0, 0, 0, 0.6));
		cursor: grab;
		user-select: none;
	}

	.card-node:active {
		cursor: grabbing;
		filter: drop-shadow(10px 10px 0px rgba(0, 0, 0, 0.8));
	}

	.card-node.selected {
		filter: drop-shadow(5px 5px 0px rgba(0, 0, 0, 1));
	}

	.card-shape {
		width: 200px;
		background: #faf8f5;
	}

	.card-content {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;
		overflow: hidden;
	}

	/* Postcard */
	.postcard {
		width: 320px;
		height: 220px;
		display: flex;
		flex-direction: row;
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

	.postcard-address{
		padding: 50px 0;
		width: 200px;
		background: #f5f0eb;
		border-left: 1px solid #e8e4df;
	}

	.address-line{
		margin: auto;
		width: 90px;
		height: 20px;
		border-bottom: 1px solid #aaa;
	}

	/* Boarding Pass */
	.boarding-pass {
		width: 360px;
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
		clip-path: polygon(100% 100%, 98% 99%, 96% 100%, 94% 99%, 92% 100%, 90% 99%, 88% 100%,
			86% 99%, 84% 100%, 82% 99%, 80% 100%, 78% 99%, 76% 100%,
			74% 99%, 72% 100%, 70% 99%, 68% 100%, 66% 99%, 64% 100%, 
			62% 99%, 60% 100%, 58% 99%, 56% 100%, 54% 99%, 52% 100%, 50% 99%,
			48% 100%, 46% 99%, 44% 100%, 42% 99%, 40% 100%, 38% 99%, 36% 100%, 34% 99%, 
			32% 100%, 30% 99%, 28% 100%, 26% 99%, 24% 100%, 
			22% 99%, 20% 100%, 18% 99%, 16% 100%, 14% 99%, 
			12% 100%, 10% 99%, 8% 100%, 6% 99%, 4% 100%,2% 99%,  
			0% 100%, 0% 0%, 40% 0%, 40% 5%, 60% 5%, 60% 0%, 100% 0%);
	}


	/* Luggage Tag */
	.luggage-tag {
		height: 300px;
		/*clip-path: polygon(100% 0%, 100% 95%, 90% 100%, 10% 100%, 0% 95%, 0% 0%);*/
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
