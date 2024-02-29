import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from '@/configs/store-key';

import { NEXT_PUBLIC_API_URL } from '@/configs/env.public';
import { cookies } from 'next/headers';
import { getRefreshToken } from '@/utils/cookies';

export async function POST(request: Request) {
  let refreshToken = getRefreshToken();
  const response = await fetch(NEXT_PUBLIC_API_URL + '/api/auth/refresh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${refreshToken}`,
    },
  }).then((res) => res.json());

  const acToken = response?.data?.accessToken;
  const rfToken = response?.data?.refreshToken;
  cookies().set(ACCESS_TOKEN_NAME, acToken);
  cookies().set(REFRESH_TOKEN_NAME, rfToken);
  return Response.json({
    data: response.data,
  });
}
