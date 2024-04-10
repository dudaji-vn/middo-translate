'use client'

import React, { Fragment, useEffect } from 'react'
import { Button } from '@/components/actions'
import { Typography } from '@/components/data-display'
import { useAuthStore } from '@/stores/auth.store'
import { cn } from '@/utils/cn'
import { MessagesSquare, Minus } from 'lucide-react'
import Image from 'next/image'
import { Triangle } from '@/components/icons'
import { PreviewReceivedMessage } from '../../(protected)/business/settings/_components/extension-creation/sections/preview-received-message'
import { DEFAULT_THEME } from '../../(protected)/business/settings/_components/extension-creation/sections/options'
import { TimeDisplay } from '@/features/chat/messages/components/time-display'
import { FakeMessage } from './_components/fake-message'
import { Message } from '@/features/chat/messages/types'
import { User } from '@/features/users/types'
import { FlowNode } from '../../(protected)/business/settings/_components/extension-creation/steps/script-chat-flow/nested-flow'
import { Edge } from 'reactflow'
import FakeTyping from './_components/fake-typing'
import { CHAT_FLOW_KEY } from '@/configs/store-key'
import { isEmpty, set } from 'lodash'
import { MessageEditor } from '@/components/message-editor'
import { MediaUploadProvider } from '@/components/media-upload'
import { Media } from '@/types'
import { ImageGallery } from '@/features/chat/messages/components/message-item/message-item-image-gallery'
import { DocumentMessage } from '@/features/chat/messages/components/message-item/message-item-document'

type FakeMessage = Message & {
  fakeType: 'flow-sender' | 'flow-receiver' | 'flow-options',
  nodeId: string,
  nodeType: FlowNode['type'],
  link?: string,
  media?: Media[],
}
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
}

const createFakeMessages = ({ data, fakeType = 'flow-sender', node }:
  {
    data: Partial<Message> & {
      link?: string,
    },
    fakeType: FakeMessage['fakeType'],
    node?: FlowNode,

  }) => {
  console.log('data', data)
  return {
    ...baseMessage,
    ...data,
    _id: new Date().getTime().toString(),
    nodeId: node?.id,
    nodeType: node?.type,
    contentEnglish: '',
    link: node?.data?.link,
    fakeType
  } as FakeMessage
}

const TestItOut = () => {
  const currentUser = useAuthStore((s) => s.user);
  const [shrinked, setShrinked] = React.useState(false);

  const [flow, setFlow] = React.useState<{
    nodes: FlowNode[],
    edges: Edge[],
  }>({
    nodes: [],
    edges: [],
  })
  const { nodes, edges } = flow;
  const [fakeMessages, setFakeMessages] = React.useState<FakeMessage[]>([]);
  const [isStarted, setIsStarted] = React.useState(false);
  const [isTyping, setIsTyping] = React.useState(false);
  const themeColor = DEFAULT_THEME;
  const addSendessageFromFlow = (node: FlowNode) => {
    switch (node.type) {
      case 'root':
        const firstMessage = createFakeMessages({
          data: { content: node.data?.content },
          fakeType: 'flow-sender',
          node
        });
        setFakeMessages([firstMessage]);
        break;
      case 'container': {
        const message = createFakeMessages({
          data: { content: node.data?.content, media: node.data?.media },
          fakeType: 'flow-sender',
          node
        });
        const optionNodes = nodes.filter((n: FlowNode) => n.parentNode === node.id);
        const options = optionNodes.map((optionNode) => createFakeMessages({
          data: {
            content: optionNode.data?.content,
            link: optionNode.data?.link,
            media: optionNode.data?.media
          },
          fakeType: 'flow-options',
          node: optionNode,
        })) || [];
        setFakeMessages((prev) => [...prev, message])
        setTimeout(() => {
          setFakeMessages((prev) => [...prev, ...options]);
        }, 1000);
        break;
      }
      case 'message': {
        const message = createFakeMessages({
          data: { content: node.data?.content, media: node.data?.media },
          fakeType: 'flow-sender',
          node
        });
        setFakeMessages((prev) => [...prev, message]);
        break;
      }
      case 'button':
        break;
      default:
        break;
    }
  }
  const addReceivedMessageFromMyChoice = (selectedNode: FlowNode) => {
    const myMessage = createFakeMessages({
      data: { content: selectedNode.data?.content },
      fakeType: 'flow-receiver',
      node: selectedNode
    });
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
  }

  useEffect(() => {
    if (!isEmpty(nodes) && !isStarted) {
      setTimeout(() => {
        onStart();
      }, 1200);
    }
  }, [nodes])

  useEffect(() => {
    const gettedflow = localStorage.getItem(CHAT_FLOW_KEY);
    if (gettedflow) {
      try {
        setFlow(JSON.parse(gettedflow));
        console.log('gettedflow', gettedflow)
      } catch (error) {
        console.error("ERROR:>>", error)
      }
    }
  }, [])
  const onStart = () => {
    const root = nodes.find((node) => node.type === 'root');
    const nextToRoot = edges.find((edge) => edge.source === root?.id);
    const nextNode = nodes.find((node) => node.id === nextToRoot?.target);
    console.log('nextToRoot', nextToRoot)
    console.log('nextNode', nextNode)
    if (nextNode) {
      addSendessageFromFlow(nextNode);
    }
    setIsStarted(true);
  }
  const scrollToBottom = () => {
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
      chatContainer.scrollTo({
        top: chatContainer.scrollHeight,
        behavior: 'smooth'
      })
    }
  }
  useEffect(() => {
    scrollToBottom();
  }, [fakeMessages])

  const onTriggerBtnClick = () => {
    setShrinked(!shrinked);

  }
  if (!currentUser || !flow || !nodes || !edges) return null

  return (<>
    <main className='w-full h-main-container-height bg-primary-100  relative bg-cover bg-no-repeat bg-[url(/test-flow-bg.png)]'>
      <div className='absolute inset-0 bg-neutral-100 bg-opacity-25' />
      <div className={cn('divide-y divide-neutral-50 flex flex-col gap-4 w-full sm:w-[410px] h-fit fixed sm:right-10 right-0 bottom-2')}>
        <div
          className={cn('w-full  h-fit row-span-10 bg-white rounded-[20px] relative  justify-between  shadow-[2px_4px_16px_2px_rgba(22,22,22,0.1)]',
            'transition-all duration-300 origin-[93%_100%] transform-gpu',
            shrinked ? 'scale-0' : 'scale-100')}
        >
          <div className='w-full h-11 px-3 border-b border-neutral-50 flex flex-row items-center'>
            <div className='w-full flex flex-row items-center justify-start'>
              <Typography className={'text-neutral-600 text-xs min-w-14'}>Power by</Typography>
              <Image src="/logo.png" priority alt="logo" width={50} height={50} />
            </div>
            <Minus className='w-4 h-4' />
          </div>
          <div className={'flex-col flex justify-between h-[500px]'}>
            <div className='overflow-y-auto overflow-x-hidden p-4' id='chat-container'>
              <TimeDisplay time={new Date().toString()} />
              {fakeMessages.map((message, index) => {
                if (message.fakeType === 'flow-sender') {
                  return <PreviewReceivedMessage media={message.media} debouncedTime={0} key={index} onTranlatedChange={(trans) => { console.log('trans', trans) }} sender={currentUser} content={message.content} />
                }
                if (message.fakeType === 'flow-receiver') {
                  return <FakeMessage key={index} message={message} />
                }
                if (message.fakeType === 'flow-options') {
                  if (message.nodeType === 'button' && message.link?.length) {
                    return <div className='w-full h-auto flex flex-col pb-1 items-end' key={index}>
                      <a target="_blank" href={message.link} key={index}>
                        <Button
                          className={'h-10  w-fit'}
                          variant={'outline'}
                          color={'primary'}
                          shape={'square'}
                          type={'button'}
                        >{message.content}
                        </Button>
                      </a>
                    </div>
                  }
                  return <div className='w-full h-auto flex flex-col pb-1 items-end' key={index}>
                    <Button
                      className={'h-10  w-fit'}
                      variant={'outline'}
                      color={'primary'}
                      shape={'square'}
                      type={'button'}
                      onClick={() => {
                        const thisNode = nodes.find((node) => node.id === message.nodeId);
                        if (thisNode) {
                          addReceivedMessageFromMyChoice(thisNode);
                        }
                      }}
                    >{message.content}
                    </Button>
                  </div>
                }
              })}
            </div>
            <div className=''>
              {isTyping && <FakeTyping />}
              <div className="relative w-full border-t p-2">
                <MediaUploadProvider>
                  <MessageEditor
                    userMentions={[]}
                    sendBtnProps={{
                      disabled: true
                    }}
                  />
                </MediaUploadProvider>
              </div>
            </div>
          </div>

          <Triangle
            fill='#ffffff'
            position="top"
            className={"absolute rotate-180  right-6 -bottom-4 -translate-y-full"}
          />
        </div>
        <div className={'w-full max-sm:pr-2 flex flex-row justify-end relative  mx-auto'}>
          <button
            onClick={onTriggerBtnClick}
            className='p-4 w-fit  rounded-full bg-white shadow-[2px_4px_16px_2px_rgba(22,22,22,0.1)] relative'>
            <MessagesSquare className={`w-6 h-6`} stroke={themeColor} />
          </button>
        </div>
      </div>
    </main >
  </>
  )
}

export default TestItOut