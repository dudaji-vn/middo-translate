import { use, useCallback, useEffect, useState } from 'react';
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
import { nodeTypes } from './custom-nodes/node-types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import toast from 'react-hot-toast';
import { Button } from '@/components/actions';
import { Eye } from 'lucide-react';
import { isEmpty, isEqual } from 'lodash';
import { deepDeleteNodes } from './nodes.utils';
import { NEXT_PUBLIC_URL } from '@/configs/env.public';
import { CHAT_FLOW_KEY } from '@/configs/store-key';
import { Media } from '@/types';


const schemaFlow = z.object({
    nodes: z.array(z.object({
        id: z.string(),
        type: z.string(),
        data: z.object({
            label: z.string().optional(),
            content: z.string().min(1, {
                message: 'Please enter content!',
            }),
            link: z.string().optional(),
            media: z.array(z.any()).optional(),
        }).refine((data) => {
            if (data.link && !data.link.trim().length) {
                return false;
            }
            return true;
        }, {
            message: 'Link should not be empty'
        }),
        position: z.object({
            x: z.number(), y: z.number()
        })
    })
    ),
    edges: z.array(z.object({ id: z.string(), source: z.string(), target: z.string(), label: z.string() })),
    flowErrors: z.array(z.object({ id: z.string(), message: z.string() }))
})

type FormDataErrors = z.infer<typeof schemaFlow>['flowErrors'];

export type FlowItemType = 'button' | 'message' | 'root' | 'container' | 'option' | 'link';

export type FlowNode = Node<{
    content: string;
    label?: string;
    media?: Media[];
    link?: string;
}> & {
    type: FlowItemType;
}
export const initialChatFlowNodes: FlowNode[] = [
    {
        id: '1',
        data: { label: 'Start conversation', content: 'start conversation' },
        position: { x: 0, y: 0 },
        className: 'light',
        type: 'root'
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

const initialEdges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', animated: true, label: 'Start conversation' },
];

const ALLOWED_CHANGES = ['position', 'reset', 'select', 'dimensions'];
const NestedFlow = ({
    onSaveToForm,
    savedFlow
}: {
    onSaveToForm: (data: { nodes: FlowNode[], edges: Edge[] }) => void,
    savedFlow?: {
        nodes: FlowNode[],
        edges: Edge[]
    }
}) => {
    const [checkingMode, setCheckingMode] = useState(false);
    const control = useForm({
        mode: 'onChange',
        defaultValues: {
            nodes: initialChatFlowNodes,
            edges: initialEdges,
            flowErrors: []
        },
        resolver: zodResolver(schemaFlow),
    });

    const { setValue, watch, trigger, formState: { errors } } = control;

    const nodes = watch('nodes');
    const edges = watch('edges');
    const flowErrors = watch('flowErrors');
    const onNodesChange = useCallback(
        (changes: NodeChange[]) => {
            const watchNodes = watch('nodes');
            if (changes.every(({ type }) => ALLOWED_CHANGES.includes(type))) {
                // @ts-ignore
                setValue('nodes', applyNodeChanges(changes, watchNodes));
            }

        },
        [setValue, watch]
    );
    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => {
            if (changes.some(({ type }) => ALLOWED_CHANGES.includes(type))) {
                // @ts-ignore
                setValue('edges', applyEdgeChanges(changes, edges));
            }

        },
        [setValue, edges]
    );

    const onNodesDelete = useCallback(
        (nodesToDelete: Node[]) => {
            if (nodesToDelete.some((node) => initialChatFlowNodes.find(n => n.id === node.id))) {
                return;
            }
            const newNodes = deepDeleteNodes(nodes, nodesToDelete, edges);
            setValue('nodes', newNodes as FlowNode[]);
        },
        [setValue, nodes, edges]
    );


    const onConnect = useCallback(
        (connection: Edge | Connection) => {
            const watchEdges = watch('edges');
            // @ts-ignore
            setValue('edges', addEdge(connection, watchEdges));

        },
        [addEdge, setValue, watch]
    );
    const redirectToPreview = () => {
        localStorage.setItem(CHAT_FLOW_KEY, JSON.stringify({ nodes, edges }));
        toast.loading('Loading preview...');
        let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
        width=700,height=700,left=-500,top=-500`;
        window.open(`${NEXT_PUBLIC_URL}/test-it-out`, 'test', params);
        setTimeout(() => {
            toast.dismiss();
        }, 500);
    }

    const checkingErrors = () => {
        const flowErrors: FormDataErrors = [];
        nodes.forEach((node: FlowNode) => {
            switch (node.type) {
                case 'option':
                    // const connected = edges.filter((edge) => edge.source === node.id);
                    // if (connected.length === 0) {
                    //     flowErrors.push({ id: node.id, message: 'Please add your answer for this selection!' });
                    // }
                    break;
                case 'container':
                    const childrens = nodes.filter((n: FlowNode) => n.parentNode === node.id);
                    if (childrens.length === 0) {
                        flowErrors.push({ id: node.id, message: 'Actions should have at least one option' });
                    }
                    break;
                case 'button':
                    if (!node.data?.content?.trim()?.length) {
                        flowErrors.push({ id: node.id, message: 'Button should have a label' });
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
    }
    useEffect(() => {
        if (checkingMode) {
            checkingErrors();
        }
        else {
            // @ts-ignore
            setValue('flowErrors', []);
        }
    }, [nodes, edges, checkingMode]);


    useEffect(() => {
        if (savedFlow && (savedFlow?.nodes || savedFlow?.edges)) {
            setValue('nodes', savedFlow.nodes);
            setValue('edges', savedFlow.edges);
        }
    }, []);
    useEffect(() => {
        if (isEqual(savedFlow?.nodes, nodes) && isEqual(savedFlow?.edges, edges)) {
            return;
        }
        else if ((!isEqual(savedFlow?.nodes, nodes) || !isEqual(savedFlow?.edges, edges))) {
            onSaveToForm({
                nodes,
                edges
            })
        }
    }, [nodes, edges])


    const onPreviewClick = () => {
        trigger('nodes')
        if (!checkingMode) {
            const error = checkingErrors();
            if (error.length) {
                toast.error('Please complete the flow!');
                return;
            }
            setCheckingMode(true);
        }
        if (checkingMode && flowErrors.length) {
            console.log('flowErrors', flowErrors)
            toast.error('Please complete the flow!');
            return;
        }
        if (!isEmpty(errors)) {
            console.log('errors', errors)
            toast.error('Please complete the flow!');
            return;
        }

        redirectToPreview();
        onSaveToForm({
            nodes,
            edges
        })
    }





    return (
        <>
            <div className='py-2 min-h-fit flex flex-row justify-between items-center'>
                <label className='text-sm font-semibold'>Create your own chat flow</label>
                <Button
                    onClick={onPreviewClick}
                    shape={'square'} size={'xs'} type='button' color={'secondary'} className='flex flex-row gap-2'>
                    Preview <Eye />
                </Button>
            </div>
            <div className='w-full  bg-gray-200  h-[700px] max-h-[calc(100vh-340px)] min-h-[400px]'>
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
                        <Background gap={16} variant={BackgroundVariant.Dots} className='bg-white outline-none' />
                    </ReactFlow>

                </Form>
            </div>
        </>
    );
};

export default NestedFlow;
