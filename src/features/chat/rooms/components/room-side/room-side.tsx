'use client';

import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/actions';
import { RoomCloud } from './room-cloud';
import { RoomDeleteConversation } from './room-delete-conversation';
import { RoomInfo } from './room-info';
import { RoomLeave } from './room-leave';
import { RoomMember } from './room-member';
import { RoomSetting } from './room-setting';
import { cn } from '@/utils/cn';
import { forwardRef } from 'react';
import { useChatBox } from '../../contexts';
import { useIsMobile } from '@/hooks/use-is-mobile';

export interface RoomSideProps extends React.HTMLAttributes<HTMLDivElement> {}

export const RoomSide = forwardRef<HTMLDivElement, RoomSideProps>(
  (props, ref) => {
    const { room, showSide, toggleSide } = useChatBox();
    const isMobile = useIsMobile();

    return (
      <>
        {showSide && (
          <div
            ref={ref}
            {...props}
            className={cn(
              'w-1/3 overflow-y-auto border-l bg-background p-3 md:p-5',
              isMobile && 'absolute left-0 top-0 z-50 h-screen w-screen',
            )}
          >
            <div className="-mx-3 -mt-3 px-1 pt-2 md:hidden">
              <Button.Icon onClick={toggleSide} variant="ghost" color="default">
                <ArrowLeft />
              </Button.Icon>
            </div>
            <RoomInfo room={room} />
            <div className="my-12">
              <RoomSetting room={room} />
              {room.isGroup && (
                <RoomMember
                  members={room.participants}
                  adminId={room.admin?._id}
                />
              )}
              <RoomCloud room={room} />
            </div>
            {room.isGroup && <RoomLeave roomId={room._id} />}
            <RoomDeleteConversation roomId={room._id} />
          </div>
        )}
      </>
    );
  },
);
RoomSide.displayName = 'RoomSide';
