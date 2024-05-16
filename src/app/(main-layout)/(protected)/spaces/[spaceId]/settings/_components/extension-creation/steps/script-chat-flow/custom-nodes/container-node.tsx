'use client';

import React, { useMemo } from 'react';
import { Edge } from 'reactflow';
import 'reactflow/dist/style.css';

import { Handle, Position } from 'reactflow';
import { Button } from '@/components/actions';
import { MessageSquare, Plus, Trash2 } from 'lucide-react';
import { FlowNode } from '../design-script-chat-flow';
import { useFormContext } from 'react-hook-form';
import Ping from '../ping';
import { RHFTextAreaField } from '@/components/form/RHF/RHFInputFields';
import { deepDeleteNodes } from '../nodes.utils';
import { CustomNodeProps, FLOW_KEYS } from './node-types';

function ContainerNode(node: CustomNodeProps) {
  const { data, isConnectable } = node;
  const { watch, setValue } = useFormContext();
  const mappedFlowErrors = watch(FLOW_KEYS.FLOW_ERRORS);
  const errorMessage = mappedFlowErrors.find(
    (error: { id: string }) => error.id === node.id,
  )?.message;
  const nodes = watch(FLOW_KEYS.NODES);
  const edges = watch(FLOW_KEYS.EDGES);
  const currentNodeIndex = nodes.findIndex(
    (n: { id: string }) => n.id === node.id,
  );
  const currentNode = nodes[currentNodeIndex];

  const [width, height, childLenth] = useMemo(() => {
    const childLength = nodes.filter(
      (n: { parentNode: string }) => n.parentNode === node.id,
    ).length;
    const maxYPos = nodes
      .filter((n: { parentNode: string }) => n.parentNode === node.id)
      .reduce((acc: number, n: { position: { y: number } }) => {
        return Math.max(acc, n.position.y);
      }, 150);

    return [400, 110 + maxYPos, childLength];
  }, [nodes, node.id]);

  const onAddNode = () => {
    const newButtonNode: FlowNode = {
      id: node.id + `-btn-${new Date().getTime()}`,
      data: { content: 'New Button' },
      position: { x: 0, y: Math.max(120 + childLenth * 50, height - 60) },
      parentNode: node.id,
      extent: 'parent',
      type: 'button',
      draggable: false,
    };
    const newButtonChildNode: FlowNode = {
      id: `${newButtonNode.id}-opt-${new Date().getTime()}`,
      type: 'option',
      data: {
        content: '',
        media: [],
      },
      position: { x: node.xPos + width + 200, y: node.yPos + childLenth * 250 },
    };
    const newEdge: Edge = {
      id: `e${newButtonNode.id}-${newButtonChildNode.id}`,
      source: newButtonNode.id,
      target: newButtonChildNode.id,
      animated: true,
      // label: "select the answer"
    };
    setValue(FLOW_KEYS.NODES, [...nodes, newButtonNode, newButtonChildNode]);
    setValue(FLOW_KEYS.EDGES, [...edges, newEdge]);
  };

  const convertContainerToOption = () => {
    const currentChilds = nodes.filter(
      (n: { parentNode: string }) => n.parentNode === node.id,
    );
    const newNodes = deepDeleteNodes(nodes, currentChilds, edges);
    const updatedNode = {
      ...currentNode,
      type: 'option',
      data: {
        label: 'Actions',
        content: '',
      },
    };
    setValue(FLOW_KEYS.NODES, [...newNodes, updatedNode]);
  };

  const formFieldId = `${FLOW_KEYS.NODES}.${currentNodeIndex}.data.content`;

  return (
    <div
      className="relative h-[500px] w-[400px] rounded-2xl border bg-white"
      style={{ width, height }}
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
            <p>{data.label}</p>
          </div>
          <div className="flex flex-row items-center gap-2  text-primary-500-main">
            <Button.Icon
              color={'error'}
              size={'xs'}
              onClick={convertContainerToOption}
              className="text-neutral-600 hover:text-error-500"
              variant={'ghost'}
            >
              <Trash2 size={18} />
            </Button.Icon>
          </div>
        </div>
        <RHFTextAreaField
          name={formFieldId}
          textareaProps={{
            placeholder: 'Type your message here...',
            rows: 3,
            className: 'w-full h-full',
          }}
        />
      </div>
      <div className="absolute bottom-4 left-0 w-full px-4">
        <Button
          shape={'square'}
          className="w-full"
          color={'secondary'}
          size={'xs'}
          onClick={onAddNode}
        >
          <Plus size={18} className="mr-2" /> Add Button
        </Button>
      </div>
      <Ping
        className={
          !!errorMessage ? 'absolute bottom-[45px] left-[15px] ' : 'hidden'
        }
        message={errorMessage}
      />
    </div>
  );
}

export default ContainerNode;
