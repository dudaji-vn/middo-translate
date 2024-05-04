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
    console.log('co to ko', to);
    if (to !== 'en') {
      // Translate to English first
      console.log('Translating to English first');
      let text = body.content;
      if (from !== 'en') {
        const englishTranslation = await translateText({
          text,
          from,
          to: 'en',
        });
        text = englishTranslation.data.translations[0].translatedText;
      }

      const result = await translateText({
        text,
        from: 'en',
        to,
      });
      return Response.json({
        data: result.data.translations[0].translatedText,
      });
    }
    const result = await translateText({
      text,
      from,
      to,
    });

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

async function translateText({
  text,
  from,
  to,
}: {
  text: string;
  from: string;
  to: string;
}) {
  const url = `${DUDAJI_API_URL}/api/v1/language/translate/v2`;
  const headers = {
    accept: 'application/json',
    'Content-Type': 'application/json',
  };
  const data = {
    target: to,
    q: [text],
    source: from,
  };

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to translate text: ${response.statusText}`);
  }

  return response.json();
}
