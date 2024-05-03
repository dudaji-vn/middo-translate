import { Avatar } from '@/components/data-display';
import { User } from '@/features/users/types';
import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';
import { cn } from '@/utils/cn';
import { forwardRef, useMemo } from 'react';
export interface ReadByUsersProps extends React.HTMLAttributes<HTMLDivElement> {
  readByUsers?: User[];
  isMe?: boolean;
}

export const ReadByUsers = forwardRef<HTMLDivElement, ReadByUsersProps>(
  ({ readByUsers, className, isMe, ...props }, ref) => {
    const { isOnBusinessChat } = useBusinessNavigationData();
    const showUsers = useMemo(() => {
      if (isOnBusinessChat) {
        return readByUsers?.filter((user) => user.status === 'anonymous') || [];
      }
      return readByUsers;
    }, [isOnBusinessChat, readByUsers]);
    if (!showUsers?.length) return null;
    return (
      <div ref={ref} {...props}>
        <div className={cn('ml-auto flex justify-end space-x-0.5', className)}>
          {showUsers?.map((user) => (
            <Avatar
              key={user._id}
              src={user.avatar}
              alt={user.name}
              className="h-4 w-4"
            />
          ))}
        </div>
      </div>
    );
  },
);
ReadByUsers.displayName = 'ReadByUsers';
