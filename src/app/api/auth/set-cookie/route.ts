import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from '@/configs/store-key';
import DataRequestSetCookie from '@/types/set-cookie-data.interface';
import { setTokens } from '@/utils/cookies';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const data: DataRequestSetCookie[] = await request.json();
  const tokens: {access_token?: string, refresh_token?: string} = {}
  data.forEach((item: DataRequestSetCookie) => {
    if(item.key === ACCESS_TOKEN_NAME || item.key === REFRESH_TOKEN_NAME) {
      tokens[item.key] = item.value;
    } else {
      cookies().set(item.key, item.value, {
        maxAge: item?.time || 60 * 60 * 24 * 30,
      });
    }
  });
  if(tokens.access_token && tokens.refresh_token) {
    setTokens({accessToken: tokens.access_token, refreshToken: tokens.refresh_token});
  }
  return Response.json({
    message: 'Set cookie success!',
  });
}
