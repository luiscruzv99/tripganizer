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
		transition:
			transform 0.1s ease,
			box-shadow 0.1s ease;
		z-index: 10;
		top: 18px;
	}

	:global(.pin-handle:hover) {
		transform: scale(1.3);
		box-shadow: 1px 2px 4px 0px rgba(0, 0, 0, 0.35);
	}

	:global(.pin-handle.connecting) {
		animation: pin-pulse 0.8s ease-in-out infinite;
	}

	@keyframes pin-pulse {
		0%,
		100% {
			transform: scale(1);
			box-shadow: 1px 2px 0px 0px rgba(0, 0, 0, 0.25);
		}
		50% {
			transform: scale(1.4);
			box-shadow: 1px 2px 6px 0px rgba(0, 0, 0, 0.4);
		}
	}
</style>
