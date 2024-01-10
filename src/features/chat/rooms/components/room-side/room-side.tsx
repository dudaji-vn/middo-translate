'use client';

import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/actions';
import { RoomActions } from '../room-actions';
import { RoomCloud } from './room-cloud';
import { RoomDeleteConversation } from './room-delete-conversation';
import { RoomInfo } from './room-info';
import { RoomLeave } from './room-leave';
import { RoomMember } from './room-member';
import { RoomSetting } from './room-setting';
import { forwardRef } from 'react';
import { useChatBox } from '../../contexts';

export interface RoomSideProps extends React.HTMLAttributes<HTMLDivElement> {}

export const RoomSide = forwardRef<HTMLDivElement, RoomSideProps>(
  (props, ref) => {
    const { room, showSide, toggleSide } = useChatBox();

    return (
      <RoomActions>
        {showSide && (
          <div
            ref={ref}
            {...props}
            className="absolute left-0 top-0 z-50 h-screen w-screen overflow-y-auto border-l bg-background p-3 md:relative md:z-auto md:h-auto md:w-[26.5rem] md:p-5"
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
            <RoomDeleteConversation isGroup={room.isGroup} roomId={room._id} />
          </div>
        )}
      </RoomActions>
    );
  },
);
RoomSide.displayName = 'RoomSide';
