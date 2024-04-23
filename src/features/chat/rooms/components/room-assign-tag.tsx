'use client';

import React, { cloneElement, use, useEffect } from 'react';
import { Room } from '../types';
import { Button } from '@/components/actions';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/data-display/popover';
import { Circle, CircleCheck, Tag } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useTranslation } from 'react-i18next';
import { useSpaceStore } from '@/stores/space.store';
import { TConversationTag } from '@/app/(main-layout)/(protected)/spaces/[spaceId]/_components/business-spaces';
import { roomApi } from '../api';
import toast from 'react-hot-toast';
import { ActionItem } from './room-actions';

const RoomAssignTag = ({
  id,
  onClosed,
  onAction,
}: {
  id: Room['_id'];
  onClosed?: () => void;
  onAction: () => void;
}) => {
  const [open, setOpen] = React.useState(false);
  const { space } = useSpaceStore();

  const tags = space?.tags || ([] as TConversationTag[]);
  const { t } = useTranslation('common');


  const onUpdateRoomTag = async (tag: TConversationTag) => {
    console.log('onUpdateRoomTag', id);
    try {
      await roomApi.changeTagRoom({ roomId: id, tagId: tag._id });
      onClosed && onClosed();
      setOpen(false);
    } catch (error) {
      toast.error('Failed to update tag');
    }
  };

  return (
    <Popover open={open}>
      <PopoverTrigger asChild>
        <div
          onClick={() => {
            onAction();
            setOpen(true);
          }}
          className="relative flex cursor-pointer select-none items-center gap-2 rounded-md px-3 py-1.5 text-sm outline-none transition-colors hover:bg-primary-100 focus:bg-accent focus:text-accent-foreground"
        >
          <Tag size={16} />
          <span>{t(`CONVERSATION.TAG`)}</span>
        </div>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        onMouseLeave={() => setOpen(false)}
        className="flex h-auto flex-col  bg-white px-0 py-4"
      >
        <div className="divide-y divide-neutral-100">
          <div className="flex max-h-60 w-full flex-col overflow-y-auto">
            {tags.map(({ _id, color, name }) => {
              const isCurrent = false;
              return (
                <div
                  key={name}
                  className={cn(
                    'flex w-full min-w-fit  cursor-pointer flex-row items-center justify-stretch gap-3 px-4 py-2 hover:bg-neutral-100',
                    { 'bg-primary-100': isCurrent },
                  )}
                  onClick={() => onUpdateRoomTag({ _id, color, name })}
                >
                  {isCurrent ? (
                    <CircleCheck
                      size={18}
                      className="border-none fill-primary-500-main stroke-white"
                    />
                  ) : (
                    <Circle size={16} className="stroke-neutral-50" />
                  )}
                  <Circle size={12} fill={color} stroke={color} />
                  <span className="text-base text-neutral-700">{name}</span>
                </div>
              );
            })}
          </div>
          <div className="flex flex-col  items-start gap-1">
            <div
              className={cn(
                'flex w-full min-w-fit  cursor-pointer flex-row items-center justify-stretch gap-3 px-4 py-2 hover:bg-neutral-100',
              )}
            >
              Add new tag
            </div>
            <div
              className={cn(
                'flex w-full min-w-fit  cursor-pointer flex-row items-center justify-stretch gap-3 px-4 py-2 hover:bg-neutral-100',
              )}
            >
              Tags management
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default RoomAssignTag;
