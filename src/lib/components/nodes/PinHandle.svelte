<script lang="ts">
	import { Handle, Position } from '@xyflow/svelte';
</script>

<Handle type="source" position={Position.Top} class="pin-handle pin-handle-source" />
<Handle type="target" position={Position.Top} class="pin-handle pin-handle-target" />

<style>
	:global(.pin-handle) {
		width: 10px;
		height: 10px;
		background: #1a1a1a;
		border: 2px solid #faf8f5;
		border-radius: 50%;
		box-shadow: 1px 2px 0px 0px rgba(0, 0, 0, 0.25);
		cursor: crosshair;
		z-index: 10;
		top: 18px;
	}
</style>
