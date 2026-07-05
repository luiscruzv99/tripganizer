<script lang="ts">
	import { goto } from '$app/navigation';
</script>

<div class="landing">
	<h1 class="title">Tripganization</h1>
	<p class="subtitle">Organize your trip visually.</p>
	<button class="cta" onclick={() => goto('/new-trip')}>Create a trip</button>
</div>

<style>
	.landing {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
		background: #e8e0d8;
		gap: 16px;
	}

	.title {
		font-family: monospace;
		font-size: 32px;
		font-weight: bold;
		color: #1a1a1a;
		letter-spacing: 1px;
		margin: 0;
	}

	.subtitle {
		font-family: monospace;
		font-size: 14px;
		color: #666;
		margin: 0;
	}

	.cta {
		margin-top: 16px;
		padding: 12px 24px;
		background: #faf8f5;
		border: 2px solid #1a1a1a;
		box-shadow: 3px 3px 0px 0px rgba(0, 0, 0, 0.2);
		cursor: pointer;
		font-family: monospace;
		font-size: 14px;
		font-weight: bold;
		color: #1a1a1a;
		transition: all 0.1s ease;
	}

	.cta:active {
		box-shadow: 1px 1px 0px 0px rgba(0, 0, 0, 0.2);
		transform: translate(2px, 2px);
	}
</style>
