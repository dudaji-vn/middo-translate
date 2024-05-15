'use client';

import { Button } from '@/components/actions';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
} from '@/components/feedback';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import DesignScriptChatFlow, {
  FlowNode,
} from '../../../../settings/_components/extension-creation/steps/script-chat-flow/design-script-chat-flow';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edge } from 'reactflow';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import RHFInputField from '@/components/form/RHF/RHFInputFields/RHFInputField';
import { isEmpty } from 'lodash';
import { createOrEditChatScript } from '@/services/scripts.service';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';

export const initialChatFlowNodes: FlowNode[] = [
  {
    id: '1',
    data: { label: 'Start conversation', content: 'start conversation' },
    position: { x: 0, y: 0 },
    className: 'light',
    type: 'root',
  },
  {
    id: '2',
    data: {
      label: 'option',
      content: 'Option',
    },
    type: 'option',
    position: { x: 200, y: 6 },
    className: 'light',
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    animated: true,
    label: 'Start conversation',
  },
];
const createChatScriptSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  chatFlow: z.object({
    nodes: z
      .array(
        z.object({
          id: z.string(),
          type: z.string(),
          data: z
            .object({
              label: z.string().optional(),
              content: z.string().min(1, {
                message: 'Please enter content!',
              }),
              link: z.string().optional(),
              media: z.array(z.any()).optional(),
            })
            .refine(
              (data) => {
                if (data.link && !data.link.trim().length) {
                  return false;
                }
                return true;
              },
              {
                message: 'Link should not be empty',
              },
            ),
          position: z.object({
            x: z.number(),
            y: z.number(),
          }),
        }),
      )
      .min(2, 'Chat flow is required'),
    edges: z
      .array(
        z.object({
          id: z.string(),
          source: z.string(),
          target: z.string(),
          label: z.string(),
          animated: z.boolean().optional(),
        }),
      )
      .min(1, 'Chat flow is required'),
    flowErrors: z
      .array(z.object({ id: z.string(), message: z.string() }))
      .optional(),
  }),
});
export type TScriptFormValues = z.infer<typeof createChatScriptSchema>;

const CreateChatScriptModal = () => {
  const [open, setOpen] = useState(false);
  const spaceId = useParams()?.spaceId as string;
  const form = useForm<TScriptFormValues>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      chatFlow: {
        nodes: initialChatFlowNodes,
        edges: initialEdges as TScriptFormValues['chatFlow']['edges'],
        flowErrors: [],
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
        flowErrors: [],
      },
    });
  };
  const onOpenChange = () => {
    if (!open) {
      resetFormData();
    }
    setOpen(!open);
  };

  const {
    handleSubmit,
    trigger,
    formState: { errors, isDirty },
  } = form;

  const submit = async ({
    name,
    chatFlow,
  }: {
    name: string;
    chatFlow: any;
  }) => {
    const payload = {
      name: name,
      chatFlow: {
        nodes: chatFlow.nodes,
        edges: chatFlow.edges,
      },
      spaceId,
    };
    try {
      await createOrEditChatScript(payload);
      setOpen(false);
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
                size={'md'}
                disabled={!isEmpty(errors) || !isDirty}
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
            <section className="flex-grow">
              <p className="text-error-500">
                {errors.chatFlow?.nodes?.message}
              </p>
              <DesignScriptChatFlow />
            </section>
          </AlertDialogContent>
        </Form>
      </AlertDialog>
    </>
  );
};

export default CreateChatScriptModal;
