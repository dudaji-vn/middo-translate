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
import { FlowNode } from './nested-flow';
import { useFormContext } from 'react-hook-form';



function MessageNode({ data, isConnectable }: { data: any; isConnectable: boolean }) {
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
function ButtonNode(node: { data: FlowNode['data']; isConnectable: boolean }) {
    const { data, isConnectable } = node;
    const { content, img } = data;

    const { watch, setValue } = useFormContext();
    const nodes = watch('nodes');
    const edges = watch('edges');


    const onCLick = () => {
        console.log('nodes', nodes);
        console.log('edges', edges);

    }
    return (
        <div className="button-node">
            {/* <Handle type="target" position={Position.Left} isConnectable={isConnectable} /> */}
            <div>   
                <Button size={'xs'} className='h-10' onClick={onCLick}>
                    {content}
                </Button>
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

function ContainerNode({ data, isConnectable }: { data: any; isConnectable: boolean }) {
    return (
        <div className="w-[400px] h-[500px] border bg-transparent rounded-2xl">
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