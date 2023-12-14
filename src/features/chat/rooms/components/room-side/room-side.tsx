'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/data-display/accordion';
import {
  File,
  Image as ImageIcon,
  LogOut,
  Package2,
  Trash2,
} from 'lucide-react';

import { Button } from '@/components/actions';
import { RoomInfo } from './room-info';
import { RoomMember } from './room-member';
import { RoomSetting } from './room-setting';
import { forwardRef } from 'react';
import { useChatBox } from '../../contexts';

export interface RoomSideProps extends React.HTMLAttributes<HTMLDivElement> {}

export const RoomSide = forwardRef<HTMLDivElement, RoomSideProps>(
  (props, ref) => {
    const { room } = useChatBox();

    return (
      <div ref={ref} {...props} className="w-1/3 overflow-y-auto border-l p-5">
        <RoomInfo room={room} />
        <div className="my-12">
          <RoomSetting room={room} />
          {room.isGroup && (
            <RoomMember members={room.participants} adminId={room.admin._id} />
          )}
          <Accordion type="single" collapsible className="mt-8">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Package2 width={16} height={16} /> <span>Cloud shared</span>{' '}
                  <span className="text-sm text-colors-neutral-600">(+99)</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="border-t">
                <div className="mt-3 flex w-full gap-2">
                  <Button
                    startIcon={<ImageIcon className="h-4 w-4" />}
                    size="sm"
                    shape="square"
                    color="secondary"
                  >
                    Media
                  </Button>
                  <Button
                    startIcon={<File className="h-4 w-4" />}
                    size="sm"
                    shape="square"
                    variant="ghost"
                    color="default"
                  >
                    File
                  </Button>
                </div>
                <div className=" my-2 grid w-full grid-cols-4 flex-wrap gap-1">
                  <div className="aspect-square rounded-[4px] bg-black"></div>
                  <div className="aspect-square rounded-[4px] bg-black"></div>
                  <div className="aspect-square rounded-[4px] bg-black"></div>
                  <div className="aspect-square rounded-[4px] bg-black"></div>
                  <div className="aspect-square rounded-[4px] bg-black"></div>
                  <div className="aspect-square rounded-[4px] bg-black"></div>
                </div>
                <Button
                  shape="square"
                  color="default"
                  size="lg"
                  className="w-full"
                >
                  <span className="text-colors-primary-500-main">Show all</span>
                </Button>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        {room.isGroup && (
          <Button
            startIcon={<LogOut className="h-4 w-4" />}
            shape="square"
            color="default"
            size="lg"
            className="mb-2 w-full rounded-b-[4px]"
          >
            Leave group
          </Button>
        )}
        <Button
          startIcon={<Trash2 className="h-4 w-4 text-colors-error-400-main" />}
          shape="square"
          color="default"
          size="lg"
          className="w-full rounded-t-[4px]"
        >
          <span className="text-colors-error-400-main">
            Delete conversation
          </span>
        </Button>
      </div>
    );
  },
);
RoomSide.displayName = 'RoomSide';
