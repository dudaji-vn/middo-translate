'use client';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from '@/components/feedback';

import { PageLoading } from '@/components/loading/page-loading';
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
import { PASSWORD_PARTTERN } from '@/configs/regex-pattern';

export default function UpdateUserPassword() {
  const [errorMessage, setErrorMessage] = useState('');
  const [open, setOpen] = useState(false);
  const {t} = useTranslation("common");
  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(z
      .object({
        currentPassword: z.string().min(1, {
          message: t('MESSAGE.ERRORS.REQUIRED'),
        }),
        newPassword: z
          .string()
          .min(8, {
            message: t('MESSAGE.ERRORS.MIN_LENGTH', {num: 8, field: t('COMMON.PASSWORD')}),
          })
          .regex(PASSWORD_PARTTERN, {
            message:t('MESSAGE.ERRORS.PASSWORD_PATTERN'),
          }),
    
        confirmPassword: z.string().min(1, {
          message: t('MESSAGE.ERRORS.REQUIRED'),
        }),
      })
      .refine((data) => data.newPassword === data.confirmPassword, {
        message: t('MESSAGE.ERRORS.PASSWORD_NOT_MATCH'),
        path: ['confirmPassword'],
      })
      .refine((data) => data.newPassword !== data.currentPassword, {
        message: t('MESSAGE.ERRORS.PASSWORD_THE_SAME'),
        path: ['newPassword'],
      })),
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
      toast.success('Your password has been changed!');
      setOpen(false);
      setErrorMessage('');
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message);
    } finally {
      reset();
    }
  };

  return (
    <>
      {isSubmitting && <PageLoading />}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger className="w-full">
          <span className="-mx-[5vw] block cursor-pointer border-b border-b-[#F2F2F2] p-4 text-center font-medium transition-all hover:bg-slate-100 md:-mx-6">
            {t('ACCOUNT_SETTING.CHANGE_PASSWORD')}
          </span>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <h3 className="text-[24px]">{t('ACCOUNT_SETTING.CHANGE_PASSWORD')}</h3>
              <RHFInputField
                name="currentPassword"
                formLabel={t('COMMON.CURRENT_PASSWORD')}
                inputProps={{
                  type: 'password',
                  placeholder: t('COMMON.CURRENT_PASSWORD_PLACEHOLDER')
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
                <AlertDialogCancel className="mr-2 border-0 bg-transparent hover:!border-0 hover:!bg-transparent">
                  <p>{t('COMMON.CANCEL')}</p>
                </AlertDialogCancel>
                <button
                  disabled={isSubmitting}
                  className="rounded-full border border-transparent bg-primary px-8 py-4 font-semibold text-background active:!border-transparent active:!bg-shading active:!text-background disabled:bg-stone-300 disabled:hover:opacity-100 md:max-w-[320px] md:hover:opacity-80"
                  type="submit"
                >
                  {t('COMMON.SAVE')}
                </button>
              </div>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
