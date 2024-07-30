import { CALL_TYPE } from '../constant/call-type';
import { useVideoCallStore } from '../store/video-call.store';

export default function useHelpDesk() {
  
  const call = useVideoCallStore(state => state.call);

  const isHelpDeskCall: boolean = call?.type == CALL_TYPE.HELP_DESK;

  return { isHelpDeskCall };
}
