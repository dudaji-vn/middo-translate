import { Avatar, Typography } from '@/components/data-display';

import { User } from '@/features/users/types';
import { XIcon } from 'lucide-react';

type UserSelectedItemProps = {
  user: User;
  onClick?: () => void;
};

export const UserSelectedItem = ({ user, onClick }: UserSelectedItemProps) => {
  const name = user.name.split(' ')[0];
  return (
    <div
      onClick={onClick}
      className="flex max-w-[60px] shrink-0 cursor-pointer flex-col gap-2 overflow-hidden"
    >
      <div className="relative flex justify-center">
        <Avatar
          size="lg"
          className="h-12 w-12"
          src={user.avatar}
          shape="circle"
          alt={user.name}
        />
        <div className="absolute right-0 top-0 rounded-full border-[0.1px] bg-background">
          <XIcon className="size-3.5" />
        </div>
      </div>
      <Typography className="truncate">{name}</Typography>
    </div>
  );
};
