<script lang="ts">
	import { goto } from '$app/navigation';
	import { createBoardApi } from '$lib/api';

	let name = $state('');
	let description = $state('');
	let startDate = $state('');
	let endDate = $state('');
	let loading = $state(false);

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!name.trim() || loading) return;
		loading = true;
		try {
			const board = await createBoardApi({
				name: name.trim(),
				description: description.trim() || undefined,
				start_date: startDate || undefined,
				end_date: endDate || undefined
			});
			localStorage.setItem('boardId', board.id);
			goto(`/trip/${board.id}`);
		} catch {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>New trip — Tripganization</title>
	<meta property="og:title" content="New trip — Tripganization" />
	<meta property="og:description" content="Create a new trip on Tripganization." />
	<meta property="og:image" content="/og-default.svg" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="New trip — Tripganization" />
	<meta name="twitter:description" content="Create a new trip on Tripganization." />
	<meta name="twitter:image" content="/og-default.svg" />
</svelte:head>

<div class="page">
	<div class="form-card">
		<h1 class="title">New trip</h1>
		<form onsubmit={handleSubmit}>
			<div class="fields-container">
				<label class="field">
					<span class="label">Trip name</span>
					<input
						class="input"
						type="text"
						placeholder="e.g. Japan 2026"
						bind:value={name}
						required
					/>
				</label>
				<label class="field">
					<span class="label">Description</span>
					<textarea
						class="input textarea"
						placeholder="Describe your trip..."
						bind:value={description}></textarea>
				</label>
				<div class="row">
					<label class="field half">
						<span class="label">Start date</span>
						<input class="input" type="date" bind:value={startDate} />
					</label>
					<label class="field half">
						<span class="label">End date</span>
						<input class="input" type="date" bind:value={endDate} />
					</label>
				</div>
			</div>
			<div class="actions">
				<a class="back" href="/">&lt; Back</a>
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
		min-height: 100vh;
		min-height: 100dvh;
		background: #e8e0d8;
		padding: 24px 16px;
	}

	.form-card {
		width: 100%;
		max-width: 400px;
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

	.fields-container {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.row {
		display: flex;
		gap: 16px;
	}

	.half {
		flex: 1;
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

	.textarea {
		min-height: 80px;
		resize: vertical;
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

	.back:hover {
		color: #1a1a1a;
		transform: translate(-5px, -5px);
		box-shadow: 8px 8px 0px 0px rgba(0, 0, 0, 0.7);
	}

	.submit {
		background: #1a1a1a;
		border: 3px solid #1a1a1a;
		cursor: pointer;
		font-family: monospace;
		font-weight: bold;
		color: #faf8f5;
		margin-top: 16px;
		padding: 12px 24px;
		min-height: 44px;
		box-shadow: 3px 3px 0px 0px rgba(0, 0, 0, 0.7);
		font-size: 14px;
		transition: all 0.1s ease;
	}

	.submit:disabled {
		opacity: 0.4;
		cursor: not-allowed;
		pointer-events: none;
	}

	.submit:hover{
		transform: translate(-5px, -5px);
		box-shadow: 8px 8px 0px 0px rgba(0, 0, 0, 0.7);
	}

	.submit:not(:disabled):active {
		box-shadow: 1px 1px 0px 0px rgba(0, 0, 0, 0.2);
		transform: translate(1px, 1px);
	}

	@media (max-width: 480px) {
		.form-card {
			padding: 24px;
		}

		.row {
			flex-direction: column;
			gap: 16px;
		}
	}
</style>
