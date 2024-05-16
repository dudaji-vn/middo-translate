'use client';

import { Button } from '@/components/actions';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
} from '@/components/feedback';
import { Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import DesignScriptChatFlow from '../../../../settings/_components/extension-creation/steps/script-chat-flow/design-script-chat-flow';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import RHFInputField from '@/components/form/RHF/RHFInputFields/RHFInputField';
import { createOrEditChatScript } from '@/services/scripts.service';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import {
  createChatScriptSchema,
  initialChatFlowNodes,
  initialEdges,
} from './schema';
import { FLOW_KEYS } from '../../../../settings/_components/extension-creation/steps/script-chat-flow/custom-nodes/node-types';

export type TScriptFormValues = z.infer<typeof createChatScriptSchema>;

const CreateOrEditChatScriptModal = ({
  currentScript,
}: {
  currentScript?: TScriptFormValues;
}) => {
  const [open, setOpen] = useState(false);
  const spaceId = useParams()?.spaceId as string;
  const router = useRouter();
  const form = useForm<TScriptFormValues>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      chatFlow: {
        nodes: initialChatFlowNodes,
        edges: initialEdges as TScriptFormValues['chatFlow']['edges'],
        mappedFlowErrors: [],
      },
    },
    resolver: zodResolver(createChatScriptSchema),
  });
  const resetFormData = () => {
    form.reset({
      name: '',
      chatFlow: {
        nodes: initialChatFlowNodes,
        edges: initialEdges as TScriptFormValues['chatFlow']['edges'],
        mappedFlowErrors: [],
      },
    });
  };
  const {
    setValue,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, isDirty, isValid, isSubmitting },
  } = form;
  const onOpenChange = () => {
    if (!open) {
      resetFormData();
    }
    setOpen(!open);
  };

  useEffect(() => {
    if (open && currentScript) {
      setValue('name', currentScript.name);
      setValue('chatFlow', currentScript.chatFlow);
    }
  }, [open, currentScript]);

  const submit = async ({
    name,
    chatFlow,
  }: {
    name: string;
    chatFlow: any;
  }) => {
    trigger(FLOW_KEYS.CHAT_FLOW);
    const payload = {
      name: name,
      chatFlow: {
        nodes: chatFlow.nodes,
        edges: chatFlow.edges,
      },
      spaceId,
    };
    try {
      const res = await createOrEditChatScript(payload);
      if (res?.data) {
        toast.success('Chat script created successfully');
      }
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error('Error on creating chat script');
      console.error('Error on creating chat script: ', error);
    }
  };

  return (
    <>
      <Button
        className="min-w-fit"
        shape={'square'}
        size="md"
        startIcon={<Plus />}
        onClick={onOpenChange}
      >
        Add&nbsp;
        <span className="max-md:hidden">New Script</span>
      </Button>
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <Form {...form}>
          <AlertDialogContent className="max-w-screen z-[100] flex h-[calc(100vh-2rem)] !w-[calc(100vw-2rem)] flex-col justify-stretch gap-1">
            <AlertDialogHeader className="flex h-fit w-full flex-row items-start justify-between gap-3 text-base">
              <RHFInputField
                name="name"
                formItemProps={{
                  className: 'w-full',
                }}
                inputProps={{
                  placeholder: 'Enter script name',
                  required: true,
                }}
              />
              <Button
                shape={'square'}
                color={isValid ? 'primary' : 'secondary'}
                size={'md'}
                loading={isSubmitting}
                type="submit"
                onClick={() => handleSubmit(submit)()}
              >
                Save
              </Button>
              <AlertDialogCancel className="flex-none p-0">
                <Button shape={'square'} variant={'ghost'} size={'md'}>
                  Cancel
                </Button>
              </AlertDialogCancel>
            </AlertDialogHeader>
            <section className="flex-grow pb-8">
              <DesignScriptChatFlow />
            </section>
          </AlertDialogContent>
        </Form>
      </AlertDialog>
    </>
  );
};

export default CreateOrEditChatScriptModal;
