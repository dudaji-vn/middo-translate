import { create } from 'zustand';

export type ModalState = {
  isShow: boolean;
  title?: string;
  description?: string;
  type: 'success' | 'error' | 'warning' | 'info';
};

export type ModalActions = {
  show: ({
    title,
    description,
    type,
  }: {
    title?: string;
    description?: string;
    type?: 'success' | 'error' | 'warning' | 'info';
  }) => void;
  hide: () => void;
};

export const useModalStore = create<ModalState & ModalActions>()((set) => ({
  isShow: false,
  content: '',
  type: 'success',
  show: ({ title, description, type }) =>
    set(() => ({ isShow: true, title, description, type })),
  hide: () => set(() => ({ isShow: false })),
}));
