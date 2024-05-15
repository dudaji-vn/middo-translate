'use client';

import 'reactflow/dist/style.css';

import { FlowNode } from '../design-script-chat-flow';
import ButtonNode from './button-node';
import MessageNode from './message-node';
import RootNode from './root-node';
import ContainerNode from './container-node';
import OptionNode from './option-node';

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
};

export enum FLOW_KEYS {
  NODES = 'chatFlow.nodes',
  EDGES = 'chatFlow.edges',
  FLOW_ERRORS = 'flowErrors',
}

const nodeTypes = {
  message: MessageNode,
  button: ButtonNode,
  root: RootNode,
  container: ContainerNode,
  option: OptionNode,
  // link: LinkNode
};

export { nodeTypes };
