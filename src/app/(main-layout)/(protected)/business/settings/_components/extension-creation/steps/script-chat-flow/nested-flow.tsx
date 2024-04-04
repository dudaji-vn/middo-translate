import { useCallback, useEffect } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  useNodesState,
  useEdgesState,
  MiniMap,
  Controls,
  Node,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { nodeTypes } from './custom-node';
import { useChatFlowStore } from '@/stores/chat-flow.store';

export type FlowItemType = 'button' | 'message' | 'root';

export type NodeData = {
  content?: string;
  label?: string;
  img?: string;
};

export type FlowNode = Node<{
  content?: string;
  label?: string;
  img?: string;
}>;
const initialNodes: FlowNode[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Start conversation' },
    position: { x: 0, y: -100 },
    className: 'light',
    // type: 'root'
  },
  {
    id: '2',
    data: {
      label: 'Actions',
      content: 'Xin chao, toi co the giup gi cho ban?',
    },
    type: 'container',
    position: { x: 100, y: 0 },
    className: 'light',
    // style: { backgroundColor: 'rgba(255, 0, 0, 0.2)', width: 400, height: 900 },
  },
  {
    id: '4b',
    data: { content: 'Gap quan ly' },
    position: { x: 15, y: 125 },
    className: 'light',
    parentNode: '2',
    extent: 'parent',
    type: 'button',
  },
  {
    id: '4c',
    data: { content: 'Gap nhan vien' },
    position: { x: 15, y: 195 },
    className: 'light',
    parentNode: '2',
    extent: 'parent',
    type: 'button',
  },
  {
    id: '4b1',
    data: { content: 'OK, toi se chuyen ban den quan ly' },
    position: { x: 305, y: 125 },
    className: 'light',
    parentNode: '4b',
    type: 'message',
  },
  {
    id: '4c1',
    data: { content: 'OK, toi se chuyen ban den nhan vien' },
    position: { x: 305, y: 195 },
    className: 'light',
    parentNode: '4c',
    type: 'message',
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', label: 'Start conversation' },
  {
    id: 'e4b-4b1',
    source: '4b',
    target: '4b1',
    animated: true,
    label: 'Gap quan ly',
  },
  {
    id: 'e4c-4c1',
    source: '4c',
    target: '4c1',
    animated: true,
    label: 'Gap nhan vien',
  },
  // { id: 'e1-4', source: '1', target: '4', animated: true },
];

const NestedFlow = () => {
  const [nodes, setNodes, onNodesChange] =
    useNodesState<NodeData>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { setNodes: saveNodes } = useChatFlowStore();

  // useEffect(() => {
  //     saveNodes(nodes);
  // }, [nodes]);

  // const onConnect = useCallback((connection) => {
  //     setEdges((eds) => addEdge(connection, eds));
  // }, []);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      // onConnect={onConnect}
      // onElementsRemove={onElementsRemove}

      nodeTypes={nodeTypes}
      className="react-flow-subflows-example"
      fitView
    >
      <MiniMap />
      <Controls />
      <Background />
    </ReactFlow>
  );
};

export default NestedFlow;
