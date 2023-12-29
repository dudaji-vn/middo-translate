'use client';

import { InboxSideMain } from './inbox-side.main';
import { RoomActions } from '../room.actions';

export interface InboxProps {}

export const Inbox = (props: InboxProps) => {
  return (
    <RoomActions>
      <div className="relative flex w-full flex-1 flex-col overflow-hidden bg-background">
        <InboxSideMain />
      </div>
    </RoomActions>
  );
};
