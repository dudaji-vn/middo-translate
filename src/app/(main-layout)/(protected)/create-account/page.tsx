"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { InputField } from '@/components/form/InputField';
import { PageLoading } from '@/components/loading/PageLoading';
import { CreateNewAccountSchema as schema } from '@/configs/yup-form';
import { Button } from '@/components/form/Button';
import { InputImage } from '@/components/form/InputImage';
import { InputSelectLanguage } from '@/components/form/InputSelectLanguage';
import { uploadImage } from '@/utils/upload-img';
import { addInfoUserService } from '@/services/authService';
import { useAuthStore } from '@/stores/auth';
import { ROUTE_NAMES } from '@/configs/route-name';

export default function CreateNewAccount() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState("");
    const { user, setData: setDataAuthStore } = useAuthStore();

    useEffect(() => {
        if(user?.avatar && user?.name && user?.language) {
            router.push(ROUTE_NAMES.ROOT);
        }
    }, [router, user]);

    const { register, setValue, watch, trigger, formState: { errors, isValid } } = useForm({
        mode: "onBlur",
        defaultValues: {
            name: "",
            avatar: undefined,
            language: "",
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
            let res = await addInfoUserService({avatar: img.secure_url, name, language});
            setDataAuthStore({user: res.data});
            router.push(ROUTE_NAMES.ROOT);
            setErrorMessage("");
        }catch (err: any) {
            setErrorMessage(err?.response?.data?.message);
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex h-screen flex-col items-center bg-background bg-cover bg-center bg-no-repeat md:!bg-[url('/bg_auth.png')]">
            {loading && <PageLoading />}
            <div className='w-full md:max-w-[500px] mx-auto py-8 md:shadow-2 mt-10 md:rounded-3xl px-[5vw] md:px-6'>
                <h2 className="text-primary relative pl-4 mb-8 leading-tight before:content-[''] before:absolute before:top-0 before:bottom-0 before:left-0 before:w-1 before:rounded-md before:bg-primary">Create new account</h2>
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
                        label='Name'
                        placeholder="Enter your name"
                        register={{ ...register('name') }}
                        errors={errors.name}
                        type="text"
                    />
                    <InputSelectLanguage
                        className='mt-5'
                        field='language'
                        setValue={setValue}
                        errors={errors.language}
                        trigger={trigger}
                    ></InputSelectLanguage>
                    <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
                    <Button type="submit">Create</Button>
                </form>
            </div>
        </div>
    );
}
