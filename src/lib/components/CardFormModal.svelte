<script lang="ts">
	import type { CardType, Card } from '$lib/types';

	let {
		cardType,
		onSubmit,
		onClose
	}: {
		cardType: CardType;
		onSubmit: (card: Omit<Card, 'id' | 'x_pos' | 'y_pos'>) => void;
		onClose: () => void;
	} = $props();

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

	let name = $state('');
	let description = $state('');
	let externalLink = $state('');
	let price = $state('');
	let startDate = $state('');
	let endDate = $state('');
	let duration = $state('');

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		onSubmit({
			name,
			type: cardType,
			description: description || undefined,
			external_link: externalLink || undefined,
			price: price ? Number(price) : undefined,
			start_date: startDate || undefined,
			end_date: endDate || undefined,
			duration: duration || undefined
		});
	}
</script>

<div class="backdrop" onclick={onClose} role="presentation"></div>
<div class="modal">
	<div class="modal-header" style="background: {typeColors[cardType]};">
		<span class="modal-type">{typeLabels[cardType]}</span>
		<button class="modal-close" onclick={onClose}>×</button>
	</div>
	<form class="modal-form" onsubmit={handleSubmit}>
		<label class="field">
			<span class="field-label">Name</span>
			<input class="field-input" type="text" bind:value={name} required />
		</label>
		<label class="field">
			<span class="field-label">Description</span>
			<textarea class="field-input field-textarea" bind:value={description}></textarea>
		</label>
		<label class="field">
			<span class="field-label">External link</span>
			<input class="field-input" type="url" bind:value={externalLink} />
		</label>
		<div class="field-row">
			<label class="field field-half">
				<span class="field-label">Price</span>
				<input class="field-input" type="number" min="0" step="0.01" bind:value={price} />
			</label>
			<label class="field field-half">
				<span class="field-label">Duration</span>
				<input class="field-input" type="text" placeholder="e.g. 3 days" bind:value={duration} />
			</label>
		</div>
		<div class="field-row">
			<label class="field field-half">
				<span class="field-label">Start date</span>
				<input class="field-input" type="date" bind:value={startDate} />
			</label>
			<label class="field field-half">
				<span class="field-label">End date</span>
				<input class="field-input" type="date" bind:value={endDate} />
			</label>
		</div>
		<div class="modal-actions">
			<button type="button" class="btn-cancel" onclick={onClose}>Cancel</button>
			<button type="submit" class="btn-submit">Create</button>
		</div>
	</form>
</div>

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		z-index: 200;
		background: rgba(0, 0, 0, 0.3);
	}

	.modal {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 201;
		width: 380px;
		max-height: 85vh;
		overflow-y: auto;
		background: #faf8f5;
		border: 2px solid #1a1a1a;
		box-shadow: 6px 6px 0px 0px rgba(0, 0, 0, 0.2);
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
		font-size: 18px;
		font-weight: bold;
		color: #1a1a1a;
		cursor: pointer;
		padding: 0;
		line-height: 1;
	}

	.modal-form {
		padding: 16px;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.field-row {
		display: flex;
		gap: 12px;
	}

	.field-half {
		flex: 1;
	}

	.field-label {
		font-family: monospace;
		font-size: 11px;
		font-weight: bold;
		color: #1a1a1a;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.field-input {
		font-family: monospace;
		font-size: 12px;
		padding: 8px 10px;
		border: 1px solid #e8e4df;
		background: #fff;
		color: #1a1a1a;
		outline: none;
	}

	.field-input:focus {
		border-color: #1a1a1a;
	}

	.field-textarea {
		resize: vertical;
		min-height: 60px;
	}

	.modal-actions {
		display: flex;
		gap: 8px;
		margin-top: 4px;
	}

	.btn-cancel,
	.btn-submit {
		flex: 1;
		font-family: monospace;
		font-size: 12px;
		font-weight: bold;
		padding: 10px;
		cursor: pointer;
		border: 2px solid #1a1a1a;
	}

	.btn-cancel {
		background: #faf8f5;
		color: #1a1a1a;
	}

	.btn-cancel:hover {
		background: #f5f0eb;
	}

	.btn-submit {
		background: #1a1a1a;
		color: #faf8f5;
	}

	.btn-submit:hover {
		background: #333;
	}

	.btn-submit:active,
	.btn-cancel:active {
		transform: translate(1px, 1px);
	}
</style>
