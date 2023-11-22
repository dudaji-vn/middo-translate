import { NEXT_PUBLIC_API_URL } from '@/configs/env.public';

export async function GET(request: Request) {
  await fetch(NEXT_PUBLIC_API_URL);
  return Response.json({
    data: 'Hello World',
  });
}
