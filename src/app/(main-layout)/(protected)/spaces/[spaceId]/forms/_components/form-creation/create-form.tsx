'use client';

import React, { useMemo } from 'react';
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
import { Button } from '@/components/actions';
import StepWrapper from './step-wrapper';
import { cn } from '@/utils/cn';
import { ArrowLeft, Eye } from 'lucide-react';
import { Typography } from '@/components/data-display';

export type TFormFormValues = z.infer<typeof createBusinessFormSchema>;

const Header = () => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const onPreviewClick = () => {
    // TODO: Implement preview
  };
  return (
    <section
      className={cn(
        ' flex w-full flex-row items-center justify-between gap-3   px-4 py-2 ',
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <Button.Icon
          onClick={() => {
            router.back();
          }}
          variant={'ghost'}
          size={'xs'}
          color={'default'}
          className="text-neutral-600"
        >
          <ArrowLeft className="" />
        </Button.Icon>
        <Typography className="min-w-max capitalize text-neutral-600 dark:text-neutral-50 max-sm:min-w-32">
          {t('EXTENSION.FORM.ADD_FORM')}
        </Typography>
      </div>
      <div className="flex flex-row items-center gap-2">
        <Button
          onClick={onPreviewClick}
          shape={'square'}
          size={'xs'}
          type="button"
          color={'secondary'}
          startIcon={<Eye />}
        >
          {t('COMMON.PREVIEW')}
          &nbsp;
        </Button>
        <Button
          variant={'default'}
          size={'xs'}
          shape={'square'}
          color={'primary'}
          type="submit"
        >
          {t('EXTENSION.FORM.ADD_FORM')}
        </Button>
      </div>
    </section>
  );
};

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
      name: currentForm?.name || '',
    },
    resolver: zodResolver(createBusinessFormSchema),
  });
  const {
    setValue,
    handleSubmit,
    trigger,
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
  return (
    <Tabs
      value={tabValue?.toString()}
      className="w-full  p-4"
      defaultValue={tabValue.toString()}
      onValueChange={(value) => {
        setTabValue(parseInt(value));
      }}
    >
      <Form {...form}>
        <Header />
        <TabsList className="mx-auto flex h-fit w-[400px] max-w-full flex-row  items-center justify-between gap-3 border-none max-md:gap-0 md:justify-start">
          {[1, 2, 3].map((_, i) => (
            <TabsTrigger
              key={i}
              value={i.toString()}
              variant="button"
              className="rounded-t-lg bg-primary-100"
            >
              {tabLabels[i]}
            </TabsTrigger>
          ))}
        </TabsList>
        <StepWrapper value="0" className="px-0" title="Untitled Form">
          updating ...
          {/* TODO: implement this form */}
        </StepWrapper>
        <StepWrapper title="Thank You Page" className="px-0" value="1">
          updating ...
          {/* TODO: implement  this form */}
        </StepWrapper>
        <StepWrapper title="Customize" className="px-0" value="2">
          updating ...
          {/* TODO : implement this form */}
        </StepWrapper>
      </Form>
    </Tabs>
  );
};

export default CreateOrEditBusinessForm;
