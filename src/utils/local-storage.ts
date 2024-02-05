import { ACCEPT_DIFF_RESULT } from '@/configs/store-key';

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
