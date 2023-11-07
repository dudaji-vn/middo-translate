import { IconButton } from '@/components/button';
import { Logo } from '../icons';
import { Menu } from '@easy-eva-icons/react';

type Props = {};

export const Header = (props: Props) => {
  return (
    <div className="flex items-center justify-between p-5">
      <Logo />
      <IconButton variant="secondary" size="icon" className="rounded-xl p-10">
        <Menu />
      </IconButton>
    </div>
  );
};
