import { useParticipantVideoCallStore } from "@/features/call/store/participant.store";
import { useVideoCallStore } from "@/features/call/store/video-call.store";
import DoodleItem from "../doodle/doodle-item";
import ParticipantInVideoCall from "@/features/call/interfaces/participant";
import VideoItem from "../video/video-item";
import { DoodleArea } from "../doodle/doodle-area";
import FocusVideoItem from "../video/focus-video-item";


const FocusScreenLayout = () => {
    const { isDoodle, isPinDoodle } = useVideoCallStore();
    const { participants } = useParticipantVideoCallStore();
    return (
        <div className="relative flex w-full h-full p-1">
            <div className="flex flex-col w-full h-full gap-1">
                <div className="">
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

export default FocusScreenLayout;