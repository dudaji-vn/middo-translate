'use client'

import 'reactflow/dist/style.css';


import { FlowNode } from '../nested-flow';
import ButtonNode from './button-node';
import MessageNode from './message-node';
import RootNode from './root-node';
import ContainerNode from './container-node';
import OptionNode from './option-node';
import LinkNode from './link-node';

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
}


const nodeTypes = {
    message: MessageNode,
    button: ButtonNode,
    root: RootNode,
    container: ContainerNode,
    option: OptionNode,
    // link: LinkNode
};

export { nodeTypes }