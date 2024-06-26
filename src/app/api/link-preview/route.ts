import { NEXT_PUBLIC_URL } from '@/configs/env.public';
import axios from 'axios';
import { load } from 'cheerio';
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const url = searchParams.get('q') || '';

  if (!url) {
    return Response.json(
      {},
      {
        status: 400,
        statusText: 'Bad Request',
      },
    );
  }

  // ignore link file type
  const listFileType = [
    '.pdf',
    '.doc',
    '.docx',
    '.ppt',
    '.pptx',
    '.xls',
    '.xlsx',
    '.csv',
    '.txt',
    '.json',
    '.xml',
    '.zip',
    '.rar',
    '.7z',
    '.tar',
    '.apk',
    '.mp3',
    '.wav',
    '.ogg',
    '.flac',
    '.aac',
    '.wma',
    '.mp4',
    '.dmg',
    '.exe',
    '.iso',
  ];
  if (listFileType.some((fileType) => url.endsWith(fileType))) {
    return Response.json(
      {},
      {
        status: 404,
        statusText: 'Not Found',
      },
    );
  }
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36',
      },
    });
    const html = response.data;

    const $ = load(html);

    const title = $('head title').text();
    const description = $('meta[name="description"]').attr('content');
    let image =
      $('meta[property="og:image"]').attr('content') ||
      $('img').first().attr('src');
    let favicon =
      $('link[rel="icon"]').attr('href') ||
      $('link[rel="shortcut icon"]').attr('href');
    const opURL = $('meta[property="og:url"]').attr('content') || url;

    if (
      !favicon ||
      !favicon.startsWith('http') ||
      !favicon.startsWith('https')
    ) {
      const rootURL = new URL(opURL);
      if (favicon) {
        if (favicon.startsWith('./')) favicon = favicon.replace(/^\.\//, '/');
        console.log('🚀 ~ GET ~ favicon', favicon);
        favicon = `${rootURL.origin}${favicon}`;
      } else {
        favicon = `${rootURL.origin}/favicon.ico`;
      }
    }

    console.log({
      title,
      description,
      image,
      favicon,
    });

    const isDev = process.env.NODE_ENV === 'development';
    const imageHost = isDev ? 'http://localhost:3000' : NEXT_PUBLIC_URL;

    if (!image?.startsWith('https://opengraph.b-cdn.net')) {
      image = imageHost + '/api/image?q=' + image;
    }

    return Response.json({
      data: {
        title,
        description,
        image: image,
        url,
        favicon: favicon ? imageHost + '/api/image?q=' + favicon : null,
      },
    });
  } catch (error) {
    console.log('🚀 ~ GET ~ error:', error);
    return Response.json(
      {},
      {
        status: 404,
        statusText: 'Not Found',
      },
    );
  }
}
