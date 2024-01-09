import { Fragment, useMemo } from "react";
import VideoItem from "../video-item";
import { useVideoCallStore } from "../../store/video-call";
import { useParticipantVideoCallStore } from "../../store/participant";

const GalleryView = () => {
    const { participants } = useParticipantVideoCallStore();
    return (
        <div className={`p-2 w-full h-full flex flex-wrap justify-center items-center`}>
            {participants.map((participant, index) => (
                <VideoItem key={index} participant={participant} />
            ))}
        </div>
    );
};

export default GalleryView;