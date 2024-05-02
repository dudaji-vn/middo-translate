import { translate } from '@/lib/cloud-translate';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const text = body.content;
    if (!text) {
      return Response.json({
        data: '',
      });
    }
    const [response] = await translate.detect(text);
    return Response.json({
      data: response,
    });
  } catch (error: any) {
    return NextResponse.next({
      status: error.status || 500,
      statusText: error.message || 'Internal Server Error',
    });
  }
}
