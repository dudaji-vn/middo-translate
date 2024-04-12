import { NEXT_PUBLIC_API_URL } from '@/configs/env.public';
import { translate } from '@/lib/cloud-translate';
import { NextResponse } from 'next/server';
export async function POST(request: Request) {
  console.log('v3/translate POST');
  const body = await request.json();
  const text = body.content || '';
  const from = body.from || 'vi';
  const to = body.to || 'en';
  const url = 'https://translate.stage.dudaji.com/api/v1/language/translate/v2';
  const headers = {
    accept: 'application/json',
    'Content-Type': 'application/json',
  };
  const data = {
    target: to,
    q: [text],
  };
  if (!text) {
    return Response.json({
      data: '',
    });
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    const json = await res.json();
    const result = json.data.translations[0].translatedText;
    return Response.json({
      data: result,
    });
  } catch (error: any) {
    try {
      const [response] = await translate.translate(text, {
        from,
        to,
      }); // use google cloud translate instead
      await fetch(NEXT_PUBLIC_API_URL + '/api/google-api-stat/translate', {
        method: 'POST',
        headers,
      }).then((res) => res.json());

      return Response.json({
        data: response,
      });
    } catch (error) {
      return NextResponse.next({
        status: 500,
        statusText: 'Translate error',
      });
    }
  }
}
