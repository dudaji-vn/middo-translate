import { Edge } from 'reactflow';
import { FlowNode } from '@/app/(main-layout)/(protected)/spaces/[spaceId]/settings/_components/extension-creation/steps/script-chat-flow/design-script-chat-flow';
import { z } from 'zod';

export const initialChatFlowNodes: FlowNode[] = [
  {
    id: '1',
    data: { label: 'Start conversation', content: 'start conversation' },
    position: { x: 0, y: 0 },
    className: 'light',
    type: 'root',
  },
  {
    id: '2',
    data: {
      label: 'option',
      content: 'Option',
    },
    type: 'option',
    position: { x: 200, y: 6 },
    className: 'light',
  },
];

export const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    animated: true,
    label: 'Start conversation',
  },
];

const checkNodeDataEmptyLink = (data: { link?: string }) => {
  if (data.link && !data.link.trim().length) {
    return false;
  }
  return true;
};
const checkFlowMessages = (nodes: FlowNode[]) => {
  const hasAtLeastOneMessageOrAction = nodes?.find(
    (node) => node.type === 'message' || node.type === 'container',
  );
  return hasAtLeastOneMessageOrAction;
};
const checkIncludingOption = (nodes: FlowNode[]) => {
  console.log('nodes', nodes);
  const hasOption = nodes?.find((node) => node.type === 'option');
  return hasOption;
};
export const createChatScriptSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  chatFlow: z
    .object({
      nodes: z
        .array(
          z.object({
            id: z.string(),
            type: z.string(),
            parentNode: z.string().optional(),
            parentId: z.string().optional(),
            style: z.any().optional(),
            className: z.string().optional(),
            width: z.number().optional(),
            height: z.number().optional(),
            deletable: z.boolean().optional(),
            draggable: z.boolean().optional(),
            sourcePosition: z.string().optional(),
            targetPosition: z.string().optional(),
            data: z
              .object({
                label: z.string().optional(),
                content: z.string().min(1, {
                  message: 'Please enter content!',
                }),
                link: z.string().optional(),
                media: z.array(z.any()).optional(),
              })
              .refine(checkNodeDataEmptyLink, {
                message: 'Link should not be empty',
              }),
            position: z.object({
              x: z.number(),
              y: z.number(),
            }),
          }),
        )
        .min(2, 'Chat flow should have at least 2 nodes'),
      edges: z
        .array(
          z.object({
            id: z.string(),
            source: z.string(),
            target: z.string(),
            label: z.string().optional(),
            animated: z.boolean().optional(),
          }),
        )
        .min(1, 'Chat flow is required'),
      mappedFlowErrors: z
        .array(z.object({ id: z.string(), message: z.string() }))
        .optional(),
    })
    .refine(({ nodes }) => !checkIncludingOption(nodes as FlowNode[]), {
      message:
        'Please complete the script! your action button is missing response!',
    }),
});
