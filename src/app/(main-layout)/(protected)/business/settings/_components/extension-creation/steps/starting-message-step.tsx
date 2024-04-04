'use client';

import { FormLabel } from '@/components/ui/form';
import React from 'react'
import CustomFirstMessageOptions from '../sections/custom-first-message-options';
import { useFormContext } from 'react-hook-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/navigation';
import Flow from './script-chat-flow/flow';

const StartingMessageStep = () => {
    const { trigger, watch, setValue, formState: {
        errors,
        isValid,
        isSubmitting,
        isSubmitSuccessful
    } } = useFormContext();
    return (
        <div className='flex flex-col gap-3 p-3'>
            <FormLabel
                className="mb-1 inline-block text-neutral-900 text-[1rem] font-semibold"
            >
                Starting message
            </FormLabel>
            <Tabs defaultValue='default'>
                <TabsList className='border-none bg-neutral-50 px-2 py-1 gap-1 rounded-[8px]'>
                    <TabsTrigger value='default' variant='button'>Plain text</TabsTrigger>
                    <TabsTrigger value='custom' variant='button'>Script</TabsTrigger>
                </TabsList>
                <TabsContent value='default'>
                    <CustomFirstMessageOptions
                        firstMessage={watch('custom.firstMessage')}
                        onFirstMessageChange={(message) => {
                            setValue('custom.firstMessage', message);
                        }}
                    />
                </TabsContent>
                <TabsContent value='custom' className='w-full h-[60vh]'>
                    <Flow />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default StartingMessageStep