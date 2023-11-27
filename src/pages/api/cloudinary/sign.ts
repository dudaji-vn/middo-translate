import type { NextApiRequest, NextApiResponse } from 'next';

import { CLOUDINARY_SECRET } from '@/configs/env.private';
import cloudinary from 'cloudinary';

export default function signature(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  // Get the timestamp in seconds
  const timestamp = Math.round(new Date().getTime() / 1000);

  // Get the signature using the Node.js SDK method api_sign_request
  const signature = cloudinary.v2.utils.api_sign_request(
    {
      timestamp: timestamp,
    },
    CLOUDINARY_SECRET,
  );

  res.statusCode = 200;
  res.json({ signature, timestamp });
}
