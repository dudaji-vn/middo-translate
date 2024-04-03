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
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36',
      },
    });
    const blob = await res.blob();
    const contentType = res.headers.get('content-type');
    return new Response(blob, {
      headers: {
        'Content-Type': contentType || 'image/png',
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
