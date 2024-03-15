import { Button } from '@/components/actions'
import { Typography } from '@/components/data-display'
import { useAuthStore } from '@/stores/auth.store'
import { cn } from '@/utils/cn'
import { Minus, Monitor, Smartphone } from 'lucide-react'
import Image from 'next/image'
import React, { ReactNode } from 'react'
import { PreviewCustomMessages } from './preview-custom-messages'

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


const PluginChatPreview = ({ className, content, language, ...props }: PluginChatPreviewProps) => {
    const [selectedDevice, setSelectedDevice] = React.useState<TPreviewDevice>('desktop')
    const currentUser = useAuthStore((s) => s.user);
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
                    <PreviewCustomMessages sender={currentUser} content={content} />
                </div>
            </div>

        </div>
    )
}

export default PluginChatPreview