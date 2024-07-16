'use client';

import { Button } from '@/components/actions';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
} from '@/components/feedback';
import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import RHFInputField from '@/components/form/RHF/RHFInputFields/RHFInputField';
import { useParams } from 'next/navigation';

import { Typography } from '@/components/data-display';
import { useTranslation } from 'react-i18next';
import { createBusinessFormSchema } from './schema';
import { useCreateOrEditForm } from '@/features/conversation-forms/hooks/use-create-or-edit-form';
import { BusinessForm } from '@/types/forms.type';

export type TFormFormValues = z.infer<typeof createBusinessFormSchema>;

const CreateOrEditBusinessFormModal = ({
  open,
  onClose,
  currentForm,
  viewOnly,
}: {
  open: boolean;
  onClose: () => void;
  currentForm?: BusinessForm;
  viewOnly?: boolean;
}) => {
  const spaceId = useParams()?.spaceId as string;
  const { t } = useTranslation('common');
  const { mutateAsync, isLoading, isSuccess } = useCreateOrEditForm();

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
      onClose();
    } catch (error) {
      console.error('Error while creating script', error);
    }
  };
  return (
    <>
      <AlertDialog open={open} onOpenChange={(o) => !o && onClose()}>
        <Form {...form}>
          <AlertDialogContent className="max-w-screen z-[100] flex h-[calc(100vh-2rem)] !w-[calc(100vw-2rem)] flex-col justify-stretch gap-1">
            <AlertDialogHeader className="flex h-fit w-full flex-row items-start justify-between gap-3 text-base">
              {viewOnly ? (
                <Typography className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                  {currentForm?.name}
                </Typography>
              ) : (
                <RHFInputField
                  name="name"
                  formItemProps={{
                    className: 'w-full',
                  }}
                  inputProps={{
                    placeholder: 'Enter form name',
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
            <section className="flex-grow pb-8">updating ...</section>
          </AlertDialogContent>
        </Form>
      </AlertDialog>
    </>
  );
};

export default CreateOrEditBusinessFormModal;
