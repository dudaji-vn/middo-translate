'use client';

import Image from 'next/image';
import { useTranslation } from 'react-i18next';

export default function Offline() {
    const { t } = useTranslation('common');
    return (
        <section className='h-screen'>
            <div className="flex flex-col items-center justify-center h-full max-w-[600px] px-[5vw] mx-auto">
                <div className="mx-auto w-[223px]">
                    <Image
                        src="/offline.svg"
                        alt="Offline"
                        width={500}
                        height={500}
                    ></Image>
                </div>
                <h1 className="mt-10 text-center text-[22px] font-semibold text-primary">
                    {t('OFFLINE.TITLE')}
                </h1>
                <p className="mt-4 text-center">
                    {t('OFFLINE.DESCRIPTION')}
                </p>
            </div>
        </section>
    );
}
