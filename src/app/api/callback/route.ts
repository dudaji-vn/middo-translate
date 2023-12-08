import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const accessToken = cookies().get('access_token');
  return Response.json({
    data: accessToken,
  });
}
