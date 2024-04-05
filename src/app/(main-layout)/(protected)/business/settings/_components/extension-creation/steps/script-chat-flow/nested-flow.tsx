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
    getConnectedEdges,
    applyEdgeChanges,
    applyNodeChanges,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { nodeTypes } from './custom-node';
import { useChatFlowStore } from '@/stores/chat-flow.store';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import toast from 'react-hot-toast';
import { Button } from '@/components/actions';
import { Eye } from 'lucide-react';
import { isEmpty } from 'lodash';

const schemaFlow = z.object({
    nodes: z.array(z.object({
        id: z.string(),
        type: z.string(),
        data: z.object({
            label: z.string().optional(),
            content: z.string().min(1, {
                message: 'Please enter message!',
            }),
            img: z.string().optional(),
        }),
        position: z.object({
            x: z.number(), y: z.number()
        })
    })),
    edges: z.array(z.object({ id: z.string(), source: z.string(), target: z.string(), label: z.string() })),
    flowErrors: z.array(z.object({ id: z.string(), message: z.string() }))
})

type FormDataErrors = z.infer<typeof schemaFlow>['flowErrors'];

export type FlowItemType = 'button' | 'message' | 'root' | 'container' | 'option';

export type FlowNode = Node<{
    content: string;
    label?: string;
    img?: string;
}> & {
    type: FlowItemType;
}
const initialNodes: FlowNode[] = [
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

const initialEdges = [
    { id: 'e1-2', source: '1', target: '2', animated: true, label: 'Start conversation' },
    // { id: 'e1-4', source: '1', target: '4'},
];

const ALLOWED_CHANGES = ['position', 'reset', 'select', 'dimensions'];
const NestedFlow = () => {
    const [openPreview, setOpenPreview] = useState(false);
    const [checkingMode, setCheckingMode] = useState(false);
    const control = useForm({
        mode: 'onChange',
        defaultValues: {
            nodes: initialNodes,
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
            // @ts-ignore

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
            if (nodesToDelete.some((node) => initialNodes.find(n => n.id === node.id))) {
                return;
            }
            const connected = getConnectedEdges(nodesToDelete, edges);
            const newNodes = nodes.filter((node) => !connected.some((edge) => edge.source === node.id || edge.target === node.id));
            setValue('nodes', newNodes);
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

    const checkingErrors = () => {
        if (!checkingMode) {
            return;
        }
        const flowErrors: FormDataErrors = [];
        nodes.forEach((node) => {
            switch (node.type) {
                case 'option':
                    const connected = edges.filter((edge) => edge.source === node.id);
                    if (connected.length === 0) {
                        flowErrors.push({ id: node.id, message: 'Please add your answer for this selection!' });
                    }
                    break;
                case 'container':
                    const childrens = nodes.filter((n) => n.parentNode === node.id);
                    if (childrens.length === 0) {
                        flowErrors.push({ id: node.id, message: 'Actions should have at least one option' });
                    }
                    break;
                // case 'message':
                //     if (!node.data?.content?.trim()?.length) {
                //         flowErrors.push({ id: node.id, message: 'Message should have a content' });
                //     }
                //     break;
                case 'button':
                    if (!node.data?.content?.trim()?.length) {
                        flowErrors.push({ id: node.id, message: 'Button should have a label' });
                    }
                    break;
                default:
                    break;
            }
        });
        // @ts-ignore
        setValue('flowErrors', flowErrors);

    }
    useEffect(() => {
        if (checkingMode) {
            checkingErrors();
        }
        else {
            // @ts-ignore
            setValue('flowErrors', []);
        }
    }, [nodes, checkingMode]);

    const onPreviewClick = () => {
        trigger('nodes')
        if (!checkingMode) {
            setCheckingMode(true);
            return;
        }
        if (checkingMode && flowErrors.length) {
            toast.error('Please complete the flow!');
            return;
        }
        if (!isEmpty(errors)) {
            toast.error('Please complete the flow!');
            setOpenPreview(true);
        }
        toast.success('Previewing');

    }


    return (
        <section className='w-full grid grid-rows-12'>
            <div className='py-2 row-span-1 flex flex-row justify-between items-center'>
                <label className='text-sm font-semibold'>Create your own chat flow</label>
                <Button
                    onClick={onPreviewClick}
                    shape={'square'} size={'xs'} type='button' color={'secondary'} className='flex flex-row gap-2'>
                    Preview <Eye />
                </Button>
            </div>
            <div className='w-full row-span-11 bg-gray-200'>
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
        </section>
    );
};

export default NestedFlow;
