'use client';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from '@/components/feedback';

import { InputField } from '@/components/form/Input-field';
import { PageLoading } from '@/components/loading/page-loading';
import { changePasswordUserService } from '@/services/user.service';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { PASSWORD_PARTTERN } from '@/configs/regex-pattern';
import RHFInputField from '@/components/form/RHF/RHFInputField/RHFInputField';
import { AlertError } from '@/components/alert/alert-error';

const formSchema = z.object({
  currentPassword: z.string().min(1, {
    message: 'Please enter current password!',
  }),
  newPassword: z
    .string()
    .min(8, {
      message: 'Password must be at least 8 characters!',
    })
    .regex(PASSWORD_PARTTERN, {
      message:
        'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number!',
    }),

  confirmPassword: z
    .string()
    .min(1, {
      message: 'Please enter confirm password!',
    })
 
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Confirm password does not match!',
  path: ['confirmPassword'],
}).refine((data) => data.newPassword !== data.currentPassword, {
  message: 'New password must be different from the current password!',
  path: ['newPassword'],
});




export default function UpdateUserPassword() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });
  const {
    trigger,
    watch,
    reset,
    formState: { errors, isValid },
  } = form;

  const submit = async (e: any) => {
    e.preventDefault();
    trigger();
    if (!isValid) return;
    const { currentPassword, newPassword } = watch();
    try {
      setLoading(true);
      await changePasswordUserService({ currentPassword, newPassword });
      toast.success('Your password has been changed!');
      setOpen(false);
      setErrorMessage('');
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message);
    } finally {
      setLoading(false);
      reset();
    }
  };

  return (
    <>
      {loading && <PageLoading />}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger className="w-full">
          <span className="-mx-[5vw] block cursor-pointer border-b border-b-[#F2F2F2] p-4 text-center font-medium transition-all hover:bg-slate-100 md:-mx-6">
            Change password
          </span>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <Form {...form}>
            <h3 className="text-[24px]">Change password</h3>
            <RHFInputField
              name="currentPassword"
              formLabel="Current password"
              inputProps={{
                type: 'password',
                placeholder: 'Enter your current password',
                className: 'mt-4',
              }}
            />
            <RHFInputField
              name="newPassword"
              formLabel="New password"
              inputProps={{
                type: 'password',
                placeholder: 'Enter your new password',
                className: 'mt-4',
              }}
            />
            <RHFInputField
              name="confirmPassword"
              formLabel="Confirm password"
              inputProps={{
                type: 'password',
                placeholder: 'Enter your confirm password',
                className: 'mt-4',
              }}
            />
            <AlertError errorMessage={errorMessage} />
            <div className="mt-6 flex items-center justify-end">
              <AlertDialogCancel className="mr-2 border-0 bg-transparent hover:!border-0 hover:!bg-transparent">
                <p>Cancel</p>
              </AlertDialogCancel>
              <button
                disabled={!isValid || loading}
                className="rounded-full border border-transparent bg-primary px-8 py-4 font-semibold text-background active:!border-transparent active:!bg-shading active:!text-background disabled:bg-stone-300 disabled:hover:opacity-100 md:max-w-[320px] md:hover:opacity-80"
                type="submit"
              >
                Save
              </button>
            </div>
          </Form>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
