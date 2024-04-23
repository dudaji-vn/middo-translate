'use client';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from '@/components/feedback';
import { Button } from '@/components/actions'
import { AlertError } from '@/components/alert/alert-error';
import { UserRound } from 'lucide-react';
import { InputSelectLanguage } from '@/components/form/input-select-language';
import { PageLoading } from '@/components/loading/page-loading';
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
    },
    resolver: zodResolver(
      z
        .object({
          name: z.string().min(1, {
            message: t('MESSAGE.ERROR.REQUIRED'),
          }),
          language: z.string().min(1, {
            message: t('MESSAGE.ERROR.REQUIRED'),
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
    formState: { errors, isValid, isSubmitting },
  } = form;
  const { name, language } = watch();
  const submit = async (values: z.infer<typeof schema>) => {
    trigger();
    if (!isValid) return;
    if (name == user?.name && language == user?.language) return;
    try {
      setLoading(true);
      let res = await updateInfoUserService({ name: name.trim(), language });
      setDataAuth({
        user: {
          ...user,
          name: res.data.name,
          language: res.data.language,
        },
      });
      toast.success(t('MESSAGE.SUCCESS.PROFILE_UPDATED'));
      setErrorMessage('');
      setOpen(false);
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message);
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
        <AlertDialogTrigger className='w-full flex items-center px-5 py-4 border-b border-b-[#F2F2F2] bg-white md:hover:bg-primary-100'>
          <Button.Icon
            variant={'ghost'}
            color={'primary'}
            size={'sm'}
            className='relative bg-primary-200 rounded-xl'
          >
            <UserRound size={20} />
          </Button.Icon>
          <span className="ml-4 block text-center text-base font-medium">
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
                <AlertDialogCancel className="mr-2 border-0 bg-transparent hover:!border-0 hover:!bg-transparent">
                  <p>{t('COMMON.CANCEL')}</p>
                </AlertDialogCancel>
                <Button
                  shape="square"
                  disabled={
                    (user.name == watch().name &&
                      user.language == watch().language) ||
                    isSubmitting
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
