import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from '@/configs/store-key';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const accessToken = searchParams.get('access_token') || '';
  const refreshToken = searchParams.get('refresh_token') || '';
  cookies().set(ACCESS_TOKEN_NAME, accessToken, {
    maxAge: 60 * 60 * 24 * 1,
  });
  cookies().set(REFRESH_TOKEN_NAME, refreshToken, {
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect('/');
}
