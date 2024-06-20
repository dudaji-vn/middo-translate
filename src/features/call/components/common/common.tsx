import { useBusinessNavigationData } from "@/hooks/use-business-navigation-data";
import useHelpDesk from "../../hooks/use-help-desk";
import { ModalAddUser } from "./modal/modal-add-user";
import { ModalAudioVideoSetting } from "./modal/modal-audio-video-setting";
import { ModalChooseScreen } from "./modal/modal-choose-screen";
import { ConfirmLeaveRoomModal } from "./modal/modal-leave-call";
import { RequestJoinRoomModal } from "./modal/modal-request-join-room";
import { ConfirmStopDoodle } from "./modal/modal-stop-doodle";
import { ModalSwitchRoom } from "./modal/modal-switch-room";

export const CommonComponent = () => {
    const { isHelpDeskCall } = useHelpDesk()
    return <>
        <ConfirmLeaveRoomModal />
        <RequestJoinRoomModal />
        <ConfirmStopDoodle />
        <ModalSwitchRoom />
        {!isHelpDeskCall && <ModalAddUser />}
        <ModalAudioVideoSetting />
        <ModalChooseScreen />
    </>
};
