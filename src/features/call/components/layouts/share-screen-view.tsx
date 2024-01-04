import { Fragment, useMemo } from "react";
import { useVideoCallStore } from "../../store";
import VideoItem from "../video-item";
import { ScrollMenu } from "react-horizontal-scrolling-menu";
import 'react-horizontal-scrolling-menu/dist/styles.css';
import FocusVideoItem from "../focus-video-item";

const ShareScreenView = () => {
    const { participants } = useVideoCallStore();
    return (
        <div className="relative flex w-full h-full p-1">
            <div className="flex flex-col w-full h-full gap-1">
                <section className="relative flex h-full w-full flex-1 overflow-hidden">
                    {participants.filter((participant: any) => participant.isShareScreen).map((participant: any) => (
                        <FocusVideoItem key={participant.socketId} participant={participant} />
                    ))}
                </section>
                <div className="">
                    <ScrollMenu
                        itemClassName="h-[122px]"
                    >
                        {participants.filter((participant: any) => !participant.isShareScreen).map((participant: any) => (
                            <VideoItem key={participant.socketId} participant={participant} size="sm" />
                        ))}
                    </ScrollMenu>
                </div>
            </div>
        </div>
    );
};

export default ShareScreenView;