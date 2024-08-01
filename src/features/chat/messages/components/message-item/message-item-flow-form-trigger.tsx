'use client';

import { Button } from '@/components/actions';
import { NEXT_PUBLIC_URL } from '@/configs/env.public';
import { announceToParent } from '@/utils/iframe-util';
import { Check, FileText } from 'lucide-react';

import { useBusinessExtensionStore } from '@/stores/extension.store';
import React, { useEffect, useMemo } from 'react';
import { messageApi } from '../../api';
import { useMessagesBox } from '../message-box';
import { createLocalMessage } from '../../utils';
import { Message, MessageType } from '../../types';
import socket from '@/lib/socket-io';
import { FlowNode } from '@/app/(main-layout)/(protected)/spaces/[spaceId]/settings/_components/extension-creation/steps/script-chat-flow/design-script-chat-flow';
import { SOCKET_CONFIG } from '@/configs/socket';
import { useNetworkStatus } from '@/utils/use-network-status';
import { useAppStore } from '@/stores/app.store';
import { usePlatformStore } from '@/features/platform/stores';

export type MessageNode = Omit<FlowNode, 'position' | 'data'> & {
  data: FlowNode['data'] & { translations?: { [key: string]: string } };
};
const useFormTrigger = ({
  messageNode,
  disabled = false,
}: {
  messageNode?: MessageNode | null;
  disabled?: boolean;
}) => {
  const { chatFlow, room, setRoomSendingState } = useBusinessExtensionStore();
  const { replaceMessage } = useMessagesBox();

  const { content: originalContent, translations } = messageNode?.data || {};
  const [me, bot] = useMemo(() => {
    const me = room?.participants.find(
      // @ts-ignore
      (p: { _id: string; tempEmail: boolean; status: string; email: string }) =>
        p.status === 'anonymous',
    );
    const bot = room?.participants.find((p) => p._id !== me?._id);
    return [me, bot];
  }, [room?.participants]);

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
  const onTriggerNextMessage = async () => {
    if (
      !chatFlow?.nodes ||
      !chatFlow?.edges ||
      !room?._id ||
      !messageNode?.data
    ) {
      return;
    }
    const { nodes, edges } = chatFlow;
    const nextNode = messageNode;

    if (nextNode) {
      const childrenActions = nodes.filter(
        (node) => node.parentNode === nextNode?.id,
      );
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

  return {
    onTriggerNextMessage,
  };
};

export default function MessageItemFlowFormTrigger({
  guestId,
  message,
  form,
}: {
  guestId?: string;
  message: Message;
  form: {
    _id: string;
    name: string;
    isSubmitted?: boolean;
  };
}) {
  const formId = form._id;
  const isSubmitted = form.isSubmitted;
  const language = message.language;
  const nextNode = useMemo(() => {
    if (!message.actions) return null;
    return message.actions[0];
  }, [message.actions]);
  const { onTriggerNextMessage } = useFormTrigger({ messageNode: nextNode });
  const { recentlySubmittedFormByMessageId } = useMessagesBox();

  const openIframeForm = () => {
    if (guestId) {
      announceToParent({
        type: 'init-form-extension',
        payload: {
          urlToForm: `${NEXT_PUBLIC_URL}/extension-form?formId=${formId}&guestId=${guestId}&messageId=${message._id}&language=${language}`,
        },
      });
    }
  };

  useEffect(() => {
    if (isSubmitted) {
      console.log(
        'FLOW-CHAT: isSubmitted',
        recentlySubmittedFormByMessageId,
        message._id,
      );
      if (recentlySubmittedFormByMessageId === message._id) {
        console.log('FLOW-CHAT: onTriggerNextMessage');
        onTriggerNextMessage();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recentlySubmittedFormByMessageId, isSubmitted]);

  return (
    <div className="relative space-y-2 ">
      <div className="relative flex w-fit min-w-10 flex-row items-start overflow-hidden rounded-[20px]  bg-neutral-50 px-2 py-1  ">
        <Button
          className="py-1  hover:underline"
          shape={'square'}
          size={'xs'}
          variant={'ghost'}
          startIcon={isSubmitted ? <Check /> : <FileText />}
          onClick={openIframeForm}
        >
          {form.name}
        </Button>
      </div>
    </div>
  );
}
