import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('q') || '';
  if (!url) {
    return Response.json({
      data: {
        message: 'URL is required',
      },
    });
  }
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Response(blob, {
      headers: {
        'Content-Type': 'image/jpeg',
      },
    });
  } catch (_error) {
    const error = _error as Error;
    return NextResponse.next({
      status: 500,
      statusText: error.message,
    });
  }
}
