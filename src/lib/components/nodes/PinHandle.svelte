<script lang="ts">
	import { Handle, Position } from '@xyflow/svelte';
</script>

<Handle type="source" position={Position.Top} class="pin-handle pin-handle-source" />
<Handle type="target" position={Position.Top} class="pin-handle pin-handle-target" />

<style>
	:global(.pin-handle) {
		width: 12px;
		height: 12px;
		background: radial-gradient(circle at 40% 40%, #d4a843, #8b6914);
		border: 1px solid #5a4a1a;
		border-radius: 50%;
		filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
		cursor: crosshair;
		transition:
			transform 0.1s ease,
			filter 0.1s ease;
		z-index: 10;
	}

	:global(.pin-handle:hover) {
		transform: scale(1.3);
		filter: drop-shadow(0 1px 4px rgba(180, 150, 60, 0.5));
	}

	:global(.pin-handle.connecting) {
		animation: pin-pulse 0.8s ease-in-out infinite;
	}

	@keyframes pin-pulse {
		0%,
		100% {
			transform: scale(1);
			filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
		}
		50% {
			transform: scale(1.4);
			filter: drop-shadow(0 1px 6px rgba(180, 150, 60, 0.6));
		}
	}
</style>
