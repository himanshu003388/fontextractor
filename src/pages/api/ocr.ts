import type { APIRoute } from 'astro';
import Tesseract from 'tesseract.js';

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File | null;

    if (!imageFile) {
      return new Response(JSON.stringify({ error: 'Image file is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (imageFile.size > 10 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: 'Image too large. Max size: 10MB' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = imageFile.type || 'image/png';
    const base64Image = buffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64Image}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const result = await Tesseract.recognize(dataUrl, 'eng', {
        coreThreshold: 0,
        cacheMethod: 'indexedDB',
      }, { signal: controller.signal });

      clearTimeout(timeoutId);

      const extractedText = result.data.text.trim();

      return new Response(JSON.stringify({
        extractedText: extractedText || '',
        confidence: Math.round(result.data.confidence),
        message: extractedText ? 'Text extracted from image' : 'No text detected in the image'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });

    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        return new Response(JSON.stringify({ error: 'OCR processing timeout. Try a smaller image.' }), {
          status: 408,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      throw err;
    }

  } catch (error: any) {
    console.error('OCR Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to process image: ' + (error.message || 'Unknown error') }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
