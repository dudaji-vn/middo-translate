import { pusherServer } from '@/lib/pusher';

export async function POST(
  request: Request,
  { params }: { params: { code: string } },
) {
  const code = params.code;
  const message = await request.json();
  pusherServer.trigger(code, 'message', message);
  return Response.json({
    data: 'success',
  });
}
