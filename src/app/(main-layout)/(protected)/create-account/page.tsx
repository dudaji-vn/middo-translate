'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/form/Button';
import { InputField } from '@/components/form/InputField';
import { InputImage } from '@/components/form/InputImage';
import { InputSelectLanguage } from '@/components/form/InputSelectLanguage';
import { PageLoading } from '@/components/loading/PageLoading';
import { ROUTE_NAMES } from '@/configs/route-name';
import { addInfoUserService } from '@/services/authService';
import { CreateNewAccountSchema as schema } from '@/configs/yup-form';
import { uploadImage } from '@/utils/upload-img';
import { useAuthStore } from '@/stores/auth';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';

export default function CreateNewAccount() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');
  const { user, setData: setDataAuthStore } = useAuthStore();

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

  const {
    register,
    setValue,
    watch,
    trigger,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      name: '',
      avatar: undefined,
      language: '',
    },
    resolver: yupResolver(schema),
  });

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    trigger();
    if (!isValid) return;
    const { avatar, name, language } = watch();
    try {
      setLoading(true);
      let img = await uploadImage(avatar as File);
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

  return (
    <div className="flex flex-col items-center bg-background bg-cover bg-center bg-no-repeat md:!bg-[url('/bg_auth.png')]">
      {loading && <PageLoading />}
      <div className="mx-auto mt-10 w-full px-[5vw] py-8 md:max-w-[500px] md:rounded-3xl md:px-6 md:shadow-2">
        <h4 className="relative mb-8 pl-4 leading-tight text-primary before:absolute before:bottom-0 before:left-0 before:top-0 before:w-1 before:rounded-md before:bg-primary before:content-['']">
          Create new account
        </h4>
        <form onSubmit={handleSubmitForm}>
          <InputImage
            className="mx-auto"
            register={{ ...register('avatar') }}
            errors={errors.avatar}
            setValue={setValue}
            field="avatar"
          ></InputImage>
          <InputField
            className="mt-5"
            label="Name"
            placeholder="Enter your name"
            register={{ ...register('name') }}
            errors={errors.name}
            type="text"
          />
          <InputSelectLanguage
            className="mt-5"
            field="language"
            setValue={setValue}
            errors={errors.language}
            trigger={trigger}
          ></InputSelectLanguage>
          <p className="mt-2 text-sm text-red-500">{errorMessage}</p>
          <Button type="submit">Create</Button>
        </form>
      </div>
    </div>
  );
}
