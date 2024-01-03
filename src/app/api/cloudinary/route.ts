import {
  NEXT_PUBLIC_CLOUDINARY_API_KEY,
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
} from '@/configs/env.public';

import { CLOUDINARY_SECRET } from '@/configs/env.private';

var cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_SECRET,
});
export async function DELETE(request: Request) {
  try {
    const { public_id } = await request.json();
    const result = await cloudinary.uploader.destroy(public_id);
    return new Response(JSON.stringify(result), {
      headers: { 'content-type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify(error), {
      headers: { 'content-type': 'application/json' },
    });
  }
}
