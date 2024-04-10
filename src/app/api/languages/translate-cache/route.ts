import { NEXT_PUBLIC_URL } from '@/configs/env.public';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const searchParamsString = searchParams.toString();
  const response = await fetch(
    `${NEXT_PUBLIC_URL}/api/languages/translate?${searchParamsString}`,
    {
      cache: process.env.NODE_ENV === 'production' ? 'no-cache' : 'force-cache',
    },
  );
  const json = await response.json();
  return Response.json({
    data: json.data,
  });
}
