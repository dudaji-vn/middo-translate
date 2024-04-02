'use client'

import { Button } from '@/components/actions';
import { Typography } from '@/components/data-display';
import { cva } from 'class-variance-authority';
import { ArrowLeft, Check, Info } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { use, useEffect, useMemo, useState } from 'react'
import { ExtensionModalType } from '../../setting-header/setting-header';
import { cn } from '@/utils/cn';
import { TabsList, TabsTrigger } from '@/components/navigation';
import { useFormContext } from 'react-hook-form';
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
export const createExtensionSteps = [
    {
        title: 'Add Domains',
        value: 0,
        nameField: 'domains',
        requiredFields: ['domains']
    },
    {
        title: 'Starting Message',
        value: 1,
        nameField: 'custom.firstMessage',
        requiredFields: ['domains', 'custom.firstMessage']
    },
    {
        title: 'Custom Extension',
        value: 2,
        nameField: 'custom.color',
        requiredFields: ['domains', 'custom.firstMessage', 'custom.language', 'custom.firstMessageEnglish'],

    },
    // {
    //     title: 'Copy & Paste Code',
    //     value: 3,
    //     nameField: 'code',
    //     requiredFields: ['domains', 'custom.firstMessage', 'custom.language', 'custom.firstMessageEnglish', 'custom.color'],
    // }
]

const CreateExtensionHeader = ({
    step,
    onStepChange,
}: {
    step: number,
    onStepChange: (value: number) => void
}) => {
    const searchParams = useSearchParams();
    const [currentError, setCurrentError] = useState(false);
    const router = useRouter();
    const modalType: ExtensionModalType = searchParams?.get('modal') as ExtensionModalType;
    const handleStepChange = (value: number) => {
        onStepChange(value);
    }
    const { trigger, watch, formState: {
        errors,
    } } = useFormContext();
    const stepPercentage = (step / (createExtensionSteps.length - 1)) * 100;
    const currentValue = watch(createExtensionSteps[step].nameField);
   useEffect(() => {
    if (currentError) {
        trigger(createExtensionSteps[step].nameField).then((value) => setCurrentError(!value));
    }
   }, [currentValue])

    return (
        <section className={cn('w-full flex flex-row items-center createExtensionSteps-center gap-3 bg-primary-100', headerVariants({ navigation: modalType || 'default' }))}>
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
            <Typography className='text-neutral-600 capitalize min-w-max'>{mappedTitle[modalType || 'create-extension']}</Typography>
            <TabsList className='border-none gap-5 relative justify-between md:mx-10 xl:mx-14'>
                <div className='absolute h-[50%] !z-0 inset-0 border-b-neutral-50 border-b-[1px] border-dashed w-full'></div>
                <div style={{ width: `${stepPercentage}%` }} className='absolute  h-[50%] !z-10 top-0 left-0 border-b-[2px] border-b-success-200 transition-all duration-1000' ></div>
                {createExtensionSteps.map((item, index) => {
                    const isActive = step === index;
                    let isDone = step > index
                    const isAfterCurrent = step < index;
                    const disabled = createExtensionSteps[step].requiredFields.some((field) => errors[field]) && step < index;
                    let stepContent = isDone ? <Check className='text-white p-1' /> : <p className='!w-6'>{index + 1}</p>;
                    const isError = currentError && step === index;
                    if (isError) {
                        stepContent = <Info className='text-white p-1 rotate-180' />
                    }
                    return (
                        <TabsTrigger variant='unset' value={String(item.value)} key={index}
                            onClick={() => {
                                if (step === index) return;
                                setCurrentError(false);
                                if (index < step) {
                                    handleStepChange(index);
                                    return;
                                }
                                if (index > step) {
                                    trigger(createExtensionSteps[step].nameField).then((value) => {
                                        if (!value) {
                                            setCurrentError(true);
                                        }
                                    });
                                }
                                Promise.all(createExtensionSteps[step].requiredFields.map((field) => {
                                    return trigger(field);
                                })).then((values) => {
                                    if (values.every((value) => value)) {
                                        handleStepChange(index);
                                    }
                                })
                            }}
                            className='z-20'
                            disabled={disabled}
                        >
                            <Button shape={'square'} size={'xs'} variant={'ghost'} className={cn('flex flex-row gap-3',
                                isActive && '!bg-neutral-50',
                                isAfterCurrent && '!bg-neutral-50  hover:bg-primary-100',
                                isDone && '!bg-success-100',
                                isError && '!bg-error-100',
                            )}>
                                <div className={cn(' rounded-full h-6 w-6 ',
                                    isActive && 'bg-primary-500-main text-white',
                                    isAfterCurrent && 'bg-neutral-200 text-white',
                                    isDone && 'bg-success-700 text-white',
                                    isError && 'bg-error-500 text-white'
                                )}>
                                    {stepContent}
                                </div>
                                <p
                                    className={cn('font-light max-md:hidden', isActive && 'text-primary-500-main ',
                                        isAfterCurrent && 'text-neutral-200',
                                        isDone && 'text-success-700',
                                        isError && 'text-error-500'
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