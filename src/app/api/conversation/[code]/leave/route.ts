import { Message, Participant } from '@/types/room';

import Room from '@/database/models/room';
import { connect } from '@/database/connect';
import { pusherServer } from '@/lib/pusher';

export async function PATCH(
  request: Request,
  { params }: { params: { code: string } },
) {
  await connect();
  const code = params.code;
  const user: Participant = await request.json();
  const newRoom = await Room.findOneAndUpdate(
    { code },
    { $pull: { participants: { socketId: user.socketId } } },
    { new: true },
  );
  const message: Message = {
    content: `${user.username} has leaved the conversation`,
    sender: {
      username: 'system',
      socketId: 'system',
      color: 'black',
      language: 'en',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isSystem: true,
  };
  pusherServer.trigger(code, 'message', message);
  return Response.json({
    data: newRoom,
  });
}
