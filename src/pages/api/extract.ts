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

    const mainResponse = await fetch(validUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      }
    });

    if (!mainResponse.ok) {
      return new Response(JSON.stringify({ error: `Failed to fetch the URL: ${mainResponse.statusText}` }), { status: 400 });
    }

    const html = await mainResponse.text();
    const fontFamilies = new Set<string>();
    
    // 1. Extract Fonts from Style Tags and Inline Styles in HTML
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

    // 2. Extract and Follow External CSS Links
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

    // Fetch up to 5 CSS files to avoid timeouts
    const cssPromises = cssLinks.slice(0, 5).map(link => 
      fetch(link).then(res => res.text()).catch(() => '')
    );
    const cssContents = await Promise.all(cssPromises);
    cssContents.forEach(extractFromText);

    // 3. Extract Meta/Snippet of Text for Preview
    // Look for h1, h2, or first significant p tag
    const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const pMatch = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    let previewText = (h1Match ? h1Match[1] : (pMatch ? pMatch[1] : ''))
      .replace(/<[^>]*>/g, '')  // Remove HTML tags
      .replace(/&nbsp;/g, ' ')   // Replace &nbsp; with space
      .replace(/&amp;/g, '&')   // Replace &amp; with &
      .replace(/&lt;/g, '<')    // Replace &lt; with <
      .replace(/&gt;/g, '>')    // Replace &gt; with >
      .replace(/&quot;/g, '"')  // Replace &quot; with "
      .replace(/&#39;/g, "'")   // Replace &#39; with '
      .replace(/\s+/g, ' ')     // Replace multiple whitespace with single space
      .trim();

    if (previewText.length > 100) previewText = previewText.substring(0, 100) + '...';
    if (!previewText) previewText = "The quick brown fox jumps over the lazy dog.";

    // 4. Clean up site title
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
    return new Response(JSON.stringify({ error: error.message || 'An error occurred during extraction.' }), { status: 500 });
  }
}