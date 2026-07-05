<script lang="ts">
	let { name, startDate, endDate }: { name: string; startDate?: string; endDate?: string } =
		$props();

	let dateRange = $derived([startDate, endDate].filter(Boolean).join(' - '));
</script>

<div class="topbar">
	<h1 class="topbar-name">{name}</h1>
	{#if dateRange}
		<div class="topbar-dates">{dateRange}</div>
	{/if}
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
		background: #1a1a1a;
		color: #faf8f5;
		box-shadow: 0 4px 0px 0px rgba(0, 0, 0, 0.3);
	}

	.topbar-name {
		font-family: monospace;
		font-size: 16px;
		font-weight: bold;
		letter-spacing: 0.5px;
		margin: 0;
	}

	.topbar-dates {
		font-family: monospace;
		font-size: 13px;
		opacity: 0.8;
	}
</style>
