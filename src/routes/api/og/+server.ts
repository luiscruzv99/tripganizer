import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	const targetUrl = url.searchParams.get('url');

	if (!targetUrl) {
		return json({ error: 'Missing url parameter' }, { status: 400 });
	}

	try {
		const parsedUrl = new URL(targetUrl);
		if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
			return json({ error: 'Invalid protocol' }, { status: 400 });
		}
	} catch (e) {
		return json({ error: 'Invalid URL' }, { status: 400 });
	}

	try {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 5000);

		const response = await fetch(targetUrl, {
			headers: {
				'User-Agent':
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
			},
			signal: controller.signal
		});

		clearTimeout(timeoutId);

		if (!response.ok) {
			return json({ error: 'Could not fetch URL' }, { status: 502 });
		}

		const text = await response.text();
		const headContent = text.slice(0, 50000);

		const getMeta = (property: string, name?: string) => {
			const propRegex = new RegExp(
				`<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']*)["']`,
				'i'
			);
			const matchProp = headContent.match(propRegex);
			if (matchProp) return matchProp[1];

			if (name) {
				const nameRegex = new RegExp(
					`<meta[^>]*name=["']${name}["'][^>]*content=["']([^"']*)["']`,
					'i'
				);
				const matchName = headContent.match(nameRegex);
				if (matchName) return matchName[1];
			}

			return null;
		};

		const title =
			getMeta('og:title') ||
			getMeta('twitter:title') ||
			headContent.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] ||
			null;
		const description =
			getMeta('og:description') ||
			getMeta('twitter:description') ||
			getMeta('description', 'description') ||
			null;
		let image = getMeta('og:image') || getMeta('twitter:image') || null;

		if (image) {
			try {
				const imgUrl = new URL(image, targetUrl);
				image = imgUrl.toString();
			} catch (e) {
				// keep original if resolution fails
			}
		}

		return json({ title, description, image });
	} catch (e: any) {
		if (e.name === 'AbortError') {
			return json({ error: 'Fetch timeout' }, { status: 502 });
		}
		return json({ error: 'Could not fetch URL' }, { status: 502 });
	}
};
