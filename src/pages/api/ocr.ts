import type { APIRoute } from 'astro';
import Tesseract from 'tesseract.js';
import Jimp from 'jimp';

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

    // Validate file size (max 10MB)
    if (imageFile.size > 10 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: 'Image too large. Max size: 10MB' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Convert file to buffer
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Convert any image format to PNG using Jimp
    const image = await Jimp.read(buffer);
    image.grayscale(); // Improve OCR accuracy

    const pngBuffer = await image.getBufferAsync(Jimp.MIME_PNG);
    const base64Image = pngBuffer.toString('base64');
    const dataUrl = `data:image/png;base64,${base64Image}`;

    // Perform OCR using Tesseract.js
    const result = await Tesseract.recognize(dataUrl, 'eng', {
      logger: () => {} // Suppress logs in production
    });

    const extractedText = result.data.text.trim();

    if (!extractedText) {
      return new Response(JSON.stringify({
        fonts: [],
        message: 'No text detected in the image',
        confidence: result.data.confidence
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      fonts: [],
      extractedText,
      confidence: result.data.confidence,
      message: 'Text extracted from image'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('OCR Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to process image: ' + (error.message || 'Unknown error') }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
