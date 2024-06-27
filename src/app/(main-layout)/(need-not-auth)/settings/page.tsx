'use client';

import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ROUTE_NAMES } from '@/configs/route-name';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/actions';
import Link from 'next/link';
import { TurnOffNotification } from '@/features/user-settings/turn-off-notification';
import SelectPageLanguage from '@/features/user-settings/select-page-language';
import SelectTheme from '@/features/user-settings/select-theme';

export default function Settings() {
 const {t} = useTranslation();
  return (
    <div className="container-height overflow-auto dark:bg-background">
        <div className="mx-auto w-full md:my-8 md:max-w-[500px] md:overflow-hidden md:rounded-xl md:shadow-2 dark:md:shadow-3">
            <div className="flex flex-col items-center p-8 bg-[#FCFCFC] dark:bg-background">
                <Link href={ROUTE_NAMES.SIGN_IN}>
                    <Button
                        variant={'default'}
                        shape={'square'}
                        color={'default'}
                        size={'xs'}
                        >
                        Sign in / Sign up
                    </Button>
                </Link>
            </div>
            <div>
                <SelectPageLanguage />
                {/* <TurnOffNotification /> */}
                <SelectTheme />
            </div>
        </div>
    </div>
  );
}
