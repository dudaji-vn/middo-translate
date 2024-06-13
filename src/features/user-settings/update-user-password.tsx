'use client';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from '@/components/feedback';

import { PageLoading } from '@/components/feedback';
import { changePasswordUserService } from '@/services/user.service';
import toast from 'react-hot-toast';
import { use, useEffect, useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import RHFInputField from '@/components/form/RHF/RHFInputFields/RHFInputField';
import { AlertError } from '@/components/alert/alert-error';
import { changePasswordSchema } from '@/configs/yup-form';
import { useTranslation } from 'react-i18next';
import { PASSWORD_PATTERN } from '@/configs/regex-pattern';
import { Button } from '@/components/actions';
import { KeyRound } from 'lucide-react';

export default function UpdateUserPassword() {
  const [errorMessage, setErrorMessage] = useState('');
  const [open, setOpen] = useState(false);
  const { t } = useTranslation('common');
  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(
      z
        .object({
          currentPassword: z.string().min(1, {
            message: t('MESSAGE.ERROR.REQUIRED'),
          }),
          newPassword: z
            .string()
            .min(8, {
              message: t('MESSAGE.ERROR.MIN_LENGTH', {
                num: 8,
                field: t('COMMON.PASSWORD'),
              }),
            })
            .regex(PASSWORD_PATTERN, {
              message: t('MESSAGE.ERROR.PASSWORD_PATTERN'),
            }),

          confirmPassword: z.string().min(1, {
            message: t('MESSAGE.ERROR.REQUIRED'),
          }),
        })
        .refine((data) => data.newPassword === data.confirmPassword, {
          message: t('MESSAGE.ERROR.PASSWORD_NOT_MATCH'),
          path: ['confirmPassword'],
        })
        .refine((data) => data.newPassword !== data.currentPassword, {
          message: t('MESSAGE.ERROR.PASSWORD_THE_SAME'),
          path: ['newPassword'],
        }),
    ),
    mode: 'onBlur',
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });
  const {
    trigger,
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting },
  } = form;
  const { currentPassword, newPassword } = watch();

  useEffect(() => {
    if (currentPassword && newPassword && newPassword?.length >= 0) {
      trigger('newPassword');
    }
  }, [currentPassword, newPassword, trigger]);

  const onSubmit = async (values: z.infer<typeof changePasswordSchema>) => {
    const { confirmPassword, ...payload } = values;
    try {
      await changePasswordUserService(payload);
      toast.success(t('MESSAGE.SUCCESS.PASSWORD_CHANGED'));
      setOpen(false);
      setErrorMessage('');
    } catch (err: any) {
      setErrorMessage(t(err?.response?.data?.message || 'BACKEND.MESSAGE.SOMETHING_WRONG'));
    } finally {
      reset();
    }
  };

  return (
    <>
      {isSubmitting && <PageLoading />}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger className="flex w-full items-center border-b bg-white dark:bg-neutral-900 dark:border-b-neutral-800 px-5 py-4 md:hover:bg-primary-100  dark:md:hover:bg-primary-800">
          <div className="relative flex !h-10 !w-10 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900 text-primary">
            <KeyRound size={20} />
          </div>
          <span className="ml-4 block text-center text-base font-medium">
            {t('ACCOUNT_SETTING.CHANGE_PASSWORD')}
          </span>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <h3 className="text-[24px]">
                {t('ACCOUNT_SETTING.CHANGE_PASSWORD')}
              </h3>
              <RHFInputField
                name="currentPassword"
                formLabel={t('COMMON.CURRENT_PASSWORD')}
                inputProps={{
                  type: 'password',
                  placeholder: t('COMMON.CURRENT_PASSWORD_PLACEHOLDER'),
                }}
              />
              <RHFInputField
                name="newPassword"
                formLabel={t('COMMON.NEW_PASSWORD')}
                inputProps={{
                  type: 'password',
                  placeholder: t('COMMON.NEW_PASSWORD_PLACEHOLDER'),
                }}
              />
              <RHFInputField
                name="confirmPassword"
                formLabel={t('COMMON.CONFIRM_PASSWORD')}
                inputProps={{
                  type: 'password',
                  placeholder: t('COMMON.CONFIRM_PASSWORD_PLACEHOLDER'),
                }}
              />
              <AlertError errorMessage={errorMessage} />
              <div className="mt-6 flex items-center justify-end">
                <AlertDialogCancel
                  onClick={() => {
                    reset();
                  }}
                  className="mr-5 border-0"
                >
                  <p>{t('COMMON.CANCEL')}</p>
                </AlertDialogCancel>
                <Button
                  size="md"
                  shape="square"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {t('COMMON.SAVE')}
                </Button>
              </div>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
