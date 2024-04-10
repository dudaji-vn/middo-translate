'use client';

import React, { useEffect } from 'react';
import { Button } from '@/components/actions';
import { Typography } from '@/components/data-display';
import { useAuthStore } from '@/stores/auth.store';
import { cn } from '@/utils/cn';
import { MessagesSquare, Minus } from 'lucide-react';
import Image from 'next/image';
import { Triangle } from '@/components/icons';
import { PreviewReceivedMessage } from '../../(protected)/business/settings/_components/extension-creation/sections/preview-received-message';
import { DEFAULT_THEME } from '../../(protected)/business/settings/_components/extension-creation/sections/options';
import { TimeDisplay } from '@/features/chat/messages/components/time-display';
import { FakeMessage } from './_components/fake-message';
import { Message } from '@/features/chat/messages/types';
import { User } from '@/features/users/types';
import { FlowNode } from '../../(protected)/business/settings/_components/extension-creation/steps/script-chat-flow/nested-flow';
import { Edge } from 'reactflow';
import FakeTyping from './_components/fake-typing';
import useClient from '@/hooks/use-client';
import { CHAT_FLOW_KEY } from '@/configs/store-key';
import { isEmpty } from 'lodash';

type FakeMessage = Message & {
  fakeType: 'flow-sender' | 'flow-receiver' | 'flow-options';
  nodeId: string;
  nodeType: FlowNode['type'];
  link?: string;
  img?: string;
};
const fakeSender: User = {
  _id: 'fake-sender',
  language: 'en',
  name: 'John Doe',
  avatar: '/avatar.png',
  email: '',
  status: 'active',
  createdAt: new Date().toString(),
};
const baseMessage: Message = {
  _id: '',
  content: '',
  status: 'sent',
  sender: fakeSender,
  createdAt: new Date().toString(),
  language: 'en',
  contentEnglish: '',
  type: 'text',
};

const createFakeMessages = (
  data: Partial<Message>,
  fakeType: FakeMessage['fakeType'] = 'flow-sender',
  node: FlowNode,
) => {
  return {
    ...baseMessage,
    ...data,
    _id: new Date().getTime().toString(),
    nodeId: node.id,
    nodeType: node.type,
    contentEnglish: '',
    link: node.data?.link,
    img: node.data?.img,
    fakeType,
  } as FakeMessage;
};

const TestItOut = () => {
  const currentUser = useAuthStore((s) => s.user);

  const [flow, setFlow] = React.useState<{
    nodes: FlowNode[];
    edges: Edge[];
  }>({
    nodes: [],
    edges: [],
  });
  const { nodes, edges } = flow;
  const [fakeMessages, setFakeMessages] = React.useState<FakeMessage[]>([]);
  const [isStarted, setIsStarted] = React.useState(false);
  const [isTyping, setIsTyping] = React.useState(false);
  const themeColor = DEFAULT_THEME;
  const addSendessageFromFlow = (node: FlowNode) => {
    switch (node.type) {
      case 'root':
        const firstMessage = createFakeMessages(
          { content: node.data?.content },
          'flow-sender',
          node,
        );
        setFakeMessages([firstMessage]);
        break;
      case 'container': {
        const message = createFakeMessages(
          { content: node.data?.content },
          'flow-sender',
          node,
        );
        const optionNodes = nodes.filter(
          (n: FlowNode) => n.parentNode === node.id,
        );
        const options =
          optionNodes.map((optionNode) =>
            createFakeMessages(
              {
                content: optionNode.data?.content,
              },
              'flow-options',
              optionNode,
            ),
          ) || [];
        setFakeMessages((prev) => [...prev, message]);
        setTimeout(() => {
          setFakeMessages((prev) => [...prev, ...options]);
        }, 1000);
        break;
      }
      case 'message': {
        const message = createFakeMessages(
          { content: node.data?.content },
          'flow-sender',
          node,
        );
        setFakeMessages((prev) => [...prev, message]);
        break;
      }
      case 'button':
        break;
      default:
        break;
    }
  };
  const addReceivedMessageFromMyChoice = (selectedNode: FlowNode) => {
    const myMessage = createFakeMessages(
      { content: selectedNode.data?.content },
      'flow-receiver',
      selectedNode,
    );
    setFakeMessages((prev) => [...prev, myMessage]);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const targetEdge = edges.find((edge) => edge.source === selectedNode.id);
      const targetNode = nodes.find((node) => node.id === targetEdge?.target);
      if (targetNode) {
        addSendessageFromFlow(targetNode);
      }
    }, 1000);
  };

  useEffect(() => {
    if (!isEmpty(nodes) && !isStarted) {
      onStart();
    }
  }, [nodes]);

  useEffect(() => {
    const gettedflow = localStorage.getItem(CHAT_FLOW_KEY);
    if (gettedflow) {
      try {
        setFlow(JSON.parse(gettedflow));
        console.log('gettedflow', gettedflow);
      } catch (error) {
        console.error('ERROR:>>', error);
      }
    }
  }, []);
  const onStart = () => {
    const root = nodes.find((node) => node.type === 'root');
    const nextToRoot = edges.find((edge) => edge.source === root?.id);
    const nextNode = nodes.find((node) => node.id === nextToRoot?.target);
    console.log('nextToRoot', nextToRoot);
    console.log('nextNode', nextNode);
    if (nextNode) {
      addSendessageFromFlow(nextNode);
    }
    setIsStarted(true);
  };
  const scrollToBottom = () => {
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
      chatContainer.scrollTo({
        top: chatContainer.scrollHeight,
        behavior: 'smooth',
      });
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [fakeMessages]);

  if (!currentUser || !flow || !nodes || !edges) return null;

  return (
    <>
      <main
        className="relative h-main-container-height w-full  bg-primary-100"
        style={{
          backgroundImage: 'url(/test-flow-bg.png)',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div
          className={cn(
            'fixed bottom-2 right-10 flex h-fit w-[410px] flex-col gap-4 divide-y divide-neutral-50',
          )}
        >
          <div
            className={cn(
              'relative  row-span-10 h-fit w-full justify-between rounded-[20px]  bg-white  shadow-[2px_4px_16px_2px_rgba(22,22,22,0.1)]',
            )}
          >
            <div className="flex h-11 w-full flex-row items-center border-b border-neutral-50 px-3">
              <div className="flex w-full flex-row items-center justify-start">
                <Typography className={'min-w-14 text-xs text-neutral-600'}>
                  Power by
                </Typography>
                <Image
                  src="/logo.png"
                  priority
                  alt="logo"
                  width={50}
                  height={50}
                />
              </div>
              <Minus className="h-4 w-4" />
            </div>
            <div
              className={'h-[400px] overflow-y-auto overflow-x-hidden  p-4 '}
              id="chat-container"
            >
              <TimeDisplay time={new Date().toString()} />
              {fakeMessages.map((message, index) => {
                if (message.fakeType === 'flow-sender') {
                  return (
                    <PreviewReceivedMessage
                      debouncedTime={0}
                      key={index}
                      onTranlatedChange={(trans) => {
                        console.log('trans', trans);
                      }}
                      sender={currentUser}
                      content={message.content}
                      className="max-h-[320px] overflow-y-auto"
                    />
                  );
                }
                if (message.fakeType === 'flow-receiver') {
                  return <FakeMessage key={index} message={message} />;
                }
                if (message.fakeType === 'flow-options') {
                  if (message.nodeType === 'button' && message.link?.length) {
                    return (
                      <div
                        className="flex h-auto w-full flex-col items-end pb-1"
                        key={index}
                      >
                        <a target="_blank" href={message.link} key={index}>
                          <Button
                            className={'h-10  w-fit'}
                            variant={'outline'}
                            color={'primary'}
                            shape={'square'}
                            type={'button'}
                          >
                            {message.content}
                          </Button>
                        </a>
                      </div>
                    );
                  }
                  return (
                    <div
                      className="flex h-auto w-full flex-col items-end pb-1"
                      key={index}
                    >
                      <Button
                        className={'h-10  w-fit'}
                        variant={'outline'}
                        color={'primary'}
                        shape={'square'}
                        type={'button'}
                        onClick={() => {
                          const thisNode = nodes.find(
                            (node) => node.id === message.nodeId,
                          );
                          if (thisNode) {
                            addReceivedMessageFromMyChoice(thisNode);
                          }
                        }}
                      >
                        {message.content}
                      </Button>
                    </div>
                  );
                }
              })}
            </div>
            {isTyping && <FakeTyping />}
            <div className="px-8 pb-4"></div>
            <Triangle
              fill="#ffffff"
              position="top"
              className={
                'absolute -bottom-4  right-6 -translate-y-full rotate-180'
              }
            />
          </div>
          <div className={'relative mx-auto flex w-full flex-row  justify-end'}>
            <button className="relative w-fit  rounded-full bg-white p-4 shadow-[2px_4px_16px_2px_rgba(22,22,22,0.1)]">
              <MessagesSquare className={`h-6 w-6`} stroke={themeColor} />
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default TestItOut;
