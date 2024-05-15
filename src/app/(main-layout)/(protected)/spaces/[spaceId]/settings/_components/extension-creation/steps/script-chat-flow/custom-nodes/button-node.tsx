'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Edge, useReactFlow, getConnectedEdges, addEdge } from 'reactflow';
import 'reactflow/dist/style.css';

import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import { Button } from '@/components/actions';
import {
  Link,
  MessageSquare,
  MessagesSquare,
  Pen,
  Plus,
  Trash2,
  Zap,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { FlowNode } from '../design-script-chat-flow';
import { useFormContext } from 'react-hook-form';
import Ping from '../ping';
import { RHFTextAreaField } from '@/components/form/RHF/RHFInputFields';
import { deepDeleteNodes } from '../nodes.utils';
import { CustomNodeProps, FLOW_KEYS } from './node-types';
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
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const nodes = watch(FLOW_KEYS.NODES);
  const edges = watch(FLOW_KEYS.EDGES);
  const { nodeIndex, currentNode, isLink } = useMemo(() => {
    const nodeIndex = nodes.findIndex((n: { id: string }) => n.id === node.id);
    const currentNode = nodes[nodeIndex];
    return {
      nodeIndex,
      currentNode,
      isLink: !!currentNode?.data?.link,
    };
  }, [node.data, node.id, node.type, nodes]);

  const onRemoveNode = useCallback(() => {
    if (isLink) {
      setValue(
        FLOW_KEYS.NODES,
        nodes.filter((n: { id: string }) => n.id !== node.id),
      );
      return;
    }
    deleteElements({ nodes: [{ id: node.id }] });
  }, [node, deleteElements]);

  const openEdit = () => {
    setIsUpdating(true);
  };

  const reAddOptionNode = () => {
    const updatedCurrentNode = {
      ...currentNode,
      data: {
        ...currentNode.data,
        link: undefined,
      },
    };
    const newButtonChildNode: FlowNode = {
      id: `${currentNode.id}-opt-${new Date().getTime()}`,
      type: 'option',
      data: {
        content: '',
        media: [],
      },
      position: { x: node.xPos + 600, y: node.yPos - 250 },
    };
    const newEdge: Edge = {
      id: `e${currentNode.id}-${newButtonChildNode.id}`,
      source: currentNode.id,
      target: newButtonChildNode.id,
      animated: true,
    };
    const nodesWithNewCurrentNode = nodes.map((n: { id: string }) =>
      n.id === currentNode.id ? updatedCurrentNode : n,
    );
    setValue(FLOW_KEYS.NODES, [...nodesWithNewCurrentNode, newButtonChildNode]);
    setValue(FLOW_KEYS.EDGES, [...edges, newEdge]);
  };
  const onIsLinkChange = (checked: boolean) => {
    if (checked) {
      const edged = getConnectedEdges([currentNode], edges)[0] || {};
      const targetNode = nodes.find(
        (n: { id: string }) => n.id === edged.target,
      );
      const newEdges = edges.filter(
        (edge: Edge) =>
          edge.target !== edged.target && edge.source !== edged.source,
      );
      setValue(FLOW_KEYS.EDGES, newEdges);
      const newNodes = targetNode
        ? deepDeleteNodes(nodes, [targetNode], edges)
        : nodes;
      setValue(FLOW_KEYS.NODES, [
        ...newNodes,
        {
          ...currentNode,
          data: {
            ...currentNode.data,
            link: 'https://',
          },
        },
      ]);
    } else {
      reAddOptionNode();
    }
  };
  const onCancelAllChanges = () => {
    try {
      const beforeChanges = JSON.parse(
        localStorage.getItem('before-changes') || '{}',
      );
      if (beforeChanges.nodes && beforeChanges.edges) {
        setValue(FLOW_KEYS.NODES, beforeChanges.nodes);
        setValue(FLOW_KEYS.EDGES, beforeChanges.edges);
      }
    } catch (error) {
      toast.error("Can't revert changes, please try again");
    }
    localStorage.removeItem('before-changes');
  };
  useEffect(() => {
    if (isUpdating === false) {
      onCancelAllChanges();
    } else if (isUpdating) {
      localStorage.setItem('before-changes', JSON.stringify({ nodes, edges }));
    }
  }, [isUpdating]);

  if (!node) return null;
  return (
    <div className="flex h-auto w-[400px]  flex-row gap-1 pl-2">
      <Button
        size={'xs'}
        startIcon={isLink ? <Link className="h-4  w-4" /> : <></>}
        className="flex-flow flex h-10 w-full gap-3 px-2"
        shape={'square'}
        onClick={openEdit}
      >
        <span className="max-w-[160px] truncate">{content}</span>
      </Button>
      <Handle
        type="source"
        className={currentNode?.data?.link ? 'hidden' : ''}
        position={Position.Right}
        isConnectable={isConnectable}
      />
      <UpdatingNodeWrapper
        open={Boolean(isUpdating)}
        onOpenChange={setIsUpdating}
      >
        <div className="z-30 flex flex-col gap-4 p-2">
          <div className="flex flex-row items-center  justify-between px-2">
            <FormLabel className="font-semibold text-neutral-800">
              Button
            </FormLabel>
            <div className="flex flex-row items-center gap-1 text-neutral-600">
              <Link size={16} />
              <FormLabel>Link</FormLabel>
              <Switch checked={isLink} onCheckedChange={onIsLinkChange} />
            </div>
          </div>
          <RHFInputField
            name={`${FLOW_KEYS.NODES}.${nodeIndex}.data.content`}
            inputProps={{
              placeholder: 'Button name',
              className: 'w-full h-full',
            }}
          />
          <RHFInputField
            formItemProps={{
              className: isLink ? 'block' : 'hidden',
            }}
            name={`${FLOW_KEYS.NODES}.${nodeIndex}.data.link`}
            inputProps={{
              disabled: !isLink,
              placeholder: 'https://',
              className: 'w-full h-full',
            }}
          />
        </div>
        <div className="flex-flow flex w-full justify-end gap-3 px-3">
          <Button
            size={'xs'}
            className="flex-flow flex h-10 gap-3 px-3"
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
            className="flex-flow flex h-10 gap-3 px-2"
            shape={'square'}
            onClick={() => {
              localStorage.removeItem('before-changes');
              setIsUpdating(false);
            }}
          >
            save
          </Button>
        </div>
      </UpdatingNodeWrapper>
      <Button.Icon
        color={'default'}
        size={'xs'}
        onClick={onRemoveNode}
        className="mr-3 text-neutral-600 hover:text-error-500"
      >
        <Trash2 size={18} />
      </Button.Icon>
    </div>
  );
}
export default ButtonNode;
