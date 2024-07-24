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
import { Typography } from '@/components/data-display';
import { useTranslation } from 'react-i18next';
import { useGetFormsNames } from '@/features/conversation-forms/hooks/use-get-forms-names';
import { useExtensionFormsStore } from '@/stores/forms.store';

export type TScriptFormValues = z.infer<typeof createChatScriptSchema>;

const initEdges = initialEdges;
const initNodes = initialChatFlowNodes;
const CreateOrEditChatScriptModal = ({
  open,
  onClose,
  currentScript,
  viewOnly,
}: {
  open: boolean;
  onClose: () => void;
  currentScript?: TChatScript;
  viewOnly?: boolean;
}) => {
  const spaceId = useParams()?.spaceId as string;
  const { t } = useTranslation('common');
  const { setFormsInfo } = useExtensionFormsStore();
  const { data: namesOfForms } = useGetFormsNames({
    spaceId,
  });
  const { mutateAsync, isLoading, isSuccess } = useCreateOrEditScript();
  const { isEditing, scriptId, currentEdges, currentNodes } = useMemo(() => {
    return {
      isEditing: Boolean(currentScript),
      scriptId: currentScript?._id,
      currentNodes: currentScript?.chatFlow
        .nodes as TScriptFormValues['chatFlow']['nodes'],
      currentEdges: currentScript?.chatFlow
        .edges as TScriptFormValues['chatFlow']['edges'],
    };
  }, [currentScript]);

  const form = useForm<TScriptFormValues>({
    mode: 'onChange',
    defaultValues: {
      name: currentScript?.name || '',
      chatFlow: {
        nodes:
          currentNodes || (initNodes as TScriptFormValues['chatFlow']['nodes']),
        edges:
          currentEdges || (initEdges as TScriptFormValues['chatFlow']['edges']),
        mappedFlowErrors: [],
      },
    },
    resolver: zodResolver(createChatScriptSchema),
  });
  const {
    setValue,
    handleSubmit,
    trigger,
    formState: { isValid, isSubmitting, errors },
  } = form;

  const submit = async ({
    name,
    chatFlow,
  }: {
    name: string;
    chatFlow: any;
  }) => {
    trigger(FLOW_KEYS.CHAT_FLOW);
    console.log('errors', isValid, errors);
    const payload = {
      ...(isEditing && { scriptId }),
      name: name,
      chatFlow: {
        nodes: chatFlow.nodes,
        edges: chatFlow.edges,
      },
      spaceId,
    };
    try {
      await mutateAsync(payload);
      onClose();
    } catch (error) {
      console.error('Error while creating script', error);
    }
  };
  useEffect(() => {
    if (namesOfForms) {
      setFormsInfo(namesOfForms);
    }
  }, [namesOfForms, setFormsInfo]);

  // console.log('rerender open', open);
  return (
    <>
      <AlertDialog open={open} onOpenChange={(o) => !o && onClose()}>
        <Form {...form}>
          <AlertDialogContent className="max-w-screen z-[100] flex h-[calc(100vh-2rem)] !w-[calc(100vw-2rem)] flex-col justify-stretch gap-1">
            <AlertDialogHeader className="flex h-fit w-full flex-row items-start justify-between gap-3 text-base">
              {viewOnly ? (
                <Typography className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                  {currentScript?.name}
                </Typography>
              ) : (
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
              )}
              <Button
                shape={'square'}
                color={isValid ? 'primary' : 'secondary'}
                size={'md'}
                loading={isLoading || isSubmitting}
                type="submit"
                onClick={() => handleSubmit(submit)()}
                className={viewOnly ? 'hidden' : 'w-32'}
              >
                {t('COMMON.SAVE')}
              </Button>
              <AlertDialogCancel className="flex-none p-0">
                <Button
                  shape={'square'}
                  variant={'ghost'}
                  size={'md'}
                  disabled={isSubmitting}
                >
                  {viewOnly ? t('COMMON.CLOSE') : t('COMMON.CANCEL')}
                </Button>
              </AlertDialogCancel>
            </AlertDialogHeader>
            <section className="flex-grow pb-8">
              <DesignScriptChatFlow viewOnly={viewOnly} />
            </section>
          </AlertDialogContent>
        </Form>
      </AlertDialog>
    </>
  );
};

export default CreateOrEditChatScriptModal;
