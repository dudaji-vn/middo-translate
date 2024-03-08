import { setTokens } from '@/utils/cookies';

import { redirect } from 'next/navigation';

export async function GET(request: Request, response: Response) {
  const { searchParams } = new URL(request.url);
  const accessToken = searchParams.get('access_token') || '';
  const refreshToken = searchParams.get('refresh_token') || '';
  // setTokens({ accessToken, refreshToken });
  redirect(`/sign-in?token=${accessToken}&refresh_token=${refreshToken}`);
}
