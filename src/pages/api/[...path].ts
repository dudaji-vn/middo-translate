import type { NextApiRequest, NextApiResponse } from 'next';

import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from '@/configs/store-key';
import Cookies from 'cookies';
import { NEXT_PUBLIC_API_URL } from '@/configs/env.public';
import httpProxy from 'http-proxy';
import { Tokens } from '@/types';
import { getTokenMaxAge } from '@/utils/jwt';
import { jwtDecode } from 'jwt-decode';

export const config = {
  api: {
    bodyParser: false,
  },
};

const proxy = httpProxy.createProxyServer();

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  return new Promise(async () => {
    const cookies = new Cookies(req, res);
    let accessToken = cookies.get(ACCESS_TOKEN_NAME) || '';
    let refreshToken = cookies.get(REFRESH_TOKEN_NAME) || '';
    let isInvalidAccessToken = false;
    if (!accessToken) {
      isInvalidAccessToken = true;
    } else {
      const decodedAccessToken = jwtDecode(accessToken);
      const currentTime = Date.now() / 1000;
      if (decodedAccessToken.exp! < currentTime) {
        isInvalidAccessToken = true;
      }
    }
    if (isInvalidAccessToken && refreshToken) {
      const res = await fetch(`${NEXT_PUBLIC_API_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${refreshToken}`,
        },
      });
      const data:
        | Tokens
        | {
            message: string;
            statusCode: number;
          } = await res.json();
      if ('statusCode' in data) {
        console.log(data);
        cookies.set(ACCESS_TOKEN_NAME, '', { maxAge: 0 });
        cookies.set(REFRESH_TOKEN_NAME, '', { maxAge: 0 });
        throw new Error(data.message);
      }
      accessToken = data.accessToken;
      refreshToken = data.refreshToken;
      cookies.set(ACCESS_TOKEN_NAME, accessToken, {
        maxAge: getTokenMaxAge(accessToken),
      });
      cookies.set(REFRESH_TOKEN_NAME, refreshToken, {
        maxAge: getTokenMaxAge(refreshToken),
      });
    }

    if (accessToken) {
      req.headers.Authorization = `Bearer ${accessToken}`;
    }

    req.headers.cookie = '';
    proxy.web(req, res, {
      target: NEXT_PUBLIC_API_URL,
      changeOrigin: true,
      selfHandleResponse: false,
    });
  });
}
