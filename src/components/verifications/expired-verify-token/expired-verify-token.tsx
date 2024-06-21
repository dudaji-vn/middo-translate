'use client';

import { useAuthStore } from '@/stores/auth.store';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

const ExpiredVerifyToken = ({
  token,
  title = 'ask the space owner to resend the invitation',
}: {
  token: string;
  title?: string;
}) => {
  const { user: currentUser, setData } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  return (
    <main className="flex h-[calc(100vh-52px)] items-center  justify-center">
      <div className="flex flex-col items-center gap-8">
        <Image
          src="/expired_invitation.svg"
          width={320}
          height={320}
          alt="Expired-verify-token"
        />
        <div className="flex  flex-col gap-3 text-center text-neutral-800">
          <span className="text-[2rem] font-semibold leading-[48px] text-neutral-800">
            The invitation has expired
          </span>
          <span className="font-light  leading-[22px] text-neutral-800">
            {title}
          </span>
        </div>
      </div>
    </main>
  );
};

export default ExpiredVerifyToken;
