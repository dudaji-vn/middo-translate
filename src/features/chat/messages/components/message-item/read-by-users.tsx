import { Avatar } from '@/components/data-display';
import { User } from '@/features/users/types';
import { cn } from '@/utils/cn';
import { forwardRef } from 'react';
export interface ReadByUsersProps extends React.HTMLAttributes<HTMLDivElement> {
  readByUsers?: User[];
  isMine?: boolean;
}

export const ReadByUsers = forwardRef<HTMLDivElement, ReadByUsersProps>(
  ({ readByUsers, className, isMine, ...props }, ref) => {
    if (!readByUsers?.length) return null;
    return (
      <div ref={ref} {...props}>
        {readByUsers?.length && (
          <div
            className={cn(
              'ml-auto flex justify-end space-x-0.5',
              isMine ? 'mt-1' : 'absolute bottom-0 right-0',
            )}
          >
            {readByUsers?.map((user) => (
              <Avatar
                key={user._id}
                src={user.avatar}
                alt={user.name}
                className="h-4 w-4"
              />
            ))}
          </div>
        )}
      </div>
    );
  },
);
ReadByUsers.displayName = 'ReadByUsers';
