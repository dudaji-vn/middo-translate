import { useParams } from 'next/navigation';

export const useRoomId = () => {
  const params = useParams<{ id: string }>();
  const roomId = params?.id;
  return roomId;
};
