import { BusinessForm } from '@/types/forms.type';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Answers = {
  formId: string;
  submission: Record<string, any>;
};
export type UserDraftAnswers = {
  [key: string]: Answers;
};

export const useHelpdeskStore = create<UserDraftAnswers>(
  // @ts-ignore
  persist((set) => ({}), {
    name: 'form-draft-helpdesk',
  }),
);
export const addFormDraftData = (userId: string, answer: Answers): void => {
  useHelpdeskStore.setState((state) => ({ ...state, [userId]: answer }));
};
export const removeFormDraftData = (userId: string): void => {
  useHelpdeskStore.setState((state) => {
    const newState = { ...state };
    // @ts-ignore
    delete newState[userId];
    return newState;
  });
};

export const useHelpdeskFormDraft = (userId: string): Answers => {
  // @ts-ignore
  return useHelpdeskStore((state) => state[userId]) ?? null;
};
