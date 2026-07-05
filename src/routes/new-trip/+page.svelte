<script lang="ts">
	import { goto } from '$app/navigation';
	import { createBoardApi } from '$lib/api';

	let name = $state('');
	let loading = $state(false);

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!name.trim() || loading) return;
		loading = true;
		try {
			const board = await createBoardApi(name.trim());
			localStorage.setItem('boardId', board.id);
			goto(`/trip/${board.id}`);
		} catch {
			loading = false;
		}
	}
</script>

<div class="page">
	<div class="form-card">
		<h1 class="title">New trip</h1>
		<form onsubmit={handleSubmit}>
			<label class="field">
				<span class="label">Trip name</span>
				<input class="input" type="text" placeholder="e.g. Japan 2026" bind:value={name} required />
			</label>
			<div class="actions">
				<a class="back" href="/">Back</a>
				<button class="submit" type="submit" disabled={!name.trim() || loading}>
					{loading ? 'Creating...' : 'Create'}
				</button>
			</div>
		</form>
	</div>
</div>

<style>
	.page {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100vh;
		background: #e8e0d8;
	}

	.form-card {
		width: 360px;
		background: #faf8f5;
		border: 2px solid #1a1a1a;
		box-shadow: 4px 4px 0px 0px rgba(0, 0, 0, 0.2);
		padding: 32px;
	}

	.title {
		font-family: monospace;
		font-size: 20px;
		font-weight: bold;
		color: #1a1a1a;
		margin: 0 0 24px 0;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.label {
		font-family: monospace;
		font-size: 12px;
		font-weight: bold;
		color: #1a1a1a;
		text-transform: uppercase;
		letter-spacing: 0.5px;
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

	.actions {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 24px;
	}

	.back {
		font-family: monospace;
		font-size: 13px;
		color: #666;
		text-decoration: none;
	}

	.back:hover {
		color: #1a1a1a;
	}

	.submit {
		padding: 10px 20px;
		background: #1a1a1a;
		border: 2px solid #1a1a1a;
		cursor: pointer;
		font-family: monospace;
		font-size: 13px;
		font-weight: bold;
		color: #faf8f5;
		transition: all 0.1s ease;
	}

	.submit:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.submit:not(:disabled):active {
		box-shadow: 1px 1px 0px 0px rgba(0, 0, 0, 0.2);
		transform: translate(1px, 1px);
	}
</style>
