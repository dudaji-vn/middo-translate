import { NEXT_PUBLIC_URL } from '@/configs/env.public';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  console.log('run translate cache');
  const searchParamsString = searchParams.toString();
  const response = await fetch(
    `${NEXT_PUBLIC_URL}/api/languages/translate?${searchParamsString}`,
    {
      cache: 'no-cache',
    },
  );
  const json = await response.json();
  return Response.json({
    data: json.data,
  });
}
