import { Fragment, useMemo } from "react";
import { useVideoCallStore } from "../../store";
import VideoItem from "../video-item";
import { ScrollMenu } from "react-horizontal-scrolling-menu";
import 'react-horizontal-scrolling-menu/dist/styles.css';
import FocusVideoItem from "../focus-video-item";
import { DoodleArea } from "../common/DoodleArea";

const FocusScreenView = () => {
    const { participants, isDoodle } = useVideoCallStore();
    const haveShareScreen = useMemo(() => participants.some((participant: any) => participant.isShareScreen), [participants]);
    const listParticipant = useMemo(()=>{
        if(isDoodle) return participants;
        if(haveShareScreen) return participants.filter((participant: any) => !participant.isShareScreen);
    }, [haveShareScreen, isDoodle, participants]);

    return (
        <div className="relative flex w-full h-full p-1">
            <div className="flex flex-col w-full h-full gap-1">
                <section className="focus-view relative flex h-full w-full flex-1 overflow-hidden ">
                    {isDoodle && <DoodleArea /> }
                    {!isDoodle && <FocusVideoItem participant={participants.find((participant: any) => participant.isShareScreen)} />}
                </section>
                <div className="">
                    <ScrollMenu
                        itemClassName="h-[122px]"
                    >
                        {listParticipant?.map((participant: any) => (
                            <VideoItem key={participant.socketId} participant={participant} size="sm" />
                        )) || []}
                    </ScrollMenu>
                </div>
            </div>
        </div>
    );
};

export default FocusScreenView;