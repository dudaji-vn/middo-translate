'use client';

import { Button } from '@/components/actions';
import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';
import { useBusinessExtensionStore } from '@/stores/extension.store';
import React, { useMemo } from 'react';
import { messageApi } from '../../api';
import { useMessagesBox } from '../message-box';
import { createLocalMessage } from '../../utils';
import { Message, MessageType } from '../../types';
import { FlowNode } from '@/app/(main-layout)/(protected)/spaces/[spaceId]/settings/_components/extension-creation/steps/script-chat-flow/design-script-chat-flow';

export type MessageNode = Omit<FlowNode, 'position' | 'data'> & {
  data: FlowNode['data'] & { translations?: { [key: string]: string } };
};
const MessageNode = ({
  messageNode,
  disabled = false,
}: {
  messageNode: MessageNode;
  disabled?: boolean;
}) => {
  const { chatFlow, room, roomSendingState, setRoomSendingState } =
    useBusinessExtensionStore();
  const { addMessage, replaceMessage } = useMessagesBox();
  const key = ['messages', room?._id];
  const {
    link,
    content: originalContent,
    translations,
  } = messageNode.data || {};
  const [me, bot] = useMemo(() => {
    const me = room?.participants.find(
      // @ts-ignore
      (p: { _id: string; tempEmail: boolean; status: string; email: string }) =>
        p.status === 'anonymous',
    );
    const bot = room?.participants.find((p) => p._id !== me?._id);
    return [me, bot];
  }, [room?.participants]);

  const content = translations?.[me?.language as string] || originalContent;
  const appendMyMessage = async () => {
    const translatedContent =
      messageNode.data?.translations?.[me?.language as string] ||
      messageNode.data?.content;
    const myMessage = {
      ...createLocalMessage({
        sender: me!,
        content: translatedContent,
        language: me?.language,
      }),
      userId: me!._id,
      mentions: [],
      roomId: room?._id,
    };
    addMessage(myMessage);
    // @ts-ignore
    const mes = await messageApi.sendAnonymousMessage(myMessage);
    if (mes)
      // @ts-ignore
      replaceMessage(mes, myMessage.clientTempId);
  };
  const onSendBotMessage = async (
    botMessage: Message & {
      roomId: string;
    },
  ) => {
    setRoomSendingState('loading');
    try {
      const mes = await messageApi.sendAnonymousMessage({
        ...botMessage,
        senderType: 'bot',
        // @ts-ignore
        userId: bot?._id,
        clientTempId: new Date().toISOString(),
      });
      if (mes)
        replaceMessage(
          {
            ...mes,
            content: mes.translations?.[me!.language] || botMessage.content,
          }, // @ts-ignore
          botMessage.clientTempId,
        );
    } catch (error) {
      console.error('Failed to send message', error);
    }
    setRoomSendingState(null);
  };
  const onFlowActionClick = async () => {
    await appendMyMessage();
    if (!chatFlow?.nodes || !chatFlow?.edges || !room?._id) return;
    const { nodes, edges } = chatFlow;

    const nextEdge = edges.find((edge) => edge.source === messageNode.id);
    const nextNode = nodes.find((node) => node.id === nextEdge?.target);

    if (nextNode) {
      const childrenActions = nodes.filter(
        (node) => node.parentNode === nextNode?.id,
      );
      console.log('nextNodeType:>>', nextNode.type);
      let messageType: MessageType = 'text';
      switch (nextNode.type) {
        case 'option':
        case 'button':
          messageType = 'flow-actions';
          break;
        case 'form':
          messageType = 'flow-form';
          break;
        default:
          messageType = 'text';
          break;
      }

      onSendBotMessage({
        ...createLocalMessage({
          sender: bot!,
          content: nextNode.data?.content,
          formId: nextNode.form,
          language: '',
        }),
        status: 'sent',
        roomId: room?._id,
        type: messageType,
        mentions: [],
        actions: nextNode.type === 'message' ? undefined : childrenActions,
      });
      if (nextNode?.data?.media) {
        const images = nextNode?.data?.media?.filter(
          (media) => media.type === 'image',
        );
        const videos = nextNode?.data?.media?.filter(
          (media) => media.type === 'video',
        );
        const documents = nextNode?.data?.media?.filter(
          (media) => media.type === 'document',
        );
        if (images.length > 0) {
          onSendBotMessage({
            ...createLocalMessage({
              sender: bot!,
              content: '',
              language: '',
            }),
            status: 'sent',
            roomId: room?._id,
            type: 'media',
            mentions: [],
            actions: nextNode.type === 'message' ? undefined : childrenActions,
            media: images,
          });
        }
        if (documents?.length) {
          onSendBotMessage({
            ...createLocalMessage({
              sender: bot!,
              content: '',
              language: '',
            }),
            status: 'sent',
            roomId: room?._id,
            type: 'media',
            mentions: [],
            actions: nextNode.type === 'message' ? undefined : childrenActions,
            media: documents,
          });
        }
        if (videos?.length) {
          onSendBotMessage({
            ...createLocalMessage({
              sender: bot!,
              content: '',
              language: '',
            }),
            status: 'sent',
            roomId: room?._id,
            type: 'media',
            mentions: [],
            actions: nextNode.type === 'message' ? undefined : childrenActions,
            media: videos,
          });
        }
      }
    }
  };

  if (messageNode.type === 'button' && link?.length) {
    return (
      <a target="_blank" href={link}>
        <Button
          disabled={disabled}
          className={'h-auto  w-fit  rounded-[20px] py-1 text-right'}
          variant={'outline'}
          color={'primary'}
          size="xs"
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
      className={'h-auto w-fit rounded-[20px] py-1  text-right'}
      variant={'outline'}
      color={'primary'}
      size="xs"
      shape={'default'}
      type={'button'}
      onClick={onFlowActionClick}
    >
      {content}
    </Button>
  );
};

export default function MessageItemFlowActions({
  actions,
}: {
  actions: MessageNode[];
}) {
  const { isUserChattingWithGuest, isHelpDesk } = useBusinessNavigationData();
  if (actions.length === 0 || !isHelpDesk || isUserChattingWithGuest) {
    return null;
  }

  return (
    <div className="flex w-full flex-col items-end justify-end gap-2 py-2">
      {actions.map((action, index) => (
        <MessageNode key={index} messageNode={action} />
      ))}
    </div>
  );
}
