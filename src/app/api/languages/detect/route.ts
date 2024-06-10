import { translate } from '@/lib/cloud-translate';
import { NEXT_PUBLIC_API_URL } from '@/configs/env.public';

export async function GET(request: Request) {
	// const { searchParams } = new URL(request.url);
	// const text = searchParams.get('query') || '';

	// if (!text) {
	// 	return Response.json({
	// 		data: '',
	// 	});
	// }
	// const [response] = await translate.detect(text);

	// await fetch(NEXT_PUBLIC_API_URL + '/api/google-api-stat/detect', {
	// 	method: 'POST',
	// 	headers: {
	// 		'Content-Type': 'application/json',
	// 	},
	// }).then((res) => res.json());

	return Response.json({
		data: 'vi',
	});
}
