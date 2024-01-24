import { ModalAddUser } from "./modal/modal-add-user";
import { ConfirmLeaveRoomModal } from "./modal/modal-leave-call";
import { RequestJoinRoomModal } from "./modal/modal-request-join-room";
import { ConfirmStopDoodle } from "./modal/modal-stop-doodle";
import { ModalSwitchRoom } from "./modal/modal-switch-room";

export const CommonComponent = () => {
    return <>
        <ConfirmLeaveRoomModal />
        <RequestJoinRoomModal />
        <ConfirmStopDoodle />
        <ModalSwitchRoom />
        <ModalAddUser />
    </>
};
