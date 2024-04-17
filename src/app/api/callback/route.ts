import { ROUTE_NAMES } from '@/configs/route-name';
import { setTokens } from '@/utils/cookies';
import { cookies } from 'next/headers';

import { redirect } from 'next/navigation';

export async function GET(request: Request, response: Response) {
  const { searchParams } = new URL(request.url);
  const accessToken = searchParams.get('access_token') || '';
  const refreshToken = searchParams.get('refresh_token') || '';
  const redirectUri = searchParams.get('redirect_uri') || '';
  console.log('accessToken', accessToken);
  setTokens({ accessToken, refreshToken });
  const type = cookies().get('login-type')?.value || '';
  const redirectPath = cookies().get('redirect-path')?.value || '';

  cookies().set('login-type', '', { expires: new Date(0) });
  cookies().set('redirect-path', '', { expires: new Date(0) });
  if (type === 'desktop') {
    redirect(
      ROUTE_NAMES.DESKTOP_LOGIN +
        '?access_token=' +
        accessToken +
        '&refresh_token=' +
        refreshToken,
    );
  } else {
    if (redirectPath) {
      redirect(redirectPath);
    }
    if (redirectUri) {
      redirect(redirectUri);
    }
    redirect(ROUTE_NAMES.ONLINE_CONVERSATION);
  }
}
