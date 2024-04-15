'use client'

import { Button } from '@/components/actions';
import { Typography } from '@/components/data-display';
import { cva } from 'class-variance-authority';
import { ArrowLeft, Check, Info } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { use, useEffect, useMemo, useState } from 'react'
import { cn } from '@/utils/cn';
import { TabsList, TabsTrigger } from '@/components/navigation';
import { useFormContext } from 'react-hook-form';
import { on } from 'events';
enum BusinessModalType {
    CreateSpace = 'create-space',
    EditSpace = 'edit-space'
}
const headerVariants = cva('w-full flex flex-row', {
    variants: {
        navigation: {
            default: 'hidden',
            'create-space': 'w-full py-2 flex flex-row gap-3',
            'edit-space': 'w-full py-2 flex flex-row gap-3',
        },
    }
});
const mappedTitle = {
    'edit-space': 'Edit Space',
    'create-space': 'Create Space',
}
export const createSpaceSteps = [
    {
        title: 'Space Information',
        value: 0,
        nameField: 'information',
        requiredFields: ['information.name', 'information.avatar']
    },
    {
        title: 'Invite Members',
        value: 1,
        nameField: 'members',
        requiredFields: ['members']
    }
]

const CreateOrEditSpaceHeader = ({
    step = 0,
    onStepChange,
}: {
    step: number,
    onStepChange: (value: number) => void,
    
}) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const modalType: BusinessModalType = searchParams?.get('modal') as BusinessModalType;

    const stepPercentage = (step / (createSpaceSteps.length - 1)) * 100;

    const handleStepChange = async (index: number) => {
        if (!createSpaceSteps[index]) return;
        onStepChange(index);
    }

    return (
        <section className={cn('w-full px-4 flex flex-row items-center justify-between createSpaceSteps-center gap-3 bg-primary-100', headerVariants({ navigation: modalType || 'default' }))}>
            <div className='flex flex-row items-center gap-2'>
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
                <Typography className='text-neutral-600 capitalize min-w-max'>{mappedTitle[modalType || 'create-space']}</Typography>
            </div>
            <TabsList className='border-none gap-5 max-w-[600px] relative justify-between md:mx-10 xl:mx-14'>
                <div className='absolute h-[50%] !z-0 inset-0 border-b-neutral-50 border-b-[1px] border-dashed w-full'></div>
                <div style={{ width: `${stepPercentage}%` }} className='absolute  h-[50%] !z-10 top-0 left-0 border-b-[2px] border-b-neutral-200 transition-all duration-1000' ></div>
                {createSpaceSteps.map((item, index) => {
                    const isActive = step === index;
                    const isAfterCurrent = step < index;
                    const isDone = step > index;
                    const stepContent = isDone ? <Check className="text-white" /> : index + 1;
                    return (
                        <div key={index}
                            className='z-20'
                        >
                            <Button
                                disabled={index > step + 1}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleStepChange(index);
                                }}
                                shape={'square'} size={'xs'} variant={'ghost'} className={cn('flex flex-row gap-3',
                                    isActive && '!bg-neutral-50',
                                    isAfterCurrent && '!bg-neutral-50  hover:bg-primary-100',
                                    isDone && '!bg-success-100',
                                )}>
                                <div className={cn(' rounded-full h-6 w-6 ',
                                    isActive && 'bg-primary-500-main text-white',
                                    isAfterCurrent && 'bg-neutral-200 text-white',
                                    isDone && 'bg-success-700 text-white',
                                )}>
                                    {stepContent}
                                </div>
                                <p className={cn('font-light max-md:hidden', isActive && 'text-primary-500-main ',
                                    isAfterCurrent && 'text-neutral-200',
                                    isDone && 'text-success-700',
                                )}> {item.title}</p>
                            </Button>
                        </div>
                    )
                })}
            </TabsList>
            <em />
        </section>
    )
}

export default CreateOrEditSpaceHeader