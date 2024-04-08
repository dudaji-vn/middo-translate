'use client'

import React from 'react';
import 'reactflow/dist/style.css';


import { Handle, Position } from 'reactflow';
import { Button } from '@/components/actions';
import { MessageSquare, Trash2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { FlowNode } from '../nested-flow';
import { useFormContext } from 'react-hook-form';
import { RHFTextAreaField } from '@/components/form/RHF/RHFInputFields';
import { CustomNodeProps } from './node-types';
import Link from 'next/link';
import { MediaUploadDropzone, MediaUploadProvider } from '@/components/media-upload';
import { MessageEditorToolbarFile } from '@/features/chat/messages/components/message-editor/message-editor-toolbar-file';
import Tooltip from '@/components/data-display/custom-tooltip/tooltip';
import { MessageEditorToolbarEmoji } from '@/features/chat/messages/components/message-editor/message-editor-toolbar-emoji';
import { useTranslation } from 'react-i18next';


const MessageNodeFiles = () => {
    const { t } = useTranslation('common');
    return <>
        <Tooltip
            title={t('TOOL_TIP.ATTACHMENT')}
            triggerItem={<MessageEditorToolbarFile />}
        />

        <Tooltip
            title={t('TOOL_TIP.EMOJI')}
            triggerItem={<MessageEditorToolbarEmoji />}
        />
    </>
}

function MessageNode({ data, isConnectable, ...node }: CustomNodeProps) {
    const { watch, setValue } = useFormContext();
    const nodes = watch('nodes');
    const nodeIndex = nodes.findIndex((n: { id: string; }) => n.id === node.id);

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
                <MediaUploadProvider>
                    <MediaUploadDropzone>
                        <MessageNodeFiles />
                    </MediaUploadDropzone>
                </MediaUploadProvider>
            </div>
        </div>
    );
}
export default MessageNode;