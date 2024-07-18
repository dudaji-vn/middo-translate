import { SpaceInboxFilterState } from '@/stores/space-inbox-filter.store';
import { create } from 'zustand';
import { VIDEO_CALL_LAYOUTS, VideoCallLayout } from '../constant/layout';
import getRandomColor from '../utils/get-random-color.util';
import CaptionInterface from '../interfaces/caption.interface';
import { User } from '@/features/users/types';
import { CallType } from '../constant/call-type';
import { Station } from '@/features/stations/types/station.types';
type ModalType = 'forward-call' | 'add-user' | 'video-setting' | 'leave-call' | 'stop-doodle' | 'choose-screen' | 'show-invitation'
export interface IRoom {
  _id: string;
  name: string;
  roomId: string;
  type: CallType;
  startTime: string;
  endTime: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  isHelpDesk: boolean;
  station?: Station
}

export interface IRequestCall {
  id: string;
  call: IRoom & {
    avatar?: string;
    participants?: User[];
  };
  user: User;
  room: IRoom & {
    avatar?: string;
    participants?: User[];
    space?: {
      _id: string;
      name: string;
      avatar: string;
    }
  };
  message?: string;
  space?: {
    _id: string;
    name: string;
    avatar: string;
  }
  type: 'direct' | 'group' | 'help_desk';
}
export type VideoCallState = {
  room: IRoom | null | undefined;
  layout: string;
  isDoodle: boolean;
  isDrawing: boolean;
  doodleImage: string | null;
  isMeDoodle: boolean;
  colorDoodle: string;
  isFullScreen: boolean;
  isPinDoodle: boolean;
  isPinShareScreen: boolean;
  modal?: ModalType;
  tmpRoom: string | null;
  isShowChat: boolean;
  isShowCaption: boolean;
  requestCall?: IRequestCall;
  captions: CaptionInterface[];
  messageId: string;
  isShowInviteSection: boolean;
  setRoom: (room?: IRoom) => void;
  isAllowDrag: boolean;
  setAllowDrag: (allowDrag: boolean) => void;
  setLayout: (layout?: VideoCallLayout) => void;
  setDoodle: (isDoodle: boolean) => void;
  setDoodleImage: (doodleImage: string) => void;
  setMeDoodle: (isMeDoodle: boolean) => void;
  setDrawing: (isDrawing: boolean) => void;
  setFullScreen: (isFullScreen: boolean) => void;
  setPinDoodle: (isPinDoodle: boolean) => void;
  setPinShareScreen: (isPinShareScreen: boolean) => void;
  setTempRoom: (tmpRoom: string | null) => void;
  setShowChat: (isShowChat: boolean) => void;
  setShowCaption: (isShowCaption: boolean) => void;
  setRequestCall: (requestCall?: IRequestCall) => void;
  addCaption: (caption: CaptionInterface) => void;
  clearCaption: () => void;
  setMessageId: (messageId: string) => void;
  clearStateVideoCall: () => void;
  setModal: (modal?: ModalType) => void;
  setShowInviteSection: (isShowInviteSection: boolean) => void;
};

export const useVideoCallStore = create<VideoCallState>()((set) => ({
  room: null,
  layout: VIDEO_CALL_LAYOUTS.GALLERY_VIEW,
  usersRequestJoinRoom: [],
  isDoodle: false,
  doodleImage: null,
  isMeDoodle: false,
  isDrawing: false,
  colorDoodle: getRandomColor(),
  peerShareScreen: [],
  isFullScreen: false,
  isPinDoodle: false,
  isPinShareScreen: false,
  tmpRoom: null,
  isShowChat: true,
  isShowCaption: false,
  requestCall: undefined,
  modal: undefined,
  captions: [],
  messageId: '',
  isShowInviteSection: true,
  setRoom: (room?: IRoom) => {
    set(() => ({ room }));
  },
  isAllowDrag: false,
  setAllowDrag: (allowDrag: boolean) => {
    set(() => ({ isAllowDrag: allowDrag }));
  },
  setLayout: (layout?: VideoCallLayout) => {
    set(() => ({ layout: layout || VIDEO_CALL_LAYOUTS.GALLERY_VIEW }));
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
  addCaption: (caption: CaptionInterface) => {
    set((state) => ({ captions: [...state.captions, caption] }));
  },
  clearCaption: () => {
    set(() => ({ captions: [] }));
  },
  setMessageId: (messageId: string) => {
    set(() => ({ messageId }));
  },
  setModal: (modal?: ModalType) => {
    set(() => ({ modal }));
  },
  setShowInviteSection: (isShowInviteSection: boolean) => {
    set(() => ({ isShowInviteSection }));
  },
  clearStateVideoCall: () => {
    set(() => ({
      layout: VIDEO_CALL_LAYOUTS.GALLERY_VIEW,
      isDoodle: false,
      doodleImage: null,
      isMeDoodle: false,
      isDrawing: false,
      peerShareScreen: [],
      isFullScreen: false,
      isPinDoodle: false,
      isPinShareScreen: false,
      tmpRoom: null,
      isShowChat: true,
      isShowCaption: false,
      requestCall: undefined,
      captions: [],
      messageId: '',
      modal: undefined
    }));
  },
}));
