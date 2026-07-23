<script lang="ts">
	import type { Card, CardType } from '$lib/types';

	let {
		card,
		onExpand
	}: {
		card: Card;
		onExpand?: () => void;
	} = $props();

	const typeColors: Record<CardType, string> = {
		DEST: '#d4e5f7',
		TRANS: '#f7dcc4',
		ACT: '#c4f7d4',
		STAY: '#dcc4f7'
	};

	const typeBorders: Record<CardType, string> = {
		DEST: '#7aadd4',
		TRANS: '#d4a57a',
		ACT: '#7ad4a5',
		STAY: '#a57ad4'
	};

	const typeIcons: Record<CardType, string> = {
		DEST: '📍',
		TRANS: '✈',
		ACT: '🧭',
		STAY: '🏠'
	};

	let headerColor = $derived(typeColors[card.type] ?? '#f5f0eb');
	let borderColor = $derived(typeBorders[card.type] ?? '#e8e4df');
	let icon = $derived(typeIcons[card.type] ?? '');

	function formatDate(d: string | undefined): string {
		if (!d) return '';
		const date = new Date(d + 'T00:00:00');
		return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
	}

	let dateRange = $derived(() => {
		const s = formatDate(card.start_date);
		const e = formatDate(card.end_date);
		if (s && e) return `${s} – ${e}`;
		if (s) return s;
		return '';
	});
</script>

<div class="card-inner">
	<div class="card-header" style="background: {headerColor}; border-bottom-color: {borderColor};">
		{#if onExpand}
			<button
				class="expand-btn nodrag"
				onclick={(e) => {
					e.stopPropagation();
					onExpand();
				}}
				title="Expand details">⤢</button
			>
		{/if}
		<div class="header-row">
			<span class="card-icon">{icon}</span>
			<span class="card-name">{card.name}</span>
		</div>
		{#if card.external_link}
			<a
				href={card.external_link}
				target="_blank"
				rel="noopener noreferrer"
				class="external-link-icon nodrag"
				title="Open link"
			>
				↗
			</a>
		{/if}
	</div>

	{#if card.header_img}
		<div class="banner-wrap">
			<img class="banner-img" src={card.header_img} alt="" />
		</div>
	{/if}
	{#if card.description}
		<div class="desc-wrap">
			<p class="card-description">{card.description}</p>
		</div>
	{/if}
	<div class="card-footer">
		{#if card.price}
			<span class="card-price">${card.price}</span>
		{:else}
			<span></span>
		{/if}
		<div class="footer-right">
			{#if dateRange()}
				<span class="card-dates">{dateRange()}</span>
			{/if}
			{#if card.duration}
				<span class="card-duration">{card.duration}</span>
			{/if}
		</div>
	</div>
</div>

<style>
	.card-inner {
		display: flex;
		flex-direction: column;
		height: 100%;
		padding-bottom: 16px;
		overflow: hidden;
		max-width: 100%;
	}

	.card-header {
		position: relative;
		min-height: 48px;
		background: #f5f0eb;
		border-bottom: 1px solid #e8e4df;
		display: flex;
		align-items: center;
		padding: 8px 36px;
		overflow: hidden;
		min-width: 0;
	}

	.expand-btn {
		position: absolute;
		top: 8px;
		left: 8px;
		width: 20px;
		height: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #fff;
		border: 1px solid #1a1a1a;
		color: #1a1a1a;
		cursor: pointer;
		padding: 0;
		font-size: 14px;
		font-weight: bold;
		font-family: monospace;
		z-index: 10;
		box-shadow: 1px 1px 0px 0px #1a1a1a;
		transition: transform 0.1s;
		pointer-events: all;
	}

	.expand-btn:hover {
		background: #f5f0eb;
		transform: translate(-1px, -1px);
		box-shadow: 2px 2px 0px 0px #1a1a1a;
	}

	.expand-btn:active {
		transform: translate(0, 0);
		box-shadow: 1px 1px 0px 0px #1a1a1a;
	}

	.header-row {
		display: flex;
		align-items: center;
		gap: 6px;
		width: 100%;
		min-width: 0;
	}

	.card-icon {
		font-size: 13px;
		flex-shrink: 0;
	}

	.card-name {
		font-family: monospace;
		font-size: 12px;
		font-weight: bold;
		color: #1a1a1a;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		min-width: 0;
		flex: 1;
	}

	.banner-wrap {
		width: 100%;
		height: 80px;
		overflow: hidden;
		border-bottom: 1px solid #e8e4df;
	}

	.banner-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
		display: block;
		max-width: 100%;
	}

	.desc-wrap {
		padding: 6px 12px;
	}

	.card-description {
		font-size: 11px;
		color: #666;
		margin: 0;
		line-height: 1.4;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 4;
		-webkit-box-orient: vertical;
	}

	.card-footer {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		padding: 8px 12px;
		margin-top: auto;
	}

	.external-link-icon {
		position: absolute;
		top: 8px;
		right: 8px;
		width: 20px;
		height: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #fff;
		border: 1px solid #1a1a1a;
		color: #1a1a1a;
		text-decoration: none;
		font-size: 12px;
		font-weight: bold;
		font-family: monospace;
		z-index: 10;
		box-shadow: 1px 1px 0px 0px #1a1a1a;
		transition: transform 0.1s;
		pointer-events: all;
	}

	.external-link-icon:hover {
		background: #f5f0eb;
		transform: translate(-1px, -1px);
		box-shadow: 2px 2px 0px 0px #1a1a1a;
	}

	.external-link-icon:active {
		transform: translate(0, 0);
		box-shadow: 1px 1px 0px 0px #1a1a1a;
	}

	.footer-right {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 2px;
	}

	.card-price {
		font-family: monospace;
		font-size: 12px;
		font-weight: bold;
		color: #1a1a1a;
	}

	.card-dates {
		font-family: monospace;
		font-size: 10px;
		color: #888;
	}

	.card-duration {
		font-family: monospace;
		font-size: 10px;
		color: #888;
	}
</style>
