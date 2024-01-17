import { translate } from '@/lib/cloud-translate';
import { NEXT_PUBLIC_API_URL } from '@/configs/env.public';

export async function GET(request: Request) {
	const [response] = await translate.getLanguages();

	await fetch(NEXT_PUBLIC_API_URL + '/api/google-api-stat/languages', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
	}).then((res) => res.json());

	return Response.json({
		data: response,
	});
}
