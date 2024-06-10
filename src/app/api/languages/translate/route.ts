import { translate } from '@/lib/cloud-translate';
import { NEXT_PUBLIC_API_URL } from '@/configs/env.public';

export async function GET(request: Request) {
  // console.log('run translate');
  const { searchParams } = new URL(request.url);
  const text = searchParams.get('query') || '';
  // const from = searchParams.get('from') || 'vi';
  // const to = searchParams.get('to') || 'en';
  // if (!text) {
  //   return Response.json({
  //     data: '',
  //   });
  // }
  // const [response] = await translate.translate(text, {
  //   from,
  //   to,
  // });

	// await fetch(NEXT_PUBLIC_API_URL + '/api/google-api-stat/translate', {
	// 	method: 'POST',
	// 	headers: {
	// 		'Content-Type': 'application/json',
	// 	},
	// }).then((res) => res.json());

  return Response.json({
    data: text,
  });
}
