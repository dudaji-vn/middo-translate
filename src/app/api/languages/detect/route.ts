import { translate } from '@/configs/cloud-translate';

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const text = searchParams.get('query') || '';

	if (!text) {
		return Response.json({
			data: '',
		});
	}
	const [response] = await translate.detect(text);
	return Response.json({
		data: response,
	});
}
