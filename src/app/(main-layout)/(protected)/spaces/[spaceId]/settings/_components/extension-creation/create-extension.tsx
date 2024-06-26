'use client';

import { Form } from '@/components/ui/form';
import { createExtensionSchema } from '@/configs/yup-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { useParams, usePathname } from 'next/navigation';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { createExtension } from '@/services/extension.service';
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
import { translateWithDetection } from '@/services/languages.service';
import { getUserSpaceRole } from '../space-setting/role.util';
import {
  ESPaceRoles,
  SPACE_SETTING_TAB_ROLES,
} from '../space-setting/setting-items';
import { TSpace } from '../../../_components/business-spaces';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/actions';
import { TChatScript } from '@/types/scripts.type';
import { useTranslation } from 'react-i18next';
import { isEqual } from 'lodash';
import customToast from '@/utils/custom-toast';
import usePlatformNavigation from '@/hooks/use-platform-navigation';

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
  initialData?: TBusinessExtensionData & { currentScript?: TChatScript['_id'] };
  title?: string;
  space: TSpace;
  isEditing?: boolean;
}) {
  const isClient = useClient();
  const [tabValue, setTabValue] = React.useState<number>(0);
  const { t } = useTranslation('common');
  const pathname = usePathname() || '';
  const params = useParams();
  const currentUser = useAuthStore((s) => s.user);
  const [compareData, setCompareData] = React.useState<any>();
  const myRole = getUserSpaceRole(currentUser, space);

  const { navigateTo } = usePlatformNavigation();

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
      currentScript: undefined,
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
      setValue('custom.language', initialData.language);
      setValue('custom.color', initialData.color || DEFAULT_THEME);
      if (initialData.currentScript) {
        setValue('currentScript', initialData.currentScript);
        setValue('startingMessageType', 'script');
        setValue('custom.firstMessage', initialData.currentScript);
        setCompareData({
          step1: initialData.domains,
          step2: initialData.currentScript,
          step3: initialData.color || DEFAULT_THEME,
        });
        return;
      }
      if (initialData.firstMessage?.length) {
        setValue('custom.firstMessage', initialData.firstMessage);
        setValue(
          'startingMessageType',
          initialData.firstMessage === DEFAULT_FIRST_MESSAGE.content
            ? 'default'
            : 'custom',
        );
        setCompareData({
          step1: initialData.domains,
          step2: initialData.firstMessage,
          step3: initialData.color || DEFAULT_THEME,
        });
        return;
      }
    }
  }, [initialData, open]);

  const submit = async (values: TFormValues) => {
    trigger();

    const spaceId = params?.spaceId;
    if (!spaceId) {
      return;
    }
    try {
      let payload: any = {
        domains: values.domains,
        color: values.custom.color,
        language: values.custom.language,
      };
      if (values.startingMessageType === 'script') {
        payload = {
          ...payload,
          currentScript: values.currentScript,
        };
      } else {
        const translatedFirstMess = await translateWithDetection(
          values.custom.firstMessage,
          'en',
        );
        const firstMessageEnglish =
          typeof translatedFirstMess === 'string'
            ? translatedFirstMess
            : translatedFirstMess?.translatedText;
        payload = {
          ...payload,
          firstMessage: values.custom.firstMessage,
          firstMessageEnglish,
        };
      }

      await createExtension(String(params?.spaceId), payload)
        .then((res) => {
          customToast.success(
            `${isEditing ? 'Edit' : 'Create'} extension success!`,
          );
        })
        .catch((err) => {
          customToast.error(
            err?.response?.data?.message ||
              `${isEditing ? 'Edit' : 'Create'}  extension failed!`,
          );
        });
      // router.push(pathname + '?tab=extension');
      navigateTo(pathname, new URLSearchParams({ tab: 'extension' }));
    } catch (err: any) {
      customToast.error(err?.response?.data?.message);
    }
  };
  const extensionRoles = SPACE_SETTING_TAB_ROLES.find(
    (item) => item.name === 'extension',
  )?.roles;

  const hasNoPermissionToEdit = !extensionRoles?.edit.includes(
    myRole as ESPaceRoles,
  );

  if (!isClient || !open || hasNoPermissionToEdit) return null;
  const noScript =
    watch('startingMessageType') === 'script' &&
    isEmpty(watch('currentScript'));
  const nothingChanged = isEqual(
    {
      step1: watch('domains'),
      step2:
        watch('startingMessageType') === 'script'
          ? watch('currentScript')
          : watch('custom.firstMessage'),
      step3: watch('custom.color'),
    },
    compareData,
  );

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(submit)}>
        <Tabs
          value={tabValue?.toString()}
          className="w-full bg-primary-100 dark:bg-[#030303]"
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
              className: 'divide-y divide-neutral-50 dark:divide-neutral-900',
            }}
          >
            <AddingDomainsStep />
          </StepWrapper>
          <StepWrapper
            value="1"
            canNext={watch('custom.firstMessage')?.length > 0}
            canPrev={watch('custom.firstMessage')?.length > 0}
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
              disabled={!isValid || isSubmitting || noScript || nothingChanged}
              className={isEditing ? 'min-w-[240px]' : 'hidden'}
            >
              {t('COMMON.SAVE_CHANGE')}
            </Button>
          </div>
        </Tabs>
      </form>
    </Form>
  );
}
