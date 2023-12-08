"use client";

import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import { toast } from '@/components/toast';
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogTrigger, PageLoading } from '@/components/feedback';
import { InputField } from '@/components/form/InputField';
import { useForm } from 'react-hook-form';
import { ChangePasswordSchema as schema } from '@/configs/yup-form';
import { changePasswordUserService } from '@/services/userService';

export default function UpdateUserPassword() {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [open, setOpen] = useState(false);

    const { register, watch, trigger, reset, formState: { errors, isValid } } = useForm({
        mode: "onBlur",
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
        resolver: yupResolver(schema),
    });

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        trigger();
        if (!isValid) return;
        const { currentPassword, newPassword } = watch();
        try {
            setLoading(true);
            await changePasswordUserService({ currentPassword, newPassword });
            toast({ title: 'Success', description: 'Your password update successfully!' })
            setOpen(false);
            setErrorMessage("");
        } catch (err: any) {
            setErrorMessage(err?.response?.data?.message);
        } finally {
            setLoading(false);
            reset();
        }
    }

    return (
    <>
        {loading && <PageLoading />}
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger className="w-full">
                <span className='-mx-[5vw] md:-mx-6 block text-center font-medium p-4 cursor-pointer hover:bg-slate-100 transition-all border-b border-b-[#F2F2F2]'>Change password</span>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <form onSubmit={submit}>
                <h3 className='text-[24px]'>Change password</h3>
                <InputField
                    label='Current password'
                    type="password"
                    placeholder='Enter your current password'
                    className='mt-4'
                    register={{ ...register('currentPassword') }}
                    errors={errors.currentPassword}
                ></InputField>
                <InputField
                    label='New password'
                    type="password"
                    placeholder='Enter your new password'
                    className='mt-4'
                    register={{ ...register('newPassword') }}
                    errors={errors.newPassword}
                ></InputField>
                <InputField
                    label='Confirm new password'
                    type="password"
                    placeholder='Confirm new password'
                    className='mt-4'
                    register={{ ...register('confirmPassword') }}
                    errors={errors.confirmPassword}
                ></InputField>
                {errorMessage && 
                <p className="mt-4 text-error-2 w-full text-center text-sm">{errorMessage}</p>
                }
                <div className='mt-6 flex justify-end items-center'>
                    <AlertDialogCancel className='mr-2 bg-transparent border-0 hover:!border-0 hover:!bg-transparent'>
                        <p>Cancel</p>
                    </AlertDialogCancel>
                    <button className='rounded-full border border-transparent bg-primary px-8 py-4 font-semibold text-background active:!border-transparent active:!bg-shading active:!text-background md:max-w-[320px] md:hover:opacity-80' type='submit'>Save</button>
                </div>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    </>
    );
}
