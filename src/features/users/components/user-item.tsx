import { Avatar } from '@/components/data-display/avatar';
import { Typography } from '@/components/data-display';
import { User } from '@/features/users/types';
import { cn } from '@/utils/cn';
import { forwardRef } from 'react';

export interface UserItemProps extends React.HTMLAttributes<HTMLDivElement> {
  user: User;
  isActive?: boolean;
  rightElement?: React.ReactNode;
  subContent?: React.ReactNode;
  wrapperClassName?: string;
  topContent?: string;
}

export const UserItem = forwardRef<HTMLDivElement, UserItemProps>(
  (
    {
      user,
      topContent,
      rightElement,
      isActive,
      subContent,
      wrapperClassName,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        {...props}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-between px-3 py-2 transition-all',
          isActive
            ? 'bg-background-lightest'
            : 'bg-transparent hover:bg-background-lighter',
          wrapperClassName,
        )}
      >
        {topContent && (
          <span className="mb-1 self-start text-xs font-light text-neutral-400">
            from <span className="font-normal">{topContent}</span>
          </span>
        )}
        <div className="flex w-full items-center gap-2">
          <Avatar src={user?.avatar} alt={user?.name} />
          <div className="w-full">
            <div className="flex items-center justify-between">
              <div className="max-w-full">
                <span className="line-clamp-1 break-all text-base font-semibold text-text/90">
                  {user?.name}
                </span>
              </div>
            </div>
            <Typography className="highlight-able line-clamp-1 break-all text-sm text-text/50">
              {subContent ? subContent : '@' + user?.username}
            </Typography>
          </div>
          {rightElement}
        </div>
      </div>
    );
  },
);

UserItem.displayName = 'UserItem';
