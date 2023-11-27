import User from '@/database/models/user';
import { connect } from '@/database/connect';

export async function POST(request: Request) {
  try {
    await connect();
    const data = await request.json();
    const { email, password } = data;
    const isExistingUser = await User.exists({ email });
    if (isExistingUser) {
      return new Response('User already exists', {
        status: 400,
      });
    }
    return Response.json({
      data: 'Success',
    });
  } catch (error) {
    return new Response('Internal Server Error', {
      status: 500,
    });
  }
}
