import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { Form, FormMessage } from '@/components/ui/form';
import toast from 'react-hot-toast';
import { Button } from '@/components/actions';
import { Eye } from 'lucide-react';
import { isEmpty } from 'lodash';
import { deepDeleteNodes } from './nodes.utils';
import { NEXT_PUBLIC_URL } from '@/configs/env.public';
import { CHAT_FLOW_KEY } from '@/configs/store-key';
import { Media } from '@/types';
import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';
import { initialChatFlowNodes } from '@/app/(main-layout)/(protected)/spaces/[spaceId]/scripts/_components/script-creation/schema';
import { type TScriptFormValues } from '@/app/(main-layout)/(protected)/spaces/[spaceId]/scripts/_components/script-creation/create-chat-script-modal';
import { cn } from '@/utils/cn';
import { useTranslation } from 'react-i18next';

export type FlowItemType =
  | 'button'
  | 'message'
  | 'root'
  | 'container'
  | 'option'
  | 'link';

export type FlowNode = Node<{
  readonly?: boolean;
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
  viewOnly = false,
}: {
  initialChatFlow?: {
    nodes: FlowNode[];
    edges: Edge[];
  };
  viewOnly?: boolean;
}) => {
  const control = useFormContext();
  const { t } = useTranslation('common');
  const { setValue, watch, trigger, formState } = control;
  const { spaceId } = useBusinessNavigationData();
  const { errors } = formState;
  const nodes = watch(FLOW_KEYS.NODES);
  const edges = watch(FLOW_KEYS.EDGES);
  const mappedFlowErrors = watch(FLOW_KEYS.FLOW_ERRORS);
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      if (viewOnly) {
        return;
      }
      const watchedNodes = watch(FLOW_KEYS.NODES);
      if (changes?.every(({ type }) => ALLOWED_CHANGES.includes(type))) {
        setValue(FLOW_KEYS.NODES, applyNodeChanges(changes, watchedNodes));
      }
    },
    [setValue, watch],
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      if (viewOnly) {
        return;
      }
      if (changes.some(({ type }) => ALLOWED_CHANGES.includes(type))) {
        setValue(FLOW_KEYS.EDGES, applyEdgeChanges(changes, edges));
      }
    },
    [setValue, edges],
  );

  const onNodesDelete = useCallback(
    (nodesToDelete: Node[]) => {
      if (viewOnly) {
        return;
      }
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
    if (viewOnly) {
      return;
    }
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
    const mappedFlowErrors: TScriptFormValues['chatFlow']['mappedFlowErrors'] =
      [];
    nodes.forEach((node: FlowNode) => {
      switch (node.type) {
        case 'button':
          if (!node.data?.content?.trim()?.length) {
            mappedFlowErrors?.push({
              id: node.id,
              message: 'Button should have a label',
            });
          }
          break;
        case 'option':
          mappedFlowErrors?.push({
            id: node.id,
            message:
              'Please complete the flow! your action button is missing response!',
          });
          break;
        case 'container':
          break;
        case 'message':
          break;
        default:
          break;
      }
    });
    setValue(FLOW_KEYS.FLOW_ERRORS, mappedFlowErrors);
    return mappedFlowErrors;
  }, [nodes, setValue]);

  useEffect(() => {
    if (initialChatFlow && (initialChatFlow?.nodes || initialChatFlow?.edges)) {
      setValue(FLOW_KEYS.NODES, initialChatFlow.nodes);
      setValue(FLOW_KEYS.NODES, initialChatFlow.edges);
    }
  }, []);

  const onPreviewClick = async () => {
    checkingErrors();
    const valid = await trigger(FLOW_KEYS.CHAT_FLOW);
    if (!valid) {
      return;
    }
    if (mappedFlowErrors?.length || !isEmpty(errors)) {
      return;
    }
    redirectToPreview();
  };
  const chatFlowError =
    watch(FLOW_KEYS.FLOW_ERRORS)?.[0]?.message ||
    errors?.chatFlow?.message ||
    errors?.chatFlow?.root?.message;

  const viewOnlyNodes = useMemo(() => {
    return nodes.map((node: FlowNode) => ({
      ...node,
      data: {
        ...node.data,
        readonly: true,
      },
    }));
  }, [nodes]);

  return (
    <>
      <div className="flex min-h-fit flex-row items-center justify-between py-2">
        <FormMessage
          className={cn('text-normal pl-4 text-left font-normal text-red-500', {
            invisible: !chatFlowError,
          })}
        >
          {chatFlowError?.toString() || <em />}
        </FormMessage>
        <Button
          onClick={onPreviewClick}
          shape={'square'}
          size={'xs'}
          type="button"
          color={'secondary'}
          className="flex flex-row gap-2"
        >
          {t('COMMON.PREVIEW')}
          &nbsp;
          <Eye />
        </Button>
      </div>
      <div className="h-[calc(100vh-200px)]  max-h-[calc(100vh-200px)]  w-full bg-gray-200 dark:bg-neutral-800">
        <Form {...control}>
          <ReactFlow
            nodes={viewOnly ? viewOnlyNodes : nodes}
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
              className="bg-white outline-none dark:bg-background"
            />
          </ReactFlow>
        </Form>
      </div>
    </>
  );
};

export default DesignScriptChatFlow;
