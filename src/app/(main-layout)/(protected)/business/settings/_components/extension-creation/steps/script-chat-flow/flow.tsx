'use client'

import React, { useState } from 'react';
import ReactFlow, { Background, NodeChange, EdgeChange, Connection, Edge, BackgroundVariant } from 'reactflow';
import 'reactflow/dist/style.css';

import { addEdge, applyEdgeChanges, applyNodeChanges } from 'reactflow';

import './nodes-flow.css';

import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import { Node } from "reactflow";
import { Button } from '@/components/actions';
import { MessageSquare, MessagesSquare, Trash, Trash2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { MessageEditorTextProvider } from '@/features/chat/messages/components/message-editor/message-editor-text-context';
import { MessageEditorToolbar } from '@/features/chat/messages/components/message-editor/message-editor-toolbar';
import { TextInput } from '@/features/chat/messages/components/message-editor/message-editor-text-input';

export type FlowItemType = 'button' | 'message' | 'root';

export type FlowNode = Node<{
  type: FlowItemType;
  content: string;
  img?: string;
}> & {
  childrens?: FlowNode[];
};


const handleStyle = { left: 10 };

function MessageNode({ data, isConnectable }: { data: any; isConnectable: boolean }) {
  const onChange = useCallback((evt: any) => {
    console.log(evt.target.value);
  }, []);

  return (
    <div className="w-[424px] h-auto gap-3 border p-2 rounded-[12px] bg-white  shadow-[2px_4px_16px_2px_#1616161A] left-[502px] top-[212px]">
      <Handle type="target" position={Position.Left} isConnectable={isConnectable} />
      <div className="flex flex-col gap-2 p-3">
        <div className="flex items-center flex-row justify-between">
          <div className="flex items-center flex-row gap-2 text-primary-500-main">
            <MessageSquare size={18} />
            <p>Message</p>
          </div>
          <div className="flex items-center flex-row gap-2 text-primary-500-main">
            <Button.Icon color={'error'} size={'xs'} variant={'ghost'}>
              <Trash2 size={18} />
            </Button.Icon>
          </div>
        </div>
        <div
          className={'flex flex-1 rounded-xl border border-neutral-100 bg-white p-3'}
        >
          <textarea
            className={cn(
              'max-h-[160px] flex-1 resize-none outline-none',
            )}
            placeholder='Enter your message here'
            onChange={onChange}
            value={data.content}
          />
        </div>
        <MessageEditorToolbar disableMedia />
      </div>
    </div>
  );
}
function ButtonNode({ data, isConnectable }: { data: FlowNode['data']; isConnectable: boolean }) {
  const { content, img } = data;
  return (
    <div className="button-node">
      <Handle type="target" position={Position.Left} isConnectable={isConnectable} />
      <div>
        <Button size={'xs'} className='h-10'>{content}</Button>
      </div>
      <Handle type="source" position={Position.Right} isConnectable={isConnectable} />
    </div>
  );
}
function RootNode({ data, isConnectable }: { data: FlowNode['data']; isConnectable: boolean }) {
  // const { content, img } = data;
  return (
    <div className="button-node relative">
      <div className='p-4 w-fit  rounded-full bg-white text-primary-500-main shadow-[2px_4px_16px_2px_rgba(22,22,22,0.1)] relative'>
        <MessagesSquare className={`w-8 h-8`} />
      </div>
      <p className='text-sm absolute text-primary-500-main -bottom-10 left-0 -right-8'>Start conversation</p>
      <Handle type="source" position={Position.Right} isConnectable={isConnectable} />
    </div>
  );
}


const rfStyle = {
  backgroundColor: '#B8CEFF',
};


const rootNode: FlowNode = {
  id: 'node-1',
  type: 'root',
  position: { x: 0, y: 0 },
  data: {
    content: 'Click me',
    type: 'button'
  },
  childrens: [     {
    id: 'node-454',
    type: 'button',
    position: { x: 100, y: 0 },
    data: {
      content: 'Hello',
      img: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
      type: 'message'
    },
    childrens: [{
      id: 'node-ww5',
      type: 'button',
      position: { x: 100, y: 0 },
      data: {
        content: 'Hello',
        img: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
        type: 'message'
      }
    },
    {
      id: 'node-www5',
      type: 'button',
      position: { x: 100, y: 0 },
      data: {
        content: 'Hello',
        img: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
        type: 'message'
      }
    }]

  },
    {
      id: 'node-44',
      type: 'button',
      position: { x: 100, y: 0 },
      data: {
        content: 'Hello',
        img: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
        type: 'message'
      },
      childrens: [{
        id: 'nodew-5',
        type: 'message',
        position: { x: 100, y: 0 },
        data: {
          content: 'Hello',
          img: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
          type: 'message'
        }
      }]

    },
    {
      id: 'node-2',
      type: 'button',
      childrens: [
        {
          id: 'node-3',
          type: 'message',
          position: { x: 100, y: 0 },
          data: {
            content: 'Hello',
            img: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
            type: 'message'
          }
        },
   
      ],
      position: { x: 100, y: 0 },
      data: {
        content: 'Hello',
        img: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
        type: 'message'
      }
    }
  ],
};
const GAP = 150;
const generatePosition = (node: FlowNode, row: number = 0, col: number = 0, parentPos: {
  x: number;
  y: number;
} = {
  x: 0, y: 0
  }): FlowNode => {
  const { childrens, type } = node;
  const gapY = 200;
  const gapX = GAP
  const newPosition = {
    x: parentPos.x + col * gapX,
    y: parentPos.y + row * gapY,
  };
  if (!childrens) return { ...node, position: newPosition };
  const mid = Math.floor((childrens?.length || 0) / 2);
  return {
    ...node,
    position: newPosition,
    childrens: childrens.map((child, index) => {
      const newRow = index;
      return generatePosition(child, newRow, col + 1, newPosition);
    })
  };
}

//  đệ quy để duyệt qua các node con vầ remove childrens
const flattenNodes = (node: FlowNode): Node[] => {
  const { childrens, ...rest } = node;
  return [rest].concat(childrens?.flatMap(flattenNodes) || []);
}
const getEdges = (node: FlowNode): Edge[] => {
  const { childrens, id } = node;
  return childrens?.flatMap(child => {
    return [{ id: `${id}-${child.id}`, source: id, target: child.id }].concat(getEdges(child));
  }) || [];
}
const iedges = getEdges(rootNode);
const inodes = flattenNodes(generatePosition(rootNode, 0));
console.log('flattenNodes', inodes)
console.log('edges', iedges)
// we define the nodeTypes outside of the component to prevent re-renderings
// you could also use useMemo inside the component
const nodeTypes = {
  message: MessageNode,
  button: ButtonNode,
  root: RootNode
};

function Flow() {
  const [nodes, setNodes] = useState(inodes);
  const [edges, setEdges] = useState(iedges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect = useCallback(
    (connection: Edge | Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      fitView
      style={rfStyle}
    >
      <Background gap={16} variant={BackgroundVariant.Dots} className='bg-white outline-none' />
    </ReactFlow>
  );
}

export default Flow;
