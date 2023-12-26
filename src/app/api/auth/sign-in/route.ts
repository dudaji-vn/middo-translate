import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from '@/configs/store-key';

import { NEXT_PUBLIC_API_URL } from '@/configs/env.public';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const { email, password } = await request.json();
  const response = await fetch(NEXT_PUBLIC_API_URL + '/api/auth/sign-in', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify({
      email,
      password,
    }),
  }).then((res) => res.json());

  const { accessToken, refreshToken } = response.data;

  cookies().set(ACCESS_TOKEN_NAME, accessToken);
  cookies().set(REFRESH_TOKEN_NAME, refreshToken);

  return Response.json({
    data: response.data,
  });
}
