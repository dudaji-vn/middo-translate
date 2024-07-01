export type SearchParams = {
  limit?: number;
  q: string;
};

export type SearchType = 'all' | 'user' | 'group' | 'message';
