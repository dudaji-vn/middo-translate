import { FlowNode } from '@/app/(main-layout)/(protected)/business/settings/_components/extension-creation/steps/script-chat-flow/nested-flow';
import { Button } from '@/components/actions';
import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';
import React from 'react'

export type MessageNode = Omit<FlowNode, 'position'>;
const MessageNode = ({
    messageNode,
    disabled = false
}: {
    messageNode: MessageNode,
    disabled?: boolean
}) => {
    const { link, content } = messageNode.data || {};
    const nodes: FlowNode[] = [];
    const addReceivedMessageFromMyChoice = (node: MessageNode) => {
        console.log(node);
    };
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
            onClick={() => {
                console.log('lalalal', messageNode)
                const thisNode = nodes.find(
                    (node) => node.id === messageNode.id
                );
                if (thisNode) {
                    addReceivedMessageFromMyChoice(thisNode);
                }
            }}
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