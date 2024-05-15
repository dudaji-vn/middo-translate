'use client';

import { Button } from '@/components/actions';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from '@/components/feedback';
import { cn } from '@/utils/cn';
import { Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
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
type TFormValues = z.infer<typeof createChatScriptSchema>;

const CreateChatScriptModal = () => {
  const [open, setOpen] = useState(false);
  const onOpenChange = () => setOpen(!open);
  const form = useForm<TFormValues>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      chatFlow: {
        nodes: initialChatFlowNodes,
        edges: initialEdges as TFormValues['chatFlow']['edges'],
        flowErrors: [],
      },
    },
    resolver: zodResolver(createChatScriptSchema),
  });
  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isValid },
  } = form;
  const scriptChatFlow = watch('chatFlow');

  // const onSaveChatFlow = (chatFlow: { nodes: FlowNode[]; edges: Edge[] }) => {
  //   setValue('chatFlow', chatFlow);
  // };

  const submit = (values: TFormValues) => {
    console.log('CREATE SCRIPT', values);
  };
  console.log('errors', errors, isValid, scriptChatFlow);
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
          <form onSubmit={handleSubmit(submit)}>
            <AlertDialogContent className="max-w-screen z-[100] flex h-[calc(100vh-2rem)] !w-[calc(100vw-2rem)] flex-col justify-stretch gap-1">
              <AlertDialogHeader className="flex w-full flex-row items-center justify-between gap-3 text-base">
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
                  disabled={!isEmpty(errors)}
                  type="submit"
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
          </form>
        </Form>
      </AlertDialog>
    </>
  );
};

export default CreateChatScriptModal;
