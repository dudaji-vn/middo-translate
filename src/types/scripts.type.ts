import { FlowNode } from '@/app/(main-layout)/(protected)/spaces/[spaceId]/settings/_components/extension-creation/steps/script-chat-flow/nested-flow';
import { Edge } from 'reactflow';
import { BaseEntity } from '.';

export const ROWS_PER_PAGE_OPTIONS = [5, 25, 75, 100];
export const DEFAULT_SCRIPTS_PAGINATION = {
  limit: ROWS_PER_PAGE_OPTIONS[1],
  currentPage: 1,
  search: '',
};

export type TChatFlow = {
  nodes: FlowNode[];
  edges: Edge[];
};

export type TChatScript = BaseEntity & {
  name: string;
  spaceId: string;
  chatFlow: TChatFlow;
};
