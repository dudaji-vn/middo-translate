import { Fragment, useMemo } from "react";
import VideoItem from "../common/video-item";
import { ScrollMenu } from "react-horizontal-scrolling-menu";
import 'react-horizontal-scrolling-menu/dist/styles.css';
import FocusVideoItem from "../common/focus-video-item";
import { DoodleArea } from "../common/doodle-area";
import { useVideoCallStore } from "../../store/video-call.store";
import { useParticipantVideoCallStore } from "../../store/participant.store";
import DoodleItem from "../common/doodle-item";
import ParticipantInVideoCall from "../../interfaces/participant";

const FocusScreenView = () => {
    const { isDoodle, isPinDoodle } = useVideoCallStore();
    const { participants } = useParticipantVideoCallStore();


    return (
        <div className="relative flex w-full h-full p-1">
            <div className="flex flex-col w-full h-full gap-1">
                <div className="">
                    {/* <ScrollMenu
                        itemClassName="h-[68px]"
                    >
                        {isDoodle ? <DoodleItem /> : {}}
                        {participants?.map((participant: any) => (
                            <VideoItem key={participant.socketId} participant={participant} size="sm" />
                        )) || []}
                    </ScrollMenu> */}
                    <div className="overflow-auto">
                        <div className="flex items-center h-[68px]">
                            {isDoodle && <div className="max-w-[100px] min-w-[60px] !h-[60px]"><DoodleItem /></div>}
                            {participants?.filter((p: ParticipantInVideoCall) => p.isShareScreen).map((participant: ParticipantInVideoCall) => (
                                <div key={participant.socketId + participant.isShareScreen}
                                    className="max-w-[100px] min-w-[60px] !h-[60px]">
                                    <VideoItem participant={participant} />
                                </div>
                            )) || []}
                            {participants?.filter((p: ParticipantInVideoCall) => !p.isShareScreen).map((participant: ParticipantInVideoCall) => (
                                <div key={participant.socketId + participant.isShareScreen}
                                    className="max-w-[100px] min-w-[60px] !h-[60px]">
                                    <VideoItem participant={participant} />
                                </div>
                            )) || []}
                        </div>
                    </div>
                </div>
                <section className="focus-view relative flex h-full w-full flex-1 overflow-hidden ">
                    <div className="flex h-full w-full relative">
                        {isDoodle && isPinDoodle && <DoodleArea />}
                        {!isPinDoodle && <FocusVideoItem participant={participants.find((participant: any) => participant.pin)} />}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default FocusScreenView;