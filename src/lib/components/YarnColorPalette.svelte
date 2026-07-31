<script lang="ts">
	let {
		onSelect,
		onClose
	}: {
		onSelect: (color: string, label: string|undefined) => void;
		onClose: () => void;
	} = $props();

	
	const colors = [
		{ color: '#e07a5f', label: 'Terracotta' },
		{ color: '#81b29a', label: 'Sage' },
		{ color: '#f2cc8f', label: 'Sand' },
		{ color: '#3d405b', label: 'Ink' },
		{ color: '#e8a87c', label: 'Peach' },
		{ color: '#95b8d1', label: 'Sky' },
		{ color: '#b5838d', label: 'Mauve' },
		{ color: '#6d6875', label: 'Stone' }
	];
	let color = $state(colors[0]);
	let label = $state(undefined);
</script>

<div class="backdrop" onclick={onClose} role="presentation"></div>
<div class="palette">
	<span class="palette-label">LABEL (optional)</span>
	<input bind:value={label} placeholder="something..." type="text" class="input">
	<span class="palette-label">YARN COLOR</span>
	<div class="swatches">
		{#each colors as c (c.color)}
			{#if color.color == c.color}
			<button
				class="swatch active"
				style="background: {c.color};"
				title={c.label}
				onclick={() => color = c}
			></button>
			{:else}
			<button
				class="swatch"
				style="background: {c.color};"
				title={c.label}
				onclick={() => color = c}
			></button>
			{/if}
		{/each}
	</div>
	<button class="add-btn" onclick={() => onSelect(color.color, label)}>Create yarn</button>
</div>

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		z-index: 9;
		background-color: rgba(0, 0, 0, 0.2);
	}

	.palette {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 200;
		background: #faf8f5;
		border: 2px solid #1a1a1a;
		box-shadow: 6px 6px 0px 0px rgba(0, 0, 0, 0.8);
		padding: 16px 20px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
	}

	.palette-label {
		font-family: monospace;
		font-size: 11px;
		font-weight: bold;
		color: #1a1a1a;
		letter-spacing: 0.5px;
	}

	.swatches {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		justify-content: center;
	}

	.swatch {
		width: 28px;
		height: 28px;
		border-radius: 50%;
		border: 2px solid #1a1a1a;
		cursor: pointer;
		transition:
			transform 0.1s ease,
			box-shadow 0.1s ease;
		padding: 0;
	}

	.swatch:hover {
		transform: scale(1.2);
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
	}

	.active {
		transform: scale(1.35);
	}

	.input {
		padding: 10px 12px;
		border: 2px solid #1a1a1a;
		background: #fff;
		font-family: monospace;
		font-size: 14px;
		color: #1a1a1a;
		outline: none;
	}

	.input:focus {
		box-shadow: 2px 2px 0px 0px rgba(0, 0, 0, 0.15);
	}
	
	.add-btn{
		margin-top: 16px;
		padding: 12px 24px;
		min-height: 44px;
		background: #faf8f5;
		border: 2px solid #1a1a1a;
		box-shadow: 3px 3px 0px 0px rgba(0, 0, 0, 0.7);
		cursor: pointer;
		font-family: monospace;
		font-size: 14px;
		font-weight: bold;
		color: #1a1a1a;
		transition: all 0.1s ease;
	}

	.add-btn:active {
		box-shadow: 1px 1px 0px 0px rgba(0, 0, 0, 0.7);
		transform: translate(2px, 2px);
	}

	.add-btn:hover{
		transform: translate(-5px, -5px);
		box-shadow: 8px 8px 0px 0px rgba(0, 0, 0, 0.7);
	}
</style>
