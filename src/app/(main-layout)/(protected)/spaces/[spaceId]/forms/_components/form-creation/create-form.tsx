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
      formFields: [],
    },
    resolver: zodResolver(createBusinessFormSchema),
  });
  const {
    watch,
    formState: { isValid, isSubmitting, errors },
  } = form;

  const submit = async ({ name }: { name: string }) => {
    const payload = {
      spaceId,
      formId: currentForm?._id,
      name,
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
    <Tabs
      value={tabValue?.toString()}
      className="h-full w-full p-4"
      defaultValue={tabValue.toString()}
      onValueChange={(value) => {
        setTabValue(parseInt(value));
      }}
    >
      <Form {...form}>
        <CreateFormHeader />
        <TabsList className="mx-auto flex h-fit w-[400px] max-w-full flex-row  items-center justify-between gap-3 border-none max-md:gap-0 md:justify-start">
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
            'flex flex-col  p-10',
            'mx-auto h-fit  min-h-[400px] w-[90%] rounded-2xl border-none bg-white shadow-[2px_4px_16px_2px_rgba(22,22,22,0.1)] dark:bg-[#030303]',
          )}
        >
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
          <StepWrapper value="0">
            <ArrayFields />
          </StepWrapper>
          <StepWrapper value="1">
            updating ...
            {/* TODO: implement  this form */}
          </StepWrapper>
          <StepWrapper value="2">
            updating ...
            {/* TODO : implement this form */}
          </StepWrapper>
        </section>
      </Form>
    </Tabs>
  );
};

export default CreateOrEditBusinessForm;
