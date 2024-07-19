'use client';

import React, { cloneElement } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { useParams, useRouter } from 'next/navigation';

import { useTranslation } from 'react-i18next';
import { createBusinessFormSchema } from './schema';
import { useCreateOrEditForm } from '@/features/conversation-forms/hooks/use-create-or-edit-form';
import { BusinessForm } from '@/types/forms.type';
import { Tabs, TabsList, TabsTrigger } from '@/components/navigation';
import StepWrapper from './step-wrapper';
import { cn } from '@/utils/cn';
import RHFInputField from '@/components/form/RHF/RHFInputFields/RHFInputField';
import { CreateFormHeader } from './create-form-header';
import ArrayFields from './array-fields';
import ThankYouForm from './thank-you-form';
import { title } from 'process';
import CustomizeForm from './customize-form';
import { DEFAULT_THEME } from '../../../settings/_components/extension-creation/sections/options';
import { Check, FileText, Paintbrush, Paintbrush2 } from 'lucide-react';
import { useAppStore } from '@/stores/app.store';
import { useBusinessNavigationData } from '@/hooks';

export type TFormFormValues = z.infer<typeof createBusinessFormSchema>;

const tabLabels = ['Form', 'Thank You', 'Customize'];
const tabIcons = {
  0: <FileText />,
  1: <Check />,
  2: <Paintbrush2 />,
};
const CreateOrEditBusinessForm = ({
  open,
  currentForm,
  viewOnly,
}: {
  open: boolean;
  currentForm?: BusinessForm;
  viewOnly?: boolean;
}) => {
  const { spaceId } = useBusinessNavigationData();
  const { t } = useTranslation('common');
  const isMobile = useAppStore((state) => state.isMobile);
  const { mutateAsync, isLoading, isSuccess } = useCreateOrEditForm();
  const [tabValue, setTabValue] = React.useState<number>(0);
  const router = useRouter();

  const DEFAULT_FORM_BG = '/forms/bg-form-1.svg';
  const form = useForm<TFormFormValues>({
    mode: 'onChange',
    defaultValues: {
      name: currentForm?.name || 'Untitled Form',
      customize: {
        layout: 'single',
        background: DEFAULT_FORM_BG,
        theme: DEFAULT_THEME,
      },
      thankyou: {
        title: 'Thank you',
        subtitle: 'for submitting our form',
        image: '',
      },
      formFields: [],
    },
    resolver: zodResolver(createBusinessFormSchema),
  });
  const {
    watch,
    handleSubmit,
    formState: { isValid, isSubmitting, errors },
  } = form;

  const submit = async (data: any) => {
    console.log('data submit:>>', data);
    const payload = {
      ...data,
      spaceId,
    };
    try {
      await mutateAsync(payload);
      router.push(`/spaces/${spaceId}/forms`);
    } catch (error) {
      console.error('Error while creating form', error);
    }
  };
  const fields = watch('formFields');
  return (
    <Form {...form}>
      <Tabs
        value={tabValue?.toString()}
        className="flex w-full flex-1 flex-col overflow-hidden bg-blue-100 p-4 pb-20 md:px-[5vw]"
        defaultValue={tabValue.toString()}
        onValueChange={(value) => {
          setTabValue(parseInt(value));
        }}
      >
        <form id="form-create-form" onSubmit={handleSubmit(submit)}>
          <CreateFormHeader />
        </form>
        <TabsList className="mx-auto flex max-h-full w-[400px] max-w-full flex-row  items-center justify-center gap-3 border-none  md:justify-between ">
          {[0, 1, 2].map((i) => {
            const isSelected = tabValue === i;
            return (
              <TabsTrigger
                key={i}
                value={i.toString()}
                variant="button"
                className={cn('rounded-t-lg bg-white max-md:w-fit max-md:px-3')}
              >
                {isSelected
                  ? isMobile
                    ? cloneElement(tabIcons[i as keyof typeof tabIcons], {
                        size: 24,
                      })
                    : tabLabels[i]
                  : tabLabels[i]}
              </TabsTrigger>
            );
          })}
        </TabsList>
        <section
          className={cn(
            'flex flex-1 flex-col overflow-hidden p-5 md:p-10',
            'mx-auto w-full  rounded-2xl border-none bg-white shadow-[2px_4px_16px_2px_rgba(22,22,22,0.1)] dark:bg-[#030303]',
          )}
        >
          {tabValue === 0 && (
            <>
              <RHFInputField
                name="name"
                formItemProps={{
                  className: 'w-full',
                }}
                inputProps={{
                  placeholder: 'please enter a form name',
                  required: true,
                  className:
                    'text-left p-0 text-2xl outline-none border-none !bg-transparent font-semibold leading-7 text-neutral-800 dark:text-neutral-50',
                }}
              />
              <RHFInputField
                name="description"
                formItemProps={{
                  className: 'w-full',
                }}
                inputProps={{
                  placeholder: 'Form description (optional)',
                  className: 'outline-none p-0 border-none !bg-transparent',
                }}
              />
            </>
          )}
          <div className="flex w-full flex-1 flex-col overflow-y-auto">
            <StepWrapper value="0">
              <ArrayFields />
            </StepWrapper>
            <StepWrapper value="1">
              <ThankYouForm />
            </StepWrapper>
            <StepWrapper value="2">
              <CustomizeForm />
            </StepWrapper>
          </div>
        </section>
      </Tabs>
    </Form>
  );
};

export default CreateOrEditBusinessForm;
