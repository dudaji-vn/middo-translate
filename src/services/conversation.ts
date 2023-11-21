import { NEXT_PUBLIC_URL } from '@/configs/env.public';
import { Room } from '@/types/room';

export async function createConversation(data: Room): Promise<Room> {
  const response = await fetch(`${NEXT_PUBLIC_URL}/api/conversation/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const json = await response.json();

  return json.data;
}
export async function getConversation(code: string): Promise<Room> {
  const response = await fetch(`${NEXT_PUBLIC_URL}/api/conversation/${code}`);
  const json = await response.json();
  return json.data;
}
