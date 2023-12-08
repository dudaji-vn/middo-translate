"use client";

import { useState } from 'react';
import { useAuthStore } from '@/stores/auth';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { toast } from '@/components/toast';
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogTrigger } from '@/components/feedback';
import { InputField } from '@/components/form/InputField';
import { UpdateInforSchema as schema } from '@/configs/yup-form';
import { InputSelectLanguage } from '@/components/form/InputSelectLanguage';
import { Edit2Outline } from '@easy-eva-icons/react';
import { updateInfoUserService } from '@/services/userService';
import { AlertError } from '@/components/Alert/AlertError';
import { PageLoading } from '@/components/loading/PageLoading';

export default function UpdateUserInfo() {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const { user, setData: setDataAuth } = useAuthStore();
    const [errorMessage, setErrorMessage] = useState("");

    const { register, watch, trigger, setValue , formState: { errors, isValid } } = useForm({
        mode: "onSubmit",
        defaultValues: {
            name: user.name || '',
            language: user.language || '',
        },
        resolver: yupResolver(schema),
    });

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        trigger();
        if (!isValid) return;
        const { name, language } = watch();
        if(name == user.name && language == user.language) return;
        try {
            setLoading(true);
            let res = await updateInfoUserService({ name, language });
            setDataAuth({ user: {
                ...user,
                name: res.data.name,
                language: res.data.language,
            }});
            toast({ title: 'Success', description: 'Your information has been update!' })
            setErrorMessage("");
            setOpen(false);
        } catch (err: any) {
            setErrorMessage(err?.response?.data?.message);
        } finally {
            setLoading(false);
            setValue('name', user.name);
            setValue('language', user.language);
        }
    }

    const onModalChange = () => {
        setOpen(!open);
        setValue('name', user.name);
        setValue('language', user.language);
    }

    return (
        <>
            {loading && <PageLoading />}
            <AlertDialog open={open} onOpenChange={onModalChange}>
                <AlertDialogTrigger>
                <div className='cursor-pointer hover:opacity-80 transition-all'>
                    <span className='w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center'>
                        <Edit2Outline width={20} height={20} fill='#3D87ED'></Edit2Outline>
                    </span>
                    <span className='font-light text-sm mt-2 text-center block'>Profile</span>
                </div>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <form onSubmit={submit}>
                    <h3 className='text-[24px]'>Edit profile</h3>
                    <InputField
                        label='Name'
                        type="text"
                        placeholder='Enter your name'
                        className='mt-4'
                        register={{ ...register('name') }}
                        errors={errors.name}
                    ></InputField>
                    <InputSelectLanguage
                        className='mt-5'
                        field='language'
                        setValue={setValue}
                        errors={errors.language}
                        trigger={trigger}
                        defaultValue={user.language || ''}
                    ></InputSelectLanguage>
                    <AlertError errorMessage={errorMessage}></AlertError>
                    <div className='mt-6 flex justify-end items-center'>
                        <AlertDialogCancel className='mr-2 bg-transparent border-0 hover:!border-0 hover:!bg-transparent'>
                            <p>Cancel</p>
                        </AlertDialogCancel>
                        <button className={`rounded-full border border-transparent px-8 py-4 font-semibold text-background active:!border-transparent active:!bg-shading active:!text-background md:max-w-[320px] md:hover:opacity-80 ${ (user.name == watch().name && user.language == watch().language) ? 'pointer-events-none bg-gray-400' : 'bg-primary'}`} type='submit'>Save</button>
                    </div>
                    </form>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
