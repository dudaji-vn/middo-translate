import { setTokens } from '@/utils/cookies';

export async function POST(request: Request) {
  const { token, refresh_token } = await request.json();
  setTokens({ accessToken: token, refreshToken: refresh_token });
  return Response.json({
    message: 'Save cookie success!',
  });
}
