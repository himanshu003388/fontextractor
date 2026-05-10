import type { APIRoute } from 'astro';

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

    return new Response(JSON.stringify({
      imageData: `data:${mimeType};base64,${base64Image}`,
      success: true
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Upload Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to process image: ' + (error.message || 'Unknown error') }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
