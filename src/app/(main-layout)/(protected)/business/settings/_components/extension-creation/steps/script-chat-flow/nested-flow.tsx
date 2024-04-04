import { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
    addEdge,
    Background,
    useNodesState,
    useEdgesState,
    MiniMap,
    Controls,
    Node,
    NodeChange,
    EdgeChange,
    Edge,
    Connection,
    BackgroundVariant,
    applyNodeChanges,
    applyEdgeChanges,
    getIncomers,
    getOutgoers,
    getConnectedEdges,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { nodeTypes } from './custom-node';
import { useChatFlowStore } from '@/stores/chat-flow.store';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import toast from 'react-hot-toast';

const schemaFlow = z.object({
    nodes: z.array(z.object({
        id: z.string(), type: z.string(), data: z.object({
            label: z.string(),
            content: z.string(), img: z.string()
        }), position: z.object({
            x: z.number(), y: z.number()
        })
    })),
    edges: z.array(z.object({ id: z.string(), source: z.string(), target: z.string(), label: z.string() })),
})
export type FlowItemType = 'button' | 'message' | 'root' | 'container';

export type FlowNode = Node<{
    content?: string;
    label?: string;
    img?: string;
}> & {
    type: FlowItemType;
}
const initialNodes: FlowNode[] = [
    {
        id: '1',
        data: { label: 'Start conversation', },
        position: { x: 0, y: -100 },
        className: 'light',
        type: 'root'
    },
    {
        id: '2',
        data: {
            label: 'Actions',
            content: "Hello, How can I help you? ",
        },
        type: 'container',
        position: { x: 100, y: 0 },
        className: 'light',
        draggable: false,
        // style: { backgroundColor: 'rgba(255, 0, 0, 0.2)', width: 400, height: 900 },
    },
    // {
    //     id: '2-1',
    //     data: { content: "Hello, How can I help you? ", },
    //     position: { x: 0, y: 100 },
    //     className: 'light',
    //     parentNode: '2',
    //     type: 'message',
    //     extent: 'parent'
    // },

    // {
    //     id: '4b',
    //     data: { content: "Gap quan ly", },
    //     position: { x: 15, y: 125 },
    //     className: 'light',
    //     parentNode: '2',
    //     extent: 'parent',
    //     type: 'button'
    // },
    // {
    //     id: '4c',
    //     data: { content: "Gap nhan vien", },
    //     position: { x: 15, y: 195 },
    //     className: 'light',
    //     parentNode: '2',
    //     extent: 'parent',
    //     type: 'button'
    // }, {
    //     id: '4b1',
    //     data: { content: "OK, toi se chuyen ban den quan ly", },
    //     position: { x: 305, y: 125 },
    //     className: 'light',
    //     parentNode: '4b',
    //     type: 'message'
    // },
    // {
    //     id: '4c1',
    //     data: { content: "OK, toi se chuyen ban den nhan vien", },
    //     position: { x: 305, y: 195 },
    //     className: 'light',
    //     parentNode: '4c',
    //     type: 'message'
    // }

];

const initialEdges = [
    { id: 'e1-2', source: '1', target: '2', label: 'Start conversation' },
    // { id: 'e1-4', source: '1', target: '4', animated: true },
];

const NestedFlow = () => {

    // const [nodes, setNodes] = useState(initialNodes);
    // const [edges, setEdges] = useState(initialEdges);
    const control = useForm({
        mode: 'onBlur',
        defaultValues: {
            nodes: initialNodes,
            edges: initialEdges,
        },
        resolver: zodResolver(schemaFlow),
    });

    const { setValue, watch } = control;
    const watchNodes = watch('nodes');
    const watchEdges = watch('edges');

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => {
            // @ts-ignore
            // setValue('nodes', applyNodeChanges(changes, watchNodes));
        },
        [setValue, watchNodes]
    );
    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => {
            // @ts-ignore
            // setValue('edges', applyEdgeChanges(changes, watchEdges));

        },
        [setValue, watchEdges]
    );

    const onNodesDelete = useCallback(
        (nodesToDelete: Node[]) => {
            if (nodesToDelete.some((node) => initialNodes.find(n => n.id === node.id))) {
                toast.error('Cannot delete this step');
                return;
            }

            const connected = getConnectedEdges(nodesToDelete, watchEdges);
            console.log('connected', connected);
            const newNodes = watchNodes.filter((node) => !connected.some((edge) => edge.source === node.id || edge.target === node.id));
            console.log('newNodes', newNodes);
            setValue('nodes', newNodes);
        },
        [setValue, watchNodes, watchEdges]
    );

    const onEdgeDelete = useCallback(
        (edgesToDelete: Edge[]) => {
            if (edgesToDelete.some((edge) => initialEdges.find(e => e.source === edge.source && e.target == edge.target))) { 
                toast.error('Cannot delete this step');
                return;
            }
            setValue('edges', watchEdges.filter((edge) => !edgesToDelete.some((e) => e.id === edge.id)));
        },
        [setValue, watchEdges]
    );

    const onConnect = useCallback(
        (connection: Edge | Connection) => {
            // @ts-ignore
            setValue('edges', addEdge(connection, watchEdges));
        },
        [setValue, watchEdges]
    );

    return (

        <Form {...control} >
            <ReactFlow
                nodes={watchNodes}
                edges={watchEdges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onEdgesDelete={onEdgeDelete}
                onNodesDelete={onNodesDelete}
                nodeTypes={nodeTypes}
                fitView
            >
                <Background gap={16} variant={BackgroundVariant.Dots} className='bg-white outline-none' />
            </ReactFlow></Form>
    );
};

export default NestedFlow;
