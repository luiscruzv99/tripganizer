export interface OgMetadata {
	title: string | null;
	description: string | null;
	image: string | null;
}

export async function fetchOgMetadata(url: string): Promise<OgMetadata> {
	const res = await fetch(`/api/og?url=${encodeURIComponent(url)}`);
	if (!res.ok) throw new Error('Failed to fetch metadata');
	return res.json();
}
