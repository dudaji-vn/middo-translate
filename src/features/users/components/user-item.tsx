import { Avatar } from '@/components/data-display/avatar';
import { Typography } from '@/components/data-display';
import { User } from '@/features/users/types';
import { cn } from '@/utils/cn';
import { forwardRef } from 'react';
import { SendIcon, XIcon } from 'lucide-react';
import { MemberStatus } from '@/app/(main-layout)/(protected)/stations/_components/type';

export interface UserItemProps extends React.HTMLAttributes<HTMLDivElement> {
  user: User;
  isActive?: boolean;
  rightElement?: React.ReactNode;
  subContent?: React.ReactNode;
  wrapperClassName?: string;
  status?: MemberStatus;
}

export const UserItem = forwardRef<HTMLDivElement, UserItemProps>(
  (
    {
      user,
      rightElement,
      isActive,
      subContent,
      wrapperClassName,
      status,
      ...props
    },
    ref,
  ) => {
    const renderStatus = () => {
      switch (status) {
        case 'invited':
          return (
            <div className="flex size-5 items-center justify-center rounded-full bg-success-100 text-success">
              <SendIcon className="size-3" />
            </div>
          );
        case 'rejected':
          return (
            <div className="flex size-5 items-center justify-center rounded-full bg-error-100 text-error">
              <XIcon className="size-3" />
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <div
        ref={ref}
        {...props}
        className={cn(
          'flex cursor-pointer items-center justify-between px-3 py-2 transition-all',
          isActive
            ? 'bg-background-lightest'
            : 'bg-transparent hover:bg-background-lighter dark:hover:bg-primary-900',
          wrapperClassName,
        )}
      >
        <div className="flex w-full items-center gap-2">
          <div className="relative">
            <Avatar src={user?.avatar} alt={user?.name} />
            {status && (
              <div className="absolute -bottom-1 -right-0 rounded-full  border-2 border-white ">
                {renderStatus()}
              </div>
            )}
          </div>
          <div className="w-full">
            <div className="flex items-center justify-between">
              <div className="max-w-full">
                <span className="line-clamp-1 break-all text-base font-semibold text-text/90">
                  {user?.name}
                </span>
              </div>
            </div>
            <Typography className="line-clamp-1 break-all text-sm text-text/50">
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
