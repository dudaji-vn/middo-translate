
import { TBusinessExtensionData } from '@/features/chat/business/business.service';
import { Room } from '@/features/chat/rooms/types';
import { create } from 'zustand';

export type BusinessExtensionState = {
  businessData: TBusinessExtensionData | null;
  room?: Room | null;
  setBusinessExtension: (data: TBusinessExtensionData) => void;
  setRoom: (room: Room) => void;
};

export const useBusinessExtensionStore = create<BusinessExtensionState>()((set) => ({
    businessData: null,
    room: null,
    setRoom: (room: Room) => set(() => ({ room })),
    setBusinessExtension: (data: TBusinessExtensionData) => set(() => ({ businessData: data })),
}));
