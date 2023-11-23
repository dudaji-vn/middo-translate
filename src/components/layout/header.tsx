'use client';

import {
  Menu,
  MessageCircle,
  MessageCircleOutline,
} from '@easy-eva-icons/react';

import { IconButton } from '@/components/button';
import Image from 'next/image';
import Link from 'next/link';
import { NEXT_PUBLIC_URL } from '@/configs/env.public';

type Props = {};

export const Header = (props: Props) => {
  return (
    <div className="flex items-center justify-between px-[5vw] py-5">
      <Link href={NEXT_PUBLIC_URL}>
        <div className="w-[100px] md:w-[120px]">
          <Image
            src="/logo.png"
            alt="logo"
            priority
            quality={100}
            width={500}
            height={500}
          />
        </div>
      </Link>
      <Link href="/online-conversation">
        <IconButton variant="secondary" shape="default">
          <MessageCircleOutline />
        </IconButton>
      </Link>
    </div>
  );
};
