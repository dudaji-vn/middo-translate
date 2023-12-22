import { Response } from '@/types';
import { User } from '@/features/users/types';
import { axios } from '@/lib/axios';
import queryString from 'query-string';

const basePath = '/recommendation';
export const recommendationApi = {
  async chat() {
    const path = queryString.stringifyUrl({
      url: `${basePath}/chat`,
    });
    const res: Response<User[]> = await axios.get(path);
    return res.data;
  },
};
