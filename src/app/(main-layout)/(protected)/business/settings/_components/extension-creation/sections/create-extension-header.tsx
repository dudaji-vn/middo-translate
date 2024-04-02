'use client'

import { Button } from '@/components/actions';
import { Typography } from '@/components/data-display';
import { cva } from 'class-variance-authority';
import { ArrowLeft, Check } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react'
import { ExtensionModalType } from '../../setting-header/setting-header';
import { cn } from '@/utils/cn';
import { TabsList, TabsTrigger } from '@/components/navigation';
const headerVariants = cva('w-full flex flex-row', {
    variants: {
        navigation: {
            default: 'hidden',
            'create-extension': 'w-full py-2 flex flex-row gap-3',
            'edit-extension': 'w-full py-2 flex flex-row gap-3',
            'edit-company': 'w-full py-2 flex flex-row gap-3'
        },
    }
});
const mappedTitle = {
    'edit-extension': 'Edit Extension',
    'create-extension': 'Create Extension',
    'edit-company': 'Edit Company'
}
const items = [
    {
        title: 'Add Domains',
        value: 'add domains'
    },
    {
        title: 'Starting Message',
        value: 'starting message'
    },
    {
        title: 'Custom Extension',
        value: 'custom extension'
    },
    {
        title: 'Copy & Paste Code',
        value: 'copy & paste code'
    }
]

const CreateExtensionHeader = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const modalType: ExtensionModalType = searchParams?.get('modal') as ExtensionModalType;
    const [step, setStep] = React.useState(0);
    const onStepChange = (value: string) => {
        setStep(items.findIndex(item => item.value === value));
    }
    const stepPercentage = (step / (items.length - 1)) * 100;
    return (
        <section className={cn('w-full flex flex-row items-center gap-5 bg-primary-100', headerVariants({ navigation: modalType || 'default' }))}>
            <Button.Icon
                onClick={() => {
                    router.back();
                }}
                variant={'ghost'}
                size={'xs'}
                color={'default'}
                className='text-neutral-600'
            >
                <ArrowLeft className="" />
            </Button.Icon>
            <Typography className='text-neutral-600 capitalize w-1/6'>{mappedTitle[modalType || 'create-extension']}</Typography>
            <TabsList className='border-none gap-5 relative justify-between w-4/6'>
                <div className='absolute h-[50%] !z-0 inset-0 border-b-neutral-50 border-b-[1px] border-dashed w-full'></div>
                <div style={{ width: `${stepPercentage}%` }}  className='absolute  h-[50%] !z-10 top-0 left-0 border-b-[2px] border-b-neutral-100 transition-all duration-1000' ></div>
                {items.map((item, index) => {
                    const isActive = step === index;
                    const isDone = step > index;
                    const isDisabled = step < index;
                    const stepContent = isDone ? <Check className='text-white p-1' /> : index + 1;
                    return (
                        <TabsTrigger variant='unset' value={item.value} key={index}
                            onClick={() => onStepChange(item.value)} className='z-20'
                        >
                            <Button shape={'square'} size={'xs'} variant={'ghost'}  className={cn('flex flex-row gap-3',
                            isActive && 'bg-neutral-50',
                            isDisabled && 'bg-neutral-50',
                            isDone && 'bg-success-100'
                            )}>
                                <div className={cn('max-lg:hidden rounded-full h-6 w-6 ',
                                isActive && 'bg-primary-500-main text-white',
                                isDisabled && 'bg-neutral-200 text-white',
                                isDone && 'bg-success-700 text-white'
                                )}>
                                  {stepContent}
                                </div>
                                <p
                                    className={cn('font-light', isActive && 'text-primary-500-main ',
                                        isDisabled && 'text-neutral-200',
                                        isDone && 'text-success-700'
                                    )}> {item.title}</p>
                            </Button>
                        </TabsTrigger>
                    )
                })}
            </TabsList>
        </section>
    )
}

export default CreateExtensionHeader