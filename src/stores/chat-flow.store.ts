
import { FlowNode } from '@/app/(main-layout)/(protected)/spaces/[spaceId]/settings/_components/extension-creation/steps/script-chat-flow/nested-flow';
import { Room } from '@/features/chat/rooms/types';
import { Edge } from 'reactflow';
import { create } from 'zustand';

export type ChatFlowState = {
    nodes: Array<FlowNode>;
    setNodes: (nodes: Array<FlowNode>) => void;
    edges: Array<Edge>;
    setEdges: (edges: Array<Edge>) => void;
};

export const useChatFlowStore = create<ChatFlowState>()((set) => ({
    nodes: [],
    setNodes: (nodes: Array<FlowNode>) => set(() => ({ nodes })),
    edges: [],
    setEdges: (edges: Array<Edge>) => set(() => ({ edges })),
}));
