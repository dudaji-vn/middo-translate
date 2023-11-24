import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '@/configs/env.private';

import GoogleProvider from 'next-auth/providers/google';
import User from '@/database/models/user';
import { connect } from '@/database/connect';

export const nextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    session: async ({ session }: any) => {
      try {
        const user = await User.findOne({ email: session.user.email });
        session.user.id = user._id;
        session.user.name = user.name;
        session.user.image = user.image;
        return session;
      } catch (error) {
        console.log(error);
      }
    },
    signIn: async (data: any) => {
      const { email, name, picture } = data.profile;
      try {
        await connect();
        const userExist = await User.findOne({ email });
        if (!userExist) {
          await User.create({
            email,
            name,
            image: picture,
          });
        }
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  },
};
