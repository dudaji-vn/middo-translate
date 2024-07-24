import { BusinessForm } from '@/types/forms.type';
import { create } from 'zustand';

export type FormInformation = Pick<BusinessForm, '_id' | 'name'>;

export type FormsState = {
  formsInfo: FormInformation[] | null;
  setFormsInfo: (formsInfo: FormInformation[]) => void;
};

export const useExtensionFormsStore = create<FormsState>((set) => ({
  formsInfo: null,
  setFormsInfo: (formsInfo) => set({ formsInfo }),
}));
