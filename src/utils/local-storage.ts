
import { ACCEPT_DIFF_RESULT, LIMIT_CLIENTS_TABLE } from '@/configs/store-key';
import { DEFAULT_CLIENTS_PAGINATION } from '@/types/business-statistic.type';

export const getAcceptDiffResult = () => {
  const diffResult = localStorage.getItem(ACCEPT_DIFF_RESULT);
  if (diffResult) {
    return JSON.parse(diffResult);
  }
  return {};
};

export const addAcceptDiffResult = (source: string, result: string) => {
  const diffResult = getAcceptDiffResult();
  diffResult[source] = result;
  localStorage.setItem(ACCEPT_DIFF_RESULT, JSON.stringify(diffResult));
};

export const getClientsTablePerpage = () => {
  try {
    const limit = parseInt(String(localStorage.getItem(LIMIT_CLIENTS_TABLE)));
    return limit ? limit : DEFAULT_CLIENTS_PAGINATION.limit;
  } catch (error) {
    console.log('error', error)
    return DEFAULT_CLIENTS_PAGINATION.limit;
  }
};
export const setClientsTablePerpage = (limit: number) => {
  localStorage.setItem(LIMIT_CLIENTS_TABLE, String(limit));
};
