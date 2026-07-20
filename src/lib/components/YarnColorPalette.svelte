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
	<input bind:value={label} placeholder="something..." type="text">
	<span class="palette-label">YARN COLOR</span>
	<div class="swatches">
		{#each colors as c (c.color)}
			<button
				class="swatch"
				style="background: {c.color};"
				title={c.label}
				onclick={() => color = c}
			></button>
		{/each}
	</div>
	<button onclick={() => onSelect(color.color, label)}>Create yarn</button>
</div>

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		z-index: 9;
	}

	.palette {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 200;
		background: #faf8f5;
		border: 2px solid #1a1a1a;
		box-shadow: 6px 6px 0px 0px rgba(0, 0, 0, 0.2);
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

	.swatch:active {
		transform: scale(1.1);
	}
</style>
