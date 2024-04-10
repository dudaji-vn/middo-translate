import { FlowNode } from '@/app/(main-layout)/(protected)/business/settings/_components/extension-creation/steps/script-chat-flow/nested-flow';
import { Button } from '@/components/actions';
import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';
import { useBusinessExtensionStore } from '@/stores/extension.store';
import React from 'react'
import { Edge } from 'reactflow';
import { messageApi } from '../../api';

export type MessageNode = Omit<FlowNode, 'position'>;
const MessageNode = ({
    messageNode,
    disabled = false,
}: {
    messageNode: MessageNode,
    disabled?: boolean,
}) => {
    const { chatFlow, room } = useBusinessExtensionStore();
    const { link, content } = messageNode.data || {};
    const [loading, setLoading] = React.useState(false);
    const onFlowActionClick = async () => {
        console.log('onFlowActionClick', messageNode, chatFlow);
        if (!chatFlow?.nodes || !chatFlow?.edges || !room?._id) return;
        setLoading(true);
        const { nodes, edges } = chatFlow;

        const nextEdge = edges.find((edge) => edge.source === messageNode.id);
        const nextNode = nodes.find((node) => node.id === nextEdge?.target);

        if (nextNode) {
            const childrenActions = nodes.filter(node => node.parentNode === nextNode?.id);
            const newBotMessage = {
                content: nextNode.data?.content,
                roomId: room?._id,
                type: 'flow-actions',
                language: 'en',
                mentions: [],
                actions: nextNode.type === 'message' ? undefined : childrenActions,
            }
            await messageApi.sendAnonymousMessage({
                ...newBotMessage,
                senderType: 'bot',
                clientTempId: new Date().toISOString()
            });
        }
    }

    if (messageNode.type === 'button' && link?.length) {
        return (
            <a target="_blank" href={link}>
                <Button
                    disabled={disabled}
                    className={'h-9  w-fit'}
                    variant={'outline'}
                    color={'primary'}
                    shape={'square'}
                    type={'button'}
                >
                    {content || link}
                </Button>
            </a>
        );
    }
    return (
        <Button
            disabled={disabled}
            className={'h-9  w-fit'}
            variant={'outline'}
            color={'primary'}
            shape={'square'}
            type={'button'}
            onClick={onFlowActionClick}
        >
            {content}
        </Button>
    );
}

export default function MessageItemFlowActions({
    actions }: {
        actions: MessageNode[]
    }) {
    const { isUserChattingWithGuest, isHelpDesk } = useBusinessNavigationData();
    if (actions.length === 0 || (!isHelpDesk && !isUserChattingWithGuest)) {
        return null;
    }
    return (
        <div className="flex flex-col gap-2 w-full items-end justify-end py-2">
            {actions.map((action, index) => (
                <MessageNode key={index} messageNode={action} disabled={isUserChattingWithGuest} />
            ))}
        </div>
    );
}