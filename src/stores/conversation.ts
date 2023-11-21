import { Participant } from '@/types/room';
import { create } from 'zustand';

export type conversationState = {
  info: Participant | null;
  setInfo: (info: Participant) => void;
};

export const useConversationStore = create<conversationState>()((set) => ({
  info: null,
  setInfo: (info) => set({ info }),
}));
