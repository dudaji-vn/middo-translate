// server side getting functions

import { NEXT_PUBLIC_API_URL } from '@/configs/env.public';
import { cookies } from 'next/headers';

const basePath: string = NEXT_PUBLIC_API_URL + '/api';

const getAccessToken = async () => {
  const cookieStore = cookies();
  const access_token = cookieStore.get('access_token')?.value;
  if (access_token) {
    return access_token;
  }
  const res = await fetch(NEXT_PUBLIC_API_URL + '/api/auth/refresh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookieStore.get('refresh_token')?.value}`,
    },
  });
  const data = await res.json();
  return data?.accessToken || '';
};

export const getStationById = async (stationId: string) => {
  const access_token = await getAccessToken();
  try {
    const response = await fetch(`${basePath}/stations/${stationId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }
    return data?.data;
  } catch (error) {
    console.error(`Error fetching station "${stationId}" : ${error as Error}`);
    return {};
  }
};
