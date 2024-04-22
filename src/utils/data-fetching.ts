'use server';

import { NEXT_PUBLIC_API_URL } from '@/configs/env.public';
import { getAccessToken, getRefreshToken } from '@/utils/cookies';

const baseUrl = NEXT_PUBLIC_API_URL;

export async function fetchApi<T>(path: string, options?: RequestInit) {
  const url = new URL(`/api${path}`, baseUrl).toString();
  let accessToken = getAccessToken();
  let refreshToken = getRefreshToken();
  if (!accessToken && refreshToken) {
    const res = await fetch(`${NEXT_PUBLIC_API_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${refreshToken.value}`,
      },
    });
    const data = await res.json();
    accessToken = {
      value: data.accessToken,
      name: 'access_token',
    };
  }
  const res = await fetch(url, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${accessToken?.value}`,
    },
  });
  if (!res.ok && res.status === 401) {
    throw new Error('Unauthorized');
  }
  const data: T = await res.json();
  return data;
}
