'use client';

import {
  ArrowLeft,
  LayoutDashboard,
  Maximize2,
  Minimize2,
  MoreVertical,
  Users2Icon,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/data-display';
import { PropsWithChildren, useEffect, useState } from 'react';
import {
  VIDEOCALL_LAYOUTS,
  VIDEOCALL_LAYOUTS_OPTION,
} from '../constant/layout';

import { Button } from '@/components/actions/button';
import ButtonDataAction from '@/components/actions/button/button-data-action';
import formatTextUppercase from '../utils/format-text-uppercase.util';
import { twMerge } from 'tailwind-merge';
import { useRouter } from 'next/navigation';
import { useVideoCallStore } from '../store/video-call';

export interface VideoCallHeaderProps {}

export const VideoCallHeader = ({}: VideoCallHeaderProps) => {
  const [isFullScreen, setFullScreen] = useState(false);
  const [isOpenMenuSelectLayout, setMenuSelectLayout] = useState(false);
  const { room, setConfirmLeave, setLayout, layout } = useVideoCallStore();
  const toggleFullScreen = () => {
    setFullScreen((prev) => !prev);
    if (!isFullScreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };
  const handleBack = () => {
    setConfirmLeave(true);
  };
  useEffect(() => {
    const handleFullScreenChange = () => {
      if (document.fullscreenElement) {
        setFullScreen(true);
      } else {
        setFullScreen(false);
      }
    };
    window.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => {
      window.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  const handleChangeLayout = (layout: keyof typeof VIDEOCALL_LAYOUTS) => {
    setLayout(layout);
  };

  return (
    <header className="flex justify-between border-b border-neutral-50 p-1">
      <div className="flex items-center">
        <Button.Icon
          variant="ghost"
          color="default"
          onClick={handleBack}
          className="mr-1 max-h-9 max-w-9"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button.Icon>
        <span className="text-sm font-semibold md:text-base">
          {room.name || 'Metting'}
        </span>
      </div>
      <div className="flex gap-2">
        <DropdownMenu
          open={isOpenMenuSelectLayout}
          onOpenChange={() => setMenuSelectLayout((prev) => !prev)}
        >
          <DropdownMenuTrigger>
            <ButtonDataAction>
              <span className="mr-2">
                {VIDEOCALL_LAYOUTS_OPTION[layout]?.icon || (
                  <LayoutDashboard className="h-5 w-5" />
                )}
              </span>
              <span>{formatTextUppercase(layout)}</span>
            </ButtonDataAction>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="overflow-hidden rounded-2xl border bg-background p-0 shadow-3"
            onClick={() => setMenuSelectLayout((prev) => !prev)}
          >
            {Object.keys(VIDEOCALL_LAYOUTS_OPTION).map((layout) => (
              <div
                key={VIDEOCALL_LAYOUTS_OPTION[layout].name}
                className="flex cursor-pointer items-center gap-2 p-4 active:!bg-background-darker active:!text-shading md:hover:bg-[#fafafa] md:hover:text-primary"
                onClick={() =>
                  handleChangeLayout(layout as keyof typeof VIDEOCALL_LAYOUTS)
                }
              >
                {VIDEOCALL_LAYOUTS_OPTION[layout].icon}
                {VIDEOCALL_LAYOUTS_OPTION[layout].name}
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <ButtonDataAction
          className="hidden rounded-full md:flex"
          onClick={toggleFullScreen}
        >
          {isFullScreen ? (
            <Minimize2 className="h-5 w-5" />
          ) : (
            <Maximize2 className="h-5 w-5" />
          )}
        </ButtonDataAction>
      </div>
    </header>
  );
};
