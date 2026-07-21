<script lang="ts">
	let { shortCode, onClose }: { shortCode: string; onClose: () => void } = $props();

	let copied = $state(false);

	function getShareUrl(): string {
		if (typeof window === 'undefined') return '';
		return `${window.location.origin}/trip?view=${shortCode}`;
	}

	async function copyToClipboard() {
		const url = getShareUrl();
		try {
			await navigator.clipboard.writeText(url);
			copied = true;
			setTimeout(() => (copied = false), 2000);
		} catch {
			// fallback
		}
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) onClose();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') onClose();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="overlay" onclick={handleBackdropClick}>
	<div class="modal">
		<div class="header">
			<span class="title">Share this trip</span>
			<button class="close" onclick={onClose}>×</button>
		</div>
		<div class="body">
			<label class="label">Shareable link</label>
			<div class="url-row">
				<input class="url-input" type="text" readonly value={getShareUrl()} />
				<button class="copy-btn" onclick={copyToClipboard}>
					{copied ? 'Copied!' : 'Copy'}
				</button>
			</div>
		</div>
	</div>
</div>

<style>
	.overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.2);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 200;
	}

	.modal {
		width: calc(100vw - 32px);
		max-width: 400px;
		background: #faf8f5;
		border: 2px solid #1a1a1a;
		box-shadow: 4px 4px 0px 0px rgba(0, 0, 0, 0.8);
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 12px 16px;
		border-bottom: 2px solid #1a1a1a;
	}

	.title {
		font-family: monospace;
		font-size: 14px;
		font-weight: bold;
		color: #1a1a1a;
	}

	.close {
		width: 28px;
		height: 28px;
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

	.close:hover {
		background: #1a1a1a;
		color: #faf8f5;
	}

	.body {
		padding: 16px;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.label {
		font-family: monospace;
		font-size: 11px;
		font-weight: bold;
		color: #666;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.url-row {
		display: flex;
		gap: 0;
	}

	.url-input {
		flex: 1;
		padding: 10px 12px;
		border: 2px solid #1a1a1a;
		border-right: none;
		background: #fff;
		font-family: monospace;
		font-size: 12px;
		color: #1a1a1a;
		outline: none;
		min-width: 0;
	}

	.copy-btn {
		padding: 10px 16px;
		background: #1a1a1a;
		border: 2px solid #1a1a1a;
		cursor: pointer;
		font-family: monospace;
		font-size: 12px;
		font-weight: bold;
		color: #faf8f5;
		white-space: nowrap;
		transition: all 0.1s ease;
	}

	.copy-btn:active {
		box-shadow: 1px 1px 0px 0px rgba(0, 0, 0, 0.2);
		transform: translate(1px, 1px);
	}
</style>
