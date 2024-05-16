'use client'

import React, { useState } from 'react';
import 'reactflow/dist/style.css';


import { Handle, Position } from 'reactflow';
import { Button } from '@/components/actions';
import { Link, MessageSquare, Plus, Zap } from 'lucide-react';
import { cn } from '@/utils/cn';
import { FlowNode } from '../design-script-chat-flow';
import { useFormContext } from 'react-hook-form';
import Ping from '../ping';
import { CustomNodeProps, FLOW_KEYS } from './node-types';





function OptionNode({ data, isConnectable, ...node }: CustomNodeProps) {
    const { watch, setValue } = useFormContext();
    const nodes = watch(FLOW_KEYS.NODES);

    const [open, setOpen] = useState(false);
    const onOpen = () => setOpen(true);
    const onClose = () => setOpen(false);

    const convertOptionToAction = () => {
        const currentNode = nodes.find((n: { id: string; }) => n.id === node.id);
        const newContainerNode: FlowNode = {
            ...currentNode,
            position: { x: currentNode.position.x + 100, y: currentNode.position.y - 100 },
            type: 'container',
            data: {
                label: 'Actions',
                content: ''
            }
        };
        const nodesWithoutCurrent = nodes.filter((n: { id: string; }) => n.id !== node.id);
        setValue(FLOW_KEYS.NODES, [...nodesWithoutCurrent, newContainerNode]);
    }



    const convertOptionToMessage = () => {
        const currentNode = nodes.find((n: { id: string; }) => n.id === node.id);
        const newMessageNode: FlowNode = {
            ...currentNode,
            type: 'message',
            data: {
                content: ''
            }
        };
        const nodesWithoutCurrent = nodes.filter((n: { id: string; }) => n.id !== node.id);
        setValue(FLOW_KEYS.NODES, [...nodesWithoutCurrent, newMessageNode]);
    }
    const convertOptionToLink = () => {
        const currentNode = nodes.find((n: { id: string; }) => n.id === node.id);
        const newLinkNode: FlowNode = {
            ...currentNode,
            type: 'link',
            data: {
                content: ''
            }
        };
        const nodesWithoutCurrent = nodes.filter((n: { id: string; }) => n.id !== node.id);
        setValue(FLOW_KEYS.NODES, [...nodesWithoutCurrent, newLinkNode]);
    }

    return (
        <div className={cn("gap-3 p-2 flex flex-row transition-all duration-700")} onMouseLeave={onClose}>
            <Button.Icon
                onClick={onOpen}
                color={'secondary'}
                size={'xs'} onMouseEnter={onOpen}
                className={cn('transition-all duration-500', open ? 'rotate-180' : 'rotate-0',
                )}>
                <Handle type="target" position={Position.Left} isConnectable={isConnectable} />
                <Plus size={18} />
            </Button.Icon>
            {/* <Ping className={!!errorMessage ? 'absolute' : 'hidden'} message={errorMessage} /> */}
            <div
                className={cn('w-[180px] origin-top-left transition-all duration-500  h-auto border bg-transparent border-primary-500-main  border-dashed p-2 space-y-2 rounded-[12px]  shadow-[2px_4px_16px_2px_#1616161A]',
                    open ? 'scale-100' : 'scale-0'
                )}>
                <Button size={'xs'}
                    color='default'
                    onClick={convertOptionToAction}
                    className='h-10 w-full flex flex-row gap-2 justify-start'
                    shape={'square'}>
                    <Zap size={18} />
                    Action
                </Button>
                <Button
                    size={'xs'}
                    color='default'
                    className='h-10 w-full flex flex-row gap-2 items-center justify-start'
                    onClick={convertOptionToMessage}
                    shape={'square'}>
                    <MessageSquare size={18} />
                    Message
                </Button>
                {/* <Button
                    size={'xs'}
                    color='default'
                    className='h-10 w-full flex flex-row gap-2 items-center justify-start'
                    onClick={convertOptionToLink}
                    shape={'square'}>
                    <Link size={18} />
                    Link
                </Button> */}
            </div>
        </div>

    );
}


export default OptionNode;