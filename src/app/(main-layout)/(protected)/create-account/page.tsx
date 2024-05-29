'use client';

import { useEffect, useState } from 'react';

import { InputField } from '@/components/form/Input-field';
import { InputImage } from '@/components/form/input-image';
import { InputSelectLanguage } from '@/components/form/input-select-language';
import { PageLoading } from '@/components/feedback';
import { ROUTE_NAMES } from '@/configs/route-name';
import { addInfoUserService, checkUsernameExistService } from '@/services/auth.service';
import { uploadImage } from '@/utils/upload-img';
import { useAuthStore } from '@/stores/auth.store';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { useRouter } from 'next/navigation';
import RHFInputField from '@/components/form/RHF/RHFInputFields/RHFInputField';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Typography } from '@/components/data-display';
import { Button } from '@/components/actions';
import { AlertError } from '@/components/alert/alert-error';

export default function CreateNewAccount() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');
  const { user, setData: setDataAuthStore } = useAuthStore();
  const {t} = useTranslation("common");
  useEffect(() => {
    if (
      user?.avatar &&
      user?.name &&
      user?.language &&
      user?.status != 'unset'
    ) {
      router.push(ROUTE_NAMES.ONLINE_CONVERSATION);
    }
  }, [router, user]);

  const form = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
      avatar: undefined,
      language: '',
      username: '',
    },
    resolver: zodResolver(z
      .object({
        name: z.string()
          .min(1, {
            message: t('MESSAGE.ERROR.REQUIRED'),
          })
          .refine((value: string) => value.trim().length > 0, {
            message: t('MESSAGE.ERROR.REQUIRED'),
          }),
        avatar: z
          .any()
          // .refine((value: any) => value?.length > 0 || value?.size > 0, {
          //   message: t('MESSAGE.ERROR.REQUIRED'),
          // })
          .refine((value: any) => value?.size ? (value?.size < 3000000) :true, {
            message: t('MESSAGE.ERROR.FILE_SIZE', {val: '3MB'}),
          })
          .optional(),
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
      .optional()),
  });

  const {
    register,
    setValue,
    watch,
    trigger,
    handleSubmit,
    setError,
    clearErrors,
    getFieldState,
    formState: { errors, isValid },
  } = form;
  
  const { avatar, name, language, username } = watch();

  const submit = async (values: any) => {
    // e.preventDefault();
    trigger();
    if (!isValid) return;
    try {
      setLoading(true);
      let img = {secure_url: ''};
      if(avatar) {
        img = await uploadImage(avatar as File);
      }
      let res = await addInfoUserService({
        avatar: img.secure_url,
        name,
        language,
        username,
      });
      setDataAuthStore({ user: res.data });
      router.push(ROUTE_NAMES.ONLINE_CONVERSATION);
      setErrorMessage('');
    } catch (err: any) {
      setErrorMessage(t(err?.response?.data?.message));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (name?.length >= 60) {
      setValue('name', name.slice(0, 60));
    }
  }, [name,setValue]);

  const onBlurUsername = async () => {
    let {error} = getFieldState('username');
    if(error) return;

    try {
      await checkUsernameExistService(username);
    } catch (err: any) {
      setError('username', {
        type: 'manual',
        message: t(err?.response?.data?.message),
      });
    }
  }

  return (
    <div className="flex flex-col items-center">
      {loading && <PageLoading />}
      <div className="mx-auto mt-10 w-full px-[5vw] py-8 md:max-w-[500px] md:rounded-3xl md:px-6">
          <Typography
            variant={'h1'}
            className="mb-8 text-center text-2xl font-semibold text-primary"
          >
            {t('CREATE_ACCOUNT.TITLE')}
          </Typography>
        <Form {...form}>
          <form onSubmit={handleSubmit(submit)}>
            <InputImage
              className="mx-auto"
              register={{ ...register('avatar') }}
              errors={errors.avatar}
              setValue={setValue}
              field="avatar"
            ></InputImage>
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
            <div className="mt-5">
              <RHFInputField
                name="username"
                formLabel={t('COMMON.USERNAME')}
                inputProps={{
                  placeholder: t('COMMON.USERNAME_PLACEHOLDER'),
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
                  onBlur: () => {onBlurUsername()},
                }}
              />
            </div>
            
            {/* <InputField
              className="mt-5"
              label="Name"
              placeholder="Enter your name"
              register={{ ...register('name') }}
              errors={errors.name}
              type="text"
            /> */}
            <InputSelectLanguage
              className="mt-5"
              field="language"
              setValue={setValue}
              errors={errors.language}
              trigger={trigger}
            ></InputSelectLanguage>
            <AlertError errorMessage={errorMessage}></AlertError>
            <Button
              variant={'default'}
              size={'md'}
              shape={'square'}
              color={'primary'}
              className="mt-5 w-full max-w-[360px] mx-auto block"
              type="submit"
              disabled={
                (!watch().name || !watch().language || !watch().username) ||
                loading ||
                Object.keys(errors).length > 0
              }
            >
              {t('COMMON.CREATE')}
            </Button>
          </form>
        </Form>

      </div>
    </div>
  );
}
