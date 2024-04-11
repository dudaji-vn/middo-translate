import { FlowNode } from '@/app/(main-layout)/(protected)/business/settings/_components/extension-creation/steps/script-chat-flow/nested-flow';
import { TBusinessExtensionData } from '@/features/chat/help-desk/api/business.service';
import { Room } from '@/features/chat/rooms/types';
import { Edge } from 'reactflow';
import { create } from 'zustand';

export type BusinessExtensionState = {
  businessData: TBusinessExtensionData | null;
  room?: Room | null;
  chatFlow?: {
    nodes: FlowNode[];
    edges: Edge[];
  } | null;
  roomSendingState: 'loading' | undefined | null;
  setRoomSendingState: (state: 'loading' | undefined | null) => void;
  setBusinessExtension: (data: TBusinessExtensionData) => void;
  setRoom: (room: Room) => void;
  setChatFlow: (chatFlow: { nodes: FlowNode[]; edges: Edge[] }) => void;
};

export const useBusinessExtensionStore = create<BusinessExtensionState>()(
  (set) => ({
    businessData: null,
    room: null,
    chatFlow: null,
    roomSendingState: undefined,
    setRoomSendingState: (state: 'loading' | undefined | null) =>
      set(() => ({ roomSendingState: state })),
    setRoom: (room: Room) => set(() => ({ room })),
    setChatFlow: (chatFlow: { nodes: FlowNode[]; edges: Edge[] }) =>
      set(() => ({ chatFlow })),
    setBusinessExtension: (data: TBusinessExtensionData) =>
      set(() => ({ businessData: data })),
  }),
);
