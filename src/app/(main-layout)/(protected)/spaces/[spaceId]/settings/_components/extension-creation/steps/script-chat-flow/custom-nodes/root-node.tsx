'use client'

import React, {  } from 'react';
import 'reactflow/dist/style.css';


import { Handle, Position } from 'reactflow';
import { MessagesSquare } from 'lucide-react';
import { CustomNodeProps } from './node-types';



function RootNode({ data, isConnectable }: CustomNodeProps) {
    return (
        <div className="button-node relative">
            <div className='p-4 w-fit  rounded-full bg-white text-primary-500-main shadow-[2px_4px_16px_2px_rgba(22,22,22,0.1)] relative'>
                <MessagesSquare className={`w-8 h-8`} />
            </div>
            <p className='text-sm absolute text-primary-500-main dark:text-neutral-50 -bottom-14 left-0 -right-8'>{data.content}</p>
            <Handle type="source" position={Position.Right} isConnectable={isConnectable} />
        </div>
    );
}
export default RootNode;