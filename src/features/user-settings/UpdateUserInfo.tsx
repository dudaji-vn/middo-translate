'use client';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from '@/components/feedback';

import { AlertError } from '@/components/Alert/AlertError';
import { Edit2Outline } from '@easy-eva-icons/react';
import { InputField } from '@/components/form/InputField';
import { InputSelectLanguage } from '@/components/form/InputSelectLanguage';
import { PageLoading } from '@/components/loading/PageLoading';
import { User } from '../users/types';
import { UpdateInforSchema as schema } from '@/configs/yup-form';
import { toast } from '@/components/toast';
import { updateInfoUserService } from '@/services/userService';
import { useAuthStore } from '@/stores/auth';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

export default function UpdateUserInfo() {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { user: userData, setData: setDataAuth } = useAuthStore();
  const [errorMessage, setErrorMessage] = useState('');
  const user = userData as User;

  const {
    register,
    watch,
    trigger,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      name: user?.name || '',
      language: user?.language || '',
    },
    resolver: yupResolver(schema),
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    trigger();
    if (!isValid) return;
    const { name, language } = watch();
    if (name == user?.name && language == user?.language) return;
    try {
      setLoading(true);
      let res = await updateInfoUserService({ name, language });
      setDataAuth({
        user: {
          ...user,
          name: res.data.name,
          language: res.data.language,
        },
      });
      toast({
        title: 'Success',
        description: 'Your information has been update!',
      });
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

  return (
    <>
      {loading && <PageLoading />}
      <AlertDialog open={open} onOpenChange={onModalChange}>
        <AlertDialogTrigger>
          <div className="cursor-pointer transition-all hover:opacity-80">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-200">
              <Edit2Outline
                width={20}
                height={20}
                fill="#3D87ED"
              ></Edit2Outline>
            </span>
            <span className="mt-2 block text-center text-sm font-light">
              Profile
            </span>
          </div>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <form onSubmit={submit}>
            <h3 className="text-[24px]">Edit profile</h3>
            <InputField
              label="Name"
              type="text"
              placeholder="Enter your name"
              className="mt-4"
              register={{ ...register('name') }}
              errors={errors.name}
            ></InputField>
            <InputSelectLanguage
              className="mt-5"
              field="language"
              setValue={setValue}
              errors={errors.language}
              trigger={trigger}
              defaultValue={user.language || ''}
            ></InputSelectLanguage>
            <AlertError errorMessage={errorMessage}></AlertError>
            <div className="mt-6 flex items-center justify-end">
              <AlertDialogCancel className="mr-2 border-0 bg-transparent hover:!border-0 hover:!bg-transparent">
                <p>Cancel</p>
              </AlertDialogCancel>
              <button
                className={`rounded-full border border-transparent px-8 py-4 font-semibold text-background active:!border-transparent active:!bg-shading active:!text-background md:max-w-[320px] md:hover:opacity-80 ${
                  user.name == watch().name && user.language == watch().language
                    ? 'pointer-events-none bg-gray-400'
                    : 'bg-primary'
                }`}
                type="submit"
              >
                Save
              </button>
            </div>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
