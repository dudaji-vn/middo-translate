"use client";

import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import { useAuthStore } from '@/stores/auth';
import { toast } from '@/components/toast';
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogTrigger } from '@/components/feedback';
import { InputField } from '@/components/form/InputField';
import { useForm } from 'react-hook-form';
import { ChangePasswordSchema as schema } from '@/configs/yup-form';
import { changePasswordUserService } from '@/services/userService';

export default function UpdateUserPassword() {
    const [open, setOpen] = useState(false);

    const { register, watch, trigger, formState: { errors, isValid } } = useForm({
        mode: "onSubmit",
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
        // const { currentPassword, newPassword } = watch();
        try {
            // let res = await changePasswordUserService({ currentPassword, newPassword });
            toast({ title: 'Success', description: 'Update info success' })
            setOpen(false);
        } catch (err: any) {
            toast({ title: 'Error', description: err?.response?.data?.message })
        } finally {
            
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger className="w-full">
                <p className='text-center font-medium p-4 cursor-pointer w-full mb-4'>Change password</p>
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
                <div className='mt-6 flex justify-end items-center'>
                    <AlertDialogCancel className='mr-2 bg-transparent border-0 hover:!border-0 hover:!bg-transparent'>
                        <p>Cancel</p>
                    </AlertDialogCancel>
                    <button className='rounded-full border border-transparent bg-primary px-8 py-4 font-semibold text-background active:!border-transparent active:!bg-shading active:!text-background md:max-w-[320px] md:hover:opacity-80' type='submit'>Save</button>
                </div>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
}
