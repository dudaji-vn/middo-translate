'use client';

import { IconButton } from '@/components/button';
import { Logo } from '../icons';
import { Menu } from '@easy-eva-icons/react';

type Props = {};

export const Header = (props: Props) => {
  return (
    <div className="flex items-center justify-between px-[5vw] py-5">
      <Logo />
      <IconButton variant="secondary" shape="default">
        <Menu />
      </IconButton>
    </div>
  );
};
