import { Room } from '@/features/chat/rooms/types';
import { createContext, useContext } from 'react';
export type VideoCallHelpDeskContextType =
  | 'WAITING'
  | 'JOINED'
  | 'BLOCK'
  | 'BUSY';
interface VideoCallHelpDeskContextProps {
  status: 'WAITING' | 'JOINED' | 'BLOCK' | 'BUSY';
  setStatus: (status: VideoCallHelpDeskContextType) => void;
  businessData: Room;
}

export const VideoCallHelpDeskContext = createContext<VideoCallHelpDeskContextProps>(
  {} as VideoCallHelpDeskContextProps,
);

export const useHelpDeskCallContext = () => {
  const context = useContext(VideoCallHelpDeskContext);
  if (!context) {
    throw new Error(
      'useHelpDeskCallContext must be used within VideoCallHelpDeskContext',
    );
  }
  return context;
};
