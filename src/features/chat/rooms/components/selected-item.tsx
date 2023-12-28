import { Avatar, Typography } from '@/components/data-display';

import { User } from '@/features/users/types';
import { XIcon } from 'lucide-react';

export const SelectedItem = ({
  user,
  onClick,
}: {
  user: User;
  onClick?: () => void;
}) => {
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
        <div className="absolute right-0 top-0 rounded-full bg-background shadow-1">
          <XIcon />
        </div>
      </div>
      <Typography className="truncate">{name}</Typography>
    </div>
  );
};
