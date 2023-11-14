import Room from '@/database/models/room';
import { connect } from '@/database/connect';

export async function GET(
  request: Request,
  { params }: { params: { code: string } },
) {
  await connect();
  const code = params.code;
  const room = await Room.findOne({ code: code });
  return Response.json({
    data: room,
  });
}
