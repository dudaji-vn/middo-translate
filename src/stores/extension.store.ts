import { TBusinessExtensionData } from '@/app/(main-layout)/(protected)/business/settings/_components/extenstion/business-extension';
import { create } from 'zustand';

export type BusinessExtensionState = {
  businessData: TBusinessExtensionData | null;
  setBusinessExtension: (data: TBusinessExtensionData) => void;
};

export const useBusinessExtensionStore = create<BusinessExtensionState>()((set) => ({
    businessData: null,
    setBusinessExtension: (data: TBusinessExtensionData) => set(() => ({ businessData: data })),
}));
