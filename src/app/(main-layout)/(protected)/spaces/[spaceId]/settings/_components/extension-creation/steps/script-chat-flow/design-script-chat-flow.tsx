import { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Node,
  NodeChange,
  EdgeChange,
  Edge,
  Connection,
  BackgroundVariant,
  applyEdgeChanges,
  applyNodeChanges,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { FLOW_KEYS, nodeTypes } from './custom-nodes/node-types';
import { useFormContext } from 'react-hook-form';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import toast from 'react-hot-toast';
import { Button } from '@/components/actions';
import { Eye } from 'lucide-react';
import { isEmpty } from 'lodash';
import { deepDeleteNodes } from './nodes.utils';
import { NEXT_PUBLIC_URL } from '@/configs/env.public';
import { CHAT_FLOW_KEY } from '@/configs/store-key';
import { Media } from '@/types';
import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';
import { initialChatFlowNodes } from '../../../../../scripts/_components/column-def/script-creation/create-chat-script-modal';

const schemaFlow = z.object({
  nodes: z.array(
    z.object({
      id: z.string(),
      type: z.string(),
      data: z
        .object({
          label: z.string().optional(),
          content: z.string().min(1, {
            message: 'Please enter content!',
          }),
          link: z.string().optional(),
          media: z.array(z.any()).optional(),
        })
        .refine(
          (data) => {
            if (data.link && !data.link.trim().length) {
              return false;
            }
            return true;
          },
          {
            message: 'Link should not be empty',
          },
        ),
      position: z.object({
        x: z.number(),
        y: z.number(),
      }),
    }),
  ),
  edges: z.array(
    z.object({
      id: z.string(),
      source: z.string(),
      target: z.string(),
      label: z.string(),
    }),
  ),
  flowErrors: z.array(z.object({ id: z.string(), message: z.string() })),
});

type FormDataErrors = z.infer<typeof schemaFlow>['flowErrors'];

export type FlowItemType =
  | 'button'
  | 'message'
  | 'root'
  | 'container'
  | 'option'
  | 'link';

export type FlowNode = Node<{
  content: string;
  label?: string;
  media?: Media[];
  link?: string;
}> & {
  type: FlowItemType;
};

const ALLOWED_CHANGES = ['position', 'reset', 'select', 'dimensions'];
const DesignScriptChatFlow = ({
  initialChatFlow,
}: {
  initialChatFlow?: {
    nodes: FlowNode[];
    edges: Edge[];
  };
}) => {
  const [checkingMode, setCheckingMode] = useState(false);

  const control = useFormContext();

  const { setValue, watch, trigger, formState } = control;
  const { spaceId } = useBusinessNavigationData();
  const { errors } = formState;
  const nodes = watch(FLOW_KEYS.NODES);
  const edges = watch(FLOW_KEYS.EDGES);
  const flowErrors = watch(FLOW_KEYS.FLOW_ERRORS);
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const watchedNodes = watch(FLOW_KEYS.NODES);
      if (changes?.every(({ type }) => ALLOWED_CHANGES.includes(type))) {
        setValue(FLOW_KEYS.NODES, applyNodeChanges(changes, watchedNodes));
      }
    },
    [setValue, watch],
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      if (changes.some(({ type }) => ALLOWED_CHANGES.includes(type))) {
        setValue(FLOW_KEYS.EDGES, applyEdgeChanges(changes, edges));
      }
    },
    [setValue, edges],
  );

  const onNodesDelete = useCallback(
    (nodesToDelete: Node[]) => {
      if (
        nodesToDelete.some((node) =>
          initialChatFlowNodes.find((n) => n.id === node.id),
        )
      ) {
        return;
      }
      const newNodes = deepDeleteNodes(nodes, nodesToDelete, edges);
      setValue(FLOW_KEYS.NODES, newNodes as FlowNode[]);
    },
    [setValue, nodes, edges],
  );

  const onConnect = (connection: Edge | Connection) => {
    setValue(FLOW_KEYS.EDGES, addEdge(connection, edges));
  };
  const redirectToPreview = () => {
    localStorage.setItem(CHAT_FLOW_KEY, JSON.stringify({ nodes, edges }));
    toast.loading('Loading preview...');
    let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
        width=700,height=700,left=-500,top=-500`;
    if (spaceId) {
      window.open(
        `${NEXT_PUBLIC_URL}/test-it-out?spaceId=${spaceId}`,
        'test',
        params,
      );
    }
    setTimeout(() => {
      toast.dismiss();
    }, 500);
  };

  const checkingErrors = useCallback(() => {
    const flowErrors: FormDataErrors = [];
    nodes.forEach((node: FlowNode) => {
      switch (node.type) {
        case 'option':
          break;
        case 'container':
          break;
        case 'button':
          if (!node.data?.content?.trim()?.length) {
            flowErrors.push({
              id: node.id,
              message: 'Button should have a label',
            });
          }
          break;
        case 'message':
          break;
        default:
          break;
      }
    });
    // @ts-ignore
    setValue('flowErrors', flowErrors);
    return flowErrors;
  }, [nodes, setValue]);

  useEffect(() => {
    if (checkingMode) {
      checkingErrors();
    } else {
      // @ts-ignore
      setValue('flowErrors', []);
    }
  }, [nodes, edges, checkingMode, checkingErrors, setValue]);

  useEffect(() => {
    if (initialChatFlow && (initialChatFlow?.nodes || initialChatFlow?.edges)) {
      setValue(FLOW_KEYS.NODES, initialChatFlow.nodes);
      setValue(FLOW_KEYS.NODES, initialChatFlow.edges);
    }
  }, []);

  const onPreviewClick = () => {
    trigger(FLOW_KEYS.NODES);
    if (!checkingMode) {
      const error = checkingErrors();
      if (error.length) {
        toast.error('Please complete the flow!');
        return;
      }
      setCheckingMode(true);
    }
    if (checkingMode && flowErrors.length) {
      toast.error('Please complete the flow!');
      return;
    }
    if (!isEmpty(errors)) {
      console.log('errors', errors);
      toast.error('Please complete the flow!');
      return;
    }

    redirectToPreview();
  };
  return (
    <>
      <div className="flex min-h-fit flex-row items-center justify-end py-2">
        <Button
          onClick={onPreviewClick}
          shape={'square'}
          size={'xs'}
          type="button"
          color={'secondary'}
          className="flex flex-row gap-2"
        >
          Preview <Eye />
        </Button>
      </div>
      <div className="h-[calc(100vh-200px)]  max-h-[calc(100vh-200px)]  w-full bg-gray-200">
        <Form {...control}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodesDelete={onNodesDelete}
            // @ts-ignore
            nodeTypes={nodeTypes}
            fitView
          >
            <Background
              gap={16}
              variant={BackgroundVariant.Dots}
              className="bg-white outline-none"
            />
          </ReactFlow>
        </Form>
      </div>
    </>
  );
};

export default DesignScriptChatFlow;
