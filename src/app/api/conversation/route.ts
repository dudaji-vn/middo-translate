import Room from '@/database/models/room';
import { connect } from '@/database/connect';

export async function POST(request: Request) {
  await connect();
  const data = await request.json();
  const createdRoom = await Room.create(data);
  return Response.json({
    data: createdRoom,
  });
}
