'use client'

import React, { useMemo, useState } from 'react';
import ReactFlow, { Background, NodeChange, EdgeChange, Connection, Edge, BackgroundVariant, useReactFlow, getConnectedEdges } from 'reactflow';
import 'reactflow/dist/style.css';

import { addEdge, applyEdgeChanges, applyNodeChanges } from 'reactflow';

import './nodes-flow.css';

import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import { Node } from "reactflow";
import { Button } from '@/components/actions';
import { MessageSquare, MessagesSquare, Pen, Plus, Trash, Trash2, Zap } from 'lucide-react';
import { cn } from '@/utils/cn';
import { FlowNode } from './nested-flow';
import { useFormContext } from 'react-hook-form';
import Tooltip from '@/components/data-display/custom-tooltip/tooltip';
import Ping from './ping';
import { RHFTextAreaField } from '@/components/form/RHF/RHFInputFields';

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


function MessageNode({ data, isConnectable, ...node }: CustomNodeProps) {
    const { watch, setValue } = useFormContext();
    const nodes = watch('nodes');
    const nodeIndex = nodes.findIndex((n: { id: string; }) => n.id === node.id);
    const messVal = watch(`nodes.${nodeIndex}.data.content`);

    const currentNode = nodes[nodeIndex];

    const convertMessageToOption = () => {
        const newMessageNode: FlowNode = {
            ...currentNode,
            type: 'option',
            data: {
                content: 'new option',
                label: 'Actions'
            }
        };
        const nodesWithoutCurrent = nodes.filter((n: { id: string; }) => n.id !== node.id);
        setValue('nodes', [...nodesWithoutCurrent, newMessageNode]);
    }

    return (
        <div className={cn(
            "w-[380px] h-auto gap-3 border p-2 rounded-[12px] bg-white  shadow-[2px_4px_16px_2px_#1616161A] left-[502px] top-[212px]")}>
            <Handle type="target" position={Position.Left} isConnectable={isConnectable} />
            <div className="flex flex-col gap-2 p-3">
                <div className="flex items-center flex-row justify-between">
                    <div className="flex items-center flex-row gap-2 text-primary-500-main">
                        <MessageSquare size={18} />
                        <p>Message</p>
                    </div>
                    <div className="flex items-center flex-row gap-2 text-primary-500-main">
                        <Button.Icon
                            color={'error'}
                            size={'xs'}
                            variant={'ghost'}
                            onClick={convertMessageToOption}
                            className='text-neutral-600 hover:text-error-500'
                        >
                            <Trash2 size={18} />
                        </Button.Icon>
                    </div>
                </div>
                <RHFTextAreaField
                    name={`nodes.${nodeIndex}.data.content`}
                    textareaProps={{
                        placeholder: 'Type your message here...',
                        rows: 3,
                        className: 'w-full h-full'
                    }}
                />
            </div>
        </div>
    );
}
function ButtonNode(node: CustomNodeProps) {
    const { data, isConnectable } = node;
    const { content, img } = data;

    const { deleteElements } = useReactFlow();
    const onRemoveNode = useCallback(() => {
        deleteElements({ nodes: [{ id: node.id }] });
    }, [node, deleteElements]);

    if (!node) return null;
    return (
        <div className="w-[360px] h-auto px-4 flex-row gap-1 flex">
            <Button size={'xs'} className='h-10 w-full' shape={'square'}>
                {content}
            </Button>
            <Button.Icon color={'default'} size={'xs'} >
                <Pen size={18} />
            </Button.Icon>
            <Button.Icon color={'default'} size={'xs'} onClick={onRemoveNode}
                className='text-neutral-600 hover:text-error-500'>
                <Trash2 size={18} />
            </Button.Icon>
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
            <p className='text-sm absolute text-primary-500-main -bottom-14 left-0 -right-8'>{data.content}</p>
            <Handle type="source" position={Position.Right} isConnectable={isConnectable} />
        </div>
    );
}
function OptionNode({ data, isConnectable, ...node }: CustomNodeProps) {
    const { watch, setValue } = useFormContext();
    const nodes = watch('nodes');
    const flowErrors = watch('flowErrors');
    const errorMessage = flowErrors.find((error: { id: string; }) => error.id === node.id)?.message || '';

    const [open, setOpen] = useState(false);
    const onOpen = () => setOpen(true);
    const onClose = () => setOpen(false);

    const convertOptionToAction = () => {
        const currentNode = nodes.find((n: { id: string; }) => n.id === node.id);
        const newContainerNode: FlowNode = {
            ...currentNode,
            type: 'container',
            data: {
                label: 'Actions',
                content: ''
            }
        };
        const nodesWithoutCurrent = nodes.filter((n: { id: string; }) => n.id !== node.id);
        setValue('nodes', [...nodesWithoutCurrent, newContainerNode]);
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
        setValue('nodes', [...nodesWithoutCurrent, newMessageNode]);
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
            <Ping className={!!errorMessage ? 'absolute' : 'hidden'} message={errorMessage} />
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
            </div>
        </div>

    );
}

function ContainerNode(node: CustomNodeProps) {
    const { data, isConnectable } = node;
    const { watch, setValue } = useFormContext();
    const flowErrors = watch('flowErrors');
    const errorMessage = flowErrors.find((error: { id: string; }) => error.id === node.id)?.message
    const nodes = watch('nodes');
    const edges = watch('edges');
    const currentNodeIndex = nodes.findIndex((n: { id: string; }) => n.id === node.id);
    const currentNode = nodes[currentNodeIndex];

    const [width, height, childLenth] = useMemo(() => {
        const childLength = nodes.filter((n: { parentNode: string; }) => n.parentNode === node.id).length;
        const maxYPos = nodes.filter((n: { parentNode: string; }) => n.parentNode === node.id).reduce((acc: number, n: { position: { y: number; }; }) => {
            return Math.max(acc, n.position.y);
        }, 150);

        return [400, 110 + maxYPos, childLength];
    }, [nodes, node.id]);

    const onAddNode = () => {
        const newButtonNode: FlowNode = {
            id: node.id + `button${childLenth + 1}-${new Date().getTime()}`,
            data: { content: "New Button", },
            position: { x: 0, y: Math.max(120 + childLenth * 50, height - 60) },
            parentNode: node.id,
            extent: 'parent',
            type: 'button',
            draggable: false
        };
        const newButtonChildNode: FlowNode = {
            id: `${newButtonNode}-child-${new Date().getTime()}`,
            type: 'option',
            data: {
                content: '',
                img: ''
            },
            position: { x: node.xPos + width + 200, y: node.yPos + childLenth * 170 },
        };
        const newEdge: Edge = {
            id: `e${newButtonNode.id}-${newButtonChildNode.id}`,
            source: newButtonNode.id,
            target: newButtonChildNode.id,
            animated: true,
            // label: "select the answer"
        };
        setValue('nodes', [...nodes, newButtonNode, newButtonChildNode]);
        setValue('edges', [...edges, newEdge]);
    }


    const convertContainerToOption = () => {
        const currentChilds = nodes.filter((n: { parentNode: string; }) => n.parentNode === node.id);
        const connected = getConnectedEdges(currentChilds, edges);
        const newNodes = nodes.filter((node: Node) => !connected.some((edge) => edge.source === node.id || edge.target === node.id));
        const updatedNode = {
            ...currentNode,
            type: 'option',
            data: {
                label: 'Actions',
                content: ''
            }
        };
        setValue('nodes', [...newNodes, updatedNode]);
    }

    const formFieldId = `nodes.${currentNodeIndex}.data.content`;

    return (
        <div className="w-[400px] h-[500px] border bg-transparent rounded-2xl relative"
            style={{ width, height }}
        >
            <Ping className={!!errorMessage ? 'absolute' : 'hidden'} message={errorMessage} />
            <Handle type="target" position={Position.Left} isConnectable={isConnectable} />
            <div className="flex flex-col gap-2 p-3">
                <div className="flex items-center flex-row justify-between">
                    <div className="flex items-center flex-row gap-2 text-primary-500-main">
                        <MessageSquare size={18} />
                        <p>{data.label}</p>
                    </div>
                    <div className="flex items-center flex-row gap-2 text-primary-500-main"
                    >
                        <Button.Icon
                            color={'error'}
                            size={'xs'}
                            onClick={convertContainerToOption}
                            className='text-neutral-600 hover:text-error-500'
                            variant={'ghost'}>
                            <Trash2 size={18} />
                        </Button.Icon>

                    </div>
                </div>
                <RHFTextAreaField
                    name={formFieldId}
                    textareaProps={{
                        placeholder: 'Type your message here...',
                        rows: 3,
                        className: 'w-full h-full'
                    }}
                />
                {/* <div
                    className={'bg-neutral-50 rounded-xl border border-neutral-100 text-neutral-900 p-3'}>
                    {data.content}
                </div> */}
            </div>
            <div className='absolute bottom-4 left-0 w-full px-4'>
                <Button shape={'square'} className='w-full' color={'secondary'} size={'xs'} onClick={onAddNode}>
                    <Plus size={18} className='mr-2' />  Add Button
                </Button>
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
    container: ContainerNode,
    option: OptionNode
};

export {
    nodeTypes
}