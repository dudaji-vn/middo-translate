"use client";

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CircleFlag } from 'react-circle-flags';
import { ArrowBackOutline, Edit2Outline, LogOutOutline, ShoppingBagOutline } from '@easy-eva-icons/react';
import { ROUTE_NAMES } from '@/configs/route-name';
import { useAuthStore } from '@/stores/auth';
import { signOutService } from '@/services/authService';
import { toast } from '@/components/toast';
import { LANGUAGE_CODES_MAP, SUPPORTED_LANGUAGES } from '@/configs/default-language';

export default function AccountSettings() {
    const router = useRouter();

    const { user, setData: setDataAuth } = useAuthStore();

    const signOut = async () => {
        try {
            await signOutService();
            setDataAuth({ user: null, isAuthentication: false });
            toast({ title: 'Success', description: 'Sign out success' })
        } catch (err: any) {
            toast({ title: 'Error', description: err?.response?.data?.message })
        }
    }

    return (
        <div>
            <div className='px-[5vw] w-full mx-auto py-5'>
                <Link
                    href={ROUTE_NAMES.ROOT}
                    className='flex w-fit items-center group'
                >
                    <span className='mr-4 group-hover:-translate-x-1 transition-all'>
                        <ArrowBackOutline></ArrowBackOutline>
                    </span>
                    <span className='font-semibold'>Account setting</span>
                </Link>
            </div>

            <div className='px-5 w-full md:max-w-[500px] mx-auto py-5 md:shadow-2 rounded-3xl pb-0 md:overflow-hidden'>
                <div className='w-20 h-20 mx-auto rounded-full overflow-hidden'>
                    <Image
                        src={user?.avatar || '/person.svg'}
                        priority
                        alt={user?.name || 'Anonymous'}
                        width={500}
                        height={500}
                        className="object-cover h-full w-full"
                    ></Image>
                </div>
                <h2 className='text-base text-center mt-3'>{user?.name || 'Anonymous'}</h2>
                <p className='text-base text-center text-[#333] mt-2'>{user?.email || ''}</p>
                {user.language && <div className='flex items-center justify-center mt-2'>
                    <CircleFlag countryCode={LANGUAGE_CODES_MAP[user?.language as keyof typeof LANGUAGE_CODES_MAP].toLowerCase() || ''} className="w-5 h-5 inline-block mr-2" />
                    <span className='text-sm'>{SUPPORTED_LANGUAGES.find((lang) => lang.code === user?.language)?.name || ''}</span>
                </div>}

                <div className='mt-8 gap-6 flex items-center justify-center'>
                    <div className='cursor-pointer hover:opacity-80 transition-all'>
                        <span className='w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center'>
                            <Edit2Outline width={20} height={20} fill='#3D87ED'></Edit2Outline>
                        </span>
                        <span className='font-light text-sm mt-2 text-center block'>Profile</span>
                    </div>
                    <div className='cursor-pointer hover:opacity-80 transition-all'>
                        <span className='w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center'>
                            <ShoppingBagOutline width={20} height={20} fill='#3D87ED'></ShoppingBagOutline>
                        </span>
                        <span className='font-light text-sm mt-2 text-center block'>Avatar</span>
                    </div>
                </div>
                <div className='bg-[#FAFAFA] mt-4 h-2 w-full'></div>
                <p className='text-center font-medium p-4 cursor-pointer'>Change password</p>
                <p
                    onClick={signOut}
                    className='text-center font-medium p-4 cursor-pointer hover:bg-red-50 mx-[-20px] flex items-center justify-center transition-all'>
                    <span>
                        <LogOutOutline width={16} height={16} fill='#ef4444'></LogOutOutline>
                    </span>
                    <span className='text-red-500 font-medium ml-2'>Sign out</span>
                </p>
            </div>
        </div>
    );
}
