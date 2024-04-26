'use client'

import React, { useEffect, useMemo, useState } from 'react';
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
import toast from 'react-hot-toast';


function ButtonNode(node: CustomNodeProps) {
  const { data, isConnectable } = node;
  const [isUpdating, setIsUpdating] = useState<boolean>();
  const { content } = data;

  const { deleteElements } = useReactFlow();
  const { watch, setValue, formState: { errors } } = useFormContext();
  const nodes = watch('nodes');
  const edges = watch('edges');
  const { nodeIndex, currentNode, isLink } = useMemo(() => {
    const nodeIndex = nodes.findIndex((n: { id: string; }) => n.id === node.id);
    const currentNode = nodes[nodeIndex];
    return {
      nodeIndex,
      currentNode,
      isLink: !!currentNode?.data?.link
    }
  }, [node.data, node.id, node.type, nodes]);

  const onRemoveNode = useCallback(() => {
    if (isLink) {
      setValue('nodes', nodes.filter((n: { id: string; }) => n.id !== node.id));
      return;
    }
    deleteElements({ nodes: [{ id: node.id }] });
  }, [node, deleteElements]);


  const openEdit = () => {
    setIsUpdating(true);
  }

  const reAddOptionNode = () => {
    const updatedCurrentNode = {
      ...currentNode,
      data: {
        ...currentNode.data,
        link: undefined
      }
    };
    const newButtonChildNode: FlowNode = {
      id: `${currentNode.id}-opt-${new Date().getTime()}`,
      type: 'option',
      data: {
        content: '',
        media: []
      },
      position: { x: node.xPos + 600, y: node.yPos - 250 },
    };
    const newEdge: Edge = {
      id: `e${currentNode.id}-${newButtonChildNode.id}`,
      source: currentNode.id,
      target: newButtonChildNode.id,
      animated: true,
    };
    const nodesWithNewCurrentNode = nodes.map((n: { id: string; }) => n.id === currentNode.id ? updatedCurrentNode : n);
    setValue('nodes', [...nodesWithNewCurrentNode, newButtonChildNode]);
    setValue('edges', [...edges, newEdge]);

  }
  const onIsLinkChange = (checked: boolean) => {
    if (checked) {
      const edged = getConnectedEdges([currentNode], edges)[0] || {};
      const targetNode = nodes.find((n: { id: string; }) => n.id === edged.target);
      const newEdges = edges.filter((edge: Edge) => edge.target !== edged.target && edge.source !== edged.source)
      setValue('edges', newEdges);
      const newNodes = targetNode ? deepDeleteNodes(nodes, [targetNode], edges) : nodes;
      setValue('nodes', [...newNodes, {
        ...currentNode,
        data: {
          ...currentNode.data,
          link: 'https://'
        }
      }]);
    }
    else {
      reAddOptionNode();
    }
  }
  const onCancelAllChanges = () => {
    try {
      const beforeChanges = JSON.parse(localStorage.getItem('before-changes') || '{}');
      if (beforeChanges.nodes && beforeChanges.edges) {
        setValue('nodes', beforeChanges.nodes);
        setValue('edges', beforeChanges.edges);
      }
    } catch (error) {
      toast.error('Can\'t revert changes, please try again');
    }
    localStorage.removeItem('before-changes');
  }
  useEffect(() => {
    if (isUpdating === false) {
      onCancelAllChanges();
    }
    else if (isUpdating) {
      localStorage.setItem('before-changes', JSON.stringify({ nodes, edges }));
    }
  }, [isUpdating])

  if (!node) return null;
  return (
    <div className="w-[400px] h-auto pl-2  flex-row gap-1 flex">
      <Button
        size={'xs'}
        startIcon={isLink ? <Link className='w-4  h-4' /> : <></>}
        className='h-10 w-full px-2 flex flex-flow gap-3' shape={'square'}
        onClick={openEdit}>
        <span className='max-w-[160px] truncate'>{content}</span>
      </Button>
      <Handle type="source" className={currentNode?.data?.link ? 'hidden' : ''} position={Position.Right} isConnectable={isConnectable} />
      <UpdatingNodeWrapper open={Boolean(isUpdating)} onOpenChange={setIsUpdating}>
        <div className='flex flex-col gap-4 p-2'>
          <div className='flex flex-row justify-between  items-center px-2'>
            <FormLabel className='text-neutral-800 font-semibold'>Button</FormLabel>
            <div className='flex flex-row gap-1 items-center text-neutral-600'>
              <Link size={16} />
              <FormLabel>Link</FormLabel>
              <Switch
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
        <div className='w-full flex flex-flow gap-3 px-3 justify-end'>
          <Button
            size={'xs'}
            className='h-10 px-3 flex flex-flow gap-3'
            shape={'square'}
            variant={'default'}
            color={'secondary'}
            onClick={() => {
              setIsUpdating(false);
            }}
          >

            cancel
          </Button>
          <Button
            size={'xs'}
            className='h-10 px-2 flex flex-flow gap-3' shape={'square'}
            onClick={() => {
              localStorage.removeItem('before-changes');
              setIsUpdating(false);
            }}
          >
            save
          </Button>
        </div>
      </UpdatingNodeWrapper >
      <Button.Icon color={'default'} size={'xs'} onClick={onRemoveNode}
        className='text-neutral-600 hover:text-error-500 mr-3'>
        <Trash2 size={18} />
      </Button.Icon>
    </div >
  );
}
export default ButtonNode;