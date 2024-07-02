import { RequestJoinRoomModal } from "./modal/modal-request-join-room";
import { ModalSwitchRoom } from "./modal/modal-switch-room";
import { VideoCallCommonModal } from "./modal";

export const CommonComponent = () => {
    return <>
        <RequestJoinRoomModal />
        <ModalSwitchRoom />
        <VideoCallCommonModal />
    </>
};
