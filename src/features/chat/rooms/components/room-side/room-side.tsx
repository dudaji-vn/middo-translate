'use client';

import { Button } from '@/components/actions';
import { RoomCloud } from './room-cloud';
import { RoomDeleteConversation } from './room-delete-conversation';
import { RoomInfo } from './room-info';
import { RoomLeave } from './room-leave';
import { RoomMember } from './room-member';
import { RoomSetting } from './room-setting';
import { Trash2 } from 'lucide-react';
import { forwardRef } from 'react';
import { useChatBox } from '../../contexts';

export interface RoomSideProps extends React.HTMLAttributes<HTMLDivElement> {}

export const RoomSide = forwardRef<HTMLDivElement, RoomSideProps>(
  (props, ref) => {
    const { room, showSide } = useChatBox();

    return (
      <>
        {showSide && (
          <div
            ref={ref}
            {...props}
            className="w-1/3 overflow-y-auto border-l p-5"
          >
            <RoomInfo room={room} />
            <div className="my-12">
              <RoomSetting room={room} />
              {room.isGroup && (
                <RoomMember
                  members={room.participants}
                  adminId={room.admin._id}
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
