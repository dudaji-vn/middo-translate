import { useVideoCallStore } from '../../../store/video-call.store';
import { ModalAddUser } from './modal-add-user';
import { ModalAudioVideoSetting } from './modal-audio-video-setting';
import { ModalChooseScreen } from './modal-choose-screen';
import { ModalForwardCall } from './modal-forward-call';
import { ModalLeaveCall } from './modal-leave-call';
import { ModalStopDoodle } from './modal-stop-doodle';

export const VideoCallCommonModal = () => {
  const modal = useVideoCallStore((state) => state.modal);

  switch(modal) {
    case 'add-user':
        return <ModalAddUser />;
    case 'video-setting':
        return <ModalAudioVideoSetting />
    case 'leave-call':
        return <ModalLeaveCall />
    case 'stop-doodle':
        return <ModalStopDoodle />
    case 'choose-screen':
        return <ModalChooseScreen />
    case 'forward-call':
        return <ModalForwardCall />
    default:
        return null;
  }
};
