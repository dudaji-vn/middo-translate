"use client";

import { useId, useRef, useState } from 'react';
import { useAuthStore } from '@/stores/auth';

import { toast } from '@/components/toast';
import { ShoppingBagOutline } from '@easy-eva-icons/react';
import { updateInfoUserService } from '@/services/userService';
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogTrigger, PageLoading } from '@/components/feedback';
import { uploadImage } from '@/utils/upload-img';
import { InputCropImage, InputCropImageRef } from '@/components/form/InputCropImage';

export default function UpdateUserAvatar() {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const { user, setData: setDataAuth } = useAuthStore();
    const inputCropImage = useRef<InputCropImageRef>(null);

    const onSubmitForm = async (e: React.FormEvent) => {
        e.preventDefault();
        const file = inputCropImage.current?.getCropData();
        if (!file) return;
        if(file.size > 1024 * 1024 * 5) { // 5MB
            toast({ title: 'Error', description: 'File size is too large' })
            return;
        }

        try {
            setLoading(true);
            let image = await uploadImage(file);
            let res = await updateInfoUserService({ avatar: image.secure_url });
            setDataAuth({ user: {
                ...user,
                avatar: res.data.avatar,
            }});
            toast({ title: 'Success', description: 'Your avatar has been update!' })
            setOpen(false);
        } catch (err: any) {
            toast({ title: 'Error', description: err?.response?.data?.message })
        } finally {
            setLoading(false);
        }
    }
    
    return (
        <>
            {loading && <PageLoading />}
            {/* <label htmlFor={id} className='cursor-pointer hover:opacity-80 transition-all'>
                <span className='w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center'>
                    <ShoppingBagOutline width={20} height={20} fill='#3D87ED'></ShoppingBagOutline>
                </span>
                <span className='font-light text-sm mt-2 text-center block'>Avatar</span>
            </label>
            <input onChange={handleFileChange} type="file" id={id} hidden accept="image/png, image/gif, image/jpeg"/> */}
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger>
                <div className='cursor-pointer hover:opacity-80 transition-all'>
                    <span className='w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center'>
                        <ShoppingBagOutline width={20} height={20} fill='#3D87ED'></ShoppingBagOutline>
                    </span>
                    <span className='font-light text-sm mt-2 text-center block'>Avatar</span>
                </div>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <form onSubmit={onSubmitForm}>
                    <h3 className='text-[24px]'>Change avatar</h3>
                    <div>
                        {/* <label className='block w-[80%] mx-auto aspect-square rounded-full overflow-hidden'>
                            <Image
                                src={user?.avatar || '/person.svg'}
                                priority
                                alt={user?.name || 'Anonymous'}
                                width={500}
                                height={500}
                                className="object-cover h-full w-full"
                            ></Image>
                        </label> */}
                        <InputCropImage 
                            ref={inputCropImage}
                        />
                    </div>
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
