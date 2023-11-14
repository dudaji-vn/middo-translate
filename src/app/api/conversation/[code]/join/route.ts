import Room from '@/database/models/room';
import { connect } from '@/database/connect';

export async function PATCH(
  request: Request,
  { params }: { params: { code: string } },
) {
  await connect();
  const code = params.code;
  const user = await request.json();
  const newRoom = await Room.findOneAndUpdate(
    { code },
    { $push: { participants: user } },
    { new: true },
  );
  return Response.json({
    data: newRoom,
  });
}
