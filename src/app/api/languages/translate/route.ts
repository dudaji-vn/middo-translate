import { translate } from '@/lib/cloud-translate';

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const text = searchParams.get('query') || '';
	const from = searchParams.get('from') || 'vi';
	const to = searchParams.get('to') || 'en';
	if (!text) {
		return Response.json({
			data: '',
		});
	}
	const [response] = await translate.translate(text, {
		from,
		to,
	});
	return Response.json({
		data: response,
	});
}
