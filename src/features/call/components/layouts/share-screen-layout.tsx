import { Fragment, useMemo } from "react";
import { useVideoCallStore } from "../../store";
import VideoItem from "../video-item";
import { ScrollMenu } from "react-horizontal-scrolling-menu";
import 'react-horizontal-scrolling-menu/dist/styles.css';

const ShareScreenLayout = () => {
    const { participants, layout } = useVideoCallStore();
    return (
        <div className="p-1 max-h-full flex flex-col box-border gap-1">
            <div className="flex-1">
                {participants.filter((participant) => participant.isShareScreen).map((participant: any) => (
                    <VideoItem key={participant.socketId} participant={participant} />
                ))}
            </div>
            <div className="">
                <ScrollMenu
                    itemClassName="h-[122px]"
                >
                    {participants.filter((participant) => !participant.isShareScreen).map((participant: any) => (
                        <VideoItem key={participant.socketId} participant={participant} size="sm" />
                    ))}
                </ScrollMenu>
            </div>
        </div>
    );
};

export default ShareScreenLayout;