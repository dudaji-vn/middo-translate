import { Button, IconButton } from '@/components/button';

import { Menu } from '@easy-eva-icons/react';
import { PUBLIC_APP_NAME } from '@/configs/env.public';
import React from 'react';

type Props = {};

export const Header = (props: Props) => {
  return (
    <div className="flex items-center justify-between p-5">
      <h1 className="text-3xl font-bold">{PUBLIC_APP_NAME}</h1>
      <IconButton variant="secondary" size="icon" className="rounded-xl p-10">
        <Menu />
      </IconButton>
    </div>
  );
};
