import { DUDAJI_API_URL } from '@/configs/env.public';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  console.log('Detect Language');
  try {
    const body = await request.json();
    const text = body.content;
    if (!text) {
      return Response.json({
        data: '',
      });
    }

    const url = `${DUDAJI_API_URL}/api/v1/language/detection`;
    const headers = {
      accept: 'application/json',
      'Content-Type': 'application/json',
    };
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ text }),
    });

    const result = await response.json();
    return Response.json({
      data: {
        language: 'vi',
      },
    });
  } catch (error: any) {
    return NextResponse.next({
      status: error.status || 500,
      statusText: error.message || 'Internal Server Error',
    });
  }
}
