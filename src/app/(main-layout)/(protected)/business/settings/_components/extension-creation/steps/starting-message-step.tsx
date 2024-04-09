'use client';

import { FormLabel } from '@/components/ui/form';
import React, { useEffect } from 'react'
import CustomFirstMessageOptions from '../sections/custom-first-message-options';
import { useFormContext } from 'react-hook-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/navigation';
import NestedFlow, { FlowNode } from './script-chat-flow/nested-flow';
import { CHAT_FLOW_KEY } from '@/configs/store-key';
import { set } from 'lodash';
import { Edge } from 'reactflow';

const StartingMessageStep = () => {
    const { trigger, watch, setValue, formState: {
        errors,
        isValid,
        isSubmitting,
        isSubmitSuccessful
    } } = useFormContext();
    const scriptChatFlow = watch('custom.chatFlow');

    const [tab, setTab] = React.useState<string>(scriptChatFlow ? 'custom' : 'default');


    const onTabSelect = (tab: string) => {
        if (tab === 'default') {
            localStorage.setItem(CHAT_FLOW_KEY, JSON.stringify(
                scriptChatFlow
            ))
            setValue('custom.chatFlow', undefined)
        } else {
            const flow = localStorage.getItem(CHAT_FLOW_KEY);
            if (flow) {
                try {
                    const parseFlow = JSON.parse(flow);
                    if (parseFlow.nodes.length > 1) {
                        setValue('custom.chatFlow', parseFlow)
                    }
                } catch (error) {
                    console.error(error)
                }
            }
        }
    }

    const onSaveChatFlow = (chatFlow: {
        nodes: FlowNode[];
        edges: Edge[];
    }) => {
        setValue('custom.chatFlow', chatFlow);
    }
    return (
        <div className='flex flex-col gap-3 p-3'>
            <FormLabel
                className="mb-1 inline-block text-neutral-900 text-[1rem] font-semibold"
            >
                Starting message
            </FormLabel>
            <Tabs onValueChange={setTab} value={tab}>
                <TabsList className='border-none bg-neutral-50 px-2 py-1 gap-1 rounded-[8px]'>
                    <TabsTrigger
                        onClick={() => onTabSelect('default')}
                        value='default' variant='button'>Plain text</TabsTrigger>
                    <TabsTrigger
                        onClick={() => onTabSelect('custom')}
                        value='custom' variant='button'>Script</TabsTrigger>
                </TabsList>
                <TabsContent value='default'>
                    <CustomFirstMessageOptions
                        firstMessage={watch('custom.firstMessage')}
                        onFirstMessageChange={(message) => {
                            setValue('custom.firstMessage', message);
                        }}
                    />
                </TabsContent>
                <TabsContent value='custom' className='w-full h-fit'>
                    <NestedFlow onSaveToForm={onSaveChatFlow} savedFlow={
                        scriptChatFlow
                    } />
                </TabsContent>
            </Tabs>

        </div>
    )
}

export default StartingMessageStep