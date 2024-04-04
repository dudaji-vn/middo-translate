'use client'

import React, { useMemo, useState } from 'react';
import ReactFlow, { Background, NodeChange, EdgeChange, Connection, Edge, BackgroundVariant } from 'reactflow';
import 'reactflow/dist/style.css';

import { addEdge, applyEdgeChanges, applyNodeChanges } from 'reactflow';

import './nodes-flow.css';

import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import { Node } from "reactflow";
import { Button } from '@/components/actions';
import { MessageSquare, MessagesSquare, Pen, Plus, Trash, Trash2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { FlowNode } from './nested-flow';
import { useFormContext } from 'react-hook-form';


export type CustomNodeProps = {
    data: FlowNode['data'];
    isConnectable: boolean;
    yPos: number;
    xPos: number;
    sourcePosition: string;
    targetPosition: string;
    type: string;
    zIndex: number;
    selected: boolean;
    id: string;
}


function MessageNode({ data, isConnectable }: CustomNodeProps) {
    const onChange = useCallback((evt: any) => {
        console.log(evt.target.value);
    }, []);

    return (
        <div className="w-[380px] h-auto gap-3 border p-2 rounded-[12px] bg-white  shadow-[2px_4px_16px_2px_#1616161A] left-[502px] top-[212px]">
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
                {/* <MessageEditorToolbar disableMedia /> */}
            </div>
        </div>
    );
}
function ButtonNode(node: CustomNodeProps) {
    const { data, isConnectable } = node;
    const { content, img } = data;

    const { watch, setValue } = useFormContext();
    const nodes = watch('nodes');
    const edges = watch('edges');
    console.log('nodes', nodes);
    console.log('edges', edges);

    if (!node) return null;
    return (
        <div className="w-[300px] h-auto px-4 flex-row flex">
            <Button size={'xs'} className='h-10 w-full' shape={'square'}>
                {content}
            </Button>
            {/* <Button.Icon color={'error'} size={'xs'} variant={'ghost'} onClick={onRemoveNode}>
                <Trash2 size={18} />
            </Button.Icon> */}
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
            <p className='text-sm absolute text-primary-500-main -bottom-14 left-0 -right-8'>Start conversation</p>
            <Handle type="source" position={Position.Right} isConnectable={isConnectable} />
        </div>
    );
}
// 

function ContainerNode(node: CustomNodeProps) {
    const { data, isConnectable } = node;

    const { watch, setValue } = useFormContext();
    const nodes = watch('nodes');
    const edges = watch('edges');

    const [width, height, childLenth] = useMemo(() => {
        const childLength = nodes.filter((n: { parentNode: string; }) => n.parentNode === node.id).length;
        const maxYPos = nodes.filter((n: { parentNode: string; }) => n.parentNode === node.id).reduce((acc: number, n: { position: { y: number; }; }) => {
            return Math.max(acc, n.position.y);
        }, 70);

        return [400, 110 + maxYPos, childLength];
    }, [nodes]);
    const onAddNode = useCallback(() => {
        const newButtonNode: FlowNode = {
            id: node.id + `button${childLenth + 1}`,
            data: { content: "New Button", },
            position: { x: 0, y: 120 + childLenth * 50 },
            parentNode: node.id,
            extent: 'parent',
            type: 'button',
            draggable: false
        };
        const newEmptyMessageNode: FlowNode = {
            id: node.id + `message${childLenth + 1}`,
            type: 'message',
            data: {
                content: '',
                img: ''
            },
            position: { x: node.xPos + width + 30, y: node.yPos + childLenth * 170 },
        };
        const newEdge: Edge = {
            id: `${newButtonNode.id}-${newEmptyMessageNode.id}`,
            source: newButtonNode.id,
            target: newEmptyMessageNode.id,
            animated: true,
            label: newButtonNode.data.content,
        };
        setValue('nodes', [...nodes, newButtonNode, newEmptyMessageNode]);
        setValue('edges', [...edges, newEdge]);
    }, [childLenth, nodes, edges, setValue, node, width, height]);

    return (
        <div className="w-[400px] h-[500px] border bg-transparent rounded-2xl relative"
            style={{ width, height }}
        >
            <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
            <div className="flex flex-col gap-2 p-3">
                <div className="flex items-center flex-row justify-between">
                    <div className="flex items-center flex-row gap-2 text-primary-500-main">
                        <MessageSquare size={18} />
                        <p>{data.label}</p>
                    </div>
                    <div className="flex items-center flex-row gap-2 text-primary-500-main">
                        <Button.Icon color={'error'} size={'xs'} variant={'ghost'}>
                            <Trash2 size={18} />
                        </Button.Icon>

                    </div>
                </div>
                <div
                    className={'bg-neutral-50 rounded-xl border border-neutral-100 text-neutral-900 p-3'}>
                    {data.content}
                </div>
            </div>
            <Button.Icon className='absolute bottom-5 left-4' shape={'square'} color={'secondary'} size={'xs'} onClick={onAddNode}>
                <Plus size={18} />
            </Button.Icon>
        </div>
    );
}

const rfStyle = {
    backgroundColor: '#B8CEFF',
};




const nodeTypes = {
    message: MessageNode,
    button: ButtonNode,
    root: RootNode,
    container: ContainerNode
};

export {
    nodeTypes,
    ButtonNode,
    RootNode,
    MessageNode
}