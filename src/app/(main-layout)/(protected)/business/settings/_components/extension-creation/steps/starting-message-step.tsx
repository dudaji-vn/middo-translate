'use client';

import { FormLabel } from '@/components/ui/form';
import React, { useEffect } from 'react'
import CustomFirstMessageOptions from '../sections/custom-first-message-options';
import { useFormContext } from 'react-hook-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/navigation';
import NestedFlow, { FlowNode } from './script-chat-flow/nested-flow';
import { Edge } from 'reactflow';

const StartingMessageStep = () => {
    const { watch, setValue } = useFormContext();
    const [temporalChatFlow, setTemporalChatFlow] = React.useState(watch('custom.chatFlow'));
    const scriptChatFlow = watch('custom.chatFlow');

    const [tab, setTab] = React.useState<string>(scriptChatFlow ? 'custom' : 'default');


    const onTabSelect = (tab: string) => {
        if (tab === 'default') {
            setTemporalChatFlow(scriptChatFlow);
            setValue('custom.chatFlow', null);
        } else if (tab === 'custom') {
            setValue('custom.chatFlow', temporalChatFlow);
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
                    {tab === 'custom' && <NestedFlow
                        onSaveToForm={onSaveChatFlow}
                        savedFlow={scriptChatFlow || temporalChatFlow}
                    />}
                </TabsContent>
            </Tabs>

        </div>
    )
}

export default StartingMessageStep