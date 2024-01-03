import { Fragment, useMemo } from "react";
import { useVideoCallStore } from "../../store";
import VideoItem from "../video-item";
import { ScrollMenu } from "react-horizontal-scrolling-menu";
import 'react-horizontal-scrolling-menu/dist/styles.css';

const ViewLayout = () => {
    const { participants, layout } = useVideoCallStore();

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
            {participants.filter((participant) => participant.isShareScreen).map((participant, index) => (
                <VideoItem key={index} participant={participant} />
            ))}
            {participants.filter((participant) => !participant.isShareScreen).map((participant, index) => (
                <VideoItem key={index} participant={participant} />
            ))}
        </div>
    );
};

export default ViewLayout;