import { NEXT_PUBLIC_API_URL } from '@/configs/env.public';
import { setTokens } from '@/utils/cookies';

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

  const accessToken = response?.data?.accessToken;
  const refreshToken = response?.data?.refreshToken;
  setTokens({ accessToken, refreshToken });
  return Response.json({
    data: response.data,
  });
}
