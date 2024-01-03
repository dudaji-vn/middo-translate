import { Fragment, useMemo } from "react";
import { useVideoCallStore } from "../../store";
import VideoItem from "../video-item";
import { ScrollMenu } from "react-horizontal-scrolling-menu";
import 'react-horizontal-scrolling-menu/dist/styles.css';

const ShareScreenLayout = () => {
    const { participants } = useVideoCallStore();
    const firstParticipantShareScreen = useMemo(() => participants.find((participant) => participant.isShareScreen), [participants]);
    const participantsRemaining = useMemo(() => {
    console.log('All participants', participants)
    console.log('fffff', firstParticipantShareScreen);
    return participants.filter((participant) => (participant.socketId !== firstParticipantShareScreen?.socketId || !participant.isShareScreen))}
    , [firstParticipantShareScreen?.socketId, participants]);

    
    console.log('participantsRemaining', participantsRemaining)
    console.log('firstParticipantShareScreen', firstParticipantShareScreen)
    return (
        <div className="p-1 max-h-full flex flex-col box-border gap-1">
            <div className="flex-1">
                <VideoItem participant={firstParticipantShareScreen} />
            </div>
            <div className="">
                <ScrollMenu
                    itemClassName="h-[122px]"
                >
                    {participantsRemaining.map((participant: any) => (
                        <VideoItem key={participant.socketId+participant.isShareScreen} participant={participant} size="sm" />
                    ))}
                </ScrollMenu>
            </div>
        </div>
    );
};

export default ShareScreenLayout;