import { NextResponse } from 'next/server';
export async function POST(request: Request) {
  console.log('v3/translate POST');
  try {
    const body = await request.json();
    const text = body.content;
    if (!body.content) {
      return Response.json({
        data: '',
      });
    }
    const from = body.from || 'vi';
    const to = body.to || 'en';
    const url =
      'https://translate.stage.dudaji.com/api/v1/language/translate/v2';
    const headers = {
      accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const data = new URLSearchParams({
      target: to,
    });
    data.append('q', text);
    data.append('source', from);

    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: data.toString(),
    });
    const json = await res.json();
    const result = json.data.translations[0].translatedText;
    return Response.json({
      data: result,
    });
  } catch (error: any) {
    console.log('Error in translateText ❤️', error.message);
    return NextResponse.next({
      status: error.status || 500,
      statusText: error.message || 'Internal Server Error',
    });
  }
}
