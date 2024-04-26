'use client';

import { MainLayout } from '@/components/layout/main-layout';
import Image from 'next/image';

function Error() {
  return (
    <MainLayout>
      <div className="container-height mx-auto flex w-full items-center justify-center p-4">
        <div>
          <Image
            src="/invalid_invitation.svg"
            alt="500"
            width={400}
            height={400}
          />
        </div>
      </div>
    </MainLayout>
  );
}

export default Error;
