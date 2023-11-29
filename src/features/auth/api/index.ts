import { Response } from '@/types';
import { User } from '@/features/users/types';
import { fetchApi } from '@/utils/data-fetching';

export async function getCurrentUser() {
  try {
    const res = await fetchApi<Response<User>>('/auth/me');
    return res.data;
  } catch (err) {
    console.log(err);
    return null;
  }
}
