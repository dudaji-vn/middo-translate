import { NEXT_PUBLIC_URL } from '@/configs/env.public';
import axios from 'axios';
import { load } from 'cheerio';
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
    const response = await axios.get(url);
    const html = response.data;

    const $ = load(html);

    const title = $('head title').text();
    const description = $('meta[name="description"]').attr('content');
    const image =
      $('meta[property="og:image"]').attr('content') ||
      $('img').first().attr('src');
    let favicon =
      $('link[rel="icon"]').attr('href') ||
      $('link[rel="shortcut icon"]').attr('href');

    if (favicon && !favicon.startsWith('http')) {
      favicon = new URL(favicon, url).href;
    }

    return Response.json({
      data: {
        title,
        description,
        image: NEXT_PUBLIC_URL + '/api/image?q=' + image,
        url,
        favicon: favicon ? NEXT_PUBLIC_URL + '/api/image?q=' + favicon : null,
      },
    });
  } catch (error) {
    return Response.json(
      {},
      {
        status: 404,
        statusText: 'Not Found',
      },
    );
  }
}
