<script lang="ts">
	import type { Card, CardType } from '$lib/types';

	let {
		card,
		onEdit,
		onClose
	}: {
		card: Card;
		onEdit: () => void;
		onClose: () => void;
	} = $props();

	$effect(() => {
		console.log('CardDetailsModal mounted with card:', card);
	});

	const typeLabels: Record<CardType, string> = {
		DEST: 'Destination',
		TRANS: 'Transport',
		ACT: 'Activity',
		STAY: 'Stay'
	};

	const typeColors: Record<CardType, string> = {
		DEST: '#d4e5f7',
		TRANS: '#f7dcc4',
		ACT: '#c4f7d4',
		STAY: '#dcc4f7'
	};
</script>

<div class="backdrop" onclick={onClose} role="presentation"></div>
<div class="modal">
	<div class="modal-header" style="background: {typeColors[card.type]};">
		<span class="modal-type">{typeLabels[card.type]}</span>
		<button class="modal-close" onclick={onClose}>×</button>
	</div>
	<div class="modal-body">
		{#if card.header_img}
			<div class="header-image">
				<img src={card.header_img} alt="" />
			</div>
		{/if}

		<h2 class="card-title">{card.name}</h2>

		{#if card.description}
			<p class="card-description">{card.description}</p>
		{/if}

		<div class="details-grid">
			{#if card.external_link}
				<div class="detail-item">
					<span class="label">Link</span>
					<a href={card.external_link} target="_blank" rel="noopener noreferrer" class="value link">
						{card.external_link}
					</a>
				</div>
			{/if}

			{#if card.price !== undefined}
				<div class="detail-item">
					<span class="label">Price</span>
					<span class="value">${card.price}</span>
				</div>
			{/if}

			{#if card.duration}
				<div class="detail-item">
					<span class="label">Duration</span>
					<span class="value">{card.duration}</span>
				</div>
			{/if}

			{#if card.start_date || card.end_date}
				<div class="detail-item">
					<span class="label">Dates</span>
					<span class="value">
						{card.start_date ?? '...'}
						{card.start_date && card.end_date ? 'to' : ''}
						{card.end_date ?? '...'}
					</span>
				</div>
			{/if}
		</div>
	</div>
	<div class="modal-actions">
		<button class="btn-edit" onclick={onEdit}>Edit</button>
		<button class="btn-close" onclick={onClose}>Close</button>
	</div>
</div>

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		z-index: 300;
		background: rgba(0, 0, 0, 0.3);
	}

	.modal {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 301;
		width: 420px;
		max-height: 90vh;
		overflow-y: auto;
		background: #faf8f5;
		border: 2px solid #1a1a1a;
		box-shadow: 8px 8px 0px 0px rgba(0, 0, 0, 0.2);
		display: flex;
		flex-direction: column;
	}

	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 12px 16px;
		border-bottom: 2px solid #1a1a1a;
	}

	.modal-type {
		font-family: monospace;
		font-size: 14px;
		font-weight: bold;
		color: #1a1a1a;
	}

	.modal-close {
		background: none;
		border: none;
		font-size: 24px;
		font-weight: bold;
		color: #1a1a1a;
		cursor: pointer;
		padding: 0;
		line-height: 1;
	}

	.modal-body {
		padding: 20px;
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.header-image {
		width: 100%;
		height: 180px;
		border: 2px solid #1a1a1a;
		overflow: hidden;
		background: #eee;
	}

	.header-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.card-title {
		font-family: monospace;
		font-size: 20px;
		font-weight: bold;
		color: #1a1a1a;
		margin: 0;
		line-height: 1.2;
	}

	.card-description {
		font-family: monospace;
		font-size: 13px;
		color: #444;
		line-height: 1.5;
		margin: 0;
	}

	.details-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
		gap: 12px;
		margin-top: 8px;
	}

	.detail-item {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 8px;
		border: 1px solid #e8e4df;
		background: #fff;
	}

	.label {
		font-family: monospace;
		font-size: 10px;
		font-weight: bold;
		color: #888;
		text-transform: uppercase;
	}

	.value {
		font-family: monospace;
		font-size: 12px;
		color: #1a1a1a;
		word-break: break-all;
	}

	.value.link {
		color: #1a1a1a;
		text-decoration: underline;
	}

	.modal-actions {
		padding: 16px;
		border-top: 2px solid #1a1a1a;
		display: flex;
		justify-content: flex-end;
	}

	.btn-close {
		font-family: monospace;
		font-size: 12px;
		font-weight: bold;
		padding: 8px 16px;
		cursor: pointer;
		border: 2px solid #1a1a1a;
		background: #faf8f5;
		color: #1a1a1a;
		box-shadow: 2px 2px 0px 0px #1a1a1a;
		transition: all 0.1s;
	}

	.btn-close:active {
		transform: translate(1px, 1px);
		box-shadow: 1px 1px 0px 0px #1a1a1a;
	}

	.btn-edit {
		font-family: monospace;
		font-size: 12px;
		font-weight: bold;
		padding: 8px 16px;
		cursor: pointer;
		border: 2px solid #1a1a1a;
		background: #1a1a1a;
		color: #faf8f5;
		box-shadow: 2px 2px 0px 0px rgba(0, 0, 0, 0.2);
		transition: all 0.1s;
	}

	.btn-edit:active {
		transform: translate(1px, 1px);
		box-shadow: 1px 1px 0px 0px rgba(0, 0, 0, 0.2);
	}
</style>
