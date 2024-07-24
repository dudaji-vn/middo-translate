'use client';

import React, { useState } from 'react';
import 'reactflow/dist/style.css';

import { Edge, Handle, Position } from 'reactflow';
import { Button } from '@/components/actions';
import { FileText, MessageSquare, Plus, Trash2, Zap } from 'lucide-react';
import { cn } from '@/utils/cn';
import { FlowNode } from '../design-script-chat-flow';
import { useFormContext } from 'react-hook-form';
import { CustomNodeProps, FLOW_KEYS } from './node-types';
import { FormControl, FormField } from '@/components/ui/form';
import { RHFFormItem } from '@/components/form/RHF/RHFFormItem';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/data-entry';
import { isEmpty } from 'lodash';
import { FormInformation, useExtensionFormsStore } from '@/stores/forms.store';
import FormNodeSelector from './form-node-selector';

function FormNode({ data, isConnectable, ...node }: CustomNodeProps) {
  const { watch, setValue, control } = useFormContext();
  const nodes = watch(FLOW_KEYS.NODES);
  const edges = watch(FLOW_KEYS.EDGES);
  const { formsInfo } = useExtensionFormsStore();
  const nodeIndex = nodes.findIndex((n: { id: string }) => n.id === node.id);
  const [open, setOpen] = useState(false);
  const hasAnyRightNode = edges.some(
    (e: { source: string; target: string }) => e.source === node.id,
  );

  const onOpen = () => {
    if (!hasAnyRightNode) setOpen(true);
  };
  const onClose = () => setOpen(false);

  const currentNode = nodes[nodeIndex];

  const convertFormToOption = () => {
    const newFormNode: FlowNode = {
      ...currentNode,
      type: 'option',
      data: {
        content: 'form option',
        label: 'Actions',
      },
    };
    const nodesWithoutCurrent = nodes.filter(
      (n: { id: string }) => n.id !== node.id,
    );
    setValue(FLOW_KEYS.NODES, [...nodesWithoutCurrent, newFormNode]);
  };

  const addNewNode = (type: 'message' | 'container') => {
    const newNode: FlowNode = {
      id: `${node.id}-message-${new Date().getTime()}`,
      position: {
        x: currentNode.position.x + 200,
        y: currentNode.position.y + 100,
      },
      parentNode: node.id,
      parentId: node.id,
      type,
      data: {
        content: '',
      },
    };
    const newEdge: Edge = {
      id: `e${node.id}-${newNode.id}`,
      source: node.id,
      target: newNode.id,
      animated: true,
    };
    console.log('newNode', newNode);
    console.log('newEdge', newEdge);
    // TODO: uncomment this
    setValue(FLOW_KEYS.NODES, [...nodes, newNode]);
    setValue(FLOW_KEYS.EDGES, [...watch(FLOW_KEYS.EDGES), newEdge]);
  };

  return (
    <div
      className={cn(
        'left-[502px] top-[212px] h-auto w-[380px] gap-3 rounded-[12px] border  bg-white p-2 shadow-[2px_4px_16px_2px_#1616161A] dark:border dark:border-neutral-900 dark:bg-background',
      )}
    >
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Right}
        isConnectable
        className={cn(hasAnyRightNode ? 'visible' : 'invisible')}
      />
      <div className="flex flex-col gap-2 p-3">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-2 text-primary-500-main">
            <FileText size={18} />
            <p>Form</p>
          </div>
          <div className="flex flex-row items-center gap-2 text-primary-500-main">
            <Button.Icon
              color={'error'}
              size={'xs'}
              disabled={data?.readonly}
              variant={'ghost'}
              onClick={convertFormToOption}
              className={cn('text-neutral-600 hover:text-error-500')}
            >
              <Trash2 size={18} />
            </Button.Icon>
          </div>
        </div>
        <div>
          <FormNodeSelector
            nameField={`${FLOW_KEYS.NODES}.${nodeIndex}.form`}
          />
        </div>
        <div
          className={cn(
            ' flex flex-row transition-all',
            hasAnyRightNode ? 'hidden' : 'visible',
          )}
          onMouseLeave={onClose}
        >
          <Button
            onClick={onOpen}
            color={'secondary'}
            size={'xs'}
            shape={'square'}
            disabled={data?.readonly || hasAnyRightNode}
            className={cn(
              'h-10 w-full min-w-fit ',
              // hasAnyRightNode ? 'hidden' : 'visible',
            )}
            onMouseEnter={onOpen}
            startIcon={<Plus size={18} />}
          >
            Add trigger after submission
          </Button>
          <div className="relative size-0">
            <div className="absolute flex flex-row">
              <span
                className={cn(
                  'h-5 origin-left border-b border-dashed  border-primary-500-main pl-6 transition-all duration-75',
                  open ? 'scale-x-100' : 'scale-x-0 delay-100',
                )}
              ></span>
              <div
                className={cn(
                  'w-[180px] origin-[0_10%]  space-y-2  rounded-[12px] border border-dashed border-primary-500-main  bg-transparent p-2 shadow-[2px_4px_16px_2px_#1616161A] transition-all  duration-300',
                  open ? 'scale-100 delay-75' : 'scale-0',
                )}
              >
                <Button
                  size={'xs'}
                  color="default"
                  disabled={data?.readonly}
                  onClick={() => addNewNode('container')}
                  className="flex h-10 w-full flex-row justify-start gap-2"
                  shape={'square'}
                >
                  <Zap size={18} />
                  Action
                </Button>
                <Button
                  size={'xs'}
                  color="default"
                  disabled={data?.readonly}
                  className="flex h-10 w-full flex-row items-center justify-start gap-2"
                  onClick={() => addNewNode('message')}
                  shape={'square'}
                >
                  <MessageSquare size={18} />
                  Message
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default FormNode;
