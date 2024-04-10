import { FlowNode } from '@/app/(main-layout)/(protected)/business/settings/_components/extension-creation/steps/script-chat-flow/nested-flow';
import { Button } from '@/components/actions';
import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';
import { useBusinessExtensionStore } from '@/stores/extension.store';
import React, { useMemo } from 'react'
import { Edge } from 'reactflow';
import { messageApi } from '../../api';
import { useQueryClient } from '@tanstack/react-query';
import { useMessagesBox } from '../message-box';

export type MessageNode = Omit<FlowNode, 'position'>;
const MessageNode = ({
    messageNode,
    disabled = false,
}: {
    messageNode: MessageNode,
    disabled?: boolean,
}) => {
    const { chatFlow, room, roomSendingState, setRoomSendingState } = useBusinessExtensionStore();
    const { addMessage, replaceMessage } = useMessagesBox();
    const key = ['messages', room?._id];
    const queryClient = useQueryClient();
    const { link, content } = messageNode.data || {};

    const [me, them] = useMemo(() => {

        // @ts-ignore
        const me = room?.participants.find((p: { _id: string, tempEmail: boolean }) => p.tempEmail);
        const them = room?.participants.find((p) => p._id !== me?._id);
        return [me, them];
    }, [room?.participants]);
    const appendMyMessage = async () => {
        const myMessage = {
            content: messageNode.data?.content,
            roomId: room?._id,
            type: 'text',
            language: 'en',
            mentions: [],
            senderType: 'user',
            userId: me?._id,
            clientTempId: new Date().toISOString()
        }
        if (me) {
            // @ts-ignore
            addMessage({
                ...myMessage,
                status: 'pending',
                sender: me });
    }
    // @ts-ignore
    await messageApi.sendAnonymousMessage(myMessage).then((res) => {
        // @ts-ignore
        if (res?._id)
            // @ts-ignore
            replaceMessage(res, myMessage.clientTempId);
    });
    // queryClient.invalidateQueries(key);
}
const onFlowActionClick = async () => {
    await appendMyMessage();
    if (!chatFlow?.nodes || !chatFlow?.edges || !room?._id) return;
    setRoomSendingState('loading');
    const { nodes, edges } = chatFlow;

    const nextEdge = edges.find((edge) => edge.source === messageNode.id);
    const nextNode = nodes.find((node) => node.id === nextEdge?.target);

    if (nextNode) {
        const childrenActions = nodes.filter(node => node.parentNode === nextNode?.id);
        const newBotMessage = {
            content: nextNode.data?.content,
            roomId: room?._id,
            language: 'en',
            type: nextNode.type === 'option' ? 'flow-actions' : 'text',
            mentions: [],
            actions: nextNode.type === 'message' ? undefined : childrenActions,
        }
        try {
            await messageApi.sendAnonymousMessage({
                ...newBotMessage,
                senderType: 'bot',
                // @ts-ignore
                userId: them?._id,
                clientTempId: new Date().toISOString()
            })
            // queryClient.invalidateQueries(key);
        } catch (error) {
            console.error('Failed to send message', error);
        }
        setRoomSendingState(null);
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
        disabled={disabled || !!roomSendingState}
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