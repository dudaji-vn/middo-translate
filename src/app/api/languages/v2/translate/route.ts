import { translate } from '@/lib/cloud-translate';
import { NEXT_PUBLIC_API_URL } from '@/configs/env.public';

export async function POST(request: Request) {
  console.log('run translate v2');
  const body = await request.json();
  const text = body.content || '';
  const from = body.from || 'vi';
  const to = body.to || 'en';
  if (!text) {
    return Response.json({
      data: '',
    });
  }
  const [response] = await translate.translate(text, {
    from,
    to,
  });

  await fetch(NEXT_PUBLIC_API_URL + '/api/google-api-stat/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => res.json());

  return Response.json({
    data: response,
  });
}
