import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from '@/configs/store-key';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const cookieStore = cookies();
  return Response.json({
    message: 'Get cookie success!',
    data: {
      accessToken: cookieStore.get(ACCESS_TOKEN_NAME)?.value,
      refreshToken: cookieStore.get(REFRESH_TOKEN_NAME)?.value,
    },
  });
}
