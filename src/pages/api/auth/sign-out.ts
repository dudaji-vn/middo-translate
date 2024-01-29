import type { NextApiRequest, NextApiResponse } from 'next';

import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from '@/configs/store-key';
import Cookies from 'cookies';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  if (req.method !== 'GET') {
    return res.status(404).json({ message: 'method not supported' });
  }
  return new Promise(() => {
    const cookies = new Cookies(req, res);
    cookies.set(ACCESS_TOKEN_NAME, '', {
      httpOnly: true,
      sameSite: 'lax',
      expires: new Date(Date.now()),
    });
    cookies.set(REFRESH_TOKEN_NAME, '', {
      httpOnly: true,
      sameSite: 'lax',
      expires: new Date(Date.now()),
    });
    res.status(200).json({
      message: 'success',
    });
  });
}
