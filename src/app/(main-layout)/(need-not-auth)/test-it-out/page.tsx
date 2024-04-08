'use client'

import Script from 'next/script'
import React, { ReactNode, useEffect } from 'react'
import { Button } from '@/components/actions'
import { Typography } from '@/components/data-display'
import { useAuthStore } from '@/stores/auth.store'
import { cn } from '@/utils/cn'
import { MessagesSquare, Minus, Monitor, Smartphone } from 'lucide-react'
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
import { set } from 'lodash'
import FakeTyping from './_components/fake-typing'
import Link from 'next/link'

export type FakeMessage = Message & {
  fakeType: 'flow-sender' | 'flow-receiver' | 'flow-options',
  nodeId: string,
  nodeType: FlowNode['type'],
  link?: string,
  img?: string,
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
  _id: '1',
  content: 'Hello',
  status: 'sent',
  sender: fakeSender,
  createdAt: new Date().toString(),
  language: 'en',
  contentEnglish: 'Hello',
  type: 'text',
}

const createFakeMessages = (data: Partial<Message>, fakeType: FakeMessage['fakeType'] = 'flow-sender', node: FlowNode) => {
  return {
    ...baseMessage,
    ...data,
    _id: new Date().getTime().toString(),
    nodeId: node.id,
    nodeType: node.type,
    link: node.data?.link,
    img: node.data?.img,
    fakeType
  } as FakeMessage
}

const TestItOut = () => {
  const currentUser = useAuthStore((s) => s.user);
  const [flow, setFlow] = React.useState<{
    nodes: FlowNode[],
    edges: Edge[],
  }>(() => {
    const gettedflow = localStorage.getItem('chat-flow');
    if (gettedflow) {
      try {
        return JSON.parse(gettedflow);
      } catch (error) {
      }
    }
    return {
      nodes: [],
      edges: [],
    }
  })
  const { nodes, edges } = flow;
  const [fakeMessages, setFakeMessages] = React.useState<FakeMessage[]>([]);
  const [isStarted, setIsStarted] = React.useState(false);
  const [isTyping, setIsTyping] = React.useState(false);
  const themeColor = DEFAULT_THEME;
  const addSendessageFromFlow = (node: FlowNode) => {
    switch (node.type) {
      case 'root':
        const firstMessage = createFakeMessages({ content: node.data?.content }, 'flow-sender', node);
        setFakeMessages([firstMessage]);
        break;
      case 'container': {
        const message = createFakeMessages({ content: node.data?.content }, 'flow-sender', node);
        const optionNodes = nodes.filter((n: FlowNode) => n.parentNode === node.id);
        const options = optionNodes.map((optionNode) => createFakeMessages({
          content: optionNode.data?.content,
        }, 'flow-options', optionNode)) || [];
        setFakeMessages((prev) => [...prev, message])
        setTimeout(() => {
          setFakeMessages((prev) => [...prev, ...options]);
        }, 1000);
        break;
      }
      case 'message': {
        const message = createFakeMessages({ content: node.data?.content }, 'flow-sender', node);
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
    const myMessage = createFakeMessages({ content: selectedNode.data?.content }, 'flow-receiver', selectedNode);
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
    onStart();
  }, [nodes])

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

  if (!currentUser || !flow || !nodes || !edges) return null

  return (<>
    <main className='w-full h-main-container-height bg-primary-100  relative'
      style={{
        backgroundImage: 'url(/test-flow-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}>
      <div className={cn('divide-y divide-neutral-50 flex flex-col gap-4 w-[410px] h-fit fixed right-10 bottom-2')}>
        <div className={cn('w-full  h-fit row-span-10 bg-white rounded-[20px] relative  justify-between  shadow-[2px_4px_16px_2px_rgba(22,22,22,0.1)]')}>
          <div className='w-full h-11 px-3 border-b border-neutral-50 flex flex-row items-center'>
            <div className='w-full flex flex-row items-center justify-start'>
              <Typography className={'text-neutral-600 text-xs min-w-14'}>Power by</Typography>
              <Image src="/logo.png" priority alt="logo" width={50} height={50} />
            </div>
            <Minus className='w-4 h-4' />
          </div>
          <div className={'p-4 overflow-y-auto overflow-x-hidden  h-[400px] '}>
            <TimeDisplay time={new Date().toString()} />
            {fakeMessages.map((message, index) => {
              if (message.fakeType === 'flow-sender') {
                return <PreviewReceivedMessage debouncedTime={0} key={index} onTranlatedChange={(trans) => { console.log('trans', trans) }} sender={currentUser} content={message.content} className="overflow-y-auto max-h-[320px]" />
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
          {isTyping && <FakeTyping />}
          <div className='px-8 pb-4'>
          </div>
          <Triangle
            fill='#ffffff'
            position="top"
            className={"absolute rotate-180  right-6 -bottom-4 -translate-y-full"}
          />
        </div>
        <div className={'w-full flex flex-row justify-end relative  mx-auto'}>
          <button className='p-4 w-fit  rounded-full bg-white shadow-[2px_4px_16px_2px_rgba(22,22,22,0.1)] relative'>
            <MessagesSquare className={`w-6 h-6`} stroke={themeColor} />
          </button>
        </div>

      </div>
    </main>
  </>
  )
}

export default TestItOut