import { Avatar } from '@/components/data-display/avatar';
import { Typography } from '@/components/data-display';
import { User } from '@/features/users/types';
import { cn } from '@/utils/cn';
import { forwardRef } from 'react';

export interface UserItemProps extends React.HTMLAttributes<HTMLDivElement> {
  user: User;
  isActive?: boolean;
}

export const UserItem = forwardRef<HTMLDivElement, UserItemProps>(
  ({ user, isActive, ...props }, ref) => {
    return (
      <div
        ref={ref}
        {...props}
        className={cn(
          'flex cursor-pointer items-center justify-between p-2 transition-all',
          isActive
            ? 'bg-background-darker'
            : 'bg-transparent hover:bg-background-lightest',
        )}
      >
        <div className="flex w-full items-center gap-2">
          <Avatar src={user?.avatar} alt={user?.username} size="lg" />
          <div className="w-full">
            <div className="flex items-center justify-between">
              <div className="max-w-full">
                <span className="line-clamp-1 break-all text-base font-semibold text-text/90">
                  {user.username}
                </span>
              </div>
            </div>
            <Typography className="line-clamp-1 break-all text-sm text-text/50">
              @{user.username}
            </Typography>
          </div>
        </div>
      </div>
    );
  },
);

UserItem.displayName = 'UserItem';
