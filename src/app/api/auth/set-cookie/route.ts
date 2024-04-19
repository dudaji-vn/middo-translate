import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from '@/configs/store-key';
import DataRequestSetCookie from '@/types/set-cookie-data.interface';
import { setTokens } from '@/utils/cookies';
import { cookies } from 'next/headers';
import { number } from 'zod';

const A_HOUR = 60 * 60;
const A_DAY = A_HOUR * 24;
const A_MOTH = A_DAY * 30;
export async function POST(request: Request) {
  const data: DataRequestSetCookie[] = await request.json();
  const tokens: { access_token?: string; refresh_token?: string } = {};
  data.forEach((item: DataRequestSetCookie) => {
    if (
      (item.key === ACCESS_TOKEN_NAME || item.key === REFRESH_TOKEN_NAME) &&
      !item.time
    ) {
      tokens[item.key] = item.value;
    } else {
      console.log(
        'Set cookie: ',
        item.key,
        item.value,
        item?.time || A_MOTH
      );
      cookies().set(item.key, item.value, {
        maxAge: typeof item?.time === 'number' ? item.time : A_MOTH,
      });
    }
  });
  if (tokens.access_token && tokens.refresh_token) {
    setTokens({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    });
  }
  return Response.json({
    message: 'Set cookie success!',
  });
}
