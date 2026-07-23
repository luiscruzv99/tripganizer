<script lang="ts">
	import type { CardType } from '$lib/types';

	let { onSelect, onClose }: { onSelect: (type: CardType) => void; onClose: () => void } = $props();

	const types: { type: CardType; label: string; icon: string; color: string }[] = [
		{ type: 'DEST', label: 'Destination', icon: '🗽', color: '#d4e5f7' },
		{ type: 'TRANS', label: 'Transport', icon: '🚂', color: '#f7dcc4' },
		{ type: 'ACT', label: 'Activity', icon: '🎟', color: '#c4f7d4' },
		{ type: 'STAY', label: 'Stay', icon: '🛏', color: '#dcc4f7' }
	];
</script>

<div class="backdrop" onclick={onClose} role="presentation"></div>
<div class="selector">
	{#each types as t (t.type)}
		<button class="selector-option" onclick={() => onSelect(t.type)}>
			<span class="option-swatch" style="background: {t.color};"></span>
			<span class="option-icon">{t.icon}</span>
			<span class="option-label">{t.label}</span>
		</button>
	{/each}
</div>

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		z-index: 9;
	}

	.selector {
		position: fixed;
		bottom: 84px;
		right: 24px;
		z-index: 10;
		background: #faf8f5;
		border: 2px solid #1a1a1a;
		box-shadow: 4px 4px 0px 0px rgba(0, 0, 0, 0.2);
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.selector-option {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 10px 16px;
		background: none;
		border: none;
		border-bottom: 1px solid #e8e4df;
		cursor: pointer;
		transition: background 0.1s ease;
		text-align: left;
	}

	.selector-option:last-child {
		border-bottom: none;
	}

	.selector-option:hover {
		background: #f5f0eb;
	}

	.option-swatch {
		width: 14px;
		height: 14px;
		border: 1px solid #e8e4df;
		flex-shrink: 0;
	}

	.option-icon {
		font-size: 14px;
		width: 20px;
		text-align: center;
		flex-shrink: 0;
	}

	.option-label {
		font-family: monospace;
		font-size: 12px;
		font-weight: bold;
		color: #1a1a1a;
	}
</style>
