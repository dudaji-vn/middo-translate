import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export type Meeting = Record<string, {
  participantsIdJoined: string[],
}>
export type ChatState = {
  showTranslateOnType: boolean;
  toggleShowTranslateOnType: () => void;
  showMiddleTranslation: boolean;
  toggleShowMiddleTranslation: () => void;
  rooIdInteract: string | null;
  setRoomIdInteract: (id: string) => void;
  srcLang: string;
  setSrcLang: (lang: string) => void;
  detLang: string;
  setDetLang: (lang: string) => void;
  onlineList: string[];
  setOnlineList: (list: string[]) => void;
  meetingList: Meeting;
  updateMeetingList: (list: Meeting) => void;
  deleteMeeting: (roomId: string) => void;
  sendOnSave: boolean;
  toggleSendOnSave: () => void;
};

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      showTranslateOnType: true,
      toggleShowTranslateOnType: () =>
        set((state) => ({ showTranslateOnType: !state.showTranslateOnType })),
      showMiddleTranslation: true,
      toggleShowMiddleTranslation: () =>
        set((state) => ({
          showMiddleTranslation: !state.showMiddleTranslation,
        })),
      rooIdInteract: null,
      setRoomIdInteract: (id) => set(() => ({ rooIdInteract: id })),
      srcLang: 'auto',
      setSrcLang: () => set(() => ({ srcLang: 'auto' })),
      detLang: '',
      setDetLang: (lang) => set(() => ({ detLang: lang })),
      onlineList: [],
      setOnlineList: (list) => set(() => ({ onlineList: list })),
      meetingList: {},
      updateMeetingList: (list: Meeting) => set((state) => ({ meetingList: {
        ...state.meetingList,
        ...list,
      } })),
      deleteMeeting: (roomId: string) => set((state) => {
        const newMeetingList = { ...state.meetingList };
        delete newMeetingList[roomId];
        return { meetingList: newMeetingList };
      }),
      sendOnSave: false,
      toggleSendOnSave: () =>
        set((state) => ({ sendOnSave: !state.sendOnSave })),
    }),
    {
      name: 'chat-storage',
    },
  ),
);
