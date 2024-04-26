'use client';

import { Typography } from '@/components/data-display';
import { MainLayout } from '@/components/layout/main-layout';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

function NotFoundPage() {
  const { t } = useTranslation('common');
  return (
    <MainLayout>
      <div className="container-height mx-auto flex w-full flex-col items-center justify-center p-4">
        <div>
          <Image src="/404.svg" alt="404" width={400} height={400} />
        </div>
        <Typography
          variant={'h1'}
          className="mt-10 text-center text-3xl text-neutral-400"
        >
          {t('404.TITLE')}
        </Typography>
        <Typography
          variant={'h6'}
          className=" mt-3 text-center font-normal text-neutral-600"
        >
          {t('404.DESCRIPTION')}
        </Typography>
      </div>
    </MainLayout>
  );
}

export default NotFoundPage;
