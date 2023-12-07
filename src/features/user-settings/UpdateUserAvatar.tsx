"use client";

import { useId, useState } from 'react';
import { useAuthStore } from '@/stores/auth';

import { toast } from '@/components/toast';
import { ShoppingBagOutline } from '@easy-eva-icons/react';
import { updateInfoUserService } from '@/services/userService';
import { PageLoading } from '@/components/feedback';
import { uploadImage } from '@/utils/upload-img';

export default function UpdateUserAvatar() {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const { user, setData: setDataAuth } = useAuthStore();
    const id = useId();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        let file = e.target.files?.[0];
        if (!file) return;
        try {
            setLoading(true);
            let img = await uploadImage(file as File);
            let res = await updateInfoUserService({avatar: img.secure_url});
            setDataAuth({user: {
                ...user,
                avatar: res.data.avatar,
            }});
            setOpen(false);
            toast({ title: 'Success', description: 'Your avatar has been update!' })
        } catch (err: any) {
            toast({ title: 'Error', description: err?.response?.data?.message })
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading && <PageLoading />}
            <label htmlFor={id} className='cursor-pointer hover:opacity-80 transition-all'>
                <span className='w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center'>
                    <ShoppingBagOutline width={20} height={20} fill='#3D87ED'></ShoppingBagOutline>
                </span>
                <span className='font-light text-sm mt-2 text-center block'>Avatar</span>
            </label>
            <input onChange={handleFileChange} type="file" id={id} hidden accept="image/png, image/gif, image/jpeg"/>
        </>
    );
}
