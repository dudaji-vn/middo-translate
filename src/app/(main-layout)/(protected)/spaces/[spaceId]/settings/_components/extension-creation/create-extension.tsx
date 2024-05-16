'use client';

import { Form } from '@/components/ui/form';
import { createExtensionSchema } from '@/configs/yup-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { useParams, usePathname, useRouter } from 'next/navigation';
import React, { use, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { createExtension } from '@/services/extension.service';
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
import { isEqual } from 'lodash';
import { FlowNode } from './steps/script-chat-flow/design-script-chat-flow';
import { translateWithDetection } from '@/services/languages.service';
import { Edge } from 'reactflow';
import { getUserSpaceRole } from '../space-setting/role.util';
import {
  ESPaceRoles,
  SPACE_SETTING_TAB_ROLES,
} from '../space-setting/setting-items';
import { TSpace } from '../../../_components/business-spaces';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/actions';
import { TChatScript } from '@/types/scripts.type';

type TFormValues = {
  addingDomain: string;
  domains: Array<string>;
  startingMessageType?: string;
  custom: {
    language: string;
    firstMessage: string;
    firstMessageEnglish: string;
    color: string;
  };
  currentScript?: TChatScript['_id'];
};

export default function CreateExtension({
  open,
  initialData,
  title = 'Create Extension',
  space,
  isEditing = false,
}: {
  open: boolean;
  initialData?: TBusinessExtensionData;
  title?: string;
  space: TSpace;
  isEditing?: boolean;
}) {
  const isClient = useClient();
  const [tabValue, setTabValue] = React.useState<number>(0);
  const pathname = usePathname() || '';
  const params = useParams();
  const currentUser = useAuthStore((s) => s.user);
  const myRole = getUserSpaceRole(currentUser, space);
  const router = useRouter();

  const form = useForm<TFormValues>({
    mode: 'onChange',
    defaultValues: {
      addingDomain: '',
      domains: [],
      startingMessageType: 'default',
      custom: {
        language: currentUser?.language,
        firstMessage: DEFAULT_FIRST_MESSAGE.content,
        firstMessageEnglish: DEFAULT_FIRST_MESSAGE.contentEnglish,
        color: DEFAULT_THEME,
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
    formState: { isValid, isSubmitting },
  } = form;

  useEffect(() => {
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
        firstMessage: initialData.firstMessage || DEFAULT_FIRST_MESSAGE.content,
        firstMessageEnglish:
          initialData.firstMessageEnglish ||
          DEFAULT_FIRST_MESSAGE.contentEnglish ||
          '',
        color: initialData.color || DEFAULT_THEME,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData, open]);

  const submit = async (values: TFormValues) => {
    trigger();
    const translatedFirstMess = await translateWithDetection(
      values.custom.firstMessage,
      'en',
    );
    const firstMessageEnglish =
      typeof translatedFirstMess === 'string'
        ? translatedFirstMess
        : translatedFirstMess?.translatedText;

    const spaceId = params?.spaceId;
    if (!spaceId) {
      return;
    }
    try {
      const payload = {
        domains: values.domains,
        ...values.custom,
        firstMessageEnglish,
      };
      await createExtension(String(params?.spaceId), payload)
        .then((res) => {
          router.push(pathname + '?tab=extension');
          toast.success('Create extension success!');
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message || 'Create extension failed!',
          );
        });
      router.refresh();
    } catch (err: any) {
      toast.error(err?.response?.data?.message);
    }
  };
  const extensionRoles = SPACE_SETTING_TAB_ROLES.find(
    (item) => item.name === 'extension',
  )?.roles;


  const hasNoPermissionToEdit = !extensionRoles?.edit.includes(
    myRole as ESPaceRoles,
  );

  if (!isClient || !open || hasNoPermissionToEdit) return null;

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(submit)}>
        <Tabs
          value={tabValue?.toString()}
          className="w-full bg-primary-100"
          defaultValue={tabValue.toString()}
          onValueChange={(value) => {
            setTabValue(parseInt(value));
          }}
        >
          <CreateExtensionHeader
            step={tabValue}
            onStepChange={setTabValue}
            isEditing={isEditing}
          />
          <StepWrapper
            value="0"
            canNext={watch('domains').length > 0}
            onNextStep={() => setTabValue(1)}
            footerProps={{
              className: isEditing ? 'hidden' : '',
            }}
            nextProps={{
              endIcon: <ArrowRight />,
            }}
            cardProps={{
              className: 'divide-y divide-neutral-50',
            }}
          >
            <AddingDomainsStep />
          </StepWrapper>
          <StepWrapper
            value="1"
            canNext={watch('custom.firstMessage').length > 0}
            canPrev={watch('custom.firstMessage').length > 0}
            onNextStep={() => setTabValue(2)}
            onPrevStep={() => setTabValue(0)}
            nextProps={{
              endIcon: <ArrowRight />,
            }}
            cardProps={{
              className: 'max-h-fit',
            }}
            footerProps={{
              className: isEditing ? 'hidden' : '',
            }}
          >
            <StartingMessageStep />
          </StepWrapper>
          <StepWrapper
            value="2"
            canPrev={watch('custom.color').length > 0}
            onPrevStep={() => setTabValue(1)}
            canNext={isValid}
            onNextStep={() => {
              form.handleSubmit(submit)();
            }}
            isLoading={isSubmitting}
            onNextLabel={'Create extension'}
            nextProps={{
              endIcon: <></>,
            }}
            footerProps={{
              className: isEditing ? 'hidden' : '',
            }}
          >
            <CustomChatThemeStep space={space} />
          </StepWrapper>
          <div className="flex h-fit w-full flex-col items-center bg-transparent py-4">
            <Button
              color={'primary'}
              shape={'square'}
              size={'sm'}
              loading={isSubmitting}
              type="submit"
              disabled={!isValid || isSubmitting}
              className={isEditing ? 'min-w-[240px]' : 'hidden'}
            >
              Save Change
            </Button>
          </div>
        </Tabs>
      </form>
    </Form>
  );
}
