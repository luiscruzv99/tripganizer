<script lang="ts">
	import type { Yarn } from '$lib/types';

	let {
		existingYarns,
		onExtend,
		onNewYarn,
		onClose
	}: {
		existingYarns: Yarn[];
		onExtend: (yarnId: string) => void;
		onNewYarn: () => void;
		onClose: () => void;
	} = $props();
</script>

<div class="backdrop" onclick={onClose} role="presentation"></div>
<div class="menu">
	<span class="menu-label">CONNECT TO</span>
	<div class="options">
		{#each existingYarns as yarn (yarn.id)}
			<button
				class="swatch"
				style="background: {yarn.color};"
				title="Extend this yarn"
				onclick={() => onExtend(yarn.id)}
			></button>
		{/each}
		<button class="new-btn" title="New yarn" onclick={onNewYarn}>+</button>
	</div>
</div>

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		z-index: 9;
	}

	.menu {
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

	.menu-label {
		font-family: monospace;
		font-size: 11px;
		font-weight: bold;
		color: #1a1a1a;
		letter-spacing: 0.5px;
	}

	.options {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		align-items: center;
		justify-content: center;
	}

	.swatch {
		width: 28px;
		height: 28px;
		border-radius: 50%;
		border: 2px solid #1a1a1a;
		cursor: pointer;
		padding: 0;
		transition:
			transform 0.1s ease,
			box-shadow 0.1s ease;
	}

	.swatch:hover {
		transform: scale(1.2);
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
	}

	.new-btn {
		width: 28px;
		height: 28px;
		border-radius: 50%;
		border: 2px solid #1a1a1a;
		background: #faf8f5;
		cursor: pointer;
		font-size: 16px;
		font-weight: bold;
		color: #1a1a1a;
		padding: 0;
		transition:
			transform 0.1s ease,
			box-shadow 0.1s ease;
	}

	.new-btn:hover {
		transform: scale(1.2);
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
	}
</style>
