<script lang="ts">
	let {
		name,
		startDate,
		endDate,
		onEdit,
		onShare
	}: {
		name: string;
		startDate?: string;
		endDate?: string;
		onEdit: () => void;
		onShare: () => void;
	} = $props();

	let dateRange = $derived([startDate, endDate].filter(Boolean).join(' - '));
</script>

<div class="topbar">
	<h1 class="topbar-name">{name}</h1>
	<div class="topbar-right">
		{#if dateRange}
			<div class="topbar-dates">{dateRange}</div>
		{/if}
		<div class="topbar-actions">
			<button class="action-btn" onclick={onEdit} title="Edit trip"> Edit </button>
			<button class="action-btn" onclick={onShare} title="Share trip"> Share </button>
		</div>
	</div>
</div>

<style>
	.topbar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 48px;
		padding: 0 20px;
		background: #2b2b2b;
		color: #faf8f5;
		box-shadow: 0 4px 0px 0px rgba(0, 0, 0, 0.7);
		padding-top: env(safe-area-inset-top, 0px);
	}

	.topbar-name {
		font-family: monospace;
		font-size: 16px;
		font-weight: bold;
		letter-spacing: 0.5px;
		margin: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		min-width: 0;
		flex: 1;
	}

	.topbar-right {
		display: flex;
		align-items: center;
		gap: 16px;
		flex-shrink: 0;
	}

	.topbar-dates {
		font-family: monospace;
		font-size: 13px;
		opacity: 0.8;
	}

	.topbar-actions {
		display: flex;
		gap: 8px;
	}

	.action-btn {
		padding: 4px 8px;
		background: #faf8f5;
		border: 2px solid #1a1a1a;
		cursor: pointer;
		font-family: monospace;
		font-size: 11px;
		font-weight: bold;
		color: #1a1a1a;
		box-shadow: 3px 3px 0px 0px rgba(0, 0, 0, 0.7);
		transition: all 0.1s ease;
	}

	.action-btn:active {
		box-shadow: 1px 1px 0px 0px rgba(0, 0, 0, 0.2);
		transform: translate(1px, 1px);
	}

	.action-btn:hover {
		transform: translate(-5px, -5px);
		box-shadow: 8px 8px 0px 0px rgba(0, 0, 0, 0.7);
	}

	@media (max-width: 480px) {
		.topbar {
			padding: 0 12px;
			padding-top: env(safe-area-inset-top, 0px);
			height: 44px;
		}

		.topbar-name {
			font-size: 14px;
		}

		.topbar-right {
			gap: 8px;
		}

		.topbar-dates {
			font-size: 11px;
			display: none;
		}

		.action-btn {
			padding: 3px 6px;
			font-size: 10px;
		}
	}
</style>
