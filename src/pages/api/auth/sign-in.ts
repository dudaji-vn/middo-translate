import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from '@/configs/store-key';

import Cookies from 'cookies';
import { NEXT_PUBLIC_API_URL } from '@/configs/env.public';
import httpProxy from 'http-proxy';

export const config = {
  api: {
    bodyParser: false,
  },
};

const proxy = httpProxy.createProxyServer();

export default function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(404).json({ message: 'method not supported' });
  }

  return new Promise((resolve) => {
    // don't send cookies to API server
    req.headers.cookie = '';

    const handleLoginResponse = (proxyRes: any, req: any, res: any) => {
      let body = '';
      proxyRes.on('data', function (chunk: any) {
        body += chunk;
      });

      proxyRes.on('end', function () {
        try {
          const isSuccess =
            proxyRes.statusCode &&
            proxyRes.statusCode >= 200 &&
            proxyRes.statusCode < 300;
          if (!isSuccess) {
            res.status(proxyRes.statusCode || 500).json(JSON.parse(body));
            return resolve(true);
          }
          const { accessToken, refreshToken, user } = JSON.parse(body).data;

          // convert token to cookies
          const cookies = new Cookies(req, res, {
            secure: process.env.NODE_ENV !== 'development',
          });
          cookies.set(ACCESS_TOKEN_NAME, accessToken, {
            httpOnly: true,
            sameSite: 'lax',
            expires: new Date(Date.now() + 86400 * 1000) /* 1 day */,
          });
          cookies.set(REFRESH_TOKEN_NAME, refreshToken, {
            httpOnly: true,
            sameSite: 'lax',
            expires: new Date(Date.now() + 86400 * 1000 * 7) /* 7 day */,
          });
          res.status(200).json({
            message: 'success',
            data: {
              accessToken,
              refreshToken,
              user,
            },
          });
        } catch (error) {
          res.status(500).json({ message: 'something went wrong' });
        }

        resolve(true);
      });
    };

    proxy.once('proxyRes', handleLoginResponse);
    proxy.web(req, res, {
      target: NEXT_PUBLIC_API_URL,
      changeOrigin: true,
      selfHandleResponse: true,
    });
  });
}
