import { Fragment, useMemo } from "react";
import VideoItem from "./video-item";
import { useVideoCallStore } from "../../store/video-call";
import { useParticipantVideoCallStore } from "../../store/participant";
import DoodleItem from "./doodle-item";

const GalleryView = () => {
    const { participants } = useParticipantVideoCallStore();
    const {isDoodle} = useVideoCallStore();
    return (
        <div className={`p-2 w-full h-full flex flex-wrap justify-center items-center overflow-auto`}>
            {isDoodle && <DoodleItem />}
            {participants.map((participant, index) => (
                <VideoItem key={index} participant={participant} />
            ))}
        </div>
    );
};

export default GalleryView;