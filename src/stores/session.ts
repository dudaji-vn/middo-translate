import { create } from 'zustand';

export type sessionState = {
  sessionId: string;
  setSessionId: (sessionId: string) => void;
};

export const useSessionStore = create<sessionState>()((set) => ({
  sessionId: '',
  setSessionId: (sessionId) => set({ sessionId }),
}));
