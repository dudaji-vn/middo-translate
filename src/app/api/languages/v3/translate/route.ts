import { DUDAJI_API_URL } from '@/configs/env.public';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    console.log('v3/translate POST');
    const body = await request.json();

    let text = body.content;

    // Validate input
    if (!body.content) {
      return Response.json({
        data: '',
      });
    }
    const from = body.from || 'vi';
    const to = body.to || 'en';

    const url = `${DUDAJI_API_URL}/api/v1/language/translate/v2`;
    const headers = {
      accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    if (from !== 'en' && to !== 'en') {
      // Translate to English first
      console.log('Translate to English first');
      const englishTranslation = await translateText(
        url,
        text,
        from,
        'en',
        headers,
      );
      text = englishTranslation.data.translations[0].translatedText;
    }

    const result = await translateText(url, text, from, to, headers);
    return Response.json({
      data: result.data.translations[0].translatedText,
    });
  } catch (error: any) {
    console.log('Error in translateText ❤️', error.message);
    return NextResponse.next({
      status: error.status || 500,
      statusText: error.message || 'Internal Server Error',
    });
  }
}

async function translateText(
  url: string,
  text: string,
  from: string,
  to: string,
  headers: Record<string, string>,
) {
  const data = new URLSearchParams({
    target: to,
    q: text,
    source: from,
  });

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: data.toString(),
  });

  if (!response.ok) {
    throw new Error(`Failed to translate text: ${response.statusText}`);
  }

  return response.json();
}
