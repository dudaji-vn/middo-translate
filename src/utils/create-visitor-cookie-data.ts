import { CK_VISITOR_ID, CK_VISITOR_ROOM_ID } from '@/types/business.type';

const DEFAULT_COOKIE_TIME = 150;
export const createVisitorCookies = ({
  user,
  roomId,
}: {
  user: { _id: string };
  roomId: string;
}) => {
  return [
    {
      key: CK_VISITOR_ID,
      value: user._id,
      time: DEFAULT_COOKIE_TIME,
    },
    {
      key: CK_VISITOR_ROOM_ID,
      value: roomId,
      time: DEFAULT_COOKIE_TIME,
    },
  ];
};
