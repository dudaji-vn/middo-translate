import { Fragment, useMemo } from "react";
import VideoItem from "../video-item";
import { useVideoCallStore } from "../../store/video-call";
import { useParticipantVideoCallStore } from "../../store/participant";

const GalleryView = () => {
    const { layout } = useVideoCallStore();
    const { participants } = useParticipantVideoCallStore();

    const calculateGridLayout = useMemo(() => {
        switch (true) {
            case participants.length == 1:
                return 'grid-cols-1';
            case participants.length > 1 && participants.length <= 4:
                return 'grid-cols-2';
            case participants.length > 4 && participants.length <= 9:
                return 'grid-cols-3';
            case participants.length > 9:
                return 'grid-cols-4';
            default:
                return 'grid-cols-'+Math.ceil(Math.sqrt(participants.length));
        }
    }, [participants.length]);

    return (
        <div className={`p-1 w-full h-full grid ${calculateGridLayout} gap-1`}>
            {participants.map((participant, index) => (
                <VideoItem key={index} participant={participant} />
            ))}
        </div>
    );
};

export default GalleryView;