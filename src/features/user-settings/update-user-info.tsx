'use client';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from '@/components/feedback';
import { Button } from '@/components/actions';
import { AlertError } from '@/components/alert/alert-error';
import { UserRound } from 'lucide-react';
import { InputSelectLanguage } from '@/components/form/input-select-language';
import { PageLoading } from '@/components/feedback';
import { updateInforSchema as schema } from '@/configs/yup-form';
import toast from 'react-hot-toast';
import { updateInfoUserService } from '@/services/user.service';
import { useAuthStore } from '@/stores/auth.store';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { Form } from '@/components/ui/form';
import RHFInputField from '@/components/form/RHF/RHFInputFields/RHFInputField';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { User } from '../users/types';
import customToast from '@/utils/custom-toast';

export default function UpdateUserInfo() {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { user: userData, setData: setDataAuth } = useAuthStore();
  const [errorMessage, setErrorMessage] = useState('');
  const user = userData as User;
  const { t } = useTranslation('common');
  const form = useForm({
    mode: 'onBlur',
    defaultValues: {
      name: user?.name || '',
      language: user?.language || '',
      username: user?.username || '',
    },
    resolver: zodResolver(
      z
        .object({
          name: z.string().min(1, {
            message: t('MESSAGE.ERROR.REQUIRED'),
          })
          .refine((data) => data.trim().length > 0, {
            message: t('MESSAGE.ERROR.REQUIRED'),
          }),
          language: z.string().min(1, {
            message: t('MESSAGE.ERROR.REQUIRED'),
          }),
          username: z
            .string()
            .min(3, { message: t('MESSAGE.ERROR.USERNAME_MIN') })
            .max(15, { message: t('MESSAGE.ERROR.USERNAME_MAX') })
            .regex(/^[a-z0-9_]+$/, {
              message: t('MESSAGE.ERROR.USERNAME_PATTERN'),
            }),
        })
        .optional(),
    ),
  });
  const {
    register,
    watch,
    handleSubmit,
    trigger,
    setValue,
    reset,
    formState: { errors, isValid, isSubmitting, isDirty },
  } = form;
  const { name, language, username } = watch();
  const submit = async (values: z.infer<typeof schema>) => {
    trigger();
    if (!isValid) return;
    if (
      name == user?.name &&
      language == user?.language &&
      username == user?.language
    )
      return;
    try {
      setLoading(true);
      let res = await updateInfoUserService({
        name: name.trim(),
        language,
        username,
      });
      console.log(res.data);
      setDataAuth({
        user: {
          ...user,
          name: res.data.name,
          language: res.data.language,
          username: res.data.username,
        },
      });
      customToast.success(t('MESSAGE.SUCCESS.PROFILE_UPDATED'));
      setErrorMessage('');
      setOpen(false);
    } catch (err: any) {
      setErrorMessage(t(err?.response?.data?.message || 'BACKEND.MESSAGE.SOMETHING_WRONG'));
    } finally {
      setLoading(false);
      setValue('name', user.name);
      setValue('language', user.language);
    }
  };
  const onModalChange = () => {
    setOpen(!open);
    setValue('name', user.name);
    setValue('language', user.language);
  };

  useEffect(() => {
    if (name?.length >= 60) {
      setValue('name', name.slice(0, 60));
    }
  }, [name, setValue]);

  return (
    <>
      {loading && <PageLoading />}
      <AlertDialog open={open} onOpenChange={onModalChange}>
        <AlertDialogTrigger className="flex w-full items-center border-b bg-white dark:bg-neutral-900 dark:border-b-neutral-800 px-5 py-4 md:hover:bg-primary-100  dark:md:hover:bg-primary-800">
          <div className="relative flex !h-10 !w-10 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900 text-primary">
            <UserRound size={20} />
          </div>
          <span className="ml-4 block text-left text-base font-medium">
            {t('ACCOUNT_SETTING.PROFILE')}
          </span>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(submit)} className="space-y-4">
              <h3 className="text-[24px]">
                {t('ACCOUNT_SETTING.EDIT_PROFILE')}
              </h3>
              <RHFInputField
                name="name"
                formLabel={t('COMMON.NAME')}
                inputProps={{
                  placeholder: t('COMMON.NAME_PLACEHOLDER'),
                  suffix: (
                    <span className="text-sm text-gray-400">{`${name?.length}/60`}</span>
                  ),
                  onKeyDown: (e) => {
                    if (
                      name?.length >= 60 &&
                      e.key !== 'Backspace' &&
                      e.key !== 'Delete'
                    ) {
                      e.preventDefault();
                    }
                  },
                }}
              />
              <RHFInputField
                name="username"
                formLabel={t('COMMON.USERNAME')}
                inputProps={{
                  placeholder: t('COMMON.USERNAME_PLACEHOLDER'),
                  prefixEl: '@',
                  suffix: (
                    <span className="text-sm text-gray-400">{`${username?.length}/15`}</span>
                  ),
                  onKeyDown: (e) => {
                    if (
                      username?.length >= 60 &&
                      e.key !== 'Backspace' &&
                      e.key !== 'Delete'
                    ) {
                      e.preventDefault();
                    }
                  },
                }}
              />
              <InputSelectLanguage
                className="mt-5"
                field="language"
                setValue={setValue}
                errors={errors.language}
                trigger={trigger}
                defaultValue={user.language || ''}
              />
              <AlertError errorMessage={errorMessage}></AlertError>
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
                  disabled={
                    (user.name == watch().name &&
                      user.language == watch().language &&
                      user.username == watch().username) ||
                    isSubmitting ||
                    Object.keys(errors).length > 0
                  }
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
