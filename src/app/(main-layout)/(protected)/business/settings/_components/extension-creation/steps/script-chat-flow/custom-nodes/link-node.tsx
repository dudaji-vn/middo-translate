'use client'

import React from 'react';
import 'reactflow/dist/style.css';


import { Handle, Position } from 'reactflow';
import { Button } from '@/components/actions';
import { Link, Trash2} from 'lucide-react';
import { cn } from '@/utils/cn';
import { FlowNode } from '../nested-flow';
import { useFormContext } from 'react-hook-form';
import { CustomNodeProps } from './node-types';
import RHFInputField from '@/components/form/RHF/RHFInputFields/RHFInputField';




function LinkNode({ data, isConnectable, ...node }: CustomNodeProps) {
    const { watch, setValue } = useFormContext();
    const nodes = watch('nodes');
    const nodeIndex = nodes.findIndex((n: { id: string; }) => n.id === node.id);

    const currentNode = nodes[nodeIndex];

    const convertLinkToOption = () => {
        const newLinkNode: FlowNode = {
            ...currentNode,
            type: 'option',
            data: {
                content: 'new option',
                label: 'Actions'
            }
        };
        const nodesWithoutCurrent = nodes.filter((n: { id: string; }) => n.id !== node.id);
        setValue('nodes', [...nodesWithoutCurrent, newLinkNode]);
    }

    return (
        <div className={cn(
            "w-[380px] h-auto gap-3 border p-2 rounded-[12px] bg-white  shadow-[2px_4px_16px_2px_#1616161A] left-[502px] top-[212px]")}>
            <Handle type="target" position={Position.Left} isConnectable={isConnectable} />
            <div className="flex flex-col gap-2 p-3">
                <div className="flex items-center flex-row justify-between">
                    <div className="flex items-center flex-row gap-2 text-primary-500-main">
                        <Link size={18} />
                        <p>Link</p>
                    </div>
                    <div className="flex items-center flex-row gap-2 text-primary-500-main">
                        <Button.Icon
                            color={'error'}
                            size={'xs'}
                            variant={'ghost'}
                            onClick={convertLinkToOption}
                            className='text-neutral-600 hover:text-error-500'
                        >
                            <Trash2 size={18} />
                        </Button.Icon>
                    </div>
                </div>
                <RHFInputField
                    name={`nodes.${nodeIndex}.data.link`}
                    inputProps={{
                        placeholder: 'https://example.com',
                        className: 'w-full h-full'
                    }}
                />
            </div>
        </div>
    );
}
export default LinkNode;