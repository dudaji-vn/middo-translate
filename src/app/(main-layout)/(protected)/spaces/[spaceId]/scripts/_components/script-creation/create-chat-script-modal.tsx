'use client';

import { Button } from '@/components/actions';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
} from '@/components/feedback';
import React, { useEffect, useMemo } from 'react';
import DesignScriptChatFlow from '../../../settings/_components/extension-creation/steps/script-chat-flow/design-script-chat-flow';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import RHFInputField from '@/components/form/RHF/RHFInputFields/RHFInputField';
import { useParams } from 'next/navigation';
import {
  createChatScriptSchema,
  initialChatFlowNodes,
  initialEdges,
} from './schema';
import { FLOW_KEYS } from '../../../settings/_components/extension-creation/steps/script-chat-flow/custom-nodes/node-types';
import { useCreateOrEditScript } from '@/features/conversation-scripts/hooks/use-create-or-edit-script';
import { TChatScript } from '@/types/scripts.type';

export type TScriptFormValues = z.infer<typeof createChatScriptSchema>;

const CreateOrEditChatScriptModal = ({
  open,
  onClose,
  currentScript,
}: {
  open: boolean;
  onClose: () => void;
  currentScript?: TChatScript;
}) => {
  const spaceId = useParams()?.spaceId as string;
  const { mutateAsync, isLoading, isSuccess } = useCreateOrEditScript();
  const [isEditing, scriptId] = useMemo(() => {
    return [Boolean(currentScript), currentScript?._id];
  }, [currentScript]);

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
    formState: { isValid, isSubmitting },
  } = form;

  useEffect(() => {
    if (open && currentScript) {
      console.log('currentScript', currentScript);
      setValue('name', currentScript.name);
      setValue(
        'chatFlow.edges',
        currentScript.chatFlow.edges as TScriptFormValues['chatFlow']['edges'],
      );
      setValue(
        'chatFlow.nodes',
        currentScript.chatFlow.nodes as TScriptFormValues['chatFlow']['nodes'],
      );
      return;
    }
    if (!open) {
      resetFormData();
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
      ...(isEditing && { scriptId }),
      name: name,
      chatFlow: {
        nodes: chatFlow.nodes,
        edges: chatFlow.edges,
      },
      spaceId,
    };
    await mutateAsync(payload).then(() => {
      isSuccess && onClose();
    });
  };

  return (
    <>
      <AlertDialog open={open} onOpenChange={(o) => !o && onClose()}>
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
                loading={isLoading || isSubmitting}
                type="submit"
                onClick={() => handleSubmit(submit)()}
              >
                Save
              </Button>
              <AlertDialogCancel className="flex-none p-0">
                <Button
                  shape={'square'}
                  variant={'ghost'}
                  size={'md'}
                  disabled={isSubmitting}
                >
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
