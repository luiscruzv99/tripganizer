<script lang="ts">
	import { goto } from '$app/navigation';
</script>

<svelte:head>
	<title>Tripganization — Plan your trips visually</title>
	<meta name="description" content="Schizo moodboarding for planning trips." />
	<meta property="og:title" content="Tripganization — Plan your trips visually" />
	<meta property="og:description" content="Schizo moodboarding for planning trips." />
	<meta property="og:image" content="/og-default.svg" />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Tripganization — Plan your trips visually" />
	<meta name="twitter:description" content="Schizo moodboarding for planning trips." />
	<meta name="twitter:image" content="/og-default.svg" />
</svelte:head>

<div class="landing">
	<h1 class="title">Tripganization</h1>
	<p class="subtitle">Schizo moodboarding for planning trips.</p>
	<button class="cta" onclick={() => goto('/new-trip')}>Create a trip</button>
</div>

<style>
	.landing {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
		height: 100dvh;
		background: #e8e0d8;
		gap: 16px;
		padding: 0 24px;
	}

	.title {
		font-family: monospace;
		font-size: clamp(24px, 6vw, 32px);
		font-weight: bold;
		color: #1a1a1a;
		letter-spacing: 1px;
		margin: 0;
		text-align: center;
	}

	.subtitle {
		font-family: monospace;
		font-size: clamp(12px, 3vw, 14px);
		color: #666;
		margin: 0;
		text-align: center;
	}

	.cta {
		margin-top: 16px;
		padding: 12px 24px;
		min-height: 44px;
		background: #faf8f5;
		border: 2px solid #1a1a1a;
		box-shadow: 3px 3px 0px 0px rgba(0, 0, 0, 0.7);
		cursor: pointer;
		font-family: monospace;
		font-size: 14px;
		font-weight: bold;
		color: #1a1a1a;
		transition: all 0.1s ease;
	}

	.cta:active {
		box-shadow: 1px 1px 0px 0px rgba(0, 0, 0, 0.7);
		transform: translate(2px, 2px);
	}

	.cta:hover{
		transform: translate(-5px, -5px);
		box-shadow: 8px 8px 0px 0px rgba(0, 0, 0, 0.7);
	}
</style>
