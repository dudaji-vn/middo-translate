'use client';

import React from 'react';
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

export type TFormFormValues = z.infer<typeof createBusinessFormSchema>;

const tabLabels = ['Form', 'Thank You', 'Customize'];
const CreateOrEditBusinessForm = ({
  open,
  currentForm,
  viewOnly,
}: {
  open: boolean;
  currentForm?: BusinessForm;
  viewOnly?: boolean;
}) => {
  const spaceId = useParams()?.spaceId as string;
  const { t } = useTranslation('common');
  const { mutateAsync, isLoading, isSuccess } = useCreateOrEditForm();
  const [tabValue, setTabValue] = React.useState<number>(0);
  const router = useRouter();

  const form = useForm<TFormFormValues>({
    mode: 'onChange',
    defaultValues: {
      name: currentForm?.name || 'Untitled Form',
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
    console.log('data', data);
    const payload = {
      ...data,
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

        <TabsList className="mx-auto flex max-h-full w-[400px] max-w-full flex-row  items-center justify-between gap-3 border-none max-md:gap-0 md:justify-start">
          {[1, 2, 3].map((_, i) => (
            <TabsTrigger
              key={i}
              value={i.toString()}
              variant="button"
              className="rounded-t-lg bg-white"
            >
              {tabLabels[i]}
            </TabsTrigger>
          ))}
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
