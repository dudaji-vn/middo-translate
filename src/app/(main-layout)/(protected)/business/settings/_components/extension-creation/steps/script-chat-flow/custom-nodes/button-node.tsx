'use client'

import React, { useMemo, useState } from 'react';
import { Edge, useReactFlow, getConnectedEdges, addEdge } from 'reactflow';
import 'reactflow/dist/style.css';


import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import { Button } from '@/components/actions';
import { Link, MessageSquare, MessagesSquare, Pen, Plus, Trash2, Zap } from 'lucide-react';
import { cn } from '@/utils/cn';
import { FlowNode } from '../nested-flow';
import { useFormContext } from 'react-hook-form';
import Ping from '../ping';
import { RHFTextAreaField } from '@/components/form/RHF/RHFInputFields';
import { deepDeleteNodes } from '../nodes.utils';
import { CustomNodeProps } from './node-types';
import UpdatingNodeWrapper from './updating-node-wrapper';
import { FormLabel } from '@/components/ui/form';
import { Switch } from '@/components/data-entry';
import RHFInputField from '@/components/form/RHF/RHFInputFields/RHFInputField';
import { add, set } from 'lodash';


function ButtonNode(node: CustomNodeProps) {
  const { data, isConnectable } = node;
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const { content, img } = data;

  const { deleteElements } = useReactFlow();
  const onRemoveNode = useCallback(() => {
    deleteElements({ nodes: [{ id: node.id }] });
  }, [node, deleteElements]);

  const { watch, setValue, formState: { errors } } = useFormContext();
  const nodes = watch('nodes');
  const edges = watch('edges');
  const nodeIndex = nodes.findIndex((n: { id: string; }) => n.id === node.id);
  const currentNode = nodes[nodeIndex];
  const openEdit = () => {
    setIsUpdating(true);
  }
  // @ts-ignore
  const isErrors = errors.nodes && errors?.nodes[nodeIndex]?.data;

  const reAddOptionNode = () => {
    const newButtonChildNode: FlowNode = {
      id: `${currentNode.id}-opt-${new Date().getTime()}`,
      type: 'option',
      data: {
        content: '',
        img: ''
      },
      position: { x: node.xPos + 600, y: node.yPos - 250 },
    };
    const newEdge: Edge = {
      id: `e${currentNode.id}-${newButtonChildNode.id}`,
      source: currentNode.id,
      target: newButtonChildNode.id,
      animated: true,
    };
    setValue('nodes', [...nodes, currentNode, newButtonChildNode]);
    setValue('edges', [...edges, newEdge]);
  }
  const onIsLinkChange = (checked: boolean) => {
    setIsLink(checked);
    if (checked) {
      const edged = getConnectedEdges([currentNode], edges)[0] || {};
      console.log('edged', edged)
      const targetNode = nodes.find((n: { id: string; }) => n.id === edged.target);
      const newEdges = edges.filter((edge: Edge) => edge.target !== edged.target && edge.source !== edged.source)
      setValue('edges', newEdges);
      const newNodes = deepDeleteNodes(nodes, [targetNode], edges);
      setValue('nodes', [...newNodes, currentNode]);
    }
    else {
      reAddOptionNode();
    }
  }

  if (!node) return null;
  return (
    <div className="w-[360px] h-auto px-4 flex-row gap-1 flex">
      <Button
        size={'xs'}
        className='h-10 w-full px-2' shape={'square'}
        onClick={openEdit}>
        <span className='max-w-[160px] truncate'>{content}</span>
      </Button>
      <Handle type="source" position={Position.Right} isConnectable={isConnectable} />
      <UpdatingNodeWrapper open={isUpdating || isErrors} onOpenChange={setIsUpdating}>
        <div className='flex flex-col gap-4 p-2'>
          <div className='flex flex-row justify-between  items-center px-2'>
            <FormLabel className='text-neutral-800 font-semibold'>Button</FormLabel>
            <div className='flex flex-row gap-1 items-center text-neutral-600'>
              <Link size={16} />
              <FormLabel>Link</FormLabel>
              <Switch
                onClick={() => setIsLink(!isLink)}
                checked={isLink}
                onCheckedChange={onIsLinkChange}
              />
            </div>
          </div>
          <RHFInputField
            name={`nodes.${nodeIndex}.data.content`}
            inputProps={{
              placeholder: 'Button name',
              className: 'w-full h-full'
            }}
          />
          <RHFInputField
            formItemProps={{
              className: isLink ? 'block' : 'hidden'
            }}
            name={`nodes.${nodeIndex}.data.link`}
            inputProps={{
              disabled: !isLink,
              placeholder: 'https://',
              className: 'w-full h-full'
            }}
          />
        </div>
      </UpdatingNodeWrapper >
      <Button.Icon color={'default'} size={'xs'} onClick={onRemoveNode}
        className='text-neutral-600 hover:text-error-500'>
        <Trash2 size={18} />
      </Button.Icon>
    </div >
  );
}
export default ButtonNode;