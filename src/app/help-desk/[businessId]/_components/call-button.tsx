'use client';

import { Button } from "@/components/actions";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/feedback";
import { useJoinCall } from "@/features/chat/rooms/hooks/use-join-call";
import { useChatStore } from "@/features/chat/stores";
import { useBusinessNavigationData } from "@/hooks/use-business-navigation-data";
import customToast from "@/utils/custom-toast";
import { HeadsetIcon } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useBoolean } from "usehooks-ts";

const HelpDeskCallButton = () => {
    const {t} = useTranslation('common');
    const { isOnHelpDeskChat } = useBusinessNavigationData();
    const { value, setTrue, setValue, setFalse } = useBoolean(false);
    const meetingList = useChatStore(state => state.meetingList)
    const startVideoCall = useJoinCall();
    const params = useParams();
    const userId = params?.slugs?.[1];
    const roomId = params?.slugs?.[0];
    const handleStartCall = () => {
        setFalse();
        customToast.success('Call started');
        if(!userId || !roomId) return;
        startVideoCall({
            roomId,
            userId,
        })
    }
    
    const checkToShowModalStartCall = () => {
        let meeting = meetingList[roomId || ''];
        if(meeting && meeting.participantsIdJoined.includes(userId || '')) {
            customToast.error('You are already in the call');
            return;
        }
        setTrue();
    }
    if(!isOnHelpDeskChat) return;

    return (
        <>
            <Button.Icon 
                size="xs" 
                variant="ghost"
                onClick={checkToShowModalStartCall}
            >
                <HeadsetIcon />
            </Button.Icon>
            <AlertDialog open={value} onOpenChange={setValue}>
                <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                    {t('MODAL.START_CALL.TITLE')}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="mt-2 md:mt-0 dark:text-neutral-50">
                    {t('MODAL.START_CALL.DESCRIPTION')}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel
                    className="sm:mr-3"
                    >
                    {t('COMMON.CANCEL')}
                    </AlertDialogCancel>
                    <Button
                        shape="square"
                        color="primary"
                        onClick={()=>handleStartCall()}
                    >
                        {t('COMMON.CONFIRM')}
                    </Button>
                </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default HelpDeskCallButton;
