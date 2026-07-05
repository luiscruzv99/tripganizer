<script lang="ts">
	let { name, startDate, endDate }: { name: string; startDate?: string; endDate?: string } =
		$props();
</script>

<div class="topbar">
	<h1 class="topbar-name">{name}</h1>
	{#if startDate || endDate}
		<div class="topbar-dates">
			{#if startDate}
				<span>{startDate}</span>
			{/if}
			{#if startDate && endDate}
				<span class="topbar-separator">-</span>
			{/if}
			{#if endDate}
				<span>{endDate}</span>
			{/if}
		</div>
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

	.topbar-separator {
		margin: 0 6px;
	}
</style>
