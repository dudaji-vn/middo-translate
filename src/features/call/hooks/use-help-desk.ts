import { CALL_TYPE } from '../constant/call-type';
import { useVideoCallStore } from '../store/video-call.store';

export default function useHelpDesk() {
  
  const room = useVideoCallStore(state => state.room);

  const isHelpDeskCall: boolean = room?.type == CALL_TYPE.HELP_DESK;

  return { isHelpDeskCall };
}
