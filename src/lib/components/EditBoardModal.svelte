<script lang="ts">
	import type { Board } from '$lib/types';

	let {
		board,
		onSubmit,
		onClose
	}: {
		board: Board;
		onSubmit: (data: Partial<Board>) => void;
		onClose: () => void;
	} = $props();

	let name = $derived(board.name);
	let description = $derived(board.description ?? '');
	let startDate = $derived(board.start_date ?? '');
	let endDate = $derived(board.end_date ?? '');
	let loading = $state(false);

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!name.trim() || loading) return;
		loading = true;
		onSubmit({
			name: name.trim(),
			description: description.trim() || undefined,
			start_date: startDate || undefined,
			end_date: endDate || undefined
		});
		loading = false;
	}
</script>

<div class="backdrop" onclick={onClose} role="presentation"></div>
<div class="modal">
	<div class="modal-header">
		<span class="modal-title">Edit trip</span>
		<button class="modal-close" onclick={onClose}>×</button>
	</div>
	<form class="modal-form" onsubmit={handleSubmit}>
		<label class="field">
			<span class="field-label">Trip name</span>
			<input class="field-input" type="text" bind:value={name} required />
		</label>
		<label class="field">
			<span class="field-label">Description</span>
			<textarea class="field-input field-textarea" bind:value={description}></textarea>
		</label>
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
			<button type="submit" class="btn-submit" disabled={!name.trim() || loading}>
				{loading ? 'Saving...' : 'Save changes'}
			</button>
		</div>
	</form>
</div>

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.2);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 200;
		transition: all 0.1s ease-in-out;
	}

	.modal {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: calc(100vw - 32px);
		max-width: 400px;
		max-height: 85vh;
		overflow-y: auto;
		background: #faf8f5;
		border: 2px solid #1a1a1a;
		box-shadow: 4px 4px 0px 0px rgba(0, 0, 0, 0.8);
		z-index: 201;
		transition: all 0.1s ease-in-out;
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 12px 16px;
		border-bottom: 2px solid #1a1a1a;
		background: #faf8f5;
	}

	.modal-title {
		font-family: monospace;
		font-size: 14px;
		font-weight: bold;
		color: #1a1a1a;
	}

	.modal-close {
		width: 24px;
		height: 24px;
		background: none;
		border: 2px solid #1a1a1a;
		cursor: pointer;
		font-size: 16px;
		font-weight: bold;
		color: #1a1a1a;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.1s ease;
	}

	.modal-close:hover {
		background: #1a1a1a;
		color: #faf8f5;
	}

	.modal-form {
		padding: 16px;
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.field-label {
		font-family: monospace;
		font-size: 12px;
		font-weight: bold;
		color: #1a1a1a;
		text-transform: lowercase;
		letter-spacing: 0.5px;
	}

	.field-input {
		padding: 10px 12px;
		border: 2px solid #1a1a1a;
		background: #fff;
		font-family: monospace;
		font-size: 14px;
		color: #1a1a1a;
		outline: none;
	}

	.field-textarea {
		min-height: 80px;
		resize: vertical;
	}

	.field-row {
		display: flex;
		gap: 16px;
	}

	.field-half {
		flex: 1;
	}

	.field-input:focus {
		box-shadow: 2px 2px 0px 0px rgba(0, 0, 0, 0.15);
	}

	.modal-actions {
		display: flex;
		justify-content: flex-end;
		gap: 12px;
		margin-top: 12px;
	}

	.btn-cancel {
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

	.btn-cancel:hover {
		transform: translate(-5px, -5px);
		box-shadow: 8px 8px 0px 0px rgba(0, 0, 0, 0.7);
	}

	.btn-submit {
		margin-top: 16px;
		padding: 12px 24px;
		min-height: 44px;
		box-shadow: 3px 3px 0px 0px rgba(0, 0, 0, 0.7);
		background: #1a1a1a;
		border: 2px solid #1a1a1a;
		cursor: pointer;
		font-family: monospace;
		font-size: 13px;
		font-weight: bold;
		color: #faf8f5;
		transition: all 0.1s ease;
		
	}

	.btn-submit:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.btn-submit:not(:disabled):active {
		box-shadow: 1px 1px 0px 0px rgba(0, 0, 0, 0.2);
		transform: translate(1px, 1px);
	}
	.btn-submit:hover{
		transform: translate(-5px, -5px);
		box-shadow: 8px 8px 0px 0px rgba(0, 0, 0, 0.7);
	}
</style>
