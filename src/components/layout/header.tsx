'use client';

import {
  Menu,
  MessageCircle,
  MessageCircleOutline,
} from '@easy-eva-icons/react';

import { IconButton } from '@/components/button';
import Link from 'next/link';
import { NEXT_PUBLIC_URL } from '@/configs/env.public';

type Props = {};

export const Header = (props: Props) => {
  return (
    <div className="flex items-center justify-between px-[5vw] py-5">
      <Link href={NEXT_PUBLIC_URL}>
        <img src="/logo.png" alt="logo" className="w-[100px] md:w-[120px]" />
      </Link>
      <Link href="/online-conversation">
        <IconButton variant="secondary" shape="default">
          <MessageCircleOutline />
        </IconButton>
      </Link>
    </div>
  );
};
