import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from '@/configs/store-key';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const {keys} = await request.json();
  const data: Record<string, string> = {};
  keys.forEach((key: string) => {
    data[key] = cookies().get(key)?.value || '';
  });
  return Response.json({
    message: 'Get cookie success!',
    data,
  });
}
