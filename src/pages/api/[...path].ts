import {
  NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_FAKE_TOKEN,
} from '@/configs/env.public';
import type { NextApiRequest, NextApiResponse } from 'next';

import { ACCESS_TOKEN_NAME } from '@/configs/store-key';
import Cookies from 'cookies';
import httpProxy from 'http-proxy';

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
  return new Promise(() => {
    const cookies = new Cookies(req, res);
    const accessToken = cookies.get(ACCESS_TOKEN_NAME) || '';
    // const accessToken = NEXT_PUBLIC_FAKE_TOKEN;

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
