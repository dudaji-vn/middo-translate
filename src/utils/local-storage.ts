import {
  ACCEPT_DIFF_RESULT,
  LIMIT_CLIENTS_TABLE,
  LIMIT_FORMS_TABLE,
  LIMIT_SCRIPTS_TABLE,
} from '@/configs/store-key';
import { DEFAULT_CLIENTS_PAGINATION } from '@/types/business-statistic.type';
import { DEFAULT_FORMS_PAGINATION } from '@/types/forms.type';
import { DEFAULT_SCRIPTS_PAGINATION } from '@/types/scripts.type';

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
    console.log('error', error);
    return DEFAULT_CLIENTS_PAGINATION.limit;
  }
};
export const setClientsTablePerpage = (limit: number) => {
  localStorage.setItem(LIMIT_CLIENTS_TABLE, String(limit));
};

export const getScriptsTablePerpage = () => {
  try {
    const limit = parseInt(String(localStorage.getItem(LIMIT_SCRIPTS_TABLE)));
    return limit ? limit : DEFAULT_SCRIPTS_PAGINATION.limit;
  } catch (error) {
    console.log('error', error);
    return DEFAULT_SCRIPTS_PAGINATION.limit;
  }
};

export const setScriptsTablePerpage = (limit: number) => {
  localStorage.setItem(LIMIT_SCRIPTS_TABLE, String(limit));
};

export const getFormsTablePerpage = () => {
  try {
    const limit = parseInt(String(localStorage.getItem(LIMIT_FORMS_TABLE)));
    return limit ? limit : DEFAULT_FORMS_PAGINATION.limit;
  } catch (error) {
    console.log('error', error);
    return DEFAULT_FORMS_PAGINATION.limit;
  }
};

export const setFormsTablePerpage = (limit: number) => {
  localStorage.setItem(LIMIT_FORMS_TABLE, String(limit));
};
