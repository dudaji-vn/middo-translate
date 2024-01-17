import { translate } from '@/lib/cloud-translate';

export async function GET(request: Request) {
	const [response] = await translate.getLanguages();

	return Response.json({
		data: response,
	});
}
