import { create } from 'zustand';
import { VIDEOCALL_LAYOUTS } from '../constant/layout';
import getRandomColor from '../utils/get-random-color.util';
import CaptionInterface from '../interfaces/caption.interface';
import { User } from '@/features/users/types';
export interface IRoom {
  _id: string;
  name: string;
  roomId: string;
  type: 'GROUP' | 'DIRECT';
  startTime: string;
  endTime: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  
}

export interface IRequestCall {
  id: string;
  call: IRoom & {
    avatar?: string;
    participants?: User[];
  };
  user: User;
  room?: IRoom & {
    avatar?: string;
    participants?: User[];
  };
}
export type VideoCallState = {
  room: IRoom | null | undefined;
  layout: string;
  confirmLeave: boolean;
  isDoodle: boolean;
  isDrawing: boolean;
  doodleImage: string | null;
  isMeDoodle: boolean;
  confirmStopDoodle: boolean;
  colorDoodle: string;
  isFullScreen: boolean;
  isPinDoodle: boolean;
  isPinShareScreen: boolean;
  tmpRoom: string | null;
  isShowChat: boolean;
  isShowCaption: boolean;
  requestCall?: IRequestCall;
  isShowModalAddUser: boolean;
  isShowModalAudioVideoSetting: boolean;
  captions: CaptionInterface[];
  messageId: string;
  showChooseScreen: boolean;
  setRoom: (room?: IRoom) => void;
  setLayout: (layout?: string) => void;
  setConfirmLeave: (confirmLeave: boolean) => void;
  setDoodle: (isDoodle: boolean) => void;
  setDoodleImage: (doodleImage: string) => void;
  setMeDoodle: (isMeDoodle: boolean) => void;
  setDrawing: (isDrawing: boolean) => void;
  setConfirmStopDoodle: (confirmStopDoodle: boolean) => void;
  setFullScreen: (isFullScreen: boolean) => void;
  setPinDoodle: (isPinDoodle: boolean) => void;
  setPinShareScreen: (isPinShareScreen: boolean) => void;
  setTempRoom: (tmpRoom: string | null) => void;
  setShowChat: (isShowChat: boolean) => void;
  setShowCaption: (isShowCaption: boolean) => void;
  setRequestCall: (requestCall?: IRequestCall) => void;
  setModalAddUser: (isShowModalAddUser: boolean) => void;
  setModalAudioVideoSetting: (isShowModalAudioVideoSetting: boolean) => void;
  addCaption: (caption: CaptionInterface) => void;
  clearCaption: () => void;
  setMessageId: (messageId: string) => void;
  clearStateVideoCall: () => void;
  setChooseScreen: (showChooseScreen: boolean) => void;
};

export const useVideoCallStore = create<VideoCallState>()((set) => ({
  room: null,
  layout: VIDEOCALL_LAYOUTS.GALLERY_VIEW,
  confirmLeave: false,
  usersRequestJoinRoom: [],
  isDoodle: false,
  doodleImage: null,
  isMeDoodle: false,
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
  requestCall: undefined,
  isShowModalAddUser: false,
  isShowModalAudioVideoSetting: false,
  captions: [],
  messageId: '',
  showChooseScreen: false,
  setRoom: (room?: IRoom) => {
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
  setMeDoodle: (isMeDoodle: boolean) => {
    set(() => ({ isMeDoodle }));
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
  setRequestCall: (requestCall?: IRequestCall) => {
    set(() => ({ requestCall }));
  },
  setModalAddUser: (isShowModalAddUser: boolean) => {
    set(() => ({ isShowModalAddUser }));
  },
  setModalAudioVideoSetting: (isShowModalAudioVideoSetting: boolean) => {
    set(() => ({ isShowModalAudioVideoSetting }));
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
      isMeDoodle: false,
      isDrawing: false,
      confirmStopDoodle: false,
      peerShareScreen: [],
      isFullScreen: false,
      isPinDoodle: false,
      isPinShareScreen: false,
      tmpRoom: null,
      isShowChat: true,
      isShowCaption: false,
      requestCall: undefined,
      isShowModalAddUser: false,
      captions: [],
      messageId: '',
    }));
  }
}));
