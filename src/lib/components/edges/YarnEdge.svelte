<script lang="ts">
	import { BaseEdge, getStraightPath, type EdgeProps } from '@xyflow/svelte';
	import type { Yarn } from '$lib/types';

	let { id, sourceX, sourceY, targetX, targetY, data }: EdgeProps = $props();

	let yarn: Yarn = $derived(data?.yarn as Yarn);
	let color = $derived(yarn?.color ?? '#1a1a1a');

	let [edgePath, labelX, labelY] = $derived(
		getStraightPath({
			sourceX,
			sourceY,
			targetX,
			targetY
		})
	);
</script>

<BaseEdge {id} path={edgePath} style="stroke: {color}; stroke-width: 2;" />
{#if yarn?.free_field}
	<text x={labelX} y={labelY-5} class="edge-label" style="fill: {color};">
		{yarn.free_field}
	</text>
{/if}

<style>
	.edge-label {
		font-family: monospace;
		font-size: 12px;
		text-anchor: middle;
		pointer-events: none;
		z-index: 5;
	}
</style>
