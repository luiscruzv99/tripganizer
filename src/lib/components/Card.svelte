<script lang="ts">
	import { draggable } from '$lib/actions/drag';

	let {
		x = 0,
		y = 0,
		onmove
	}: { x: number; y: number; onmove?: (x: number, y: number) => void } = $props();
</script>

<div use:draggable={{ onmove }} class="card" style:left="{x}px" style:top="{y}px">
	<div class="card-content">
		<div class="card-header"></div>
		<div class="card-body"></div>
	</div>
</div>

<style>
	.card {
		position: absolute;
		width: 200px;
		height: 280px;
		background: #faf8f5;
		box-shadow:
			4px 4px 0px 0px rgba(0, 0, 0, 0.15),
			2px 2px 0px 0px rgba(0, 0, 0, 0.1);
		border: 1px solid #e8e4df;
		cursor: grab;
		user-select: none;
		transition: box-shadow 0.15s ease;
	}

	.card:active {
		cursor: grabbing;
		box-shadow:
			6px 6px 0px 0px rgba(0, 0, 0, 0.2),
			3px 3px 0px 0px rgba(0, 0, 0, 0.12);
	}

	.card-content {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.card-header {
		height: 60px;
		background: #f5f0eb;
		border-bottom: 1px solid #e8e4df;
	}

	.card-body {
		flex: 1;
		padding: 12px;
	}
</style>
