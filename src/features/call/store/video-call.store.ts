import { create } from 'zustand';
import { VIDEOCALL_LAYOUTS } from '../constant/layout';
import getRandomColor from '../utils/get-random-color.util';
import CaptionInterface from '../interfaces/caption.interface';

export type VideoCallState = {
  room: any;
  layout: string;
  confirmLeave: boolean;
  isDoodle: boolean;
  isDrawing: boolean;
  doodleImage: string | null;
  isMeDoole: boolean;
  confirmStopDoodle: boolean;
  colorDoodle: string;
  isFullScreen: boolean;
  isPinDoodle: boolean;
  isPinShareScreen: boolean;
  tmpRoom: string | null;
  isShowChat: boolean;
  isShowCaption: boolean;
  requestCall: any[];
  isShowModalAddUser: boolean;
  captions: CaptionInterface[];
  messageId: string;
  showChooseScreen: boolean;
  setRoom: (room: any) => void;
  setLayout: (layout?: string) => void;
  setConfirmLeave: (confirmLeave: boolean) => void;
  setDoodle: (isDoodle: boolean) => void;
  setDoodleImage: (doodleImage: string) => void;
  setMeDoodle: (isMeDoole: boolean) => void;
  setDrawing: (isDrawing: boolean) => void;
  setConfirmStopDoodle: (confirmStopDoodle: boolean) => void;
  setFullScreen: (isFullScreen: boolean) => void;
  setPinDoodle: (isPinDoodle: boolean) => void;
  setPinShareScreen: (isPinShareScreen: boolean) => void;
  setTempRoom: (tmpRoom: string | null) => void;
  setShowChat: (isShowChat: boolean) => void;
  setShowCaption: (isShowCaption: boolean) => void;
  addRequestCall: (data: any) => void;
  removeRequestCall: (roomId?: string) => void;
  setModalAddUser: (isShowModalAddUser: boolean) => void;
  addCaption: (caption: CaptionInterface) => void;
  clearCaption: () => void;
  setMessageId: (messageId: string) => void;
  clearStateVideoCall: () => void;
  clearRequestCall: () => void;
  setChooseScreen: (showChooseScreen: boolean) => void;
};

export const useVideoCallStore = create<VideoCallState>()((set) => ({
  room: null,
  layout: VIDEOCALL_LAYOUTS.GALLERY_VIEW,
  confirmLeave: false,
  usersRequestJoinRoom: [],
  isDoodle: false,
  doodleImage: null,
  isMeDoole: false,
  isDrawing: false,
  confirmStopDoodle: false,
  colorDoodle: getRandomColor(),
  peerShareScreen: [],
  isFullScreen: false,
  isPinDoodle: false,
  isPinShareScreen: false,
  tmpRoom: null,
  isShowChat: true,
  isShowCaption: false,
  requestCall: [],
  isShowModalAddUser: false,
  captions: [],
  messageId: '',
  showChooseScreen: false,
  setRoom: (room: any) => {
    set(() => ({ room }));
  },
  setLayout: (layout?: string) => {
    set(() => ({ layout: layout || VIDEOCALL_LAYOUTS.GALLERY_VIEW }));
  },
  setConfirmLeave: (confirmLeave: boolean) => {
    set(() => ({ confirmLeave }));
  },
  setDoodle: (isDoodle: boolean) => {
    set(() => ({ isDoodle }));
  },
  setDoodleImage: (doodleImage: string) => {
    set(() => ({ doodleImage }));
  },
  setMeDoodle: (isMeDoole: boolean) => {
    set(() => ({ isMeDoole }));
  },
  setDrawing: (isDrawing: boolean) => {
    set(() => ({ isDrawing }));
  },
  setConfirmStopDoodle: (confirmStopDoodle: boolean) => {
    set(() => ({ confirmStopDoodle }));
  },
  setFullScreen: (isFullScreen: boolean) => {
    set(() => ({ isFullScreen }));
  },
  setPinDoodle: (isPinDoodle: boolean) => {
    if (isPinDoodle) set(() => ({ isPinShareScreen: false }));
    set(() => ({ isPinDoodle }));
  },
  setPinShareScreen: (isPinShareScreen: boolean) => {
    if (isPinShareScreen) set(() => ({ isPinDoodle: false }));
    set(() => ({ isPinShareScreen }));
  },
  setTempRoom: (tmpRoom: string | null) => {
    set(() => ({ tmpRoom }));
  },
  setShowChat: (isShowChat: boolean) => {
    set(() => ({ isShowChat }));
  },
  setShowCaption: (isShowCaption: boolean) => {
    set(() => ({ isShowCaption }));
  },
  addRequestCall: (data: any) => {
    set((state) => ({ requestCall: [...state.requestCall, data] }));
  },
  removeRequestCall: (roomId?: string) => {
    if (roomId)
      set((state) => ({
        requestCall: state.requestCall.filter((item) => item.id !== roomId),
      }));
    else set((state) => ({ requestCall: state.requestCall.slice(1) }));
  },
  clearRequestCall: () => {
    set(() => ({ requestCall: [] }));
  },
  setModalAddUser: (isShowModalAddUser: boolean) => {
    set(() => ({ isShowModalAddUser }));
  },
  addCaption: (caption: CaptionInterface) => {
    set((state) => ({ captions: [...state.captions, caption] }));
  },
  clearCaption: () => {
    set(() => ({ captions: [] }));
  },
  setMessageId: (messageId: string) => {
    set(() => ({ messageId }));
  },
  setChooseScreen: (showChooseScreen: boolean) => {
    set(() => ({ showChooseScreen }));
  },
  clearStateVideoCall: () => {
    set(() => ({
      layout: VIDEOCALL_LAYOUTS.GALLERY_VIEW,
      confirmLeave: false,
      isDoodle: false,
      doodleImage: null,
      isMeDoole: false,
      isDrawing: false,
      confirmStopDoodle: false,
      peerShareScreen: [],
      isFullScreen: false,
      isPinDoodle: false,
      isPinShareScreen: false,
      tmpRoom: null,
      isShowChat: true,
      isShowCaption: false,
      requestCall: [],
      isShowModalAddUser: false,
      captions: [],
      messageId: '',
    }));
  }
}));
