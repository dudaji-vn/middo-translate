import { useMemo } from "react";
import { useVideoCallStore } from "../../store";
import VideoItem from "../video-item";

const ViewLayout = () => {
    const { participants } = useVideoCallStore();

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

export default ViewLayout;