'use client';

import React from 'react';
import 'reactflow/dist/style.css';

import { Handle, Position } from 'reactflow';
import { Button } from '@/components/actions';
import { MessageSquare, Trash2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { FlowNode } from '../design-script-chat-flow';
import { useFormContext } from 'react-hook-form';
import { RHFTextAreaField } from '@/components/form/RHF/RHFInputFields';
import { CustomNodeProps, FLOW_KEYS } from './node-types';
import {
  MediaUploadDropzone,
  MediaUploadProvider,
} from '@/components/media-upload';
import NodeMessageToolbar from './node-message-toolbar';

function MessageNode({ data, isConnectable, ...node }: CustomNodeProps) {
  const { watch, setValue } = useFormContext();
  const nodes = watch(FLOW_KEYS.NODES);
  const nodeIndex = nodes.findIndex((n: { id: string }) => n.id === node.id);

  const currentNode = nodes[nodeIndex];

  const convertMessageToOption = () => {
    const newMessageNode: FlowNode = {
      ...currentNode,
      type: 'option',
      data: {
        content: 'new option',
        label: 'Actions',
      },
    };
    const nodesWithoutCurrent = nodes.filter(
      (n: { id: string }) => n.id !== node.id,
    );
    setValue(FLOW_KEYS.NODES, [...nodesWithoutCurrent, newMessageNode]);
  };

  return (
    <div
      className={cn(
        'left-[502px] top-[212px] h-auto w-[380px] gap-3 rounded-[12px] border  bg-white dark:bg-background dark:border dark:border-neutral-900 p-2 shadow-[2px_4px_16px_2px_#1616161A]',
      )}
    >
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />
      <div className="flex flex-col gap-2 p-3">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-2 text-primary-500-main">
            <MessageSquare size={18} />
            <p>Message</p>
          </div>
          <div className="flex flex-row items-center gap-2 text-primary-500-main">
            <Button.Icon
              color={'error'}
              size={'xs'}
              disabled={data?.readonly}
              variant={'ghost'}
              onClick={convertMessageToOption}
              className="text-neutral-600 hover:text-error-500"
            >
              <Trash2 size={18} />
            </Button.Icon>
          </div>
        </div>
        <RHFTextAreaField
          name={`${FLOW_KEYS.NODES}.${nodeIndex}.data.content`}
          textareaProps={{
            placeholder: 'Type your message here...',
            rows: 3,
            className: 'w-full h-full dark:bg-neutral-900',
            disabled: data?.readonly,
          }}
        />
        <MediaUploadProvider>
          <MediaUploadDropzone>
            <NodeMessageToolbar
              readonly={data?.readonly}
              mediasNameField={`${FLOW_KEYS.NODES}.${nodeIndex}.data.media`}
              contentNameField={`${FLOW_KEYS.NODES}.${nodeIndex}.data.content`}
            />
          </MediaUploadDropzone>
        </MediaUploadProvider>
      </div>
    </div>
  );
}
export default MessageNode;
