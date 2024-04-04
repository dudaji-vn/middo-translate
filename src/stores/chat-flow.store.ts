import { FlowNode } from '@/app/(main-layout)/(protected)/business/settings/_components/extension-creation/steps/script-chat-flow/custom-node';
import { Room } from '@/features/chat/rooms/types';
import { create } from 'zustand';

export type ChatFlowState = {
    nodes: Array<FlowNode>;
    setNodes: (nodes: Array<FlowNode>) => void;
    addNode: (node: FlowNode) => void;
    removeNode: (node: FlowNode) => void;

};

export const useChatFlowStore = create<ChatFlowState>()((set) => ({
    nodes: [],
    setNodes: (nodes: Array<FlowNode>) => set(() => ({ nodes })),
    addNode: (node: FlowNode) => set((state) => ({ nodes: [...state.nodes, node] })),
    removeNode: (node: FlowNode) => set((state) => ({ nodes: state.nodes.filter((n) => n.id !== node.id) })),
}));
