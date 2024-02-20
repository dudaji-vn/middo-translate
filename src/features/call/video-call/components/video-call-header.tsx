import { Maximize2, Minimize2, Phone } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/actions';
import { useVideoCallStore } from '../../store/video-call.store';

export default function VideoCallHeader() {
  const { room, isFullScreen, setFullScreen } = useVideoCallStore();

  const toggleFullScreen = () => {
    setFullScreen(!isFullScreen);
  };
  
  return (
    <div
      className={`flex items-center gap-1 bg-primary-100 py-2 pl-3 pr-1 text-primary ${
        !isFullScreen && 'cursor-grab active:cursor-grabbing'
      }`}
    >
      <Phone className="h-4 w-4 stroke-current" />
      <span className="line-clamp-1 flex-1 font-semibold">{room?.name}</span>
      <Button.Icon
        variant="default"
        color="default"
        size="xs"
        onClick={toggleFullScreen}
      >
        {isFullScreen ? <Minimize2 /> : <Maximize2 />}
      </Button.Icon>
    </div>
  );
}
