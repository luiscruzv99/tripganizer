<script lang="ts">
	import Card from '$lib/components/Card.svelte';

	interface CardData {
		id: string;
		x: number;
		y: number;
	}

	let cards: CardData[] = $state([
		{ id: '1', x: 100, y: 100 },
		{ id: '2', x: 350, y: 150 },
		{ id: '3', x: 600, y: 200 }
	]);

	let canvasEl: HTMLDivElement;

	function handleCardMove(id: string, x: number, y: number) {
		if (!canvasEl) return;
		const canvasRect = canvasEl.getBoundingClientRect();
		cards = cards.map((c) =>
			c.id === id
				? {
						...c,
						x: x - canvasRect.left + canvasEl.scrollLeft,
						y: y - canvasRect.top + canvasEl.scrollTop
					}
				: c
		);
	}

	function addCard() {
		cards = [
			...cards,
			{
				id: crypto.randomUUID(),
				x: Math.random() * 400 + 100,
				y: Math.random() * 300 + 100
			}
		];
	}
</script>

<div class="canvas" bind:this={canvasEl}>
	<div class="canvas-inner">
		{#each cards as card (card.id)}
			<Card x={card.x} y={card.y} onmove={(x, y) => handleCardMove(card.id, x, y)} />
		{/each}
	</div>
	<button class="add-btn" onclick={addCard}>+</button>
</div>

<style>
	.canvas {
		width: 100vw;
		height: 100vh;
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
