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
import { InputSelectLanguage } from '@/components/form/input-select-language';
import { PageLoading } from '@/components/loading/page-loading';
import { User } from '../users/types';
import { updateInforSchema as schema } from '@/configs/yup-form';
import toast from 'react-hot-toast';
import { updateInfoUserService } from '@/services/user.service';
import { useAuthStore } from '@/stores/auth.store';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { Form } from '@/components/ui/form';
import RHFInputField from '@/components/form/RHF/RHFInputField/RHFInputField';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export default function UpdateUserInfo() {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { user: userData, setData: setDataAuth } = useAuthStore();
  const [errorMessage, setErrorMessage] = useState('');
  const user = userData as User;

  const form = useForm({
    mode: 'onBlur',
    defaultValues: {
      name: user?.name || '',
      language: user?.language || '',
    },
    resolver: zodResolver(schema),
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


  useEffect(() => {
    if (name?.length >= 60) {
      setValue('name', name.slice(0, 60));
    }
  }, [name,setValue]);

  return (
    <>
      {loading && <PageLoading />}
      <AlertDialog open={open} onOpenChange={onModalChange}>
        <AlertDialogTrigger>
          <div className="cursor-pointer transition-all hover:opacity-80">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-200 p-0 font-semibold text-primary ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 active:bg-primary-400 disabled:pointer-events-none disabled:bg-primary-100 disabled:text-primary-200 disabled:opacity-50 md:hover:bg-primary-300 md:active:bg-primary-400">
              <Edit2Icon />
            </div>
            <span className="mt-2 block text-center text-sm font-light">
              Profile
            </span>
          </div>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(submit)} className="space-y-4">
              <h3 className="text-[24px]">Edit profile</h3>
              <RHFInputField
                name="name"
                formLabel="Name"
                inputProps={{
                  placeholder: 'Enter your name',
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
                  <p>Cancel</p>
                </AlertDialogCancel>
                <Button
                  shape="square"
                  disabled={
                    user.name == watch().name &&
                    user.language == watch().language
                    || isSubmitting
                  }
                  type="submit"
                >
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
