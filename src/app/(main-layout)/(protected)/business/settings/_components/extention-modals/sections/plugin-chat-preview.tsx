import { Button } from '@/components/actions'
import { Avatar, Text, Typography } from '@/components/data-display'
import { Spinner } from '@/components/feedback'
import { TriangleSmall } from '@/components/icons/triangle-small'
import { MessageActions } from '@/features/chat/messages/components/message-actions'
import { MessageItemGroup } from '@/features/chat/messages/components/message-group'
import { MessageItem } from '@/features/chat/messages/components/message-item'
import { TimeDisplay } from '@/features/chat/messages/components/time-display'
import { Message } from '@/features/chat/messages/types'
import { User } from '@/features/users/types'
import { translateText, translateWithDetection } from '@/services/languages.service'
import { useAuthStore } from '@/stores/auth.store'
import { cn } from '@/utils/cn'
import { Minus, Monitor, Smartphone } from 'lucide-react'
import Image from 'next/image'
import React, { ReactNode, useEffect, useMemo } from 'react'
import { useDebounce } from 'usehooks-ts'

export type PluginChatPreviewProps = {
    content: string;
    language: string;

} & React.HTMLAttributes<HTMLDivElement>

export type TPreviewDevice = 'desktop' | 'mobile';
const devices: Array<{ name: TPreviewDevice, icon: ReactNode }> = [
    {
        name: 'desktop',
        icon: <Monitor className='w-10/12' />
    },
    {
        name: 'mobile',
        icon: <Smartphone className='w-10/12' />
    },
];

const FakeChat = ({ sender, content = '' }: {
    sender?: User | null,
    content?: string, contentEnglish?: string,
}) => {
    const [contentEnglish, setContentEnglish] = React.useState<string>('')
    const [isTranslating, setIsTranslating] = React.useState<boolean>(false)
    useEffect(() => {
        setIsTranslating(true);
        translateWithDetection(content, 'en').then((res) => {
            setContentEnglish(typeof res === 'string' ? res : res.translatedText)
        }).finally(() => {
            setIsTranslating(false);
        })
    }, [content])
    return <div >
        <TimeDisplay time={new Date().toLocaleDateString()} />
        <div className="w-full gap-1  pb-10 relative  flex pr-11 md:pr-20">
            <div className="overflow-hidden relative aspect-square size-6 rounded-full mb-auto mr-1 mt-0.5 shrink-0">
                <Avatar src={String(sender?.avatar)} alt={String(sender?.name)} size="xs" />
            </div>
            <div className="relative space-y-2">
                <Typography className='p-1 text-sm leading-[18px] font-light text-neutral-600'>{sender?.name}</Typography>
                <div className="w-fit min-w-10 bg-neutral-50 px-2 py-1 relative overflow-hidden rounded-[20px]">
                    <div className="px-3 py-2 bg-neutral-50 break-word-mt text-start tiptap prose editor-view prose-strong:text-current max-w-none w-full focus:outline-none text-current text-sm">
                        {content}
                    </div>
                    <div className="relative mt-2 min-w-10">
                        <TriangleSmall
                            fill={'#e6e6e6'}
                            position="top"
                            className="absolute left-4 top-0 -translate-y-full"
                        />
                        <div className="mb-1 mt-2 rounded-xl bg-neutral-100 p-1 px-3 text-neutral-600">
                            <Text
                                value={contentEnglish}
                                className={cn("text-start text-sm font-light")}
                            />
                            <Spinner size='sm' className={isTranslating && !contentEnglish ? 'text-white mx-auto' : 'hidden'} color='white' />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

const PluginChatPreview = ({ className, content, language, ...props }: PluginChatPreviewProps) => {
    const [selectedDevice, setSelectedDevice] = React.useState<TPreviewDevice>('desktop')
    const currentUser = useAuthStore((s) => s.user);
    const debouncedContent = useDebounce(content, 1000);

    return (
        <div {...props} className={cn('divide-y divide-neutral-50 flex flex-col ', className)}>
            <div className='py-2  px-3 flex flex-row gap-3 items-center justify-start'>
                <Typography className='font-medium text-sm leading-[18px] text-neutral-800'>
                    Preview
                </Typography>
                <div className='bg-neutral-50 p-1 flex flex-row gap-1 items-center rounded-[8px]'>
                    {devices.map((device, index) => {
                        const isSelect = selectedDevice === device.name;
                        return (
                            <Button.Icon
                                key={device.name}
                                shape={'square'}
                                variant='ghost'
                                color={'default'}
                                type='button'
                                className={cn('rounded-[4px]', isSelect ? 'bg-white hover:!bg-white' : 'bg-neutral-50 hover:!bg-gray-50')}
                                onClick={() => setSelectedDevice(device.name)}
                            >
                                {device.icon}
                            </Button.Icon>
                        )
                    })}
                </div>
            </div>
            <div className='p-3'>
                <div className='max-w-[375px] rounded-[20px] flex flex-col m-auto min-w-[200px] min-h-[200px] bg-white shadow-[2px_4px_16px_2px_rgba(22,22,22,0.1)]'>
                    <div className='w-full h-11 px-3 border-b border-neutral-50 flex flex-row items-center justify-between'>
                        <div className='w-full flex flex-row items-center justify-start'>
                            <Typography className={'text-neutral-600 text-xs min-w-14'}>Power by</Typography>
                            <Image src="/logo.png" priority alt="logo" width={50} height={50} />
                        </div>
                        <Minus className='w-4 h-4' />
                    </div>
                    <FakeChat sender={currentUser} content={debouncedContent} />


                </div>
            </div>

        </div>
    )
}

export default PluginChatPreview