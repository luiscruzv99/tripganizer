<script lang="ts">
	import { Handle, Position } from '@xyflow/svelte';
</script>

<Handle type="source" position={Position.Top} class="pin-handle pin-handle-source" />
<Handle type="target" position={Position.Top} class="pin-handle pin-handle-target" />

<style>
	:global(.pin-handle) {
		width: 17px;
		height: 17px;
		background: red;
		border: 4px solid darkred;
		border-top: 1px solid darkred;
		border-left: 1px solid darkred;
		border-radius: 9999%;
		box-shadow: 3px 3px 0px 0px rgba(0, 0, 0, 0.8);
		cursor: crosshair;
		top: 5px;
		left: 150px;
	}

	:global(.pin-handle-source) {
		z-index: 11;
	}
</style>
