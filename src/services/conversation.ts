import { Participant, Room } from '@/types/room';

import { NEXT_PUBLIC_URL } from '@/configs/env.public';
import { notFound } from 'next/navigation';

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
export async function joinConversation(
  code: string,
  user: Participant,
): Promise<Room> {
  const response = await fetch(
    `${NEXT_PUBLIC_URL}/api/conversation/${code}/join`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    },
  );
  const json = await response.json();
  return json.data;
}
