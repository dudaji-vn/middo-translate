import { Message, Participant, Room } from '@/types/room';

import { NEXT_PUBLIC_URL } from '@/configs/env.public';

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
  const response = await fetch(`${NEXT_PUBLIC_URL}/api/conversation/${code}`, {
    cache: 'no-cache',
  });
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
      cache: 'no-cache',
    },
  );
  const json = await response.json();
  return json.data;
}

export async function getConversationWithUserSocketId(
  code: string,
  socketId: string,
): Promise<Room> {
  const response = await fetch(
    `${NEXT_PUBLIC_URL}/api/conversation/${code}/user-socket/${socketId}`,
    {
      cache: 'no-cache',
    },
  );
  const json = await response.json();
  return json.data;
}

export async function leaveConversation(
  code: string,
  user: Participant,
): Promise<Room> {
  const response = await fetch(
    `${NEXT_PUBLIC_URL}/api/conversation/${code}/leave`,
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

export async function sendMessage(
  message: Message,
  code: string,
): Promise<Message> {
  const response = await fetch(
    `${NEXT_PUBLIC_URL}/api/conversation/${code}/message`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    },
  );
  const json = await response.json();
  return json.data;
}
