'use client';

import { Form } from '@/components/ui/form';
import { createExtensionSchema } from '@/configs/yup-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { createExtensionService } from '@/services/extension.service';
import toast from 'react-hot-toast';
import isEmpty from 'lodash/isEmpty';
import useClient from '@/hooks/use-client';
import { useAuthStore } from '@/stores/auth.store';
import { TBusinessExtensionData } from '@/features/chat/help-desk/api/business.service';
import { DEFAULT_FIRST_MESSAGE, DEFAULT_THEME } from './sections/options';
import { Tabs } from '@/components/navigation';
import CreateExtensionHeader from './sections/create-extension-header';
import StepWrapper from './steps/step-wrapper';
import StartingMessageStep from './steps/starting-message-step';
import CustomChatThemeStep from './steps/custom-chat-theme-step';
import AddingDomainsStep from './steps/adding-domains-step';
import { CHAT_FLOW_KEY } from '@/configs/store-key';
import { isEqual } from 'lodash';
import { initialChatFlowNodes } from './steps/script-chat-flow/nested-flow';


type TFormValues = {
  addingDomain: string;
  domains: Array<string>;
  custom: {
    language: string;
    firstMessage: string;
    firstMessageEnglish: string;
    color: string;
    chatFlow: {
      nodes: any[];
      edges: any[];
    };
  };

}




export default function CreateExtension({ open, initialData, title = 'Create Extension' }: {
  open: boolean;
  initialData?: TBusinessExtensionData;
  title?: string;
}) {
  const isClient = useClient()
  const [tabValue, setTabValue] = React.useState<number>(0);
  const pathname = usePathname() || '';
  const currentUser = useAuthStore((s) => s.user);
  const router = useRouter();

  const form = useForm<TFormValues>({
    mode: 'onChange',
    defaultValues: {
      addingDomain: '',
      domains: [],
      custom: {
        language: currentUser?.language,
        firstMessage: DEFAULT_FIRST_MESSAGE.content,
        firstMessageEnglish: DEFAULT_FIRST_MESSAGE.contentEnglish,
        color: DEFAULT_THEME,
        chatFlow: {
          nodes: [],
          edges: [],
        }
      },
    },
    resolver: zodResolver(createExtensionSchema),
  });

  const {
    watch,
    handleSubmit,
    trigger,
    reset,
    setValue,
    formState: { errors, isValid, isSubmitting, },
  } = form;

  useEffect(() => {
    console.log('initialData', initialData)
    if (open) {
      setTabValue(0);
    }
    if (!open) {
      reset();
      return;
    }
    if (!isEmpty(initialData)) {
      setValue('domains', initialData.domains);
      setValue('custom', {
        language: initialData.language,
        firstMessage: initialData.firstMessage,
        firstMessageEnglish: initialData.firstMessageEnglish,
        color: initialData.color || DEFAULT_THEME,
        chatFlow: {
          nodes: initialData?.chatFlow?.nodes || [],
          edges: initialData?.chatFlow?.edges || [],
        },
      });
      if (initialData?.chatFlow?.nodes?.length && !isEqual(initialData?.chatFlow?.nodes, initialChatFlowNodes)) {
        localStorage.setItem(CHAT_FLOW_KEY, JSON.stringify(initialData.chatFlow));
      }
      else if (!initialData?.chatFlow) {
        localStorage.removeItem(CHAT_FLOW_KEY);
      }
    }
  }, [initialData, open]);

  const submit = async (values: TFormValues) => {
    trigger();

    try {
      const payload = {
        domains: values.domains,
        ...values.custom,
        chatFlow: watch('custom.chatFlow'),
      };
      await createExtensionService(payload).then((res) => {
        router.push(pathname);
        toast.success('Create extension success!');
      }).catch((err) => {
        toast.error(err?.response?.data?.message || 'Create extension failed!');
      })
      router.refresh();
    } catch (err: any) {
      toast.error(err?.response?.data?.message);
    }
  };

  if (!isClient || !open) return null;
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(submit)}>
        <Tabs value={tabValue?.toString()} className="w-full bg-primary-100"
          defaultValue={tabValue.toString()}
          onValueChange={(value) => {
            setTabValue(parseInt(value));
          }}>
          <CreateExtensionHeader step={tabValue} onStepChange={setTabValue} />
          <StepWrapper value="0" >
            <AddingDomainsStep />
          </StepWrapper>
          <StepWrapper value="1" >
            <StartingMessageStep />
          </StepWrapper>
          <StepWrapper value="2">
            <CustomChatThemeStep />
          </StepWrapper>

        </Tabs>
      </form>
    </Form>

  );
}
