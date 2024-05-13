'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/form/button';
import { InputField } from '@/components/form/Input-field';
import { InputImage } from '@/components/form/input-image';
import { InputSelectLanguage } from '@/components/form/input-select-language';
import { PageLoading } from '@/components/feedback';
import { ROUTE_NAMES } from '@/configs/route-name';
import { addInfoUserService } from '@/services/auth.service';
import { uploadImage } from '@/utils/upload-img';
import { useAuthStore } from '@/stores/auth.store';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { useRouter } from 'next/navigation';
import RHFInputField from '@/components/form/RHF/RHFInputFields/RHFInputField';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';

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
      router.push(ROUTE_NAMES.ROOT);
    }
  }, [router, user]);

  const form = useForm({
    mode: 'onBlur',
    defaultValues: {
      name: '',
      avatar: undefined,
      language: '',
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
          .refine((value: any) => value?.length > 0 || value?.size > 0, {
            message: t('MESSAGE.ERROR.REQUIRED'),
          })
          .refine((value: any) => value?.size < 3000000, {
            message: t('MESSAGE.ERROR.FILE_SIZE', {val: '3MB'}),
          }),
        language: z.string().min(1, {
          message: t('MESSAGE.ERROR.REQUIRED'),
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
    formState: { errors, isValid },
  } = form;
  
  const { avatar, name, language } = watch();

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
      });
      setDataAuthStore({ user: res.data });
      router.push(ROUTE_NAMES.ROOT);
      setErrorMessage('');
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (name?.length >= 60) {
      setValue('name', name.slice(0, 60));
    }
  }, [name,setValue]);

  return (
    <div className="flex flex-col items-center bg-background bg-cover bg-center bg-no-repeat md:!bg-[url('/bg_auth.png')]">
      {loading && <PageLoading />}
      <div className="mx-auto mt-10 w-full px-[5vw] py-8 md:max-w-[500px] md:rounded-3xl md:px-6 md:shadow-2">
        <h4 className="relative mb-8 pl-4 leading-tight text-primary before:absolute before:bottom-0 before:left-0 before:top-0 before:w-1 before:rounded-md before:bg-primary before:content-['']">
          {t('CREATE_ACCOUNT.TITLE')}
        </h4>
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
            <p className="mt-2 text-sm text-red-500">{errorMessage}</p>
            <Button type="submit">{t('COMMON.CREATE')}</Button>
          </form>
        </Form>

      </div>
    </div>
  );
}
