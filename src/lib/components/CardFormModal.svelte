<script lang="ts">
	import type { CardType, Card } from '$lib/types';
	import { fetchOgMetadata } from '$lib/og';

	let {
		cardType,
		card,
		onSubmit,
		onClose
	}: {
		cardType: CardType;
		card?: Card;
		onSubmit: (data: Omit<Card, 'id' | 'x_pos' | 'y_pos'> & { id?: string }) => void;
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

	let name = $state(card?.name ?? '');
	let description = $state(card?.description ?? '');
	let externalLink = $state(card?.external_link ?? '');
	let price = $state(card?.price?.toString() ?? '');
	let startDate = $state(card?.start_date ?? '');
	let endDate = $state(card?.end_date ?? '');
	let duration = $state(card?.duration ?? '');
	let headerImg = $state(card?.header_img ?? '');
	let fetchingOg = $state(false);
	let ogError = $state<string | null>(null);
	let ogSuccess = $state(false);

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		onSubmit({
			...(card?.id ? { id: card.id } : {}),
			name,
			type: cardType,
			description: description || undefined,
			external_link: externalLink || undefined,
			price: price ? Number(price) : undefined,
			start_date: startDate || undefined,
			end_date: endDate || undefined,
			duration: duration || undefined,
			header_img: headerImg || undefined
		});
	}

	async function handleFetchOg() {
		if (!externalLink) return;
		fetchingOg = true;
		ogError = null;
		ogSuccess = false;

		try {
			const og = await fetchOgMetadata(externalLink);
			let filled = false;
			if (og.title && !name) {
				name = og.title;
				filled = true;
			}
			if (og.description && !description) {
				description = og.description;
				filled = true;
			}
			if (og.image) {
				headerImg = og.image;
				filled = true;
			}

			if (!og.title && !og.description && !og.image) {
				ogError = 'No metadata found';
			} else if (!filled && (name || description)) {
				ogError = 'Fields already filled — clear them first to auto-fill';
			} else {
				ogSuccess = true;
				setTimeout(() => (ogSuccess = false), 2000);
			}
		} catch (e: any) {
			ogError = e.message || 'Failed to fetch metadata';
		} finally {
			fetchingOg = false;
		}
	}

	function clearOgError() {
		ogError = null;
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
			<div class="field-input-group">
				<input class="field-input" type="url" bind:value={externalLink} oninput={clearOgError} />
				{#if externalLink.startsWith('http')}
					<button class="btn-fetch" onclick={handleFetchOg} disabled={fetchingOg}>
						{fetchingOg ? '...' : 'Fetch'}
					</button>
				{/if}
			</div>
			{#if ogSuccess}
				<span class="field-hint success">✓ Metadata fetched</span>
			{/if}
			{#if ogError}
				<span class="field-hint error">{ogError}</span>
			{/if}
		</label>
		{#if headerImg}
			<div class="field">
				<span class="field-label">Header image preview</span>
				<div class="image-preview-container">
					<img class="image-preview" src={headerImg} alt="Preview" />
				</div>
				<button class="btn-remove-img" onclick={() => (headerImg = '')}>✕ Remove image</button>
			</div>
		{/if}
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
			<button type="submit" class="btn-submit">{card ? 'Save' : 'Create'}</button>
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
		width: calc(100vw - 32px);
		max-width: 380px;
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

	.field-input-group {
		display: flex;
		gap: 8px;
	}

	.field-input-group .field-input {
		flex: 1;
	}

	.btn-fetch {
		font-family: monospace;
		font-size: 12px;
		font-weight: bold;
		padding: 0 12px;
		cursor: pointer;
		border: 2px solid #1a1a1a;
		background: #faf8f5;
		color: #1a1a1a;
		box-shadow: 2px 2px 0px 0px rgba(0, 0, 0, 0.2);
	}

	.btn-fetch:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.btn-fetch:active:not(:disabled) {
		transform: translate(1px, 1px);
		box-shadow: 1px 1px 0px 0px rgba(0, 0, 0, 0.2);
	}

	.field-hint {
		font-family: monospace;
		font-size: 10px;
		margin-top: 2px;
	}

	.field-hint.success {
		color: #2d6a4f;
	}

	.field-hint.error {
		color: #bc4749;
	}

	.image-preview-container {
		width: 100%;
		height: 60px;
		border: 2px solid #1a1a1a;
		overflow: hidden;
		background: #eee;
	}

	.image-preview {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.btn-remove-img {
		background: none;
		border: none;
		font-family: monospace;
		font-size: 10px;
		color: #1a1a1a;
		text-align: left;
		cursor: pointer;
		padding: 0;
		margin-top: 4px;
		text-decoration: underline;
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
