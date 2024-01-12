'use client';


import ReceiveVideoCall from "./receive-call";
import VideoCallDragWrapper from "./video-call-drag-wrapper";

const CallVideoModalContainer = () => {
    
    return (
        <>
            <VideoCallDragWrapper />
            <ReceiveVideoCall />
        </>
    )
};

export default CallVideoModalContainer;