'use client';

import { useNetworkStatus } from '@/utils/use-network-status';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/actions';
type Status = 'ONLINE' | 'OFFLINE' | undefined;
export default function Offline() {
  const { t } = useTranslation('common');
  const [status, setStatus] = useState<Status>();

  const { isOnline } = useNetworkStatus();
  useEffect(() => {
    if (isOnline && status == 'OFFLINE') {
      setStatus('ONLINE');
      window.location.reload();
    }
    if (!isOnline) {
      setStatus('OFFLINE');
    }
  }, [isOnline, status]);

  if(status !== 'OFFLINE') return null;
  return (
    <section className="fixed inset-0 z-[100] bg-white">
      <div className="mx-auto flex h-full max-w-[600px] flex-col items-center justify-center px-[5vw]">
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
        <p className="mt-4 text-center">{t('OFFLINE.DESCRIPTION')}</p>
        <Button onClick={()=>window.location.reload()} shape={'square'} size={'sm'} className='mx-auto block mt-4'>{t('OFFLINE.REFRESH')}</Button>
      </div>
    </section>
  );
}
