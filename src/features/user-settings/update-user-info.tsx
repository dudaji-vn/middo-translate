'use client';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from '@/components/feedback';

import { AlertError } from '@/components/alert/alert-error';
import { Button } from '@/components/actions';
import { Edit2Icon } from 'lucide-react';
import { InputField } from '@/components/form/Input-field';
import { InputSelectLanguage } from '@/components/form/input-select-language';
import { PageLoading } from '@/components/loading/page-loading';
import { User } from '../users/types';
import { UpdateInforSchema as schema } from '@/configs/yup-form';
import toast from 'react-hot-toast';
import { updateInfoUserService } from '@/services/user.service';
import { useAuthStore } from '@/stores/auth.store';
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
      toast.success('Update info success!');
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
            <Button.Icon color="secondary">
              <Edit2Icon />
            </Button.Icon>
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
              <Button
                shape="square"
                disabled={
                  user.name == watch().name && user.language == watch().language
                }
                type="submit"
              >
                Save
              </Button>
            </div>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
