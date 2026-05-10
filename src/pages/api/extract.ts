import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { url } = await request.json();

    if (!url) {
      return new Response(JSON.stringify({ error: 'URL is required' }), { status: 400 });
    }

    let validUrl = url;
    if (!validUrl.startsWith('http')) {
      validUrl = 'https://' + validUrl;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    let mainResponse: Response;
    try {
      mainResponse = await fetch(validUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        signal: controller.signal
      });
    } catch (err: any) {
      clearTimeout(timeoutId);
      const errorMessage = err.name === 'AbortError' ? 'Request timeout' : err.message;
      return new Response(JSON.stringify({ error: 'Failed to fetch URL: ' + errorMessage }), { status: 400 });
    }

    clearTimeout(timeoutId);

    if (!mainResponse.ok) {
      return new Response(JSON.stringify({ error: `Failed to fetch: ${mainResponse.statusText}` }), { status: 400 });
    }

    const html = await mainResponse.text();
    const fontFamilies = new Set<string>();

    const extractFromText = (text: string) => {
      const fontRegex = /font-family\s*:\s*([^;>}!]+)/gi;
      let match;
      while ((match = fontRegex.exec(text)) !== null) {
        const fonts = match[1].split(',').map(f => f.trim().replace(/['"]/g, ''));
        fonts.forEach(f => {
          const lowerF = f.toLowerCase();
          const isGeneric = ['sans-serif', 'serif', 'monospace', 'cursive', 'fantasy', 'system-ui', '-apple-system', 'blinkmacsystemfont', 'segoe ui', 'roboto', 'oxygen', 'ubuntu', 'cantarell', 'open sans', 'helvetica neue', 'arial', 'verdana', 'tahoma', 'trebuchet ms', 'times new roman', 'georgia', 'courier new', 'inherit', 'initial', 'unset'].includes(lowerF);
          if (f && !isGeneric && f.length > 1) {
            fontFamilies.add(f);
          }
        });
      }
    };

    extractFromText(html);

    const cssLinkRegex = /<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["']/gi;
    const cssLinks: string[] = [];
    let cssMatch;
    while ((cssMatch = cssLinkRegex.exec(html)) !== null) {
      let cssUrl = cssMatch[1];
      if (!cssUrl.startsWith('http')) {
        const urlObj = new URL(validUrl);
        if (cssUrl.startsWith('//')) {
          cssUrl = 'https:' + cssUrl;
        } else if (cssUrl.startsWith('/')) {
          cssUrl = urlObj.origin + cssUrl;
        } else {
          cssUrl = urlObj.origin + urlObj.pathname.replace(/\/[^/]*$/, '/') + cssUrl;
        }
      }
      cssLinks.push(cssUrl);
    }

    const cssPromises = cssLinks.slice(0, 2).map(link => {
      const cssController = new AbortController();
      const cssTimeout = setTimeout(() => cssController.abort(), 3000);
      return fetch(link, { signal: cssController.signal })
        .then(res => res.text())
        .catch(() => '')
        .finally(() => clearTimeout(cssTimeout));
    });

    const cssContents = await Promise.all(cssPromises);
    cssContents.forEach(extractFromText);

    const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const pMatch = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    let previewText = (h1Match ? h1Match[1] : (pMatch ? pMatch[1] : ''))
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/\s+/g, ' ')
      .trim();

    if (previewText.length > 100) previewText = previewText.substring(0, 100) + '...';
    if (!previewText) previewText = "The quick brown fox jumps over the lazy dog.";

    const rawTitle = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || 'Unknown Site';
    const siteTitle = rawTitle.replace(/\s+/g, ' ').trim();

    const uniqueFonts = Array.from(fontFamilies);

    return new Response(JSON.stringify({
      fonts: uniqueFonts,
      previewText: previewText,
      siteTitle: siteTitle
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'An error occurred.' }), { status: 500 });
  }
}